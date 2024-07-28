import { Coordinates, Event } from "types";
import { create } from "zustand";

interface PassportState {
  open: boolean;
  setOpen: (boolean: boolean) => void;
  chosenCoordinates: Coordinates;
  setChosenCoordinates: (coordinates: Coordinates) => void;
  handleOpenAndReset: (open: boolean) => void;
  handleSecondaryOpenAndReset: (secondaryOpen: any) => void;
  secondaryOpen: boolean;
  setSecondaryOpen: (boolean: boolean) => void;
  filteredEvents: Event[];
  setFilteredEvents: (events: Event[]) => void;
  currentEventId: number | null;
  setCurrentEventId: (id: number | null) => void;
  mints: string[];
  setMints: (mints: string[]) => void;
  contract: string | null;
  setContract: (contract: string | null) => void;
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
  filteredEvents: [],
  setFilteredEvents: (events) => set({ filteredEvents: events }),
  handleSecondaryOpenAndReset: (secondaryOpen: any) => {
    set({ secondaryOpen });
  },
  secondaryOpen: false,
  setSecondaryOpen: (boolean) => set({ secondaryOpen: boolean }),
  currentEventId: null,
  setCurrentEventId: (id) => set({ currentEventId: id }),
  mints: [],
  setMints: (mints) => set({ mints }),
  contract: null,
  setContract: (contract) => set({ contract }),
}));
