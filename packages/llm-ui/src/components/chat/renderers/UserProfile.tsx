import { Mail, MapPin, Phone, User } from "lucide-react";
import React from "react";

interface UserProfileProps {
  name?: string;
  role?: string;
  email?: string;
  location?: string;
  avatar?: string;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  name = "Anonymous",
  role = "User",
  email,
  location,
  avatar
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 p-4 my-4 bg-white dark:bg-[#1e1f20] rounded-xl border border-gray-200 dark:border-[#3c4043] shadow-sm max-w-md">
      <div className="relative">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold overflow-hidden">
          {avatar ? (
            <img src={avatar} alt={name} className="w-full h-full object-cover" />
          ) : (
            <span>{name.charAt(0).toUpperCase()}</span>
          )}
        </div>
        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white dark:border-[#1e1f20] rounded-full"></div>
      </div>

      <div className="flex-1 text-center sm:text-left">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{name}</h3>
        <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-2">{role}</p>

        <div className="flex flex-col gap-1 text-xs text-gray-500 dark:text-gray-400">
          {email && (
            <div className="flex items-center justify-center sm:justify-start gap-1.5">
              <Mail size={12} />
              <span>{email}</span>
            </div>
          )}
          {location && (
            <div className="flex items-center justify-center sm:justify-start gap-1.5">
              <MapPin size={12} />
              <span>{location}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex sm:flex-col gap-2">
        <button className="p-2 rounded-lg bg-gray-100 dark:bg-[#2d2e30] hover:bg-gray-200 dark:hover:bg-[#3c4043] text-gray-600 dark:text-gray-300 transition-colors">
          <User size={16} />
        </button>
        <button className="p-2 rounded-lg bg-gray-100 dark:bg-[#2d2e30] hover:bg-gray-200 dark:hover:bg-[#3c4043] text-gray-600 dark:text-gray-300 transition-colors">
          <Phone size={16} />
        </button>
      </div>
    </div>
  );
};
