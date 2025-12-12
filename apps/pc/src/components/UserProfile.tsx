import React from "react";

/**
 * UserProfile Component
 *
 * Usage Example:
 * ::user-profile[User Bio Content]{name="John Doe" role="Developer" avatar="https://example.com/avatar.png" bio="Full stack developer"}
 */
interface UserProfileProps {
  name?: string;
  role?: string;
  avatar?: string;
  bio?: string;
  [key: string]: any;
}

export const UserProfile: React.FC<UserProfileProps> = ({ name, role, avatar, bio, children, ...rest }) => {
  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800 my-2 max-w-md">
      <div className="flex items-center gap-4">
        {avatar ? (
          <img src={avatar} alt={name} className="w-12 h-12 rounded-full object-cover" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xl">
            {(name || "A").charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <h3 className="font-bold text-lg">{name || "Anonymous"}</h3>
          {role && <p className="text-sm text-gray-500">{role}</p>}
        </div>
      </div>
      {bio && <div className="mt-3 text-gray-700 dark:text-gray-300 text-sm">{bio}</div>}
      {children && <div className="mt-3 text-sm">{children}</div>}
    </div>
  );
};
