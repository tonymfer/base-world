import create from "zustand";

interface LandingState {
  canvasWidth: number;
  mobile: boolean;
  burgerVisible: boolean;
  scrolling: boolean;
  initialXY: number[] | null;
  setCanvasWidth: (width: number) => void;
  setIsMobile: (boolean: boolean) => void;
  setInitialXY: (xy: number[]) => void;
  setBurgerVisible: (boolean: boolean) => void;
  setScrolling: (boolean: boolean) => void;
}

export const useLandingStore = create<LandingState>((set, get) => ({
  canvasWidth: 0,
  mobile: false,
  scrolled: false,
  scrolling: false,
  burgerVisible: false,
  initialXY: null,
  setCanvasWidth: (width: number) => set({ canvasWidth: width }),
  setInitialXY: (xy: number[]) => set({ initialXY: xy }),
  setIsMobile: (boolean) => set({ mobile: boolean }),
  setBurgerVisible: (boolean) => set({ burgerVisible: boolean }),
  setScrolling: (bool) => set({ scrolling: bool }),
}));
