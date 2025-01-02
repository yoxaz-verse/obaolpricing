// // utils/verifyToken.ts
// import jwt from "jsonwebtoken";

// interface DecodedToken {
//   id: string;
//   email: string;
//   role?: string;
//   iat: number;
//   exp: number;
// }

// export const verifyToken = (token: string): DecodedToken | null => {
//   try {
//     const secretKey = process.env.JWT_SECRET_KEY as string;
//     const decoded = jwt.verify(token, secretKey) as DecodedToken;
//     return decoded;
//   } catch (error) {
//     console.error("Token verification failed:", error);
//     return null;
//   }
// };
