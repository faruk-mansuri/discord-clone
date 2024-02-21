'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import qs from 'query-string';
import ActionTooltip from '../ActionTooltip';
import { Video, VideoOff } from 'lucide-react';

const ChatVideoButton = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const isVideo = searchParams.get('video');

  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname || '',
        query: {
          video: isVideo ? undefined : true,
        },
      },
      { skipNull: true }
    );

    router.push(url);
  };

  const Icon = isVideo ? VideoOff : Video;
  const toolTipLabel = isVideo ? 'End video call' : ' Start video call';

  return (
    <ActionTooltip label={toolTipLabel} side='bottom'>
      <button className='hover:opacity-75 transition mr-4 ' onClick={onClick}>
        <Icon className='h-6 w-6 text-zinc-500 dark:text-zinc-400' />
      </button>
    </ActionTooltip>
  );
};

export default ChatVideoButton;
