"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg">
        <Button variant="ghost" size="icon" className="absolute right-2 top-2" onClick={() => router.back()}>
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
        <div>{children}</div>
      </div>
    </div>
  )
}

export default Modal