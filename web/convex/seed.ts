/**
 * This file is used to seed the database with some initial data.
 * This is useful for development purposes.
 */
import { mutation } from "./_generated/server";

export const seedNotices = mutation(async ({ db }) => {
  const notices = Array.from({ length: 100 }, (_, i) => ({
    title: `Title ${i + 1}`,
    description: `This is the description for notice ${i + 1}.`,
    classroom: "3A",
  }));

  for (const notice of notices) {
    await db.insert("notices", notice);
  }
  return "Inserted 100 notices successfully!";
});


// Helper function to generate random alphanumeric strings
function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Seed function to populate the sign_up_verification table
export const seedVerificationCodes = mutation(async ({ db }) => {

  const codes = Array.from({ length: 10 }, (_, i) => ({
    code: generateRandomString(6) ?? i, // 6-digit alphanumeric code, add i just to depress warning about unused variable
    classroom: Math.random() < 0.5 ? '3A' : '6B', // alphanumeric class code
    role: Math.random() < 0.5 ? 'student' : 'teacher', // Random role
    isValid: true, // Initially set to true
  }))

  for (const code of codes) {
    await db.insert("verification_info", code);
  }
  return "Inserted 10 codes successfully!";
});
