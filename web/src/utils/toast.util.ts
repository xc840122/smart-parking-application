import { ToastType } from "@/constants/enum/toast";
import { toast } from "sonner";

export const toastMessage = (message: string, type: ToastType) => {
  'use client';
  switch (type) {
    case ToastType.SUCCESS:
      toast.success(message);
      break;
    case ToastType.ERROR:
      toast.error(message);
      break;
    case ToastType.WARNING:
      toast.warning(message);
      break;
    case ToastType.INFO:
      toast.info(message);
      break;
    default:
      toast(message);
  };
};