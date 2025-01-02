// // middleware/authMiddleware.ts (Next.js)
// import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
// import { verifyToken } from "@/utils/verifyToken";
// import nc from "next-connect";

// interface AuthenticatedRequest extends NextApiRequest {
//   user: {
//     id: string;
//     email: string;
//     role?: string;
//   };
// }

// const authMiddleware = nc<AuthenticatedRequest, NextApiResponse>({
//   onError(error: any, req: any, res: any) {
//     console.error(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   },
//   onNoMatch(req: any, res: any) {
//     res.status(405).json({ message: `Method ${req.method} Not Allowed` });
//   },
// });

// authMiddleware.use(
//   (req: AuthenticatedRequest, res: NextApiResponse, next: Function) => {
//     const authHeader = req.headers.authorization;

//     if (!authHeader) {
//       return res.status(401).json({ message: "Authorization header missing" });
//     }

//     const token = authHeader.split(" ")[1]; // Expecting format: "Bearer <token>"

//     if (!token) {
//       return res.status(401).json({ message: "Token missing" });
//     }

//     const decoded = verifyToken(token);

//     if (!decoded) {
//       return res.status(401).json({ message: "Invalid or expired token" });
//     }

//     // Attach user information to the request object
//     req.user = {
//       id: decoded.id,
//       email: decoded.email,
//       role: decoded.role,
//     };

//     next();
//   }
// );

// export default authMiddleware;
