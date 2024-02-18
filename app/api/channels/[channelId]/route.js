import { currentProfile } from '@/lib/currentProfile';
import { db } from '@/lib/db';
import { MemberRole } from '@prisma/client';
import { NextResponse } from 'next/server';

export const DELETE = async (req, { params }) => {
  try {
    const profile = await currentProfile();
    if (!profile) return new NextResponse('Unauthorized', { status: 401 });

    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get('serverId');
    if (!serverId)
      return new NextResponse('Server ID missing', { status: 400 });

    if (!params.channelId)
      return new NextResponse('Channel ID missing', { status: 400 });

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          deleteMany: {
            id: params.channelId,
            name: {
              not: 'general',
            },
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log('CHANNEL_ID_DELETE', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
};
