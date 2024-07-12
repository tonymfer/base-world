import { Coordinates } from "@/types";
import { create } from "zustand";

interface PassportState {
  open: boolean;
  setOpen: (boolean: boolean) => void;
  chosenCoordinates: Coordinates;
  setChosenCoordinates: (coordinates: Coordinates) => void;
  handleOpenAndReset: (open: boolean) => void;
}

export const usePassport = create<PassportState>((set, get) => ({
  open: false,
  setOpen: (boolean) => set({ open: boolean }),
  chosenCoordinates: { lat: "", lng: "", name: "" },
  setChosenCoordinates: (coordinates) =>
    set({ chosenCoordinates: coordinates }),
  handleOpenAndReset: (open) => {
    set({ open });
    if (!open) {
      set({ chosenCoordinates: { lat: "", lng: "", name: "" } });
    }
  },
}));
