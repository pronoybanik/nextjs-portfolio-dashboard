
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  ExternalLink,
  FolderKanban,
  LoaderCircle,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { TProject } from "@/types/projectType";

type Notice = {
  type: "error" | "success";
  message: string;
} | null;

const AllProjects: React.FC = () => {
  const [projects, setProjects] = useState<TProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const [projectToDelete, setProjectToDelete] =
    useState<TProject | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "published" | "draft">(
    "all"
  );

  const router = useRouter();

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setLoadError(false);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/project/all`
      );

      if (!res.ok) throw new Error("Failed to fetch projects");

      const data = await res.json();
      setProjects(data?.data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    if (!notice) return;

    const timer = setTimeout(() => setNotice(null), 4000);
    return () => clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    if (!projectToDelete) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !deleting) {
        setProjectToDelete(null);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [projectToDelete, deleting]);

  const publishedCount = projects.filter(
    (project) => project.isActive !== false
  ).length;

  const draftCount = projects.length - publishedCount;

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    return projects
      .filter((project) => {
        const matchesSearch =
          !query ||
          project.title?.toLowerCase().includes(query) ||
          project._id?.toLowerCase().includes(query);

        const isPublished = project.isActive !== false;

        const matchesFilter =
          filter === "all" ||
          (filter === "published" && isPublished) ||
          (filter === "draft" && !isPublished);

        return matchesSearch && matchesFilter;
      })
      .sort(
        (a, b) =>
          (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
      );
  }, [projects, search, filter]);

  const handleEdit = (id: string) => {
    router.push(`/dashboard/edit-project/${id}`);
  };

  const handleView = (id: string) => {
    window.open(
      `${process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000"}/project/${id}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleStatusChange = async (
    project: TProject,
    isActive: boolean
  ) => {
    const previousStatus = project.isActive !== false;

    setProjects((previous) =>
      previous.map((item) =>
        item._id === project._id ? { ...item, isActive } : item
      )
    );

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/project/${project._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isActive }),
        }
      );

      if (!res.ok) throw new Error("Failed to update status");

      const payload = await res.json();

      setProjects((previous) =>
        previous.map((item) =>
          item._id === project._id
            ? { ...item, ...(payload.data || {}), isActive }
            : item
        )
      );

      setNotice({
        type: "success",
        message: isActive
          ? "Project published successfully."
          : "Project moved to drafts successfully.",
      });
    } catch (error) {
      console.error(error);

      setProjects((previous) =>
        previous.map((item) =>
          item._id === project._id
            ? { ...item, isActive: previousStatus }
            : item
        )
      );

      setNotice({
        type: "error",
        message: "Unable to update project status. Please try again.",
      });
    }
  };

  const handleOrderChange = async (
    project: TProject,
    value: number
  ) => {
    const previousOrder = project.displayOrder;
    const displayOrder = Math.max(0, value || 0);

    setProjects((previous) =>
      previous.map((item) =>
        item._id === project._id
          ? { ...item, displayOrder }
          : item
      )
    );

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/project/${project._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ displayOrder }),
        }
      );

      if (!res.ok) throw new Error("Failed to update display order");

      setNotice({
        type: "success",
        message: "Display order saved successfully.",
      });
    } catch (error) {
      console.error(error);

      setProjects((previous) =>
        previous.map((item) =>
          item._id === project._id
            ? { ...item, displayOrder: previousOrder }
            : item
        )
      );

      setNotice({
        type: "error",
        message: "Unable to save display order. Please try again.",
      });
    }
  };

  const handleDelete = async () => {
    if (!projectToDelete) return;

    setDeleting(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/project/${projectToDelete._id}`,
        { method: "DELETE" }
      );

      if (!res.ok) throw new Error("Failed to delete project");

      setProjects((previous) =>
        previous.filter((project) => project._id !== projectToDelete._id)
      );

      setNotice({
        type: "success",
        message: "Project deleted successfully.",
      });

      setProjectToDelete(null);
    } catch (error) {
      console.error(error);

      setNotice({
        type: "error",
        message: "Unable to delete project. Please try again.",
      });
    } finally {
      setDeleting(false);
    }
  };

  const buttonBase =
    "inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <main className="min-h-screen bg-slate-50/70 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl space-y-7">
        {/* Page heading */}
        <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-teal-700">
              <FolderKanban size={17} />
              Portfolio Management
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Projects
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
              Manage, organize, and publish your portfolio projects
              from one place.
            </p>
          </div>

          <Link
            href="/dashboard/create-project"
            className={`${buttonBase} min-h-11 bg-teal-700 px-5 text-white shadow-sm hover:bg-teal-800 hover:shadow-md`}
          >
            <Plus size={18} />
            New project
          </Link>
        </header>

        {/* Notification */}
        {notice && (
          <div
            role={notice.type === "error" ? "alert" : "status"}
            className={`flex items-start justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${
              notice.type === "error"
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-emerald-200 bg-emerald-50 text-emerald-800"
            }`}
          >
            <div className="flex items-start gap-2">
              {notice.type === "error" ? (
                <CircleAlert size={18} className="mt-0.5 shrink-0" />
              ) : (
                <Check size={18} className="mt-0.5 shrink-0" />
              )}
              <span>{notice.message}</span>
            </div>

            <button
              type="button"
              onClick={() => setNotice(null)}
              className="rounded-md p-1 hover:bg-black/5"
              aria-label="Dismiss notification"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Statistics */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            label="Total projects"
            value={projects.length}
            description="All portfolio projects"
            icon={<FolderKanban size={20} />}
          />

          <StatCard
            label="Published"
            value={publishedCount}
            description="Visible on your portfolio"
            icon={<Check size={20} />}
          />

          <StatCard
            label="Drafts"
            value={draftCount}
            description="Not currently published"
            icon={<Pencil size={20} />}
          />
        </section>

        {/* Table container */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Table toolbar */}
          <div className="flex flex-col gap-4 border-b border-slate-200 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                All projects
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {filteredProjects.length}{" "}
                {filteredProjects.length === 1 ? "project" : "projects"} found
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1 sm:w-64">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search projects..."
                  aria-label="Search projects"
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10"
                />
              </div>

              <select
                value={filter}
                onChange={(event) =>
                  setFilter(event.target.value as typeof filter)
                }
                aria-label="Filter projects by status"
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10"
              >
                <option value="all">All statuses</option>
                <option value="published">Published</option>
                <option value="draft">Drafts</option>
              </select>

              <button
                type="button"
                onClick={() => void fetchProjects()}
                disabled={loading}
                className={`${buttonBase} border border-slate-200 bg-white text-slate-600 hover:bg-slate-50`}
                aria-label="Refresh projects"
              >
                <RefreshCw
                  size={16}
                  className={loading ? "animate-spin" : ""}
                />
                <span className="sm:hidden">Refresh</span>
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-64 flex-col items-center justify-center gap-3 p-8">
              <LoaderCircle size={30} className="animate-spin text-teal-700" />
              <p className="text-sm text-slate-500">Loading projects...</p>
            </div>
          ) : loadError ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center">
              <CircleAlert size={32} className="text-red-500" />
              <h3 className="mt-4 font-semibold text-slate-900">
                Unable to load projects
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Check your connection and try again.
              </p>
              <button
                type="button"
                onClick={() => void fetchProjects()}
                className={`${buttonBase} mt-5 bg-teal-700 text-white hover:bg-teal-800`}
              >
                <RefreshCw size={16} />
                Try again
              </button>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                <FolderKanban size={26} />
              </div>

              <h3 className="mt-4 font-semibold text-slate-900">
                {search || filter !== "all"
                  ? "No matching projects"
                  : "No projects yet"}
              </h3>

              <p className="mt-1 max-w-sm text-sm text-slate-500">
                {search || filter !== "all"
                  ? "Try changing your search or status filter."
                  : "Create your first project to showcase it on your portfolio."}
              </p>

              {search || filter !== "all" ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setFilter("all");
                  }}
                  className={`${buttonBase} mt-4 border border-slate-200 bg-white text-slate-700 hover:bg-slate-50`}
                >
                  Clear filters
                </button>
              ) : (
                <Link
                  href="/dashboard/create-project"
                  className={`${buttonBase} mt-4 bg-teal-700 text-white hover:bg-teal-800`}
                >
                  <Plus size={17} />
                  Create project
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[950px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/80">
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Project
                      </th>
                      <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Project ID
                      </th>
                      <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Display order
                      </th>
                      <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Status
                      </th>
                      <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredProjects.map((project) => {
                      const isPublished = project.isActive !== false;

                      return (
                        <tr
                          key={project._id}
                          className="group transition-colors hover:bg-slate-50/80"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-teal-100 bg-teal-50 text-teal-700 transition group-hover:bg-teal-100">
                                <FolderKanban size={20} />
                              </div>

                              <div className="min-w-0">
                                <p className="max-w-xs truncate font-semibold text-slate-800">
                                  {project.title || "Untitled project"}
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                  Portfolio project
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            <span
                              title={project._id}
                              className="inline-block max-w-40 truncate rounded-md border border-slate-200 bg-slate-50 px-2 py-1 font-mono text-xs text-slate-600"
                            >
                              {project._id}
                            </span>
                          </td>

                          <td className="px-4 py-4">
                            <input
                              type="number"
                              min={0}
                              step={1}
                              aria-label={`Display order for ${project.title}`}
                              value={project.displayOrder ?? 0}
                              onChange={(event) => {
                                const value = Number(event.target.value);
                                setProjects((previous) =>
                                  previous.map((item) =>
                                    item._id === project._id
                                      ? {
                                          ...item,
                                          displayOrder: value,
                                        }
                                      : item
                                  )
                                );
                              }}
                              onBlur={(event) => {
                                void handleOrderChange(
                                  project,
                                  Number(event.target.value)
                                );
                              }}
                              className="h-9 w-20 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10"
                            />
                          </td>

                          <td className="px-4 py-4">
                            <button
                              type="button"
                              onClick={() =>
                                void handleStatusChange(
                                  project,
                                  !isPublished
                                )
                              }
                              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition hover:opacity-80 ${
                                isPublished
                                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                  : "border-amber-200 bg-amber-50 text-amber-700"
                              }`}
                              title="Click to change project status"
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  isPublished
                                    ? "bg-emerald-500"
                                    : "bg-amber-500"
                                }`}
                              />
                              {isPublished ? "Published" : "Draft"}
                            </button>
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => handleView(project._id)}
                                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
                                title="View project"
                              >
                                <ExternalLink size={14} />
                                View
                              </button>

                              <button
                                type="button"
                                onClick={() => handleEdit(project._id)}
                                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-teal-200 bg-teal-50 px-3 text-xs font-semibold text-teal-800 transition hover:border-teal-300 hover:bg-teal-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
                                title="Edit project"
                              >
                                <Pencil size={14} />
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() => setProjectToDelete(project)}
                                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 text-xs font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                                title="Delete project"
                              >
                                <Trash2 size={14} />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col gap-2 border-t border-slate-200 bg-slate-50/50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500">
                  Showing{" "}
                  <span className="font-semibold text-slate-700">
                    {filteredProjects.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-slate-700">
                    {projects.length}
                  </span>{" "}
                  projects
                </p>

                <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400">
                  <Check size={14} />
                  Project management
                </span>
              </div>
            </>
          )}
        </section>

        <p className="text-center text-xs text-slate-400">
          Keep your portfolio organized and up to date.
        </p>
      </div>

      {/* Delete confirmation modal */}
      {projectToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !deleting
            ) {
              setProjectToDelete(null);
            }
          }}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-project-title"
            aria-describedby="delete-project-description"
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-7"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <Trash2 size={23} />
            </div>

            <h2
              id="delete-project-title"
              className="mt-5 text-xl font-bold text-slate-900"
            >
              Delete project?
            </h2>

            <p
              id="delete-project-description"
              className="mt-2 text-sm leading-6 text-slate-500"
            >
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-800">
                {projectToDelete.title}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                autoFocus
                disabled={deleting}
                onClick={() => setProjectToDelete(null)}
                className={`${buttonBase} border border-slate-200 bg-white px-4 text-slate-700 hover:bg-slate-50`}
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={() => void handleDelete()}
                className={`${buttonBase} bg-red-600 px-4 text-white shadow-sm hover:bg-red-700`}
              >
                {deleting ? (
                  <LoaderCircle size={16} className="animate-spin" />
                ) : (
                  <Trash2 size={16} />
                )}
                {deleting ? "Deleting..." : "Delete project"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

type StatCardProps = {
  label: string;
  value: number;
  description: string;
  icon: React.ReactNode;
};

function StatCard({
  label,
  value,
  description,
  icon,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
          <p className="mt-2 text-xs text-slate-400">{description}</p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default AllProjects;
