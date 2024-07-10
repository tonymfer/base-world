import useApi from "@/app/hooks/useApi";
import { useLandingStore } from "@/app/stores/landing";
import { ActiveCity, useMapStore } from "@/app/stores/map";
import isMobile from "@/app/utils/device";
import { activateGlobe, zoomInCity, zoomOutCity } from "@/app/utils/globe";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import List from "./List";
import { api } from "@/app/utils/api";
import { useDebounce } from "@uidotdev/usehooks";

const Globe = dynamic(() => import("./ThreeGlobe"), { ssr: false });

export default function BaseGlobe() {
  const ready = useMapStore((s) => s.ready);
  const globeActive = useMapStore((s) => s.globeActive);
  const setGlobeActive = useMapStore((s) => s.setGlobeActive);
  const activeCity = useMapStore((s) => s.activeCity);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const countriesRef = useRef<HTMLDivElement>(null);
  const scrollNumber = isMobile() ? 150 : 30;
  const setScrolling = useLandingStore((s) => s.setScrolling);
  const scrolling = useLandingStore((s) => s.scrolling);
  const setBurgerVisible = useLandingStore((s) => s.setBurgerVisible);

  const { data } = useApi({
    url: "countries",
    method: "GET",
  }) as {
    data: {
      casts: number;
      countryCode: string;
      countryName: string;
      createdAt: string;
      id: number;
      latitude: number;
      longitude: number;
    }[];
  };

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

  useEffect(() => {
    // ... other useEffect code ...

    const updateMask = () => {
      const container = countriesRef.current;
      if (container) {
        const atTop = container.scrollTop === 0;
        const atBottom =
          container.scrollHeight - container.scrollTop ===
          container.clientHeight;
        container.style.maskImage = atTop
          ? "linear-gradient(to bottom, transparent, white 0%, white 5%, white 95%, transparent)"
          : atBottom
          ? "linear-gradient(to bottom, transparent, white 5%, white 100%, transparent)"
          : "linear-gradient(to bottom, transparent, white 5%, white 95%, transparent)";
      }
    };

    const container = countriesRef.current;
    if (container) {
      container.addEventListener("scroll", updateMask);
    }

    // Call updateMask initially to set the correct mask
    updateMask();

    return () => {
      if (container) {
        container.removeEventListener("scroll", updateMask);
      }
    };
  }, [countriesRef, globeActive, ready]);

  const memoizedGlobe = useMemo(() => {
    if (!data) return null;

    return (
      <Globe
        data={(data as ActiveCity[])?.sort((a, b) => a.longitude - b.longitude)}
      />
    );
  }, [data]);

  const activeCityResponse = useMapStore((state) => state.activeCityResponse);
  const setActiveCity = useMapStore((state) => state.setActiveCity);
  const globeRef = useMapStore((state) => state.globeRef);
  const [fetching, setFetching] = useState(false);
  const setActiveCityResponse = useMapStore(
    (state) => state.setActiveCityResponse
  );

  const [temp, setTemp] = useState<any>();

  async function handleHover() {
    const d = temp;
    setActiveCity(d);
    zoomInCity(d, "left");
    setFetching(true);
    const response = await api(`country/${d.id}`, {
      method: "GET",
    });
    setFetching(false);
    setActiveCityResponse(await response.json());
  }

  const debouncedCity = useDebounce(temp, 300);

  useEffect(() => {
    if (!globeActive) return;
    if (debouncedCity) {
      zoomInCity(temp, "right");
    }
  }, [debouncedCity, globeRef]);

  return (
    <div
      ref={scrollContainerRef}
      className="relative flex scrollbar-hide h-screen w-screen items-center bg-black"
    >
      <motion.div
        ref={countriesRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: globeActive && !activeCity ? 1 : 0 }}
        transition={{ duration: 0.5, staggerChildren: 1 }}
        style={{
          pointerEvents: globeActive && !activeCity ? "auto" : "none",
        }}
        className="absolute z-[10] transition-all scrollbar-hide left-0 padded-horizontal-wide hidden mobile:flex h-2/3 top-1/6 w-[400px] text-white flex-col items-start justify-start"
      >
        <div className="relative overflow-y-auto scrollbar-hide h-full">
          <div className="flex w-full flex-col pointer-events-none justify-start">
            {data
              ?.sort((a, b) => b.casts - a.casts)
              .slice(0, 15)
              .map((d, i) => {
                const { casts, countryName } = d;
                return (
                  <motion.div
                    key={i}
                    onClick={handleHover}
                    onHoverStart={() => !activeCity && setTemp(d)}
                    // onMouseEnter={() => setTemp(d)}
                    className={`relative flex pointer-events-none transition-all min-h-[min-content] w-full overflow-visible hover:bg-white px-1.5 py-1 hover:font-normal hover:text-black rounded-sm font-thin items-center text-xl justify-start`}
                  >
                    <span className="">{i + 1}.</span>
                    <span className="whitespace-nowrap ml-1">
                      {countryName}{" "}
                    </span>
                    <span className="ml-1 flex items-center justify-center gap-2 text-[22px] whitespace-nowrap font-normal text-blue-400">
                      {casts}
                      {i === 0 && <span className="flex">🎉</span>}
                    </span>
                  </motion.div>
                );
              })}
          </div>
        </div>
      </motion.div>
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
              <span className="">a community of builders</span>
              <span className="">on Base</span>
            </h1>
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
