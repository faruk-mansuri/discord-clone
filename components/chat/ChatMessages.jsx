'use client';

import { useChatQuery } from '@/hooks/useChatQuery';
import ChatWelcome from './ChatWelcome';
import { Loader2, ServerCrash } from 'lucide-react';
import { Fragment, useRef, ElementRef, useEffect } from 'react';
import ChatItem from './ChatItem';
import { format } from 'date-fns';
import { useChatSocket } from '@/hooks/useChatSocket';
import { useChatScroll } from '@/hooks/useChatScolll';

const DATE_FORMAT = 'd MMM yyyy, HH:mm';

const ChatMessages = ({
  name,
  member,
  chatId,
  apiUrl,
  socketUrl,
  socketQuery,
  paramKey,
  paramValue,
  type,
}) => {
  const queryKey = `chat:${chatId}`;
  const addKey = `chat:${chatId}:messages`;
  const updateKey = `chat:${chatId}:messages:update`;

  const chatRef = useRef(null);
  const bottomRef = useRef(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({ queryKey, apiUrl, paramKey, paramValue });

  useChatSocket({ queryKey, addKey, updateKey });
  useChatScroll({
    chatRef,
    bottomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    count: data?.pages?.[0]?.items?.length ?? 0,
  });

  if (status === 'pending') {
    return (
      <div className='flex flex-col flex-1 justify-center items-center'>
        <Loader2 className='h-7 w-7 text-zinc-500 animate-spin my-4' />
        <p className='text-xs text-zinc-500 dark:text-zinc-400'>
          Loading messages...
        </p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className='flex flex-col flex-1 justify-center items-center'>
        <ServerCrash className='h-7 w-7 text-zinc-500 my-4' />
        <p className='text-xs text-zinc-500 dark:text-zinc-400'>
          Something went wrong!
        </p>
      </div>
    );
  }

  return (
    <div ref={chatRef} className='flex-1 flex flex-col py-4 overflow-y-auto'>
      {!hasNextPage && <div className='flex-1' />}

      {!hasNextPage && <ChatWelcome type={type} name={name} />}

      {hasNextPage && (
        <div className='flex justify-center'>
          {isFetchingNextPage ? (
            <Loader2 className='h-6 w-6 text-zinc-500 animate-spin my-4' />
          ) : (
            <button
              onClick={() => fetchNextPage()}
              className='text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition my-4  text-xs'
            >
              Load previous message
            </button>
          )}
        </div>
      )}
      <div className='flex flex-col-reverse mt-auto'>
        {data?.pages?.map((group, i) => {
          return (
            <Fragment key={i}>
              {group.items.map((message) => {
                return (
                  <ChatItem
                    key={message.id}
                    id={message.id}
                    currentMember={member}
                    member={message.member}
                    content={message.content}
                    fileUrl={message.fileUrl}
                    deleted={message.deleted}
                    timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                    isUpdated={message.updatedAt !== message.createdAt}
                    socketUrl={socketUrl}
                    socketQuery={socketQuery}
                  />
                );
              })}
            </Fragment>
          );
        })}
      </div>

      <div ref={bottomRef} />
    </div>
  );
};

export default ChatMessages;
