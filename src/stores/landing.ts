import { create } from 'zustand';

interface LandingState {
  canvasWidth: number;
  mobile: boolean;
  burger: boolean;
  scrolling: boolean;
  initialXY: number[] | null;
  setCanvasWidth: (width: number) => void;
  setIsMobile: (boolean: boolean) => void;
  setInitialXY: (xy: number[]) => void;
  setBurger: (boolean: boolean) => void;
  setScrolling: (boolean: boolean) => void;
}

export const useLandingStore = create<LandingState>((set, get) => ({
  canvasWidth: 0,
  mobile: false,
  scrolled: false,
  scrolling: false,
  burger: false,
  initialXY: null,
  setCanvasWidth: (width: number) => set({ canvasWidth: width }),
  setInitialXY: (xy: number[]) => set({ initialXY: xy }),
  setIsMobile: (boolean) => set({ mobile: boolean }),
  setBurger: (boolean) => set({ burger: boolean }),
  setScrolling: (bool) => set({ scrolling: bool }),
}));
