import { GENERIC_MESSAGES } from "@/constants/messages/generic.message";
import { deleteParkingSpaceService } from "@/services/parking.service";
import type { Feedback, FormState } from "@/types/action-type";

/**
 * SSR action, delete a notice
 * @param prevState
 * @param formData
 *  
 * */
const deleteAction = async (prevState: FormState, formData: FormData) => {
  try {
    // Initial the feedback
    const feedback: Feedback = { result: false, message: "" };
    // Get id from from
    const id = formData.get('id') as string;
    // Call service to delete notice
    const response = await deleteParkingSpaceService(id);
    // Set state according to response,for toast use
    if (response.result) {
      feedback.result = true;
      feedback.message = GENERIC_MESSAGES.SUCCESS.DELETE_SUCCESSFUL;
    }
    else {
      feedback.result = false;
      feedback.message = GENERIC_MESSAGES.ERROR.DELETE_FAILED;
    }
    return { feedback };
  } catch (err) {
    console.error(`Failed to delete notice. Please try again. ${err}`);
    throw new Error("Delete notice failed");
  }
};

export default deleteAction;
