"use client";
import Image from "next/image";
import BaseGlobe from "./components/Hero";
import GlobeHeader from "./components/Hero/GlobeHeader";

export default function Home() {
  return (
    <main className="bg-white">
      <GlobeHeader />
      <BaseGlobe />
    </main>
  );
}
