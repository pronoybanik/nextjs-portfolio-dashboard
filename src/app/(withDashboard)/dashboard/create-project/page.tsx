"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

// Define form data type
interface BookFormData {
  title: string;
  category: string;
  description: string;
  frontEndGitLink: string;
  backEndGitLink: string;
  liveLink: string;
  inStock: boolean;
  image: FileList;
}

const CreateProject = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BookFormData>();

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: BookFormData) => {
    const imageValue = data.image[0];
    if (!imageValue) {
      alert("Please upload an image.");
      return;
    }

    setLoading(true); // Start loading

    const formData = new FormData();
    formData.append("file", imageValue);
    formData.append("upload_preset", "Book-sell-shop"); // Replace with your preset
    formData.append("cloud_name", "dvcbclqid"); // Replace with your cloud name

    try {
      const imageResponse = await fetch(
        `https://api.cloudinary.com/v1_1/dvcbclqid/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!imageResponse.ok) {
        const errorData = await imageResponse.json(); // Get error details if available
        alert(
          `Image upload failed: ${
            errorData?.message || imageResponse.statusText
          }`
        );
        return;
      }

      const imgData = await imageResponse.json();
      const bookImageUrl = imgData.secure_url;

      const projectData = {
        title: data.title,
        content: data.description,
        image: bookImageUrl,
        frontEndGitLink: data.frontEndGitLink,
        backEndGitLink: data.backEndGitLink,
        liveLink: data.liveLink,
        category: data.category,
      };

      const projectResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/project`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Important: Set content type
          },
          body: JSON.stringify(projectData), // Stringify the data
        }
      );

      if (!projectResponse.ok) {
        const errorData = await projectResponse.json();
        alert(
          `Project creation failed: ${
            errorData?.message || projectResponse.statusText
          }`
        );
        return;
      }

      alert("Project created successfully!");
      setTimeout(() => {
        reset();
        router.push("/dashboard/all-project");
      }, 1000);
    } catch (err) {
      console.error("Error:", err);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="mx-auto max-w-screen-xl lg:my-4 my-2">
      <div className="text-center my-10">
        <h2 className="text-4xl my-4 md:my-6 font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 leading-tight uppercase">
          create Project
        </h2>
      </div>
      <div className="mx-auto max-w-lg">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mb-0 mt-6 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8"
        >
          <p className="text-center text-lg font-medium">Add a New Project</p>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 uppercase">
              Title
            </label>
            <input
              type="text"
              {...register("title", { required: "Title is required" })}
              className="block w-full py-3 text-gray-700  bg-white border rounded-lg pl-4 focus:to-indigo-600 from-purple-600 focus:outline-none focus:ring focus:ring-opacity-40"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 uppercase">
              Description
            </label>
            <textarea
              {...register("description", {
                required: "Description is required",
              })}
              className="block w-full py-3 text-gray-700 bg-white border rounded-lg pl-4 focus:to-indigo-600 from-purple-600 focus:outline-none focus:ring focus:ring-opacity-40"
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 uppercase">
              Category
            </label>
            <select
              {...register("category", { required: "Category is required" })}
              className="block w-full py-3 text-gray-700 uppercase bg-white border rounded-lg pl-4 focus:to-indigo-600 from-purple-600 focus:outline-none focus:ring focus:ring-opacity-40"
            >
              <option  value="">Select a category</option>
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
            {errors.category && (
              <p className="text-red-500 text-xs mt-1">
                {errors.category.message}
              </p>
            )}
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 uppercase">
              Image
            </label>
            <input
              type="file"
              {...register("image", { required: "Image is required" })}
              className="block w-full py-3 text-gray-700 bg-white border rounded-lg pl-4 focus:to-indigo-600 from-purple-600 focus:outline-none focus:ring focus:ring-opacity-40"
            />
            {errors.image && (
              <p className="text-red-500 text-xs mt-1">
                {errors.image.message}
              </p>
            )}
          </div>

          {/* frontEndGigLink */}
          <div>
            <label className="block text-sm font-medium text-gray-700 uppercase">
              FrontEnd GigLink
            </label>
            <input
              type="text"
              {...register("frontEndGitLink", {
                required: "Title is required",
              })}
              className="block w-full py-3 text-gray-700  bg-white border rounded-lg pl-4 focus:to-indigo-600 from-purple-600 focus:outline-none focus:ring focus:ring-opacity-40"
            />
            {errors.frontEndGitLink && (
              <p className="text-red-500 text-xs mt-1">
                {errors.frontEndGitLink.message}
              </p>
            )}
          </div>
          {/* backEndGitLink */}
          <div>
            <label className="block text-sm font-medium text-gray-700 uppercase">
              backEnd GitLink
            </label>
            <input
              type="text"
              {...register("backEndGitLink", {
                required: "Title is required",
              })}
              className="block w-full py-3 text-gray-700  bg-white border rounded-lg pl-4 focus:to-indigo-600 from-purple-600 focus:outline-none focus:ring focus:ring-opacity-40"
            />
            {errors.backEndGitLink && (
              <p className="text-red-500 text-xs mt-1">
                {errors.backEndGitLink.message}
              </p>
            )}
          </div>
          {/* backEndGitLink */}
          <div>
            <label className="block text-sm font-medium text-gray-700 uppercase">
              live Link
            </label>
            <input
              type="text"
              {...register("liveLink", {
                required: "Title is required",
              })}
              className="block w-full py-3 text-gray-700  bg-white border rounded-lg pl-4 focus:to-indigo-600 from-purple-600 focus:outline-none focus:ring focus:ring-opacity-40"
            />
            {errors.liveLink && (
              <p className="text-red-500 text-xs mt-1">
                {errors.liveLink.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-center">
            <button
              type="submit"
              className={`w-60 px-5 py-3 text-base font-medium text-center text-indigo-100 border border-indigo-500 rounded-lg shadow-sm cursor-pointer hover:text-white bg-gradient-to-br from-purple-500 via-indigo-500 to-indigo-500 ${
                loading ? "cursor-not-allowed opacity-75" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Loading..." : "Add Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;
