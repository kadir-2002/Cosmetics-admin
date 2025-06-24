import React, { useState, useRef, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";


interface ComponentSelectorProps {
  selectedComponents: string[];
  onSelectComponent: (componentId: string) => void;
  componentOptions: any[];
}

export default function GraphComponentSelector({
  selectedComponents,
  onSelectComponent,
  componentOptions,
}: ComponentSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
    if (e.key === "Enter" || e.key === " ") {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="flex bg-white items-center justify-between w-full px-4 py-1.5 bg-light-blue border border-light-blue rounded-md shadow-sm text-sm focus:outline-none "
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center">
     
          <span className="text-gray-900 font-semibold text-lg">Graph</span>
        </div>
        <IoIosArrowDown
          className={`w-4 h-4 ml-2 transition-transform duration-200 ${
            isOpen ? "transform rotate-180" : ""
          }`} 
        />
      </button>

      {isOpen && (
        <div
          className="absolute z-20 md:w-[250px] lg:w-[220px] w-[180px]  mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto [&::-webkit-scrollbar]:w-2
              [&::-webkit-scrollbar-track]:bg-gray-100
              [&::-webkit-scrollbar-thumb]:bg-gray-300
              dark:[&::-webkit-scrollbar-track]:bg-neutral-700
              dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
          <ul className="py-1" role="listbox">
            {componentOptions.map((option) => {
              const isDisabled = selectedComponents.includes(option.id);
              return (
                <li
                  key={option.id}
                  className={`
                    px-4 py-2 text-sm cursor-pointer flex items-center justify-between
                    ${
                      isDisabled
                        ? "text-gray-400 bg-gray-50 cursor-not-allowed"
                        : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                    }
                    transition-colors duration-150
                  `}
                  onClick={() => {
                    if (!isDisabled) {
                      onSelectComponent(option.id);
                      setIsOpen(false);
                    }
                  }}
                  role="option"
                  aria-selected={selectedComponents.includes(option.id)}
                >
                  <div className="flex items-center space-x-2">
                    <span>{option.label}</span>
                  </div>
                  {selectedComponents.includes(option.id) && (
                    // <Check className="w-4 h-4 text-blue-500" />
                    <></>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
