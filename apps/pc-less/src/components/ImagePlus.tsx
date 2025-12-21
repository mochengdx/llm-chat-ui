import React from "react";
import styles from "./ImagePlus.module.less";

/**
 * ImagePlus Component
 *
 * Usage Example:
 * ::image-plus[Description inside]{src="https://mdn.alipayobjects.com/oasis_be/afts/img/A*IP-ZRq1TJY4AAAAAQYAAAAgAekp5AQ/original/T_Effect_EdgeBaseMap.png" name="Image Name" info="Some info" link="https://example.com"}
 */
interface ImagePlusProps {
  src?: string;
  name?: string;
  info?: string;
  link?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export const ImagePlus: React.FC<ImagePlusProps> = ({
  src = "https://mdn.alipayobjects.com/oasis_be/afts/img/A*IP-ZRq1TJY4AAAAAQYAAAAgAekp5AQ/original/T_Effect_EdgeBaseMap.png",
  name,
  info,
  link,
  children
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.imageWrapper}>
        <img src={src} alt={name || "Image"} className={styles.image} />
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.title} title={name}>
            {name || "Unnamed Image"}
          </h3>
          {link && (
            <a href={link} target="_blank" rel="noopener noreferrer" className={styles.link}>
              Open Link &rarr;
            </a>
          )}
        </div>

        {info && <p className={styles.info}>{info}</p>}

        {children && <div className={styles.children}>{children}</div>}
      </div>
    </div>
  );
};
