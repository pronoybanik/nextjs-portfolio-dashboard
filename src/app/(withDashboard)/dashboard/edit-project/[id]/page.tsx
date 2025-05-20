"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { TProject } from "@/app/types/projectType";

const EditProject = () => {
  const { id } = useParams(); // Get project ID from URL
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [existingData, setExistingData] = useState<TProject | null>(null);

  const {
    register,
    handleSubmit,

    control,
    formState: { errors },
  } = useForm<TProject>();

  // Fetch existing project data
  useEffect(() => {
    if (!id) return;
    const fetchProject = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/project/${id}`);
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
      } else {
        delete projectData.image;
      }

      // Send updated data to backend
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/project/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
      });

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
            <option value="Technology">Technology</option>
            <option value="Health">Health</option>
            <option value="Lifestyle">Lifestyle</option>
            <option value="Business">Business</option>
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
          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <input
                type="file"
                onChange={(e) => field.onChange(e.target.files)}
                className="w-full p-2 border rounded"
              />
            )}
          />
        </div>

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
