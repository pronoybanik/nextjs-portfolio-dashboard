import { jwtDecode } from "jwt-decode";

const verifyToken = (token: string) => {
  return jwtDecode(token);
};

export default verifyToken;
