"use client";
import { Toaster } from "sonner";
import BaseGlobe from "./components/Hero";
import GlobeHeader from "./components/Hero/GlobeHeader";

import { DetailsSheet } from "./components/Passport/details-sheet";
import EventSheet from "./components/Passport/event-sheet";
import { usePassport } from "./stores/passport";

export default function Home() {
  const open = usePassport((state) => state.open);

  return (
    <main className="bg-white scrollbar-hide">
      <DetailsSheet />
      <GlobeHeader />
      <BaseGlobe />
      <EventSheet />
      <Toaster position={open ? "bottom-left" : "bottom-right"} visibleToasts={7} />
    </main>
  );
}
