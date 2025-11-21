import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    signOut: '/logout',
    error: '/login',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'dummy-client-id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy-secret',
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error('Invalid credentials');
        }

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role,
          kycStatus: user.kycStatus,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        const email = user.email;
        if (!email) return false;

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
          where: { email },
        });

        if (existingUser) {
          // Existing user, allow sign in
          return true;
        }

        // New user - create with default INVESTOR role
        // User will be redirected to complete-profile to set actual role
        const names = user.name?.split(' ') || ['', ''];
        const isAdmin = email === 'golearnx@gmail.com'; // Admin account

        await prisma.user.create({
          data: {
            email: email,
            firstName: names[0] || 'User',
            lastName: names.slice(1).join(' ') || 'Account',
            password: '', // No password for Google accounts
            role: isAdmin ? 'ADMIN' : 'INVESTOR', // Default to INVESTOR, will be updated in complete-profile
            emailVerified: new Date(),
            avatar: user.image,
            subscriptionTier: isAdmin ? 'BUSINESS' : 'FREE', // Admin gets BUSINESS tier
            subscriptionStatus: 'ACTIVE',
          },
        });

        // New users need to complete their profile
        // This will be handled by checking role in complete-profile page
        return true;
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.kycStatus = user.kycStatus;
      }
      
      // Fetch latest user data
      if (token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          select: {
            id: true,
            role: true,
            kycStatus: true,
            subscriptionTier: true,
            email: true,
          },
        });
        
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.kycStatus = dbUser.kycStatus;
          token.subscriptionTier = dbUser.subscriptionTier;
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.kycStatus = token.kycStatus as string;
        (session.user as any).subscriptionTier = token.subscriptionTier as string;
      }
      return session;
    },
  },
};
