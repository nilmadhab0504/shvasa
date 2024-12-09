import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string; 
    email: string;
    name : string;
  }
  
  export interface Session {
    user: User;
  }
}
