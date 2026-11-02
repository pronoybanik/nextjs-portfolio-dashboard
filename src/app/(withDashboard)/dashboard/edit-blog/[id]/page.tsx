"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import Image from "next/image";

interface BlogFormData {
  title: string;
  content: string;
  author: string;
  category: string;
  image?: FileList;
}

const EditBlog = () => {
  const { id } = useParams(); // Get blog ID from URL
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageInputKey, setImageInputKey] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BlogFormData>();
  const imageRegistration = register("image");

  useEffect(() => {
    if (!id) return;

    const fetchBlog = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs/${id}`);
        const data = await res.json();

        if (data.data) {
          // Populate form fields with existing blog data
          setValue("title", data.data.title);
          setValue("content", data.data.content);
          setValue("author", data.data.author);
          setValue("category", data.data.category);
          setExistingImage(data.data.image); // Store existing image URL
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
      }
    };

    fetchBlog();
  }, [id, setValue]);

  const onSubmit = async (data: BlogFormData) => {
    setLoading(true);
    try {
      let imageUrl = existingImage;

      // If the user uploads a new image, upload it to Cloudinary
      if (data.image && data.image.length > 0) {
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
        imageUrl = imgData.secure_url;
      }

      // Send updated data to backend
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, image: imageUrl }),
      });

      if (!res.ok) throw new Error("Failed to update blog");

      alert("Blog updated successfully!");
      router.push("/dashboard/all-blogs");
    } catch (error) {
      console.error(error);
      alert("An error occurred while updating the blog.");
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setExistingImage(null);
    setSelectedImage(null);
    setValue("image", undefined);
    setImageInputKey((key) => key + 1);
  };

  return (
    <div className="max-w-lg mx-auto my-10 p-6 shadow-lg rounded-lg bg-white">
      <h2 className="text-2xl font-bold mb-4 text-indigo-600">Edit Blog</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            {...register("title", { required: "Title is required" })}
            className="w-full p-2 border rounded"
          />
          {errors.title && <p className="text-red-500">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">Content</label>
          <textarea
            {...register("content", { required: "Content is required" })}
            className="w-full p-2 border rounded"
          />
          {errors.content && <p className="text-red-500">{errors.content.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">Author</label>
          <input
            type="text"
            {...register("author", { required: "Author is required" })}
            className="w-full p-2 border rounded"
          />
          {errors.author && <p className="text-red-500">{errors.author.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">Category</label>
          <select {...register("category")} className="w-full p-2 border rounded">
            <option value="Technology">Technology</option>
            <option value="Health">Health</option>
            <option value="Lifestyle">Lifestyle</option>
            <option value="Portfolio">Portfolio</option>
            <option value="Business">Business</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Image</label>
          {(existingImage || selectedImage) && (
            <div className="relative mb-2 h-32 w-32">
              {existingImage ? (
                <Image width={300} height={300} src={existingImage} alt="Blog" className="h-32 w-32 rounded object-cover" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={selectedImage ?? ""} alt="Selected blog preview" className="h-32 w-32 rounded object-cover" />
              )}
              <button
                type="button"
                onClick={removeImage}
                aria-label="Remove blog image"
                title="Remove image"
                className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-rose-600 text-base font-bold leading-none text-white shadow-md hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                ×
              </button>
            </div>
          )}
          <input
            key={imageInputKey}
            type="file"
            accept="image/*"
            {...imageRegistration}
            onChange={(event) => {
              imageRegistration.onChange(event);
              const file = event.target.files?.[0];
              setExistingImage(null);
              setSelectedImage(file ? URL.createObjectURL(file) : null);
            }}
            className="w-full rounded border p-2"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Blog"}
        </button>
      </form>
    </div>
  );
};

export default EditBlog;
