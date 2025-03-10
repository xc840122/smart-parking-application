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
import { useUser } from "@clerk/nextjs"

// This is sample data.
const data = {
  // user: {
  //   name: "Peter",
  //   email: "peter@example.com",
  //   avatar: "/avatar.png",
  // },
  navMain: [
    {
      title: "Class Management",
      url: "",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Notice",
          url: "/notice",
        },
        {
          title: "Lesson",
          url: "/notice",
        },
        {
          title: "Student",
          url: "/notice",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, isLoaded, isSignedIn } = useUser();
  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: user.username ?? 'username',
            class: user.unsafeMetadata.classroom as string,
            avatar: user.imageUrl ?? 'avatar',
          }} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
