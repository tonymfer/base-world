"use client";
import Details from "./components/Details";
import BaseGlobe from "./components/Hero";
import GlobeHeader from "./components/Hero/GlobeHeader";

import { DetailsSheet } from "./components/Passport/details-sheet";
import EventSheet from "./components/Passport/event-sheet";

export default function Home() {
  return (
    <main className="bg-white overflow-hidden scrollbar-hide ">
      <DetailsSheet />
      <GlobeHeader />
      <BaseGlobe />
      <div className="pointer-events-none h-[600px] w-screen select-none bg-gradient-to-b from-black to-white tablet:h-[3000px]" />
      <Details />
      <EventSheet />
    </main>
  );
}
