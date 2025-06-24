"use client";
import React, { useState } from "react";
import BlogTagFormComponent from "./BlogTagFormComponent";
import BlogSEOKeywordComponent from "./BlogSEOKeywordComponent";
import BlogFormComponent from "./BlogFromComponent";
import BlogCommentCOmponent from "./BlogCommentCOmponent";

const tabs = [
  {
    label: "Blogs",
    content: (
      <div>
        <BlogFormComponent />
      </div>
    ),
  },
  {
    label: "Blog Tag",
    content: (
      <div>
        <BlogTagFormComponent />
      </div>
    ),
  },
  {
    label: "Blog SEO Keyword",
    content: (
      <div>
        <BlogSEOKeywordComponent />
      </div>
    ),
  },
];

const BlogTagandPostMainComponent = () => {
  const [activeTab, setActiveTab] = useState(tabs[0].label);
  return (
    <div className='w-full'>
      <div className='flex space-x-4 mb-6'>
        {tabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(tab.label)}
            className={`px-4 py-2 rounded-md transition-colors duration-200 ${
              activeTab === tab.label
                ? "bg-admin-primary text-white"
                : "bg-white border-[1px] hover:bg-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className=''>{tabs.find((t) => t.label === activeTab)?.content}</div>
    </div>
  );
};

export default BlogTagandPostMainComponent;
