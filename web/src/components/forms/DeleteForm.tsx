'use client'
import {
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import deleteAction from "@/actions/delete.action";

const DeleteForm = ({
  id,
}: {
  id: string,
}) => {

  const [state, formAction, isPending] = useActionState(deleteAction, {
    feedback: { result: false, message: "" }
  });

  /**
   * Prevent multiple toasts by using useEffect and judgement(message) to listen to the feedback state change
   * useActionState triggers renders before the user confirms the action. 
   * This is because it tracks the state changes that happen during the asynchronous operation (delete action) 
   * and updates the state accordingly.It doesn't wait for the user to confirm.
   */
  useEffect(() => {
    // useActionState trace the status
    // Avoid empty toast coz the default message is empty, 
    // it generates toast before conforming
    if (state.feedback.message) {
      if (state.feedback.result) {
        toast.success(state.feedback.message);
      } else {
        toast.error(state.feedback.message);
      }
    }
  }, [state.feedback]);

  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>
          {`Are you sure you want to delete it?`}
        </AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently remove the data.
        </AlertDialogDescription>
      </AlertDialogHeader>
      {!state.feedback.result && <p className="text-red-500 text-sm">{state.feedback.message}</p>}
      <AlertDialogFooter className="flex items-center justify-center gap-2">
        <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
        <form
          autoComplete="off"
          action={formAction}
        >
          <input type="hidden" name="id" value={id} />
          <Button
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Confirm"}
          </Button>
        </form>
      </AlertDialogFooter>
    </>
  );
};

export default DeleteForm;