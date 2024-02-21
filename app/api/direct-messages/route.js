import { currentProfile } from '@/lib/currentProfile';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

const MESSAGES_PATCH = 10;

export const GET = async (req) => {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get('cursor');
    const conversationId = searchParams.get('conversationId');

    if (!profile) return new NextResponse('Unauthorized', { status: 401 });

    if (!conversationId)
      return new NextResponse('Conversation ID missing', { status: 400 });

    let messages = [];

    if (cursor) {
      messages = await db.directMessage.findMany({
        take: MESSAGES_PATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          conversationId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } else {
      messages = await db.directMessage.findMany({
        take: MESSAGES_PATCH,
        where: {
          conversationId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }

    let nextCursor = null;

    if (messages.length === MESSAGES_PATCH) {
      nextCursor = messages[MESSAGES_PATCH - 1].id;
    }

    return NextResponse.json({ items: messages, nextCursor });
  } catch (error) {
    console.log('DIRECT_MESSAGES_GET', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
};
