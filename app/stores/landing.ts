import create from "zustand";

interface LandingState {
  canvasWidth: number;
  mobile: boolean;
  burgerVisible: boolean;
  scrolling: boolean;
  setCanvasWidth: (width: number) => void;
  setChartOption: (option: ChartOption) => void;
  setIsMobile: (boolean: boolean) => void;
  setBurgerVisible: (boolean: boolean) => void;
  setScrolling: (boolean: boolean) => void;
}

export const useLandingStore = create<LandingState>((set, get) => ({
  canvasWidth: 0,
  mobile: false,
  scrolled: false,
  scrolling: false,
  burgerVisible: false,
  setCanvasWidth: (width: number) => set({ canvasWidth: width }),
  setChartOption: (option: ChartOption) => {
    const prevChartOption = get().chartOption;
    set({ chartOption: option, prevChartOption });
  },
  setIsMobile: (boolean) => set({ mobile: boolean }),
  setBurgerVisible: (boolean) => set({ burgerVisible: boolean }),
  setScrolling: (bool) => set({ scrolling: bool }),
}));
