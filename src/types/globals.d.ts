import { User } from "./types";


declare global {
  interface CustomJwtSessionClaims extends User {}
} 
// We are extending the global Clerk-provided CustomJwtSessionClaims interface
// to include our custom User fields (`email`, `fullName`, `image`) for better type safety.
// This does NOT inject these values at runtime — it only helps TypeScript understand
// that `sessionClaims` includes these fields, assuming Clerk JWT Template is correctly set up.
