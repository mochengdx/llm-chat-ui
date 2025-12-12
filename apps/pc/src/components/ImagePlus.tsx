import React from "react";

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
    <div className="border rounded-lg overflow-hidden shadow-sm bg-white dark:bg-gray-800 my-2 max-w-md hover:shadow-md transition-shadow">
      <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
        <img src={src} alt={name || "Image"} className="w-full h-full object-cover" />
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg truncate flex-1" title={name}>
            {name || "Unnamed Image"}
          </h3>
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 text-sm flex-shrink-0 ml-2"
            >
              Open Link &rarr;
            </a>
          )}
        </div>

        {info && <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{info}</p>}

        {children && <div className="text-sm mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">{children}</div>}
      </div>
    </div>
  );
};
