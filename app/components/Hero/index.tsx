import * as TWEEN from "@tweenjs/tween.js";
import useApi from "@/app/hooks/useApi";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef } from "react";
import { useLandingStore } from "@/app/stores/landing";
import { ActiveCity, useMapStore } from "@/app/stores/map";
import styles from "styles/Button.module.css";
import { activateGlobe, deactivateGlobe } from "@/app/utils/globe";
import isMobile from "@/app/utils/device";
import List from "./List";
import { motion } from "framer-motion";

const Globe = dynamic(() => import("./ThreeGlobe"), { ssr: false });

export default function BaseGlobe(
  {
    //   userCount,
    //   isLoading,
    // }: {
    //   userCount: string;
    //   isLoading: boolean;
  }
) {
  const ready = useMapStore((s) => s.ready);
  const globeActive = useMapStore((s) => s.globeActive);
  const setGlobeActive = useMapStore((s) => s.setGlobeActive);
  const activeCity = useMapStore((s) => s.activeCity);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollNumber = isMobile() ? 150 : 30;
  const setScrolling = useLandingStore((s) => s.setScrolling);
  const scrolling = useLandingStore((s) => s.scrolling);
  const setBurgerVisible = useLandingStore((s) => s.setBurgerVisible);

  const { data } = useApi({
    url: "countries",
    method: "GET",
  });

  console.log(data);

  useEffect(() => {
    const handleScroll = (e: WheelEvent | TouchEvent) => {
      if (!ready) {
        e.preventDefault();
        return;
      }
      const elem = e.target as HTMLElement;
      const isScrollable = elem.classList.contains("scrollable");
      const containerScrollable = elem.offsetHeight < elem.scrollHeight;

      if (!containerScrollable && elem.classList.contains("cancel")) {
        elem.classList.remove("cancel");
      }

      if (!globeActive) {
        e.preventDefault();
        if (
          (e instanceof WheelEvent && e.deltaY > 0) ||
          e instanceof TouchEvent
        ) {
          activateGlobe();
          setGlobeActive(true);
          setBurgerVisible(true);
        }
      } else if (globeActive && !isScrollable && !containerScrollable) {
        e.preventDefault();
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("wheel", handleScroll, {
        passive: false,
      });
      container.addEventListener("touchmove", handleScroll, {
        passive: false,
      });
    }

    if (globeActive) {
      document.body.style.cursor = "pointer";
    } else {
      document.body.style.cursor = "auto";
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleScroll);
        container.removeEventListener("touchmove", handleScroll);
      }
      document.body.style.cursor = "auto";
    };
  }, [scrollContainerRef, globeActive, ready]);

  const memoizedGlobe = useMemo(() => {
    if (!data) return null;

    return (
      <Globe
        data={(data as ActiveCity[])?.sort((a, b) => a.longitude - b.longitude)}
      />
    );
  }, [data]);

  return (
    <div
      ref={scrollContainerRef}
      className="relative flex scrollbar-hide h-screen w-screen touch-pan-x touch-pan-y select-none items-center overscroll-none bg-black"
    >
      <div className="h-full w-full">
        <div
          className={`absolute z-0 ${
            ready ? "opacity-100" : "opacity-0"
          } h-screen w-screen transition-opacity duration-[0.5s]`}
        >
          {memoizedGlobe}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: globeActive ? 0 : 1,
            pointerEvents: globeActive ? "none" : "auto",
          }}
          transition={{ staggerChildren: 0.2 }}
          className={`
      absolute top-[40%] z-[1000] flex w-full -translate-y-1/2 flex-col items-center justify-between gap-5 overflow-hidden bg-transparent py-20 transition-opacity duration-1000 se:top-[30%]`}
        >
          <div className=" flex h-fit w-fit flex-col text-white items-center">
            <h1 className="flex w-full flex-col items-center justify-start gap-2 whitespace-pre-wrap text-center text-xl font-thin text-white se:text-2xl detail:mt-0 detail:flex detail:flex-row detail:whitespace-nowrap detail:text-3xl laptop:text-4xl">
              <span className="">Bringing the world onchain,</span>
              <span className="">a communtiy of builders</span>
              <span className="">on Base</span>
            </h1>
            <div className="flex flex-col items-center justify-center">
              <div className="text-white">made with ♥️ by</div>
              <div className="flex items-center justify-center gap-1">
                <a
                  href="https://warpcast.com/to"
                  rel="noopener noreferrer"
                  target="_blank"
                  className="px-2 py-1 w-fit rounded-lg bg-[#472A91] text-white text-sm"
                >
                  @to
                </a>
                <a
                  href="https://warpcast.com/undefined"
                  rel="noopener noreferrer"
                  target="_blank"
                  className="px-2 py-1 w-fit rounded-lg bg-[#472A91] text-white text-sm"
                >
                  @undefined
                </a>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                activateGlobe();
                setGlobeActive(true);
                setBurgerVisible(true);
              }}
              onTouchStart={() => {
                activateGlobe();
                setGlobeActive(true);
                setBurgerVisible(true);
              }}
              className={` flex w-auto bg-white px-3 py-1.5 text-xl mobile:text-2xl items-center border-[1px] border-primary mt-5 mobile:mt-10 rounded-lg text-black`}
            >
              Explore
            </motion.button>
          </div>
        </motion.div>
      </div>
      <List data={data} />
    </div>
  );
}
