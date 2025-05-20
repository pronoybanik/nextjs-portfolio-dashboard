"use server";

import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

export const loginUser = async (userData: any) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      }
    );

    const result = await res.json();
    console.log("result", result);

    if (result.token) {
      (await cookies()).set("token", result?.token);
    }

    return result;
  } catch (error: any) {
    return Error(error);
  }
};


export const getCurrentUser = async () => {
  const accessToken = (await cookies()).get("token")?.value
  let decodeData = null;

  if (accessToken) {
    decodeData = await jwtDecode(accessToken);
    return decodeData;
  } else {
    return null;
  }
};

export const logout = async () => {
  (await cookies()).delete("token");
}
