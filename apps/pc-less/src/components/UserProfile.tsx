import React from "react";
import styles from "./UserProfile.module.less";

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
    <div className={styles.container}>
      <div className={styles.header}>
        {avatar ? (
          <img src={avatar} alt={name} className={styles.avatar} />
        ) : (
          <div className={styles.avatarPlaceholder}>{(name || "A").charAt(0).toUpperCase()}</div>
        )}
        <div className={styles.info}>
          <h3 className={styles.name}>{name || "Anonymous"}</h3>
          {role && <p className={styles.role}>{role}</p>}
        </div>
      </div>
      {bio && <div className={styles.bio}>{bio}</div>}
      {children && <div className={styles.children}>{children}</div>}
    </div>
  );
};
