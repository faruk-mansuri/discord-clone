'use client';

import { useEffect, useState } from 'react';
import CreateServerModal from '../Modals/CreateServerModal';
import InviteModal from '../Modals/InviteModal';
import EditServerModal from '../Modals/EditServerModal';
import MembersModal from '../Modals/MembersModal';
import CreateChannelModal from '../Modals/CreateChannelModal';
import LeaveServerModal from '../Modals/LeaveServerModal';
import DeleteServerModal from '../Modals/DeleteServerModal copy';
import DeleteChannelModal from '../Modals/DeleteChannelModal';

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <CreateServerModal />
      <InviteModal />
      <EditServerModal />
      <MembersModal />
      <CreateChannelModal />
      <LeaveServerModal />
      <DeleteServerModal />
      <DeleteChannelModal />
    </>
  );
};
