import { Loader } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen fixed top-0 left-0 right-0 bottom-0 bg-white bg-opacity-90 z-50">
      <Loader className="h-12 w-12 animate-spin text-blue-500" />
    </div>
  );
}