import ProductItem from "@/components/ProductItem";
import React from "react";
import Link from "next/link";
import { TProject } from "@/app/types/projectType";

const Projects = async ({ loadId }: { loadId: string }) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/project`, {
    cache: "no-cache",
  });
  const projects = await res.json();

  return (
    <section id={loadId} className="py-16 px-8 bg-purple-50 min-h-screen">
      <div className="text-center my-20">
        <h2 className="text-4xl sm:text-5xl md:text-7xl my-4 md:my-6 font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 leading-tight">
          My Recent Works
        </h2>
        <p className="text-black mt-8 text-xl  font-medium text-center">
          We put your ideas and thus your wishes in the form of a unique web
          project that <br /> inspires you and you customers.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 grid-cols-1 max-w-screen-2xl mx-auto">
        {projects?.data?.slice(0, 4).map((project: TProject) => (
          <ProductItem key={project?._id} projectData={project} />
        ))}
      </div>
      <Link href="/all-product" className="flex justify-center mt-8">
        <button className="w-60 px-5 py-3 text-base font-medium text-center text-indigo-100 border border-indigo-500 rounded-lg shadow-sm cursor-pointer hover:text-white bg-gradient-to-br from-purple-500 via-indigo-500 to-indigo-500">
          View All
        </button>
      </Link>
    </section>
  );
};

export default Projects;
