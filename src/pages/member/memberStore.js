import { create } from 'zustand';

const useMemberStore = create((set) => ({
  memberList: [],
  pagingInfo: {
    pageNumber: 1,
    action: 'all', // 초기값 지정
    listCount: 0,
    maxPage: 0,
    pageSize: 10,
    startPage: 0,
    endPage: 0,
    keyword: '',
  },
  setMemberList: (list) => set(() => ({ memberList: list })),
  setPagingInfo: (info) =>
    set((state) => ({
      pagingInfo: { ...state.pagingInfo, ...info },
    })),

  isInitialLoad: true, // 처음 로드 여부 플래그
  setInitialLoad: (flag) => set({ isInitialLoad: flag }),
}));

export default useMemberStore;
