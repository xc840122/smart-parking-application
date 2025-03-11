"use client"

import * as React from "react"
import {
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { SignedIn, SignedOut, SignIn, SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs"
import { Button } from "./ui/button"

// This is sample data.
const data = {
  // user: {
  //   name: "Peter",
  //   email: "peter@example.com",
  //   avatar: "/avatar.png",
  // },
  navMain: [
    {
      title: "Start Parking",
      url: "",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Parking Lots",
          url: "/parking",
        },
        {
          title: "Booking Record",
          url: "/booking",
        },
        {
          title: "My Review",
          url: "/review",
        },
      ],
    },
    {
      title: "Billing Information",
      url: "",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Payment History",
          url: "/payment",
        },
        {
          title: "Wallet",
          url: "/wallet",
        },
      ],
    },
    {
      title: "Customer Support",
      url: "",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Contact Us",
          url: "/payment",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        {!user
          ? (
            <div className="flex gap-2 justify-center bg-gray-200 
            shadow-sm p-4 rounded-md w-full">
              <SignedOut>
                <SignInButton>
                  <Button variant='outline'>
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton>
                  <Button variant='default' className="bg-gray-400 hover:bg-gray-500">
                    Sign Up
                  </Button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          )
          : (
            <NavUser
              user={{
                name: user.username ?? '',
                level: user.unsafeMetadata.level as string,
                avatar: user.imageUrl ?? '',
              }} />
          )
        }
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
