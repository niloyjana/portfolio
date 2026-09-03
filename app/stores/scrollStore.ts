import { create } from 'zustand';

interface ScrollStore {
  scrollProgress: number;
  setScrollProgress: (progress: number) => void;
  scrollEl: HTMLElement | null;
  setScrollEl: (el: HTMLElement) => void;
}

export const useScrollStore = create<ScrollStore>((set) => ({
  scrollProgress: 0,
  setScrollProgress: (progress) => set(() => ({ scrollProgress: progress })),
  scrollEl: null,
  setScrollEl: (el) => set(() => ({ scrollEl: el })),
}));