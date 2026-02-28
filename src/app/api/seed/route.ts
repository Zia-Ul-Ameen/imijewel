import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { admins } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    const seedSecret = request.headers.get('x-seed-secret');

    if (seedSecret !== process.env.SEED_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const email = 'admin@imijewel.com';
        const password = 'Password@123';
        const passwordHash = await bcrypt.hash(password, 12);

        // Check if admin already exists
        const [existing] = await db
            .select()
            .from(admins)
            .where(eq(admins.email, email))
            .limit(1);

        if (existing) {
            return NextResponse.json({
                message: 'Admin already exists',
                email,
            });
        }

        await db.insert(admins).values({ email, passwordHash });

        return NextResponse.json({
            message: 'Admin seeded successfully',
            email,
        });
    } catch (error) {
        console.error('Seed error:', error);
        return NextResponse.json({ error: 'Seed failed' }, { status: 500 });
    }
}
