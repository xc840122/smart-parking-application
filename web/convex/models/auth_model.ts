import { Id } from "../_generated/dataModel";
import { MutationCtx, QueryCtx } from "../_generated/server";

export const getVerificationInfoModel = async (ctx: QueryCtx, code: string) => {
  try {
    return await ctx.db
      .query("verification_info")
      .withIndex("by_code", q => q.eq("code", code))
      .first();
  } catch (error) {
    console.error("Failed to retrieve verification info:", error);
    throw new Error("Query failed");
  }
}

export const updateVerificationInfoModel = async (
  ctx: MutationCtx,
  id: Id<'verification_info'>,
  isValid: boolean
) => {
  try {
    await ctx.db.patch(id, {
      isValid: isValid,
    });
  } catch (error) {
    console.error("Failed to update verification info:", error);
    throw new Error("Update failed");
  }
}