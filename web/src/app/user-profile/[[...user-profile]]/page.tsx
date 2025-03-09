"use client";

import { UserProfile } from "@clerk/nextjs";
import { X } from "lucide-react";
import Link from "next/link";

export default function UserProfilePage() {
  return (
    <div className="flex justify-center items-center min-h-screen w-screen bg-gray-100 relative">
      <div className="absolute top-4 right-10 cursor-pointer z-50">
        <Link href="/" passHref>
          <button aria-label="Close" className="hover:opacity-70 transition-opacity duration-200">
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </Link>
      </div>
      <UserProfile
        appearance={{
          elements: {
            rootBox: "w-full max-w-3xl mx-auto", // Customize the root container
            card: "shadow-lg rounded-lg", // Customize the card
            navbar: "border-b border-gray-200", // Customize the navbar
            headerTitle: "text-2xl font-bold", // Customize the header title
            headerSubtitle: "text-gray-600", // Customize the header subtitle
          },
          variables: {
            colorPrimary: "#4f46e5", // Customize primary color
            colorText: "#1f2937", // Customize text color
          },
        }}
        routing="path" // Use path-based routing
        path="/user-profile" // Define the path for the profile page
      />
    </div>
  );
}