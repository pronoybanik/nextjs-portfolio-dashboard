"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { TProject } from "@/types/projectType";

const EditProject = () => {
  const { id } = useParams(); // Get project ID from URL
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [existingData, setExistingData] = useState<TProject | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageInputKey, setImageInputKey] = useState(0);
  const [imageRemoved, setImageRemoved] = useState(false);

  const {
    register,
    handleSubmit,

    control,
    setValue,
    formState: { errors },
  } = useForm<TProject>();

  // Fetch existing project data
  useEffect(() => {
    if (!id) return;
    const fetchProject = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/project/${id}`
        );
        const data = await res.json();
        setExistingData(data.data);
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    };

    fetchProject();
  }, [id]);

  // Handle form submission
  const onSubmit = async (data: TProject) => {
    setLoading(true);
    try {
      const projectData = { ...data };

      if (data.image && data.image.length > 0) {
        // Upload image to Cloudinary
        const formData = new FormData();
        formData.append("file", data.image[0]);
        formData.append("upload_preset", "Book-sell-shop");
        formData.append("cloud_name", "dvcbclqid");

        const imageRes = await fetch(
          `https://api.cloudinary.com/v1_1/dvcbclqid/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!imageRes.ok) throw new Error("Image upload failed");

        const imgData = await imageRes.json();
        projectData.image = imgData.secure_url;
      } else if (imageRemoved) {
        projectData.image = "";
      } else {
        delete projectData.image;
      }

      // Send updated data to backend
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/project/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(projectData),
        }
      );

      if (!res.ok) throw new Error("Failed to update project");

      alert("Project updated successfully!");
      router.push("/dashboard/all-project");
    } catch (error) {
      console.error(error);
      alert("An error occurred while updating the project.");
    } finally {
      setLoading(false);
    }
  };

  if (!existingData) return <p>Loading...</p>;

  return (
    <div className="max-w-lg mx-auto my-10 p-6 shadow-lg rounded-lg bg-white">
      <h2 className="text-2xl font-bold mb-4 text-indigo-600">Edit Project</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            defaultValue={existingData?.title}
            {...register("title", { required: "Title is required" })}
            className="w-full p-2 border rounded"
          />
          {errors.title && (
            <p className="text-red-500">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium">content</label>
          <textarea
            defaultValue={existingData?.content}
            {...register("content", { required: "Description is required" })}
            className="w-full p-2 border rounded"
          />
          {errors.content && (
            <p className="text-red-500">{errors.content.message}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium">Category</label>
          <select
            defaultValue={existingData?.category}
            {...register("category")}
            className="w-full p-2 border rounded"
          >
            <option value="">Select a category</option>
            <option value="Technology">Portfolio Website</option>
            <option value="Health">E-commerce Website</option>
            <option value="Lifestyle">Learning/Tutoring Platform</option>
            <option value="Business">Job Board Website</option>
            <option value="Business">Blogging Platform</option>
            <option value="Business">
              SaaS Dashboard (Analytics/CRM/HRM/etc.)
            </option>
            <option value="Business">Real Estate Listing Website</option>
            <option value="Business">Forum/Community Website</option>
            <option value="Business">Event Management Website</option>
            <option value="Business">Travel Booking Website</option>
          </select>
        </div>

        {/* Front-End Git Link */}
        <div>
          <label className="block text-sm font-medium">
            Front-End Git Link
          </label>
          <input
            type="text"
            defaultValue={existingData?.frontEndGitLink}
            {...register("frontEndGitLink")}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Back-End Git Link */}
        <div>
          <label className="block text-sm font-medium">Back-End Git Link</label>
          <input
            type="text"
            defaultValue={existingData?.backEndGitLink}
            {...register("backEndGitLink")}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Live Link */}
        <div>
          <label className="block text-sm font-medium">Live Link</label>
          <input
            type="text"
            defaultValue={existingData?.liveLink}
            {...register("liveLink")}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium">Image (optional)</label>
          {(existingData.image || selectedImage) && (
            <div className="relative mb-2 h-32 w-32">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedImage || existingData.image}
                alt="Project preview"
                className="h-32 w-32 rounded object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setExistingData((current) => current ? { ...current, image: undefined } : current);
                  setSelectedImage(null);
                  setImageRemoved(true);
                  setValue("image", undefined);
                  setImageInputKey((key) => key + 1);
                }}
                aria-label="Remove project image"
                title="Remove image"
                className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-rose-600 text-base font-bold leading-none text-white shadow-md hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                ×
              </button>
            </div>
          )}
          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <input
                key={imageInputKey}
                type="file"
                accept="image/*"
                onChange={(e) => field.onChange(e.target.files)}
                onInput={(e) => {
                  const file = (e.currentTarget as HTMLInputElement).files?.[0];
                  setSelectedImage(file ? URL.createObjectURL(file) : null);
                  if (file) setImageRemoved(false);
                }}
                className="w-full p-2 border rounded"
              />
            )}
          />
        </div>

        <label className="flex items-center gap-3 text-sm font-medium">
          <input type="checkbox" defaultChecked={existingData?.isActive ?? true} {...register("isActive")} />
          Publish project
        </label>
        <label className="block text-sm font-medium">
          Display order
          <input type="number" min={0} defaultValue={existingData?.displayOrder ?? 0} {...register("displayOrder", { valueAsNumber: true })} className="mt-1 w-full rounded border p-2" />
        </label>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Project"}
        </button>
      </form>
    </div>
  );
};

export default EditProject;
