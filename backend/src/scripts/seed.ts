import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { env } from "../config/env";
import { User } from "../models/User";

async function seed() {
  await mongoose.connect(env.MONGODB_URI);
  console.log("✅ MongoDB connected");

  const existing = await User.findOne({ email: env.ADMIN_EMAIL.toLowerCase() });
  if (existing) {
    console.log(`ℹ️  Admin already exists: ${env.ADMIN_EMAIL}`);
    await mongoose.disconnect();
    return;
  }

  const passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, 10);
  await User.create({
    name: env.ADMIN_NAME,
    email: env.ADMIN_EMAIL.toLowerCase(),
    phone: "+8801745762857",
    passwordHash,
    role: "admin",
    active: true,
  });

  console.log("✅ Admin user created:");
  console.log(`   Email:    ${env.ADMIN_EMAIL}`);
  console.log(`   Password: ${env.ADMIN_PASSWORD}`);
  console.log("   ⚠️  Change the password after first login!");

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
