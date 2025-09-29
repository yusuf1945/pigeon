import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import User from "../models/user.model.js";
import "dotenv/config";

// Create a client to send and receive events
export const inngest = new Inngest({
  id: "slack-clone",
  eventKey: process.env.INNGEST_EVENT_KEY,
});

const syncUser = inngest.createFunction(
  { id: "sync-user" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    await connectDB();
    const { id, email_addresses, first_name, last_name, image_url } =
      event.data;

    // ✅ Fixed: Use correct Clerk webhook data structure
    const email = email_addresses?.[0]?.email_address;
    const image = image_url;

    const newUser = {
      clerkId: id,
      email: email,
      name: `${first_name || ""} ${last_name || ""}`.trim(),
      image: image,
    };

    await User.create(newUser);

    console.log("User Created Event Received", event.data);
  }
);

const deleteUserFromDB = inngest.createFunction(
  { id: "delete-user-from-db" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    await connectDB();
    const { id } = event.data;
    await User.findOneAndDelete({ clerkId: id });
    console.log("User deleted from database:", id);
  }
);

// Export Inngest functions
export const functions = [syncUser, deleteUserFromDB];
