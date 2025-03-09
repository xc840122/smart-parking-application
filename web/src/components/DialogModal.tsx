'use client'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "./ui/button"
import { ReactElement, useState } from "react";
import React from "react";
import { Pencil, Trash2 } from "lucide-react";

interface ModalProps {
  triggerButtonText?: string;
  triggerButtonStyles?: string;
  children: ReactElement<{ onClose?: () => void }>;
}

const DialogModal = ({
  triggerButtonText,
  triggerButtonStyles,
  children
}: ModalProps) => {

  const [isOpen, setIsOpen] = useState(false);

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      {/* Button type of trigger */}
      {<AlertDialogTrigger asChild>
        {triggerButtonText === 'Delete'
          ? <Trash2 color="#7b39ed" />
          : triggerButtonText === 'Edit'
            ? <Pencil color="#7b39ed" />
            : (<Button className={triggerButtonStyles}>
              {triggerButtonText}
            </Button>)}
      </AlertDialogTrigger>}
      {/* Modal content */}
      <AlertDialogContent>
        {children && React.isValidElement(children)
          ? React.cloneElement(children, { onClose: () => setIsOpen(false) })
          : children}
        <div className="absolute top-4 right-4 cursor-pointer">
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DialogModal