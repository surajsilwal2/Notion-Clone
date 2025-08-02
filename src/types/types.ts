export type User = {
    fullName: string,
    email: string,
    image: string
}
 
// This defines our custom User type for TypeScript,
// so we can get type safety when working with Clerk session claims.
// Note: This does NOT inform Clerk about these fields —
// we still need to configure Clerk’s JWT Template separately
// to include `fullName`, `email`, and `image` at runtime.