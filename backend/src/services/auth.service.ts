import { User } from "../models/User";
import { HttpError } from "../utils/HttpError";

/**
 * A verified identity profile produced after a successful login
 * (Credentials, Google, or any configured provider).
 */
export interface LoginProfile {
  email: string;
  name?: string;
  image?: string;
  provider?: string;
  isVerified?: boolean;
}

type UserDocument = InstanceType<typeof User>;

export interface SyncResult {
  user: UserDocument;
  created: boolean;
}

function isDuplicateKeyError(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    (err as { code?: number }).code === 11000
  );
}

/**
 * Find an existing user by email, or create one if it does not exist.
 * Never creates a duplicate: the email is the unique key.
 *
 * On create:
 *  - role defaults to "user"
 *  - status defaults to "active"
 *  - lastLoginAt is set
 *
 * On update:
 *  - always bumps lastLoginAt (and updatedAt via timestamps)
 *  - updates name/image/provider only when a new value was provided and differs
 *  - the existing role (e.g. admin) is always preserved, never overwritten
 */
export async function findOrCreateUser(
  profile: LoginProfile,
): Promise<SyncResult> {
  const email = profile.email?.trim().toLowerCase();
  if (!email) {
    throw new HttpError(400, "ইমেইল প্রয়োজন।");
  }

  const existing = await User.findOne({ email });

  if (!existing) {
    const name = profile.name?.trim() || email.split("@")[0] || "User";
    const user = await User.create({
      name,
      email,
      image: profile.image ?? "",
      role: "user",
      status: "active",
      active: true,
      provider: profile.provider ?? "credentials",
      isVerified: profile.isVerified ?? false,
      lastLoginAt: new Date(),
    }).catch(async (err: unknown) => {
      // Concurrent duplicate create — return the already-created user instead.
      if (isDuplicateKeyError(err)) {
        return User.findOne({ email });
      }
      throw err;
    });

    if (!user) {
      throw new HttpError(409, "ইমেইল দিয়ে অ্যাকাউন্ট তৈরিতে সমস্যা হয়েছে।");
    }

    return { user, created: true };
  }

  const updates: Record<string, unknown> = { lastLoginAt: new Date() };

  const name = profile.name?.trim();
  if (name && name !== existing.name) {
    updates.name = name;
  }

  if (profile.image && profile.image !== existing.image) {
    updates.image = profile.image;
  }

  if (profile.provider && profile.provider !== existing.provider) {
    updates.provider = profile.provider;
  }

  const user = await User.findByIdAndUpdate(existing._id, updates, {
    new: true,
    runValidators: true,
  });

  return { user: user ?? existing, created: false };
}
