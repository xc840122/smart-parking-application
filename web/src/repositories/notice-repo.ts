/**
 * Notice data layer
 * 
 */
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";


/**
 * Get notice list by class name from database
 * Apply beta function fetchQuery from convex/nextjs for SSR
 * @param classroom
 * @returns 
 */
// export const getNoticesRepo = async (classroom: string) => {
//   try {
//     const noticeList = await fetchQuery(
//       api.notice.getNotices,
//       { classroom: classroom }
//     );
//     return noticeList;
//   } catch (error) {
//     console.error(`Failed to get notice list from db: ${error}`);
//     return null;
//   }
// }

export const getNoticeByIdRepo = async (id: string) => {
  try {
    const notice = await fetchQuery(
      api.notice.getNoticeById,
      { _id: id as Id<"notices"> }
    );
    return notice;
  } catch (error) {
    console.error(`Failed to get notice by id: ${error}`);
    throw new Error("Get notice by id failed");
  }
}

export const createNoticeRepo = async (classroom: string, title: string, description: string): Promise<Id<"notices">> => {
  try {
    return await fetchMutation(
      api.notice.createNotice,
      {
        classroom: classroom,
        title: title,
        description: description
      }
    );
  } catch (error) {
    console.error(`Failed to create notice: ${error}`);
    throw new Error("Create notice failed");
  }
}

export const updateNoticeRepo = async (id: string, title: string, description: string) => {
  try {
    await fetchMutation(
      api.notice.updateNotice,
      {
        _id: id as Id<"notices">,
        title: title,
        description: description
      }
    );
  } catch (error) {
    console.error(`Failed to update notice: ${error}`);
    return null;
  }
}

export const deleteNoticeRepo = async (id: string) => {
  try {
    await fetchMutation(
      api.notice.deleteNotice,
      { _id: id as Id<"notices"> }
    );
  } catch (error) {
    console.error(`Failed to delete notice: ${error}`);
    return null;
  }
}

