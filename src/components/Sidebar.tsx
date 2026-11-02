"use client";


import { logout } from "@/service/auth";
import SecondaryButton from "@/shared/SecondaryButton";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FaHome, FaProjectDiagram, FaBloggerB } from "react-icons/fa";
import { GrProjects } from "react-icons/gr";
import { IoIosContact } from "react-icons/io";
import { TbLogs } from "react-icons/tb";

const Sidebar = () => {
  const routes = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    routes.push("/login");
  };

  return (
    <div className="rounded-2xl bg-slate-900 p-4 shadow-xl shadow-slate-200/60 lg:sticky lg:top-5">
      <div className="mb-6 px-3 pt-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300">
          Portfolio
        </p>
        <h1 className="mt-1 text-xl font-bold text-white">Admin Dashboard</h1>
      </div>
      <ul className="grid gap-1 sm:grid-cols-2 lg:grid-cols-1">
        <li>
          <Link
            href="/dashboard"
            className={`flex items-center gap-3 rounded-xl p-3 text-sm font-medium transition ${
              pathname === "/dashboard"
                ? "bg-indigo-500 text-white shadow-lg shadow-indigo-950/30"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <FaHome className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard/create-project"
            className={`flex items-center gap-3 rounded-xl p-3 text-sm font-medium transition ${
              pathname === "/dashboard/create-project"
                ? "bg-indigo-500 text-white shadow-lg shadow-indigo-950/30"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <FaProjectDiagram className="h-5 w-5" />
            <span>Create project</span>
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard/all-project"
            className={`flex items-center gap-3 rounded-xl p-3 text-sm font-medium transition ${
              pathname === "/dashboard/all-project"
                ? "bg-indigo-500 text-white shadow-lg shadow-indigo-950/30"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <GrProjects className="h-5 w-5" />
            <span>Projects</span>
          </Link>
        </li>
        {/* <li>
          <Link
            href="/dashboard/create-blogs"
            className={`flex items-center gap-3 rounded-xl p-3 text-sm font-medium transition ${
              pathname === "/dashboard/create-blogs"
                ? "bg-indigo-500 text-white shadow-lg shadow-indigo-950/30"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <FaBloggerB className="h-5 w-5" />
            <span>Create Blogs</span>
          </Link>
        </li> */}
        <li>
          <Link
            href="/dashboard/contact"
            className={`flex items-center gap-3 rounded-xl p-3 text-sm font-medium transition ${
              pathname === "/dashboard/contact"
                ? "bg-indigo-500 text-white shadow-lg shadow-indigo-950/30"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <IoIosContact className="h-5 w-5" />
            <span>Contact</span>
          </Link>
        </li>
        {/* <li>
          <Link
            href="/dashboard/all-blogs"
            className={`flex items-center gap-3 rounded-xl p-3 text-sm font-medium transition ${
              pathname === "/dashboard/all-blogs"
                ? "bg-indigo-500 text-white shadow-lg shadow-indigo-950/30"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <TbLogs className="h-5 w-5" />
            <span>Blogs</span>
          </Link>
        </li> */}
        <li>
          <div className="mt-3 border-t border-slate-800 pt-3 sm:col-span-2 lg:col-span-1">
            <SecondaryButton handler={handleLogout}>Logout</SecondaryButton>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
