"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react" // Import icons

const DropdownMenuRadio = ({
  topItem,
  menu,
  selectedValue,
  disabled,
  onValueChange
}: {
  topItem: string, // Title of the dropdown
  menu: string[], // List of options
  selectedValue?: string, // Currently selected value
  disabled?: boolean, // Whether the dropdown is disabled
  onValueChange?: (value: string) => void // Callback when a value is selected
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className="flex items-center justify-between gap-2 w-1/3" // Fixed width and layout
        >
          <span className="truncate text-ellipsis"> {/* Truncate long text */}
            {selectedValue || topItem} {/* Display selected value or default title */}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" /> {/* Dropdown icon */}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuLabel className="text-sm font-semibold text-gray-700">
          {topItem} {/* Dropdown title with styling */}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={selectedValue}
          onValueChange={onValueChange}
        >
          {menu.map((item) => (
            <DropdownMenuRadioItem
              key={item}
              value={item}
              className="flex items-center justify-between gap-2" // Layout for menu items
            >
              <span>{item}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default DropdownMenuRadio;