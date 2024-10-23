// pages/api/auth/[...nextauth].js - 

import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';
import clientPromise from '../../../lib/mongodb';

export default NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const client = await clientPromise;
          const db = client.db(process.env.MONGODB_DB);
          const user = await db.collection('users').findOne({ email: credentials.email });

          if (user && (await bcrypt.compare(credentials.password, user.password))) {
            return { id: user._id, name: user.name, email: user.email, role: user.role };
          } else {
            throw new Error('Invalid credentials');
          }
        } catch (error) {
          console.error('Error in authorize:', error);
          throw new Error('Invalid credentials');
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
