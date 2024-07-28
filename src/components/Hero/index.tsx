import useApi from "@/hooks/useApi";
import { useLandingStore } from "@/stores/landing";
import { ActiveCity, useMapStore } from "@/stores/map";
import isMobile from "@/utils/device";
import { activateGlobe, zoomInCity } from "@/utils/globe";
import { shortenNumber } from "@/lib/utils";
import { useDebounce } from "@uidotdev/usehooks";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../ui/button";
import useRealTimePosts from "../useRealTimePosts";

const Globe = dynamic(() => import("./ThreeGlobe"), { ssr: false });

export default function BaseGlobe() {
  const ready = useMapStore((s) => s.ready);
  const globeActive = useMapStore((s) => s.globeActive);
  const about = useMapStore((s) => s.about);
  const setGlobeActive = useMapStore((s) => s.setGlobeActive);
  const activeCity = useMapStore((s) => s.activeCity);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const countriesRef = useRef<HTMLDivElement>(null);
  const scrollNumber = isMobile() ? 150 : 30;
  const setScrolling = useLandingStore((s) => s.setScrolling);
  const scrolling = useLandingStore((s) => s.scrolling);

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
      channelId: string;
      followers: number;
    }[];
  };

  const { data: baseData } = useApi({
    url: "base",
    method: "GET",
  }) as {
    data: { followers: number };
  };

  useRealTimePosts();

  useEffect(() => {
    const handleScroll = (e: WheelEvent | TouchEvent) => {
      if (!ready || about) {
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

  const setActiveCity = useMapStore((state) => state.setActiveCity);
  const globeRef = useMapStore((state) => state.globeRef);
  const [fetching, setFetching] = useState(false);
  const setActiveCityResponse = useMapStore(
    (state) => state.setActiveCityResponse
  );

  const [temp, setTemp] = useState<any>();

  async function handleHover() {
    // const d = temp;
    // setActiveCity(d);
    // zoomInCity(d, "left");
    // setFetching(true);
    // const response = await api(`country/${d.id}`, {
    //   method: "GET",
    // });
    // setFetching(false);
    // setActiveCityResponse(await response.json());
    const channelId =
      temp.countryName === "Base" ? "base" : `~/channel/${temp.channelId}`;
    window.open(`https://warpcast.com/${channelId}`, "_blank");
  }

  const debouncedCity = useDebounce(temp, 300);

  useEffect(() => {
    if (!globeActive) return;
    if (debouncedCity) {
      zoomInCity(temp, "right");
    }
  }, [debouncedCity, globeRef]);

  const userTotalCount = data?.reduce((acc, curr) => acc + curr.followers, 0);

  return (
    <div
      ref={scrollContainerRef}
      className="relative flex scrollbar-hide h-screen w-screen items-center bg-transparent"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: globeActive && !activeCity ? 1 : 0 }}
        transition={{ duration: 0.5, staggerChildren: 1 }}
        style={{
          pointerEvents: globeActive && !activeCity ? "auto" : "none",
        }}
        className="absolute z-[10] transition-all scrollbar-hide left-0 padded-horizontal-wide hidden mobile:flex h-2/3 top-1/6 w-[400px] text-white flex-col items-start justify-start"
      >
        <div className="relative overflow-y-auto scrollbar-hide h-full">
          <div className="flex w-full flex-col justify-start">
            <motion.div
              onClick={handleHover}
              onHoverStart={() => {
                const bData = data?.find((d) => d.countryName === "Base");
                !activeCity && setTemp(bData);
              }}
              className={`relative group flex transition-all min-h-[min-content] w-full overflow-visible hover:bg-white px-1.5 py-1 hover:font-normal hover:text-black rounded-sm font-thin items-center text-base justify-start`}
            >
              <span className="whitespace-nowrap ml-1">/base - </span>
              <span className="ml-1 flex items-center justify-center gap-1 text-base">
                <span className=" ">{shortenNumber(baseData?.followers)}</span>
                <svg
                  fill="#ffffff"
                  className="group-hover:fill-black group-hover:stroke-black h-4 w-4"
                  viewBox="0 0 32 32"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="#ffffff"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <path d="M16 15.503A5.041 5.041 0 1 0 16 5.42a5.041 5.041 0 0 0 0 10.083zm0 2.215c-6.703 0-11 3.699-11 5.5v3.363h22v-3.363c0-2.178-4.068-5.5-11-5.5z"></path>
                  </g>
                </svg>
              </span>
            </motion.div>
            {data
              ?.sort((a, b) => b.followers - a.followers)
              .slice(0, 15)
              .map((d, i) => {
                const { casts, channelId, countryName, followers } = d;
                return (
                  <motion.div
                    key={i}
                    onClick={handleHover}
                    onHoverStart={() => !activeCity && setTemp(d)}
                    // onMouseEnter={() => setTemp(d)}
                    className={`relative group flex transition-all min-h-[min-content] w-full overflow-visible hover:bg-white px-1.5 py-1 hover:font-normal hover:text-black rounded-sm font-thin items-center text-base justify-start`}
                  >
                    {/* <span className="">{i + 1}.</span> */}
                    <span className="whitespace-nowrap ml-1">
                      /{channelId} -{" "}
                    </span>
                    <span className="ml-1 flex items-center justify-center gap-0.5 text-base">
                      <span className=" ">{shortenNumber(followers)}</span>
                      <svg
                        fill="#ffffff"
                        className="group-hover:fill-black group-hover:stroke-black h-4 w-4"
                        viewBox="0 0 32 32"
                        xmlns="http://www.w3.org/2000/svg"
                        stroke="#ffffff"
                      >
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          <path d="M16 15.503A5.041 5.041 0 1 0 16 5.42a5.041 5.041 0 0 0 0 10.083zm0 2.215c-6.703 0-11 3.699-11 5.5v3.363h22v-3.363c0-2.178-4.068-5.5-11-5.5z"></path>
                        </g>
                      </svg>
                    </span>
                  </motion.div>
                );
              })}
          </div>
          <Button
            className="uppercase mt-2 h-0 text-slate-500 py-4 w-[90%] mx-2"
            variant="link"
            asChild
          >
            <Link href="/leaderboard">See More</Link>
          </Button>
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
            opacity: globeActive || about ? 0 : 1,
            pointerEvents: globeActive || about ? "none" : "auto",
          }}
          transition={{ staggerChildren: 0.2, staggerDirection: -1 }}
          className={`
      absolute top-[40%] z-[1000] flex w-full -translate-y-1/2 flex-col items-center justify-between gap-5 overflow-hidden bg-transparent py-20 transition-opacity duration-1000 se:top-[30%]`}
        >
          <div className=" flex h-fit w-fit flex-col text-white items-center">
            <h1 className="flex w-full flex-col items-center justify-start gap-2 whitespace-pre-wrap text-center text-xl font-thin text-white se:text-2xl detail:mt-0 detail:flex detail:flex-row detail:whitespace-nowrap detail:text-3xl laptop:text-4xl">
              <span className="">Bringing the world onchain,</span>
              <span className="">a community of builders</span>
              <span className="">on Base</span>
            </h1>
            {data?.length !== 0 && (
              <div
                className={`mt-3 block text-base font-extralight text-gray-300`}
              >
                {data?.length} countries, {userTotalCount} users on warpcast
              </div>
            )}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                activateGlobe();
                setGlobeActive(true);
              }}
              onTouchStart={() => {
                activateGlobe();
                setGlobeActive(true);
              }}
              className={` flex w-auto bg-white px-3 py-1.5 text-xl mobile:text-2xl items-center mt-5 mobile:mt-10 rounded-lg text-black hover:bg-white/90`}
            >
              Explore
            </motion.button>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: about ? 1 : 0,
            pointerEvents: about ? "auto" : "none",
            backdropFilter: about ? `blur(4px)` : `blur(0px)`,
            transition: {
              backdropFilter: { delay: about ? 1 : 0 },
              opacity: {
                delay: about ? 1 : 0,
              },
            },
          }}
          className={`
      absolute top-0 left-0 z-[1000] flex w-screen padded-horizontal-wide h-screen flex-col items-center justify-center`}
        >
          <div className=" flex h-full w-full justify-center flex-col text-white items-center">
            <div className="flex flex-col mt-10 mobile:mt-5 items-center justify-center h-full gap-5 tablet:gap-[120px]">
              <div className="flex w-full max-w-full tablet:max-w-[1000px] flex-col items-start justify-start gap-2 lg:gap-5 text-xl font-thin text-white">
                <div className="text-xl tablet:text-5xl font-semibold whitespace-nowrap">{`BASE\nIS FOR EVERYONE`}</div>
                <div className="text-sm leading-tight tablet:text-xl">
                  Base is paving the way for the next generation of the
                  internet, working alongside its community to ensure that
                  builders worldwide have equal access to the opportunities
                  offered by the Global Onchain Economy.
                </div>
                <div className="text-sm leading-tight tablet:text-xl">
                  {`The Base Global Communities initiative leverages the power of
                  community to drive the adoption, education, and growth of
                  Base's ecosystem on a global scale. Currently built on the
                  Farcaster network, 44 Base country/language specific channels
                  and 70+ community leaders are a part of this initiative,
                  working to foster and support vibrant, engaged, and inclusive
                  communities around the world that are passionate about the
                  vision of Base and the Global Onchain Economy.`}
                </div>
              </div>
              <div className="flex w-full tablet:max-w-[1000px] flex-col items-start justify-start gap-2 lg:gap-5 text-xl font-thin text-white">
                <div className="text-xl tablet:text-5xl font-semibold whitespace-nowrap">{`ONCHAIN SUMMER\nIS FOR EVERYONE`}</div>
                <div className="text-sm leading-tight mobile:text-xl">
                  Onchain Summer is a global movement calling on the ecosystem
                  to build and create projects that will usher in the next wave
                  of users onchain. To celebrate the diversity and creativity of
                  our Base Global Communities, creators worldwide created an NFT
                  collection to spread the word about Onchain Summer in their
                  native languages!
                </div>
                <div className=" text-base mobile:text-xl">
                  See the gallery on Coinbase Wallet web app:{" "}
                  <Link
                    className="underline"
                    href="https://wallet.coinbase.com/nft/gallery"
                    passHref
                  >
                    wallet.coinbase.com/nft/gallery/........
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      {/* <List data={data} /> */}
    </div>
  );
}
