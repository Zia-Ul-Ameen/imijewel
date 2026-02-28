import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { db } from '@/lib/db';
import { admins } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        Credentials({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const [admin] = await db
                    .select()
                    .from(admins)
                    .where(eq(admins.email, credentials.email as string))
                    .limit(1);

                if (!admin) return null;

                const isValid = await bcrypt.compare(
                    credentials.password as string,
                    admin.passwordHash
                );

                if (!isValid) return null;

                return {
                    id: admin.id,
                    email: admin.email,
                    role: 'admin',
                };
            },
        }),
    ],
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
    pages: {
        signIn: '/admin/auth',
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.AUTH_SECRET,
});
