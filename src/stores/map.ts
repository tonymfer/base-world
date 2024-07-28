import { createRef } from 'react';
import create from 'zustand';

type ActiveCityResponse = {
  id: number;
  createdAt: string;
  countryCode: string;
  countryName: string;
  channelId: string;
  followers: number;
  latitude: number;
  longitude: number;
  casts: Cast[];
};

export type Cast = {
  id: number;
  createdAt: string;
  castHash: string;
  fid: number;
  username: string;
  pfp_url: string;
  text: string;
  timestamp: string;
  channelUrl: string;
  countryId: number;
};
export type ActiveCity = {
  casts: number;
  channelId: string;
  followers: number;
  countryCode: string;
  countryName: string;
  createdAt: string;
  id: number;
  latitude: number;
  longitude: number;
};

const globeRef = createRef<any>();

interface MapState {
  activeCity: ActiveCity | null;
  activeCityResponse: ActiveCityResponse | null;
  clicked: boolean;
  loading: boolean;
  radius: number;
  places: any[];
  ready: boolean;
  about: boolean;
  globeActive: boolean;
  globeRef: any;
  setActiveCity: (obj: ActiveCity | null) => void;
  setActiveCityResponse: (obj: ActiveCityResponse | null) => void;
  setPlaces: (obj: any[]) => void;
  setClicked: (obj: boolean) => void;
  setRadius: (obj: number) => void;
  setReady: (obj: boolean) => void;
  setGlobeActive: (obj: boolean) => void;
  setGlobe: (obj: any) => void;
}

export const useMapStore = create<MapState>((set) => ({
  activeCity: null,
  activeCityResponse: null,
  loading: false,
  places: [],
  clicked: false,
  radius: 0,
  ready: false,
  about: false,
  globeActive: false,
  globeRef,
  setActiveCity: (obj) => set({ activeCity: obj }),
  setActiveCityResponse: (obj) => set({ activeCityResponse: obj }),
  setPlaces: (obj) => set({ places: obj }),
  setClicked: (bool) => set({ clicked: bool }),
  setRadius: (obj) => set({ radius: obj }),
  setReady: (bool) => set({ ready: bool }),
  setGlobeActive: (bool) => set({ globeActive: bool }),
  setGlobe: (obj) => set({ globeRef: obj }),
}));
