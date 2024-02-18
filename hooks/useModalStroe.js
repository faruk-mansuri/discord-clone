import { create } from 'zustand';

export const useModalStore = create((set) => {
  return {
    type: null,
    data: {
      server: null,
      channel: null,
      channelType: null,
      apiUrl: '',
      query: '',
    },
    isOpen: false,
    onOpen: (type, data) =>
      set((state) => {
        return { isOpen: true, type, data: { ...state.data, ...data } };
      }),
    onClose: () => set({ type: null, isOpen: false }),
  };
});
