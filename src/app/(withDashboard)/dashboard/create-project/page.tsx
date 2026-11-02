"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface ProjectFormData {
  title: string;
  category: string;
  description: string;
  frontEndGitLink: string;
  backEndGitLink: string;
  liveLink: string;
  image: FileList;
  isActive: boolean;
  displayOrder: number;
}

const CATEGORIES = [
  "Portfolio Website",
  "E-commerce Website",
  "Hospital Management",
  "Learning/Tutoring Platform",
  "Job Board Website",
  "Blogging Platform",
  "SaaS Dashboard (Analytics/CRM/HRM/etc.)",
  "Real Estate Listing Website",
  "Forum/Community Website",
  "Event Management Website",
  "Travel Booking Website",
];

const urlRule = (label: string) => ({
  required: `${label} is required`,
  pattern: {
    value: /^https?:\/\/.+\..+/i,
    message: "Enter a full link starting with http:// or https://",
  },
});

const inputClass =
  "block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/25";

const Field = ({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) => (
  <label className="block">
    <span className="mb-1.5 block text-sm font-medium text-slate-800">
      {label}
    </span>
    {children}
    {error ? (
      <span className="mt-1.5 block text-xs font-medium text-red-600">
        {error}
      </span>
    ) : hint ? (
      <span className="mt-1.5 block text-xs text-slate-500">{hint}</span>
    ) : null}
  </label>
);

const Section = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) => (
  <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
    <h3 className="text-base font-semibold text-slate-900">{title}</h3>
    <p className="mb-5 mt-0.5 text-sm text-slate-500">{description}</p>
    <div className="space-y-5">{children}</div>
  </section>
);

const CreateProject = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    resetField,
  } = useForm<ProjectFormData>({
    defaultValues: { isActive: true, displayOrder: 0 },
  });

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "error" | "success";
    message: string;
  } | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // Live preview of the selected image
  const imageFiles = watch("image");
  useEffect(() => {
    const file = imageFiles?.[0];
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFiles]);

  const isActive = watch("isActive");

  const onSubmit = async (data: ProjectFormData) => {
    setStatus(null);
    const imageValue = data.image?.[0];
    if (!imageValue) {
      setStatus({ type: "error", message: "Add a cover image to continue." });
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", imageValue);
      formData.append("upload_preset", "Book-sell-shop");
      formData.append("cloud_name", "dvcbclqid");

      const imageResponse = await fetch(
        `https://api.cloudinary.com/v1_1/dvcbclqid/image/upload`,
        { method: "POST", body: formData }
      );

      if (!imageResponse.ok) {
        const errorData = await imageResponse.json().catch(() => null);
        setStatus({
          type: "error",
          message: `Image upload failed: ${
            errorData?.error?.message ||
            errorData?.message ||
            imageResponse.statusText
          }`,
        });
        return;
      }

      const imgData = await imageResponse.json();

      const projectData = {
        title: data.title,
        content: data.description,
        image: imgData.secure_url,
        frontEndGitLink: data.frontEndGitLink,
        backEndGitLink: data.backEndGitLink,
        liveLink: data.liveLink,
        category: data.category,
        isActive: data.isActive,
        displayOrder: data.displayOrder,
      };

      const projectResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/project`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(projectData),
        }
      );

      if (!projectResponse.ok) {
        const errorData = await projectResponse.json().catch(() => null);
        setStatus({
          type: "error",
          message: `Project creation failed: ${
            errorData?.message || projectResponse.statusText
          }`,
        });
        return;
      }

      setStatus({
        type: "success",
        message: "Project created. Taking you to all projects…",
      });
      setTimeout(() => {
        reset();
        router.push("/dashboard/all-project");
      }, 1000);
    } catch (err) {
      console.error("Error:", err);
      setStatus({
        type: "error",
        message: "Something went wrong. Check your connection and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          New project
        </h1>
        <p className="mt-1.5 max-w-xl text-sm text-slate-600">
          Add a project to your portfolio. You can hide it from visitors until
          it&apos;s ready.
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Main column */}
          <div className="space-y-6">
            <Section
              title="Project details"
              description="What visitors see on the project card."
            >
              <Field label="Title" error={errors.title?.message}>
                <input
                  type="text"
                  placeholder="e.g. Hospital booking system"
                  {...register("title", { required: "Title is required" })}
                  className={inputClass}
                />
              </Field>

              <Field label="Category" error={errors.category?.message}>
                <select
                  {...register("category", {
                    required: "Choose a category",
                  })}
                  className={inputClass}
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Description" error={errors.description?.message}>
                <textarea
                  rows={6}
                  placeholder="What does it do, who is it for, and what did you build?"
                  {...register("description", {
                    required: "Description is required",
                  })}
                  className={`${inputClass} resize-y`}
                />
              </Field>
            </Section>

            <Section
              title="Links"
              description="Where people can see the code and the live site."
            >
              <Field
                label="Live site"
                error={errors.liveLink?.message}
              >
                <input
                  type="url"
                  inputMode="url"
                  placeholder="https://myproject.com"
                  {...register("liveLink", urlRule("Live site link"))}
                  className={inputClass}
                />
              </Field>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Front-end repository"
                  error={errors.frontEndGitLink?.message}
                >
                  <input
                    type="url"
                    inputMode="url"
                    placeholder="https://github.com/you/client"
                    {...register(
                      "frontEndGitLink",
                      urlRule("Front-end repository link")
                    )}
                    className={inputClass}
                  />
                </Field>
                <Field
                  label="Back-end repository"
                  error={errors.backEndGitLink?.message}
                >
                  <input
                    type="url"
                    inputMode="url"
                    placeholder="https://github.com/you/server"
                    {...register(
                      "backEndGitLink",
                      urlRule("Back-end repository link")
                    )}
                    className={inputClass}
                  />
                </Field>
              </div>
            </Section>
          </div>

          {/* Side column */}
          <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            <Section
              title="Cover image"
              description="Shown at the top of the project card."
            >
              <div
                className={`flex aspect-video items-center justify-center overflow-hidden rounded-lg border border-dashed bg-slate-50 ${
                  errors.image ? "border-red-400" : "border-slate-300"
                }`}
              >
                {preview ? (
                  <div className="relative h-full w-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={preview}
                      alt="Selected cover preview"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => resetField("image")}
                      aria-label="Remove selected cover image"
                      title="Remove image"
                      className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-rose-600 text-lg font-bold leading-none text-white shadow-md transition hover:bg-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <span className="px-4 text-center text-sm text-slate-500">
                    No image selected
                  </span>
                )}
              </div>
              <Field label="Choose file" error={errors.image?.message}>
                <input
                  type="file"
                  accept="image/*"
                  {...register("image", { required: "Add a cover image" })}
                  className="block w-full cursor-pointer text-sm text-slate-600 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-slate-900 file:px-3.5 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-slate-700"
                />
              </Field>
            </Section>

            <Section
              title="Visibility"
              description="Control when and where it appears."
            >
              <label className="flex cursor-pointer items-start justify-between gap-4">
                <span>
                  <span className="block text-sm font-medium text-slate-800">
                    Publish project
                  </span>
                  <span className="block text-xs text-slate-500">
                    {isActive
                      ? "Visible to visitors."
                      : "Saved as a draft. Only you can see it."}
                  </span>
                </span>
                <span className="relative mt-0.5 inline-flex shrink-0">
                  <input
                    type="checkbox"
                    {...register("isActive")}
                    className="peer sr-only"
                  />
                  <span className="h-6 w-11 rounded-full bg-slate-300 transition peer-checked:bg-teal-600 peer-focus-visible:ring-2 peer-focus-visible:ring-teal-600/40 peer-focus-visible:ring-offset-2" />
                  <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
                </span>
              </label>

              <Field
                label="Display order"
                hint="Lower numbers appear first."
                error={errors.displayOrder?.message}
              >
                <input
                  type="number"
                  min={0}
                  {...register("displayOrder", {
                    valueAsNumber: true,
                    min: { value: 0, message: "Use 0 or higher" },
                  })}
                  className={inputClass}
                />
              </Field>
            </Section>
          </aside>
        </div>

        {/* Status + actions */}
        {status && (
          <div
            role={status.type === "error" ? "alert" : "status"}
            className={`mt-6 rounded-lg border px-4 py-3 text-sm font-medium ${
              status.type === "error"
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-teal-200 bg-teal-50 text-teal-800"
            }`}
          >
            {status.message}
          </div>
        )}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => router.push("/dashboard/all-project")}
            disabled={loading}
            className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600/40 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-700 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading && (
              <svg
                className="h-4 w-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="currentColor"
                  strokeOpacity="0.3"
                  strokeWidth="3"
                />
                <path
                  d="M21 12a9 9 0 0 0-9-9"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            )}
            {loading ? "Creating…" : "Create project"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProject;
