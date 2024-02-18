import { currentProfile } from '@/lib/currentProfile';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export const PATCH = async (req, { params }) => {
  try {
    const profile = await currentProfile();
    if (!profile) return new NextResponse('Unauthorized', { status: 401 });

    const { role } = await req.json();

    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get('serverId');
    if (!serverId)
      return new NextResponse('Server ID missing', { status: 400 });

    if (!params.memberId)
      return new NextResponse('Member ID missing', { status: 400 });

    const server = await db.server.update({
      where: { id: serverId, profileId: profile.id },
      data: {
        members: {
          update: {
            where: {
              id: params.memberId,
              profileId: { not: profile.id }, // check for admin can not change his own role
            },
            data: {
              role,
            },
          },
        },
      },
      include: {
        members: {
          include: { profile: true },
          orderBy: { role: 'asc' },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log('MEMBER_ID_ERROR', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
};

export const DELETE = async (req, { params }) => {
  try {
    const profile = await currentProfile();
    if (!profile) return new NextResponse('Unauthorized', { status: 401 });

    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get('serverId');
    if (!serverId)
      return new NextResponse('Server ID missing', { status: 400 });

    if (!params.memberId)
      return new NextResponse('Member Id missing', { status: 400 });

    const server = await db.server.update({
      where: { id: serverId, profileId: profile.id },
      data: {
        members: {
          deleteMany: {
            id: params.memberId,
            profileId: { not: profile.id },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: { role: 'asc' },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log('MEMBER_ID_DELETE', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
};
