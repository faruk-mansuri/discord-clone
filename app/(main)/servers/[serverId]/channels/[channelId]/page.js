import MediaRoom from '@/components/MediaRoom';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatInput from '@/components/chat/ChatInput';
import ChatMessages from '@/components/chat/ChatMessages';
import { currentProfile } from '@/lib/currentProfile';
import { db } from '@/lib/db';
import { redirectToSignIn } from '@clerk/nextjs';
import { ChannelType } from '@prisma/client';
import { redirect } from 'next/navigation';

const ChannelIdPage = async ({ params }) => {
  const profile = await currentProfile();
  if (!profile) return redirectToSignIn();

  const { serverId, channelId } = params;

  const channel = await db.channel.findUnique({
    where: { id: channelId },
  });

  const member = await db.member.findFirst({
    where: {
      serverId,
      profileId: profile.id,
    },
  });

  if (!channel || !member) redirect('/');

  return (
    <div className='bg-white dark:bg-[#313338] flex flex-col h-screen'>
      <ChatHeader name={channel.name} serverId={serverId} type='channel' />

      {channel.type === ChannelType.TEXT && (
        <>
          <ChatMessages
            member={member}
            name={channel.name}
            chatId={channel.id}
            type='channel'
            apiUrl='/api/messages'
            socketUrl='/api/socket/messages'
            socketQuery={{ channelId: channel.id, serverId: channel.serverId }}
            paramKey='channelId'
            paramValue={channel.id}
          />

          <ChatInput
            name={channel.name}
            type='channel'
            apiUrl='/api/socket/messages'
            query={{ channelId: channel.id, serverId: channel.serverId }}
          />
        </>
      )}

      {channel.type === ChannelType.AUDIO && (
        <MediaRoom chatId={channelId} video={false} audio={true} />
      )}

      {channel.type === ChannelType.VIDEO && (
        <MediaRoom chatId={channelId} video={true} audio={true} />
      )}
    </div>
  );
};

export default ChannelIdPage;
