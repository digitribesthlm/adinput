// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import clientPromise from '../../../lib/mongodb';

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('Please provide NEXTAUTH_SECRET environment variable');
}

const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please provide both email and password');
        }

        try {
          const client = await clientPromise;
          const db = client.db(process.env.MONGODB_DB);
          
          const user = await db.collection('users').findOne({ 
            email: credentials.email.toLowerCase() 
          });

          if (!user) {
            console.log('No user found with email:', credentials.email);
            throw new Error('No user found with this email');
          }

          // For plain text password comparison
          const isPasswordValid = credentials.password === user.password;

          if (!isPasswordValid) {
            console.log('Invalid password for user:', credentials.email);
            throw new Error('Invalid password');
          }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role
          };
        } catch (error) {
          console.error('Authorization error:', error);
          throw new Error(error.message || 'Authentication failed');
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === 'development',
};

export default NextAuth(authOptions);