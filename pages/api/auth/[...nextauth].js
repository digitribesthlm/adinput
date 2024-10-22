// pages/api/auth/[...nextauth].js - 

import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoClient } from 'mongodb';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const client = await MongoClient.connect(process.env.MONGODB_URI);
        const db = client.db('adinput');
        const user = await db.collection('users').findOne({ email: credentials.email });
        
        if (user && credentials.password === user.password) { // In production, use proper password hashing
          return { id: user._id, name: user.name, email: user.email, role: user.role };
        } else {
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      return session;
    }
  },
  pages: {
    signIn: '/login',
  }
});