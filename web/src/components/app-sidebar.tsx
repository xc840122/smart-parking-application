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
      title: "Parking Management",
      url: "",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Find Parking",
          url: "/parking",
        },
        {
          title: "My Booking",
          url: "/booking",
        },
      ],
    }, {
      title: "Billing Management",
      url: "",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Order History",
          url: "/parking",
        },
        {
          title: "My Account",
          url: "/account",
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
          title: "Contact us",
          url: "/contact",
        },
        {
          title: "Notice",
          url: "/notice",
        },
      ],
    },
    {
      title: "Admin Management",
      url: "",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Parking Management",
          url: "/parkingmanagement",
        },
        {
          title: "Booking Management",
          url: "/bookingmanagement",
        },
        {
          title: "Order Management",
          url: "/ordermanagement",
        },
        {
          title: "Review Management",
          url: "/reviewmanagement",
        },
        {
          title: "Notice Management",
          url: "/noticemanagement",
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
