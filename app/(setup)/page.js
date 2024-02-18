import InitialModal from '@/components/Modals/InitialModal';
import { db } from '@/lib/db';
import { initialProfile } from '@/lib/initialProfile';
import { redirect } from 'next/navigation';

const Home = async () => {
  const profile = await initialProfile();

  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  return <InitialModal />;
};

export default Home;
