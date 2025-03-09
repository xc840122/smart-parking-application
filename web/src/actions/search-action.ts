import { NOTICE_MESSAGES } from "@/constants/messages/notice-message";
import type { FormState, Feedback } from "@/types/action-type";
import { searchInputSchema } from "@/validators/notice-validator";
import { redirect } from "next/navigation";

const searchAction = (prevSate: FormState, formData: FormData) => {

  // Initial the feedback
  const feedback: Feedback = { result: false, message: "" };

  // Validate the input using the schema
  const value = formData.get("search") as string;
  const result = searchInputSchema.safeParse({ keyword: value });

  if (!result.success && value) {
    feedback.result = false;
    feedback.message = NOTICE_MESSAGES.ERROR.INVALID_SEARTCH_INPUT;
  } else {
    // Set the feedback message to be search value
    // feedback.result = true;
    // feedback.message = value;
    redirect(`?search=${encodeURIComponent(value)}&page=1`);
  }
  return { feedback };
}

export default searchAction