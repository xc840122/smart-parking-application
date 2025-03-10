import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getVerificationInfoModel, updateVerificationInfoModel } from "./models/auth_model";


// Mutation to process verification information
export const signUpCodeVerification = query({
  args: { code: v.string(), classroom: v.string() },
  handler: async (ctx, args) => {
    try {
      // Fetch verification information
      const verificationInfo = await getVerificationInfoModel(ctx, args.code);
      // Check if verification information is valid
      if (!verificationInfo
        || verificationInfo.isValid !== true
        || verificationInfo.classroom.toLowerCase() !== args.classroom.toLowerCase()) {
        return null;
      }
      return verificationInfo;
    } catch (error) {
      console.error(`Verify failed: ${error}`);
      return null;
    }
  },
});

export const updateSignUpInfo = mutation({
  args: { id: v.id('verification_info'), isValid: v.boolean() },
  handler: async (ctx, args) => {
    try {
      await updateVerificationInfoModel(ctx, args.id, args.isValid);
      return true;
    } catch (error) {
      console.error(`Update failed: ${error}`);
      return false;
    }
  }
});