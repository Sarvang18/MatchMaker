import { NextAuthOptions, getServerSession as nextGetServerSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from './db';
import type { MatchmakerSession } from '@/types';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const matchmaker = await prisma.matchmaker.findUnique({
          where: { email: credentials.email },
        });

        if (!matchmaker) {
          return null;
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password,
          matchmaker.passwordHash
        );

        if (!isValidPassword) {
          return null;
        }

        return {
          id: matchmaker.id,
          name: matchmaker.name,
          email: matchmaker.email,
          role: matchmaker.role,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export async function getServerSession() {
  return nextGetServerSession(authOptions) as Promise<{
    user: MatchmakerSession;
  } | null>;
}
