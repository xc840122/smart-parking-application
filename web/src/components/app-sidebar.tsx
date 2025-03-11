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
            level: user.unsafeMetadata.level as string,
            avatar: user.imageUrl ?? 'avatar',
          }} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
