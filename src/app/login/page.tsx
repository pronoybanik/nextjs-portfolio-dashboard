"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import SecondaryButton from "@/shared/SecondaryButton";
import { loginUser } from "@/service/auth";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
  
  
    try {
      const res = await loginUser(formData);
      
      if (res?.token) {
        alert(res.message || "Login successful!");
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      } else {
        alert(res.message || "Login failed.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 shadow-lg rounded-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>

        {error && <p className="text-red-500 text-center mb-2">{error}</p>}

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full mb-3 p-2 border rounded"
          required
        />

        {/* <PrimaryButton>{loading ? "Logging in..." : "Login"}</PrimaryButton> */}
        <SecondaryButton type="submit">
          {loading ? "Logging in..." : "Login"}
        </SecondaryButton>

        <p className="text-center mt-3">
          Do not have an account?{" "}
          <a href="/register" className="text-blue-500">
            Register
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
