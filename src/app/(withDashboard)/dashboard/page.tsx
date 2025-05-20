"use client";

import { useEffect, useState } from "react";
import { JwtPayload } from "jsonwebtoken";
import { getCurrentUser } from "@/service/auth";

interface CustomJwtPayload extends JwtPayload {
  id?: string;
  role?: string;
}

interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
}

const DashboardPage = () => {
  const [tokenInfo, setTokenInfo] = useState<CustomJwtPayload | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const decodedToken = (await getCurrentUser()) as CustomJwtPayload;
      console.log("Decoded token:", decodedToken);

      if (decodedToken?.id) {
        setTokenInfo(decodedToken);

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/${decodedToken.id}`
          );
          const data = await res.json();
          console.log("User API response:", data);

          if (res.ok && data?.data) {
            setUser(data.data);
          } else {
            console.error("No user data returned");
          }
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      }

      setLoading(false);
    };

    init();
  }, []);

  if (loading) {
    return <h1 className="text-center text-2xl mt-10">Loading...</h1>;
  }

  return (
    <div>
      <h1 className="text-4xl text-center mt-10">Welcome to the dashboard</h1>
      {user ? (
        <div className="text-center mt-5">
          <h2 className="text-2xl">Name: {user.name}</h2>
          <h2 className="text-2xl">Email: {user.email}</h2>
          <h2 className="text-2xl">Role: {user.role}</h2>
        </div>
      ) : (
        <h1 className="text-2xl text-center mt-5 text-red-500">
          No user data found
        </h1>
      )}
    </div>
  );
};

export default DashboardPage;
