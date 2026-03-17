import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET(
  _req: Request,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;

  try {
    const user = await (prisma as any).user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        profilePicture: true,
        image: true,
        nationality: true,
        occupation: true,
        workExperience: true,
        spokenLanguages: true,
        skills: true,
        aboutMe: true,
        bio: true,
        interests: true,
        availability: true,
        willingToRelocate: true,
        hasWorkPermit: true,
        workPermitCountries: true,
        preferredRegions: true,
        openToOpportunities: true,
        profileVisibility: true,
        trustScore: true,
        completedStays: true,
        completedAgreements: true,
        reviewsReceivedCount: true,
        responseRate: true,
        createdAt: true,
        reviews: {
          take: 6,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            reviewer: {
              select: {
                id: true,
                name: true,
                profilePicture: true,
                image: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.profileVisibility === 'PRIVATE') {
      return NextResponse.json({ error: 'This profile is private' }, { status: 403 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return NextResponse.json({ error: 'Failed to load portfolio' }, { status: 500 });
  }
}
