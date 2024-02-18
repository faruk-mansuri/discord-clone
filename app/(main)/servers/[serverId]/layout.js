import ServerSidebar from '@/components/server/ServerSidebar';
import { currentProfile } from '@/lib/currentProfile';
import { db } from '@/lib/db';
import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

const ServerIdLayout = async ({ children, params }) => {
  const profile = await currentProfile();
  if (!profile) return redirectToSignIn();

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: { profileId: profile.id },
      },
    },
  });

  if (!server) return redirect('/');

  return (
    <div className='h-screen'>
      <div className='hidden md:flex h-screen w-60 z-20 flex-col fixed inset-y-0'>
        <ServerSidebar serverId={params.serverId} />
      </div>
      <main className='h-screen md:pl-60'>{children}</main>
    </div>
  );
};

export default ServerIdLayout;
