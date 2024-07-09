"use client";
import Image from "next/image";
import BaseGlobe from "./components/Hero";
import GlobeHeader from "./components/Hero/GlobeHeader";
import SideMenu from "@/app/components/SideMenu";

export default function Home() {
  return (
    <main className="bg-white scrollbar-hide">
      <GlobeHeader />
      <BaseGlobe />
    </main>
  );
}
