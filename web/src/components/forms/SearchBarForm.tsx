'use client'
import searchAction from "@/actions/search-action";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useActionState } from "react";
// import { useActionState, useEffect, useState } from "react";

const SearchBar = () => {

  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();

  const [state, formAction, isPending] = useActionState(searchAction,
    { feedback: { result: false, message: "" } });

  // Clear search query and reset list
  const clearSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    router.replace(`${path}?${params.toString()}`, { scroll: false });
  };

  // Display error message if any
  const error = (!state.feedback.result && state.feedback.message)
    ? state.feedback.message : null;

  return (
    <form
      action={formAction}
      className="flex flex-col justify-center items-star w-full md:max-w-max gap-2">
      <span
        className={`text-red-500 text-xs w-full h-4 ${error ? 'block' : 'hidden'}`}>
        {error}
      </span>
      {/* Display current search keyword with a remove option */}
      {searchParams.get('search') && (
        <div className={`flex items-center justify-between w-fit space-x-2 px-1 rounded-lg bg-gray-100 opacity-70`}>
          <span className="text-sm text-gray-500">{searchParams.get('search')}</span>
          <X
            onClick={clearSearch}
            size={12}
            className="text-gray-500 cursor-pointer" />
        </div>
      )}
      <div className="flex flex-col items-center md:flex-row w-full gap-2">
        <Input
          className="md:w-64"
          name="search"
          type="text"
          placeholder="Please input..."
        />
        <Button
          type="submit"
          disabled={isPending}
          className="w-full md:w-auto"
        >
          Search
        </Button>
      </div>
    </form>
  )
}

export default SearchBar
