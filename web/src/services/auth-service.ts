import { signUpCodeVerificationRepo, updateVerificationInfoRepo } from "@/repositories/auth-repo";
import { ApiResponse } from "@/types/api-type";
import { VerificationInfoDataModel } from "@/types/convex-type";


export const signUpVerificationService = async (code: string, classroom: string)
  : Promise<ApiResponse<VerificationInfoDataModel>> => {
  try {
    // Get the verification information by code
    const verificationInfo = await signUpCodeVerificationRepo(code, classroom);

    // // If no verification information is found,return false
    if (!verificationInfo)
      return { result: false, message: "ERROR.CODE_NOT_FOUND" };

    // If the verification code is invalid, return false
    if (verificationInfo.isValid !== true) {
      return { result: false, message: "ERROR.INVALID_CODE" };
    }
    // If the classroom doesn't match, return false
    if (verificationInfo.classroom.toLowerCase() !== classroom.toLowerCase()) {
      return { result: false, message: "ERROR.CLASSROOM_NOT_MATCH" };
    }
    return { result: false, message: "SUCCESS.VERIFICATION_SUCCESSFUL", data: verificationInfo };;

  } catch (error) {
    console.error(`Failed to get verification information from db: ${error}`);
    throw new Error("ERROR.UNKNOWN");
  }
}

export const updateVerificationInfoService = async (id: string, isValid: boolean) => {
  try {
    await updateVerificationInfoRepo(id, isValid);
    return { result: true, message: "SUCCESS.VERIFICATION_UPDATED" };
  } catch (error) {
    console.error(`Failed to update verification information in db: ${error}`);
    throw new Error("ERROR.UNKNOWN");
  }
}