import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import User from "../../../models/User"; // Assuming you have a User model to interact with your DB
import connectDB from "../../../lib/connectDB";

interface Credentials {
  email: string;
  password: string;
}

interface User {
  id: string;
  email: string;
  name: string;
}

export const authOptions: any = {
  providers: [
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: Credentials | undefined) {
        if (!credentials) {
          throw new Error("No credentials provided");
        }
        await connectDB();
        const { email, password } = credentials;

        // Fetch user from the database
        const user = await User.findOne({ email });

        // Check if user exists and password is correct
        if (!user) {
          throw new Error("No user found with this email");
        }

        // Compare provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        // Return user object with token (if needed)
        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user?: User }) {
      if (user) {
        token = { ...token, id: user.id, email: user.email, name: user.name };
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      session.user = { id: token.id, email: token.email, name: token.name };
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "gkjbk",
};
