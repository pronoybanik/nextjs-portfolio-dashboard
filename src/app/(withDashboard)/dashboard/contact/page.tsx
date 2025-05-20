"use client";
import React, { useEffect, useState } from "react";

interface TContact {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: number;
  category: string;
  message: string;
  createdAt: string;
}

const Contact = () => {
  const [contact, setContact] = useState<TContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchContacts();
  }, []);

  // Fetch contacts from API
  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`);
      if (!res.ok) throw new Error("Failed to fetch contacts");

      const data = await res.json();
      setContact(data.data || []);
      setLoading(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  // Handle delete request
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/contact/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) throw new Error("Failed to delete inquiry");

      setContact((prev) => prev.filter((item) => item._id !== id));
      alert("Inquiry deleted successfully!");
    } catch (error) {
      console.error(error);
      alert("An error occurred while deleting.");
    }
  };

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">
        User Inquiries
      </h2>

      {contact.length === 0 ? (
        <p className="text-center text-gray-500">No inquiries found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contact.map((item) => (
            <div
              key={item._id}
              className="bg-white shadow-lg rounded-lg p-5 border border-gray-200 transition-transform hover:scale-105"
            >
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {item.firstName} {item.lastName}
                </h3>
                <p className="text-sm text-gray-500">{item.category}</p>
              </div>

              <div className="mb-3">
                <p className="text-gray-700">
                  <strong>Email:</strong> {item.email}
                </p>
                <p className="text-gray-700">
                  <strong>Phone:</strong> {item.phone}
                </p>
              </div>

              <p className="text-gray-700">
                <strong>Message:</strong> {item.message}
              </p>

              <p className="text-xs text-gray-500 mt-3">
                Created at: {new Date(item.createdAt).toLocaleString()}
              </p>

              <button
                onClick={() => handleDelete(item._id)}
                className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Contact;
