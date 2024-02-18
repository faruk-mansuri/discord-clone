import { currentProfile } from '@/lib/currentProfile';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export const PATCH = async (req, { params }) => {
  try {
    const profile = await currentProfile();
    if (!profile) return new NextResponse('Unauthorized', { status: 401 });

    const body = await req.json();

    const server = await db.server.update({
      where: { id: params.serverId, profileId: profile.id },
      data: {
        ...body,
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log('SERVER_PATCH', error);
    return new NextResponse('internal Error', { status: 500 });
  }
};

export const DELETE = async (req, { params }) => {
  try {
    const profile = await currentProfile();
    if (!profile) return new NextResponse('Unauthorized', { status: 401 });

    const server = await db.server.delete({
      where: {
        id: params.serverId,
        profileId: profile.id,
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log('SERVER_ID_DELETE', error);
    return new NextResponse('internal Error', { status: 500 });
  }
};
