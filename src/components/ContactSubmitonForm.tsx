import Image from "next/image";
import Link from "next/link";
import React from "react";

export interface TBlog {
  title: string;
  content: string;
  author: string;
  _id: string;
  img: string;
  category: string;
}

const ContactSubmitonForm = ({ blog }: { blog: TBlog }) => {
  return (
    <div>
      <Link
        href={`/blog/${blog?._id}`}
        key={blog?._id}
        className="bg-white shadow-lg rounded-2xl overflow-hidden transition-transform transform hover:scale-105"
      >
        <div className="relative h-48">
          <Image
            src={blog.img}
            alt={blog.title}
            fill
            className="object-cover"
          />
          <span className="absolute top-2 left-2 bg-purple-600 text-white text-sm px-3 py-1 rounded-lg">
            {blog.category}
          </span>
        </div>
        <div className="p-4">
          <p className="text-sm text-gray-500 flex items-center space-x-2">
            <span className="text-purple-600">•</span>
            <span>Comment</span>
          </p>
          <h3 className="text-lg font-semibold mt-2">{blog.title}</h3>
        </div>
      </Link>
    </div>
  );
};

export default ContactSubmitonForm;
