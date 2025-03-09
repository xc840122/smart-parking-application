// db operation of notices
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { createNoticeModel, deleteNoticeModel, getNoticeByIdModel, getNoticesModel, updateNoticeModel } from "./models/notice_model";

/**
 * Get notice list by class name from database
 * according to search keyword or date range
 * @param ctx
 * @param classroom
 * @param keyword
 * @param startDate
 * @param endDate
 * @returns 
 */
export const getNotices = query({
  args: {
    classroom: v.string(),
    keyword: v.optional(v.string()),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await getNoticesModel(
      ctx,
      args.classroom,
      args.keyword,
      args.startDate,
      args.endDate
    );
  },
});

/**
 * Get notice by id
 * @param _id
 * @returns 
 */
export const getNoticeById = query({
  args: { _id: v.id("notices") },
  handler: async (ctx, args) => {
    return await getNoticeByIdModel(ctx, args._id);
  }
});

/**
 * Create a new notice
 * @param classroom
 * @param title
 * @param description
 * @returns 
 */
export const createNotice = mutation({
  args: { classroom: v.string(), title: v.string(), description: v.string() },
  handler: async (ctx, args) => {
    return await createNoticeModel(
      ctx,
      args.classroom,
      args.title,
      args.description,
    );
  },
});

/**
 * Update a notice
 * @param _id
 * @param title
 * @param description
 */
export const updateNotice = mutation({
  args: { _id: v.id('notices'), title: v.string(), description: v.string() },
  handler: async (ctx, args) => {
    await updateNoticeModel(ctx, args._id, args.title, args.description);
  }
});

/**
 * Delete a notice
 * @param _id
 */
export const deleteNotice = mutation({
  args: { _id: v.id("notices") },
  handler: async (ctx, args) => {
    await deleteNoticeModel(ctx, args._id);
  }
});