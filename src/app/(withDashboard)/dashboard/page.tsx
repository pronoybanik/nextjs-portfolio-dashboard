"use client";

import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import {
  fetchPortfolioSettings,
  savePortfolioSettings,
} from "@/service/portfolio";
import {
  defaultPortfolioSettings,
  EducationItem,
  ExperienceItem,
  PortfolioSettings,
  SkillCategory,
} from "@/types/portfolio";

const sectionOptions = {
  header: ["glass", "minimal", "split", "dark"],
  education: ["timeline", "cards", "stacked", "grid"],
  experience: ["timeline", "cards", "stacked", "grid"],
  skills: ["category", "grid", "bar", "compact"],
} as const;

/* ---------- Design tokens (Tailwind class strings) ---------- */
const inputCls =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/20";
const labelTextCls = "text-sm font-medium text-slate-700";
const primaryBtnCls =
  "inline-flex items-center justify-center rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";
const addBtnCls =
  "inline-flex items-center gap-1.5 rounded-md border border-teal-700/30 bg-teal-50 px-3 py-1.5 text-sm font-medium text-teal-800 transition-colors hover:bg-teal-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700";
const smallBtnCls =
  "rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700";
const removeBtnCls =
  "rounded-md px-2 py-1 text-sm font-medium text-rose-700 transition-colors hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500";
const entryCls =
  "rounded-lg border border-slate-200 border-l-4 border-l-teal-700 bg-slate-50 p-4 sm:p-5";

const navItems = [
  { id: "header", label: "Header" },
  { id: "layouts", label: "Section layouts" },
  { id: "education", label: "Education" },
  { id: "experience", label: "Work experience" },
  { id: "skills", label: "Skills" },
];

/* ---------- Presentational helpers (no logic) ---------- */
const Panel = ({
  id,
  title,
  hint,
  action,
  children,
}: {
  id: string;
  title: string;
  hint?: string;
  action?: ReactNode;
  children: ReactNode;
}) => (
  <section
    id={id}
    className="scroll-mt-24 overflow-hidden rounded-xl border border-slate-200 bg-white"
  >
    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 px-5 py-4 sm:px-6">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-slate-900">
          {title}
        </h2>
        {hint && <p className="mt-0.5 text-sm text-slate-500">{hint}</p>}
      </div>
      {action}
    </div>
    <div className="px-5 py-5 sm:px-6">{children}</div>
  </section>
);

const OptionPicker = ({
  options,
  value,
  onSelect,
}: {
  options: readonly string[];
  value: string;
  onSelect: (variant: string) => void;
}) => (
  <div className="inline-flex flex-wrap gap-1 rounded-lg bg-slate-100 p-1">
    {options.map((variant) => {
      const active = value === variant;
      return (
        <button
          key={variant}
          type="button"
          aria-pressed={active}
          onClick={() => onSelect(variant)}
          className={`rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 ${
            active
              ? "bg-white text-teal-800 shadow-sm ring-1 ring-slate-200"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          {variant}
        </button>
      );
    })}
  </div>
);

/* ---------- Confirm modal ---------- */
const ConfirmModal = ({
  open,
  title,
  message,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  const confirmBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) confirmBtnRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="mx-4 w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-slate-900">
          {title ?? "Confirm removal"}
        </h3>
        <p className="mt-2 text-sm text-slate-600">
          {message ??
            "Are you sure you want to remove this item? This action cannot be undone."}
        </p>
        <div className="mt-5 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700"
          >
            Cancel
          </button>
          <button
            ref={confirmBtnRef}
            type="button"
            onClick={onConfirm}
            className="rounded-md bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
          >
            Yes, remove
          </button>
        </div>
      </div>
    </div>
  );
};

function useConfirm() {
  const [pending, setPending] = useState<{
    action: () => void;
    title?: string;
    message?: string;
  } | null>(null);

  const requestConfirm = useCallback(
    (action: () => void, title?: string, message?: string) => {
      setPending({ action, title, message });
    },
    [],
  );

  const onConfirm = useCallback(() => {
    pending?.action();
    setPending(null);
  }, [pending]);

  const onCancel = useCallback(() => {
    setPending(null);
  }, []);

  return { pending, requestConfirm, onConfirm, onCancel };
}

const createEmptyEducation = (): EducationItem => ({
  degree: "",
  institute: "",
  duration: "",
  description: "",
});

const createEmptyExperience = (): ExperienceItem => ({
  order: 0,
  title: "",
  company: "",
  type: "",
  location: "",
  duration: "",
  period: "",
  responsibilities: [""],
  skills: [""],
  gradient: "from-purple-500 to-indigo-500",
});

const createEmptySkillCategory = (): SkillCategory => ({
  category: "",
  skills: [{ name: "", level: "Advanced", percentage: 80, imageUrl: "" }],
});

const DashboardPage = () => {
  const [settings, setSettings] = useState<PortfolioSettings>(
    defaultPortfolioSettings,
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingSkillImage, setUploadingSkillImage] = useState<string | null>(
    null,
  );
  const [error, setError] = useState("");
  const { pending, requestConfirm, onConfirm, onCancel } = useConfirm();

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const portfolio = await fetchPortfolioSettings();

        console.log(portfolio);

        setSettings({
          ...defaultPortfolioSettings,
          ...portfolio,
          header: {
            ...defaultPortfolioSettings.header,
            ...(portfolio?.header ?? {}),
            socialLinks: Array.isArray(portfolio?.header?.socialLinks)
              ? portfolio.header.socialLinks
              : defaultPortfolioSettings.header.socialLinks,
            typedWords: Array.isArray(portfolio?.header?.typedWords)
              ? portfolio.header.typedWords
              : defaultPortfolioSettings.header.typedWords,
          },
          sectionStyles: {
            ...defaultPortfolioSettings.sectionStyles,
            ...(portfolio?.sectionStyles ?? {}),
          },
          education: Array.isArray(portfolio?.education)
            ? portfolio.education
            : defaultPortfolioSettings.education,
          experience: Array.isArray(portfolio?.experience)
            ? portfolio.experience.map((item, index) => ({
                ...item,
                order: Number.isFinite(item.order) ? item.order : index,
              }))
            : defaultPortfolioSettings.experience,
          skills: Array.isArray(portfolio?.skills)
            ? portfolio.skills
            : defaultPortfolioSettings.skills,
          softSkills: Array.isArray(portfolio?.softSkills)
            ? portfolio.softSkills
            : defaultPortfolioSettings.softSkills,
        });
      } catch {
        setError("Could not load portfolio settings.");
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const updateHeader = <K extends keyof PortfolioSettings["header"]>(
    key: K,
    value: PortfolioSettings["header"][K],
  ) => {
    setSettings((prev) => ({
      ...prev,
      header: {
        ...prev.header,
        [key]: value,
      },
    }));
  };

  const uploadCloudinaryImage = async (file: File) => {
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "Book-sell-shop",
    );

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dvcbclqid"}/image/upload`,
        { method: "POST", body: formData },
      );
      const payload = await response.json();

      if (!response.ok || typeof payload.secure_url !== "string") {
        throw new Error(payload?.error?.message || "Image upload failed");
      }

      return payload.secure_url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Image upload failed");
      return null;
    }
  };

  const uploadHeaderImage = async (file: File) => {
    setUploadingImage(true);
    try {
      const imageUrl = await uploadCloudinaryImage(file);
      if (imageUrl) updateHeader("imageUrl", imageUrl);
    } finally {
      setUploadingImage(false);
    }
  };

  const updateSectionStyle = (
    section: keyof PortfolioSettings["sectionStyles"],
    value: string,
  ) => {
    setSettings((prev) => ({
      ...prev,
      sectionStyles: {
        ...prev.sectionStyles,
        [section]: value,
      },
    }));
  };

  const updateSocialLink = (
    index: number,
    field: "label" | "url",
    value: string,
  ) => {
    setSettings((prev) => {
      const next = [...prev.header.socialLinks];
      next[index] = { ...next[index], [field]: value };
      return {
        ...prev,
        header: { ...prev.header, socialLinks: next },
      };
    });
  };

  const addSocialLink = () => {
    setSettings((prev) => ({
      ...prev,
      header: {
        ...prev.header,
        socialLinks: [
          ...prev.header.socialLinks,
          { label: "New Link", url: "https://" },
        ],
      },
    }));
  };

  const updateEducation = (
    index: number,
    field: keyof EducationItem,
    value: string,
  ) => {
    setSettings((prev) => {
      const next = [...prev.education];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, education: next };
    });
  };

  const addEducation = () =>
    setSettings((prev) => ({
      ...prev,
      education: [...prev.education, createEmptyEducation()],
    }));
  const removeEducation = (index: number) =>
    setSettings((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  const moveEducation = (index: number, direction: -1 | 1) => {
    setSettings((prev) => {
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= prev.education.length) return prev;

      const next = [...prev.education];
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return { ...prev, education: next };
    });
  };

  const updateExperience = (
    index: number,
    field: keyof ExperienceItem,
    value: string | string[] | number,
  ) => {
    setSettings((prev) => {
      const next = [...prev.experience];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, experience: next };
    });
  };

  const updateExperienceList = (
    index: number,
    listKey: "responsibilities" | "skills",
    subIndex: number,
    value: string,
  ) => {
    setSettings((prev) => {
      const next = [...prev.experience];
      const current = [...(next[index][listKey] ?? [])];
      current[subIndex] = value;
      next[index] = { ...next[index], [listKey]: current };
      return { ...prev, experience: next };
    });
  };

  const addExperienceEntry = () =>
    setSettings((prev) => ({
      ...prev,
      experience: [...prev.experience, createEmptyExperience()],
    }));
  const removeExperience = (index: number) =>
    setSettings((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  const moveExperience = (index: number, direction: -1 | 1) => {
    setSettings((prev) => {
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= prev.experience.length) return prev;

      const next = [...prev.experience];
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return { ...prev, experience: next };
    });
  };

  const addExperienceItem = (
    index: number,
    listKey: "responsibilities" | "skills",
  ) => {
    setSettings((prev) => {
      const next = [...prev.experience];
      next[index] = {
        ...next[index],
        [listKey]: [...(next[index][listKey] ?? []), ""],
      };
      return { ...prev, experience: next };
    });
  };

  const updateSkillCategory = (
    categoryIndex: number,
    field: keyof SkillCategory,
    value: string,
  ) => {
    setSettings((prev) => {
      const next = [...prev.skills];
      next[categoryIndex] = {
        ...next[categoryIndex],
        [field]: value,
      } as SkillCategory;
      return { ...prev, skills: next };
    });
  };

  const updateSkillItem = (
    categoryIndex: number,
    skillIndex: number,
    field: "name" | "level" | "percentage" | "imageUrl",
    value: string | number,
  ) => {
    setSettings((prev) => {
      const next = [...prev.skills];
      const categorySkills = [...next[categoryIndex].skills];
      categorySkills[skillIndex] = {
        ...categorySkills[skillIndex],
        [field]: value,
      };
      next[categoryIndex] = { ...next[categoryIndex], skills: categorySkills };
      return { ...prev, skills: next };
    });
  };

  const addSkillCategory = () =>
    setSettings((prev) => ({
      ...prev,
      skills: [...prev.skills, createEmptySkillCategory()],
    }));
  const removeSkillCategory = (index: number) =>
    setSettings((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  const addSkillItem = (categoryIndex: number) => {
    setSettings((prev) => {
      const next = [...prev.skills];
      next[categoryIndex] = {
        ...next[categoryIndex],
        skills: [
          ...next[categoryIndex].skills,
          { name: "", level: "Advanced", percentage: 80, imageUrl: "" },
        ],
      };

      return { ...prev, skills: next };
    });
  };

  const removeSkillItem = (categoryIndex: number, skillIndex: number) => {
    setSettings((prev) => {
      const next = [...prev.skills];
      next[categoryIndex] = {
        ...next[categoryIndex],
        skills: next[categoryIndex].skills.filter((_, i) => i !== skillIndex),
      };
      return { ...prev, skills: next };
    });
  };

  const updateSoftSkill = (index: number, value: string) => {
    setSettings((prev) => {
      const softSkills = [...prev.softSkills];
      softSkills[index] = value;
      return { ...prev, softSkills };
    });
  };

  const addSoftSkill = () => {
    setSettings((prev) => ({ ...prev, softSkills: [...prev.softSkills, ""] }));
  };

  const removeSoftSkill = (index: number) => {
    setSettings((prev) => ({
      ...prev,
      softSkills: prev.softSkills.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const uploadSkillImage = async (
    categoryIndex: number,
    skillIndex: number,
    file: File,
  ) => {
    const uploadKey = `${categoryIndex}-${skillIndex}`;
    setUploadingSkillImage(uploadKey);
    try {
      const imageUrl = await uploadCloudinaryImage(file);
      if (imageUrl)
        updateSkillItem(categoryIndex, skillIndex, "imageUrl", imageUrl);
    } finally {
      setUploadingSkillImage(null);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");

    try {
      await savePortfolioSettings({
        ...settings,
        experience: settings.experience.map((item, index) => ({
          ...item,
          order: index,
        })),
      });
      alert("Portfolio settings saved successfully");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save portfolio settings",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 bg-slate-100 text-slate-600">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-teal-700" />
        <p className="text-base font-medium">Loading portfolio editor...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      {/* Confirm removal modal */}
      <ConfirmModal
        open={!!pending}
        title={pending?.title}
        message={pending?.message}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />

      {/* Sticky top bar */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <h1 className="truncate text-xl font-semibold tracking-tight text-slate-900">
              Portfolio settings
            </h1>
            <p className="truncate text-sm text-slate-500">
              Edit what visitors see on your site, then save.
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className={primaryBtnCls}
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[200px_minmax(0,1fr)]">
        {/* Side navigation */}
        <nav aria-label="Sections" className="hidden lg:block">
          <ul className="sticky top-24 space-y-1 border-l border-slate-300">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="-ml-px block border-l-2 border-transparent px-4 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:border-teal-700 hover:text-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <main className="space-y-6">
          {error && (
            <div
              role="alert"
              className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
            >
              {error}
            </div>
          )}

          {/* HEADER */}
          <Panel
            id="header"
            title="Header"
            hint="Your name, photo, and links at the top of the site."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-1.5">
                <span className={labelTextCls}>Site name</span>
                <input
                  value={settings.siteName}
                  onChange={(e) =>
                    setSettings({ ...settings, siteName: e.target.value })
                  }
                  className={inputCls}
                />
              </label>
              <label className="space-y-1.5">
                <span className={labelTextCls}>Badge</span>
                <input
                  value={settings.header.badge}
                  onChange={(e) => updateHeader("badge", e.target.value)}
                  className={inputCls}
                />
              </label>

              <div className="space-y-1.5 md:col-span-2">
                <span className={labelTextCls}>Header image</span>
                <div className="flex items-center gap-4 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-3">
                  {settings.header.imageUrl ? (
                    <div className="relative shrink-0">
                      <img
                        src={settings.header.imageUrl}
                        alt="Header preview"
                        className="h-20 w-20 rounded-lg object-cover ring-1 ring-slate-200"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          requestConfirm(
                            () => updateHeader("imageUrl", ""),
                            "Remove image",
                            "Are you sure you want to remove the header image?",
                          )
                        }
                        aria-label="Remove header image"
                        title="Remove image"
                        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-rose-600 text-sm font-bold leading-none text-white shadow-md transition hover:bg-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-slate-200 text-xs text-slate-500">
                      No image
                    </div>
                  )}
                  <div className="min-w-0 flex-1 space-y-1">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      disabled={uploadingImage}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) void uploadHeaderImage(file);
                        e.currentTarget.value = "";
                      }}
                      className="block w-full text-sm text-slate-600 file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-slate-700"
                    />
                    <p className="text-xs text-slate-500">
                      JPEG, PNG, WebP or GIF.
                    </p>
                    {uploadingImage && (
                      <p className="text-xs font-medium text-teal-700">
                        Uploading...
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <label className="space-y-1.5 md:col-span-2">
                <span className={labelTextCls}>Name</span>
                <input
                  value={settings.header.name}
                  onChange={(e) => updateHeader("name", e.target.value)}
                  className={inputCls}
                />
              </label>
              <label className="space-y-1.5 md:col-span-2">
                <span className={labelTextCls}>Description</span>
                <textarea
                  value={settings.header.description}
                  onChange={(e) => updateHeader("description", e.target.value)}
                  className={`${inputCls} min-h-[110px]`}
                />
              </label>
              <label className="space-y-1.5">
                <span className={labelTextCls}>Resume URL</span>
                <input
                  value={settings.header.resumeUrl}
                  onChange={(e) => updateHeader("resumeUrl", e.target.value)}
                  className={inputCls}
                />
              </label>
              <label className="space-y-1.5">
                <span className={labelTextCls}>Typed words</span>
                <input
                  value={settings.header.typedWords.join(" | ")}
                  onChange={(e) =>
                    updateHeader(
                      "typedWords",
                      e.target.value
                        .split("|")
                        .map((word) => word.trim())
                        .filter(Boolean),
                    )
                  }
                  className={inputCls}
                />
                <span className="block text-xs text-slate-500">
                  Separate words with a vertical bar.
                </span>
              </label>
            </div>

            <div className="mt-8 border-t border-slate-200 pt-6">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="text-base font-semibold text-slate-900">
                  Social links
                </h3>
                <button onClick={addSocialLink} className={addBtnCls}>
                  Add link
                </button>
              </div>
              <div className="space-y-2">
                {settings.header.socialLinks.map((link, index) => (
                  <div
                    key={`${link.label}-${index}`}
                    className="grid gap-2 md:grid-cols-[180px_1fr]"
                  >
                    <input
                      value={link.label}
                      onChange={(e) =>
                        updateSocialLink(index, "label", e.target.value)
                      }
                      placeholder="Label"
                      className={inputCls}
                    />
                    <input
                      value={link.url}
                      onChange={(e) =>
                        updateSocialLink(index, "url", e.target.value)
                      }
                      placeholder="https://"
                      className={inputCls}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 border-t border-slate-200 pt-6">
              <h3 className="mb-3 text-base font-semibold text-slate-900">
                Header design
              </h3>
              <OptionPicker
                options={sectionOptions.header}
                value={settings.sectionStyles.header}
                onSelect={(variant) => updateSectionStyle("header", variant)}
              />
            </div>
          </Panel>

          {/* SECTION STYLES */}
          <Panel
            id="layouts"
            title="Section layouts"
            hint="Choose how each section is displayed on your site."
          >
            <div className="space-y-5">
              {(["education", "experience", "skills"] as const).map(
                (section) => (
                  <div
                    key={section}
                    className="grid gap-2 sm:grid-cols-[140px_1fr] sm:items-center"
                  >
                    <p className="text-sm font-semibold capitalize text-slate-800">
                      {section}
                    </p>
                    <OptionPicker
                      options={sectionOptions[section]}
                      value={settings.sectionStyles[section]}
                      onSelect={(variant) =>
                        updateSectionStyle(section, variant)
                      }
                    />
                  </div>
                ),
              )}
            </div>
          </Panel>

          {/* EDUCATION */}
          <Panel
            id="education"
            title="Education"
            hint="Degrees and schools, newest first works best."
            action={
              <button onClick={addEducation} className={addBtnCls}>
                Add education
              </button>
            }
          >
            <div className="space-y-4">
              {settings.education.map((item, index) => (
                <div key={`${item.degree}-${index}`} className={entryCls}>
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {item.degree || `Education ${index + 1}`}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        Position {index + 1}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => moveEducation(index, -1)}
                        disabled={index === 0}
                        aria-label="Move education up"
                        title="Move up"
                        className={
                          smallBtnCls +
                          " disabled:cursor-not-allowed disabled:opacity-40"
                        }
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => moveEducation(index, 1)}
                        disabled={index === settings.education.length - 1}
                        aria-label="Move education down"
                        title="Move down"
                        className={
                          smallBtnCls +
                          " disabled:cursor-not-allowed disabled:opacity-40"
                        }
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          requestConfirm(
                            () => removeEducation(index),
                            "Remove education",
                            "Are you sure you want to remove this education entry?",
                          )
                        }
                        className={removeBtnCls}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <input
                      value={item.degree}
                      onChange={(e) =>
                        updateEducation(index, "degree", e.target.value)
                      }
                      placeholder="Degree"
                      className={inputCls}
                    />
                    <input
                      value={item.institute}
                      onChange={(e) =>
                        updateEducation(index, "institute", e.target.value)
                      }
                      placeholder="Institute"
                      className={inputCls}
                    />
                    <input
                      value={item.duration}
                      onChange={(e) =>
                        updateEducation(index, "duration", e.target.value)
                      }
                      placeholder="Duration"
                      className={`${inputCls} md:col-span-2`}
                    />
                    <textarea
                      value={item.description}
                      onChange={(e) =>
                        updateEducation(index, "description", e.target.value)
                      }
                      placeholder="Description"
                      className={`${inputCls} min-h-[90px] md:col-span-2`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          {/* EXPERIENCE */}
          <Panel
            id="experience"
            title="Work experience"
            hint="Roles, responsibilities, and the skills you used."
            action={
              <button onClick={addExperienceEntry} className={addBtnCls}>
                Add experience
              </button>
            }
          >
            <div className="space-y-4">
              {settings.experience.map((item, index) => (
                <div key={`experience-${index}`} className={entryCls}>
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {item.title || item.company
                          ? [item.title, item.company]
                              .filter(Boolean)
                              .join(" at ")
                          : `Experience ${index + 1}`}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        Position {index + 1}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => moveExperience(index, -1)}
                        disabled={index === 0}
                        aria-label="Move experience up"
                        title="Move up"
                        className={
                          smallBtnCls +
                          " disabled:cursor-not-allowed disabled:opacity-40"
                        }
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => moveExperience(index, 1)}
                        disabled={index === settings.experience.length - 1}
                        aria-label="Move experience down"
                        title="Move down"
                        className={
                          smallBtnCls +
                          " disabled:cursor-not-allowed disabled:opacity-40"
                        }
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          requestConfirm(
                            () => removeExperience(index),
                            "Remove experience",
                            "Are you sure you want to remove this experience entry?",
                          )
                        }
                        className={removeBtnCls}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <input
                      value={item.title}
                      onChange={(e) =>
                        updateExperience(index, "title", e.target.value)
                      }
                      placeholder="Role title"
                      className={inputCls}
                    />
                    <input
                      value={item.company}
                      onChange={(e) =>
                        updateExperience(index, "company", e.target.value)
                      }
                      placeholder="Company"
                      className={inputCls}
                    />
                    <input
                      value={item.type}
                      onChange={(e) =>
                        updateExperience(index, "type", e.target.value)
                      }
                      placeholder="Type"
                      className={inputCls}
                    />
                    <input
                      value={item.location}
                      onChange={(e) =>
                        updateExperience(index, "location", e.target.value)
                      }
                      placeholder="Location"
                      className={inputCls}
                    />
                    <input
                      value={item.duration}
                      onChange={(e) =>
                        updateExperience(index, "duration", e.target.value)
                      }
                      placeholder="Duration"
                      className={inputCls}
                    />
                    <input
                      value={item.period}
                      onChange={(e) =>
                        updateExperience(index, "period", e.target.value)
                      }
                      placeholder="Period"
                      className={inputCls}
                    />
                    <p className="flex items-center rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                      Display order:{" "}
                      <span className="ml-1 font-semibold text-slate-800">
                        {index + 1}
                      </span>
                    </p>
                    <input
                      value={item.gradient ?? ""}
                      onChange={(e) =>
                        updateExperience(index, "gradient", e.target.value)
                      }
                      placeholder="Gradient class"
                      className={`${inputCls} md:col-span-2`}
                    />
                  </div>

                  <div className="mt-5 space-y-2 border-t border-slate-200 pt-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-800">
                        Responsibilities
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          addExperienceItem(index, "responsibilities")
                        }
                        className={smallBtnCls}
                      >
                        Add
                      </button>
                    </div>
                    {(item.responsibilities ?? []).map(
                      (responsibility, responsibilityIndex) => (
                        <input
                          key={`${item.title}-responsibility-${responsibilityIndex}`}
                          value={responsibility}
                          onChange={(e) =>
                            updateExperienceList(
                              index,
                              "responsibilities",
                              responsibilityIndex,
                              e.target.value,
                            )
                          }
                          placeholder="What did you do?"
                          className={inputCls}
                        />
                      ),
                    )}
                  </div>

                  <div className="mt-5 space-y-2 border-t border-slate-200 pt-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-800">
                        Skills
                      </p>
                      <button
                        type="button"
                        onClick={() => addExperienceItem(index, "skills")}
                        className={smallBtnCls}
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(item.skills ?? []).map((skill, skillIndex) => (
                        <input
                          key={`${item.title}-skill-${skillIndex}`}
                          value={skill}
                          onChange={(e) =>
                            updateExperienceList(
                              index,
                              "skills",
                              skillIndex,
                              e.target.value,
                            )
                          }
                          placeholder="Skill"
                          className={`${inputCls} w-auto min-w-[130px] flex-1 sm:flex-none`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          {/* SKILLS */}
          <Panel
            id="skills"
            title="Skills"
            hint="Group skills by category and set a proficiency for each."
            action={
              <button onClick={addSkillCategory} className={addBtnCls}>
                Add category
              </button>
            }
          >
            <div className="space-y-4">
              {settings.skills.map((category, categoryIndex) => (
                <div
                  key={`skill-category-${categoryIndex}`}
                  className={entryCls}
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-800">
                      {category.category || `Category ${categoryIndex + 1}`}
                    </p>
                    <button
                      onClick={() =>
                        requestConfirm(
                          () => removeSkillCategory(categoryIndex),
                          "Remove category",
                          "Are you sure you want to remove this skill category and all its skills?",
                        )
                      }
                      className={removeBtnCls}
                    >
                      Remove
                    </button>
                  </div>
                  <input
                    value={category.category}
                    onChange={(e) =>
                      updateSkillCategory(
                        categoryIndex,
                        "category",
                        e.target.value,
                      )
                    }
                    placeholder="Category title"
                    className={`${inputCls} mb-4`}
                  />

                  <div className="space-y-3">
                    <div className="hidden gap-3 px-1 text-xs font-medium text-slate-500 md:grid md:grid-cols-[1.5fr_1fr_100px_180px_auto]">
                      <span>Skill</span>
                      <span>Level</span>
                      <span>Percent</span>
                      <span>Icon</span>
                      <span>Action</span>
                    </div>
                    {category.skills.map((skill, skillIndex) => (
                      <div
                        key={`skill-${categoryIndex}-${skillIndex}`}
                        className="grid gap-3 rounded-lg border border-slate-200 bg-white p-3 md:grid-cols-[1.5fr_1fr_100px_180px_auto] md:border-0 md:bg-transparent md:p-0"
                      >
                        <input
                          value={skill.name}
                          onChange={(e) =>
                            updateSkillItem(
                              categoryIndex,
                              skillIndex,
                              "name",
                              e.target.value,
                            )
                          }
                          placeholder="Skill name"
                          className={inputCls}
                        />
                        <select
                          value={skill.level}
                          onChange={(e) =>
                            updateSkillItem(
                              categoryIndex,
                              skillIndex,
                              "level",
                              e.target.value,
                            )
                          }
                          className={inputCls}
                        >
                          <option>Advanced</option>
                          <option>Intermediate</option>
                          <option>Basic</option>
                        </select>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={skill.percentage}
                          onChange={(e) =>
                            updateSkillItem(
                              categoryIndex,
                              skillIndex,
                              "percentage",
                              Number(e.target.value),
                            )
                          }
                          className={inputCls}
                        />
                        <label className="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-600">
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            disabled={
                              uploadingSkillImage ===
                              `${categoryIndex}-${skillIndex}`
                            }
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file)
                                void uploadSkillImage(
                                  categoryIndex,
                                  skillIndex,
                                  file,
                                );
                              e.currentTarget.value = "";
                            }}
                            className="min-w-0 flex-1 file:mr-2 file:cursor-pointer file:rounded file:border-0 file:bg-slate-900 file:px-2 file:py-1 file:text-xs file:font-medium file:text-white"
                          />
                          {uploadingSkillImage ===
                            `${categoryIndex}-${skillIndex}` && (
                            <span className="font-medium text-teal-700">
                              Uploading...
                            </span>
                          )}
                        </label>
                        {skill.imageUrl && (
                          <div className="relative h-10 w-10 md:col-start-4">
                            <img
                              src={skill.imageUrl}
                              alt={`${skill.name} preview`}
                              className="h-10 w-10 rounded object-cover ring-1 ring-slate-200"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                requestConfirm(
                                  () =>
                                    updateSkillItem(
                                      categoryIndex,
                                      skillIndex,
                                      "imageUrl",
                                      "",
                                    ),
                                  "Remove image",
                                  "Are you sure you want to remove this skill icon?",
                                )
                              }
                              aria-label={`Remove ${skill.name || "skill"} image`}
                              title="Remove image"
                              className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-xs font-bold leading-none text-white shadow-sm transition hover:bg-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-1"
                            >
                              ×
                            </button>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() =>
                            requestConfirm(
                              () => removeSkillItem(categoryIndex, skillIndex),
                              "Remove skill",
                              `Are you sure you want to remove the skill "${skill.name || "this skill"}"?`,
                            )
                          }
                          aria-label={`Remove ${skill.name || "skill"}`}
                          title="Remove skill"
                          className={removeBtnCls}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addSkillItem(categoryIndex)}
                      className={addBtnCls}
                    >
                      Add skill
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel
            id="soft-skills"
            title="Soft skills"
            hint="Manage the soft skills shown in the public portfolio."
            action={
              <button onClick={addSoftSkill} className={addBtnCls}>
                Add soft skill
              </button>
            }
          >
            <div className="space-y-3">
              {settings.softSkills.map((skill, index) => (
                <div key={`${skill}-${index}`} className="flex gap-2">
                  <input
                    value={skill}
                    onChange={(event) =>
                      updateSoftSkill(index, event.target.value)
                    }
                    placeholder="Soft skill"
                    className={`${inputCls} flex-1`}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      requestConfirm(
                        () => removeSoftSkill(index),
                        "Remove soft skill",
                        "Are you sure you want to remove this soft skill?",
                      )
                    }
                    className={removeBtnCls}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </Panel>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
