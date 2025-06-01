import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: typeof window !== 'undefined' 
    ? window.location.origin 
    : process.env.BETTER_AUTH_URL || "http://localhost:3002"
})

export const { 
  signIn, 
  signUp, 
  signOut, 
  useSession,
  getSession 
} = authClient 