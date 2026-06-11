import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';

export async function GET() {
  try {
    const leaderboard = await prisma.leaderboard.findMany({
      take: 100,
      orderBy: {
        score: 'desc',
      },
      include: {
        user: {
          select: {
            email: true, // In production, we'd use a username
          },
        },
      },
    });

    return NextResponse.json(leaderboard);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId, score, seasonId } = await request.json();

    if (!userId || score === undefined) {
      return NextResponse.json({ error: 'Missing userId or score' }, { status: 400 });
    }

    const entry = await prisma.leaderboard.upsert({
      where: { userId },
      update: {
        score: {
          set: score,
        },
      },
      create: {
        userId,
        score,
        seasonId: seasonId || 'season-1',
      },
    });

    return NextResponse.json(entry);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update leaderboard' }, { status: 500 });
  }
}
