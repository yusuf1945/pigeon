// inngest.js
import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import User from "../models/user.model.js";
import { upsertStreamUser, addUserToPublicChannels } from "./stream.js"; // your stream.js
import "dotenv/config";

// Create Inngest client
export const inngest = new Inngest({
  id: "slack-clone",
  signingKey: process.env.INNGEST_SIGNING_KEY,
});

// ============================
// 1️⃣ Sync new user
// ============================
const syncUser = inngest.createFunction(
  { id: "sync-user" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    await connectDB();

    const { id, email_addresses, first_name, last_name, image_url } =
      event.data;

    const email = email_addresses?.[0]?.email_address;
    const name = `${first_name || ""} ${last_name || ""}`.trim();
    const image = image_url;

    const newUser = {
      clerkId: id,
      email: email_addresses[0]?.email_address,
      name: `${first_name || ""} ${last_name || ""}`,
      image: image_url,
    };

    // 1️⃣ Save to MongoDB (upsert avoids duplicates)
    await User.findOneAndUpdate({ clerkId: id }, newUser, {
      upsert: true,
      new: true,
    });

    console.log("✅ User saved to MongoDB:", email);

    // 2️⃣ Upsert user in Stream.io
    await upsertStreamUser({
      id: newUser.clerkId.toString(),
      name: newUser.name,
      image: newUser.image,
    });
    console.log("✅ User upserted in Stream.io:", newUser.name);

    // 3️⃣ Add user to all public channels
    await addUserToPublicChannels(id);
    console.log("✅ User added to public channels:", name);
  }
);

// ============================
// 2️⃣ Delete user
// ============================
const deleteUserFromDB = inngest.createFunction(
  { id: "delete-user-from-db" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    await connectDB();
    const { id } = event.data;

    await User.findOneAndDelete({ clerkId: id });
    console.log("🗑 User deleted from MongoDB:", id);
  }
);

// Export Inngest functions
export const functions = [syncUser, deleteUserFromDB];
