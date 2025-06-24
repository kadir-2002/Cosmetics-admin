"use client"
import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { GoSearch } from "react-icons/go";


const SearchComponent: React.FC = async () => {
   
    const [searchText, setSearchText] = useState<string>("");
    const [searchTextBy, setSearchTextBy] = useState<string>("");
    const [showDropdown, setShowDropdown] = useState<boolean>(false);

    const handleDropdownClick = (searchBy: string) => {
        setSearchTextBy(searchBy);
      };
      const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
        setShowDropdown(!!e.target.value);
    
    
      };
      const clearSearch = () => {
        setSearchText("");
        setSearchTextBy("");
    
      };
      
    
  return (
    <div className=" flex justify-center items-center mx-auto w-full">
         <div className="md:w-[60%] w-[90%] mb-4 relative">
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            <GoSearch />
          </span>
          <input
            type="text"
            className="w-full p-2 pl-10 pr-10 border bg-gray-200 border-gray-500 rounded-lg focus:outline-none"
            placeholder="Search by Client Name, Email, Service Name or ID"
            value={searchText}
            onChange={handleSearchChange}
          />
          {searchText && (
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              onClick={clearSearch}
            >
              <AiOutlineClose size={23} />
            </button>
          )}
        </div>

        {showDropdown && (
          <div className="absolute bg-white border border-gray-300 w-full mt-1 rounded-lg shadow-lg">
            <ul className="py-2">
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleDropdownClick("name")}
              >
                Search name for: {searchText}
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleDropdownClick("email")}
              >
                Search email for: {searchText}
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleDropdownClick("id")}
              >
                Search ID for: {searchText}
              </li>

              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleDropdownClick("service")}
              >
                Search service for: {searchText}
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleDropdownClick("prize")}
              >
                Search price for: {searchText}
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleDropdownClick("status")}
              >
                Search status for: {searchText}
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchComponent;
