import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import SidebarDropdown from "./SidebarDropdown";
const SidebarItem = ({ item, pageName, setPageName, setSidebarOpen }: any) => {
  const handleClick = () => {
    setSidebarOpen(false)
    const updatedPageName =
      pageName !== item.label.toLowerCase() ? item.label.toLowerCase() : "";
    return setPageName(updatedPageName);
  };

  const pathname = usePathname();

  const isActive = (item: any) => {
    if (item?.route === pathname) return true;
    if (item?.children) {
      return item?.children.some((child: any) => isActive(child));
    }
    return false;
  };
  const isItemActive = isActive(item);
  return (
    <li>
      <Link
        href={item.route}
        onClick={handleClick}
        className={`${isItemActive ? "bg-[#ffffff] text-[#281868] rounded-xl shadow-sm" : ""} group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4`}>
        <div className="h-8 w-8 flex justify-center items-center">
          {/* <Image
            width={60}
            height={60}
            src={item?.icon}
            alt="Logo"
            priority
            className='h-full w-full'
          /> */}
          {item?.icon}
        </div>
        <p className="text-xl">{item?.label}</p>
        {item.children && (
            <svg className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${pageName === item.label.toLowerCase() && "rotate-180"}`}
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                fill=""
              />
            </svg>
          )} 
          {isItemActive && (
            <span className="absolute -right-1 top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-[#A259FF] shadow-md"></span>
          )}
      </Link>
    {item?.children && (
        <div className={`translate transform overflow-hidden ${pageName !== item?.label?.toLowerCase() && "hidden"}`}>
          <SidebarDropdown item={item?.children} />
        </div>
      )}
    </li>

  );
};

export default SidebarItem;
