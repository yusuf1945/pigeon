import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import User from "../models/User.js";
import "dotenv/config";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "slack-clone" });

const syncUser = inngest.createFunction(
  { id: "sync-user" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    await connectDB();
    const { id, email_address, first_name, last_name, profile_image_url } =
      event.data;

    const newUser = {
      clerkId: id,
      email: email_address,
      name: `${first_name || ""} ${last_name || ""}`,
      image: profile_image_url,
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
    await User.deleteOne({ clerkId: id });
    //todo LATER
  }
);

// Create an empty array where we'll export future Inngest functions
export const functions = [syncUser, deleteUserFromDB];
