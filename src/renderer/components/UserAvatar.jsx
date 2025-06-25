import { User } from "lucide-react";

export default function UserAvatar() {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
        <User className="text-gray-600 dark:text-gray-300" size={24} />
      </div>
      <span className="mt-1 text-xs text-gray-600 dark:text-gray-300">User101010</span>
    </div>
  );
}
