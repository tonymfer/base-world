"use client";
import BaseGlobe from "./components/Hero";
import GlobeHeader from "./components/Hero/GlobeHeader";

import { DetailsSheet } from "./components/Passport/details-sheet";
import EventSheet from "./components/Passport/event-sheet";

export default function Home() {
  return (
    <main className="bg-white scrollbar-hide">
      <DetailsSheet />
      <GlobeHeader />
      <BaseGlobe />
      <EventSheet />
    </main>
  );
}
