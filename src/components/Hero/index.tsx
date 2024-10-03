import useApi from '@/hooks/useApi';
import { useLandingStore } from '@/stores/landing';
import { ActiveCity, useMapStore } from '@/stores/map';
import isMobile from '@/utils/device';
import { activateGlobe, deactivateGlobe, zoomInCity } from '@/utils/globe';
import { useDebounce } from '@uidotdev/usehooks';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '../ui/button';
import useRealTimePosts from '../useRealTimePosts';
import { useFixedGlobeData } from './useCountries';
import Image from 'next/image';
import batwLogo from '@/images/batw-logo.png';
import { baseAroundTheWorld } from './baseAroundTheWorld';
import { ExpandableCardDemo } from '../Expandable';

const Globe = dynamic(() => import('./ThreeGlobe'), { ssr: false });

export default function BaseGlobe() {
  const ready = useMapStore((s) => s.ready);
  const globeActive = useMapStore((s) => s.globeActive);
  const globeRef = useMapStore((s) => s.globeRef);
  const about = useMapStore((s) => s.about);
  const setGlobeActive = useMapStore((s) => s.setGlobeActive);
  const activeCity = useMapStore((s) => s.activeCity);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const countriesRef = useRef<HTMLDivElement>(null);
  const scrollNumber = isMobile() ? 150 : 30;
  const setScrolling = useLandingStore((s) => s.setScrolling);
  const scrolling = useLandingStore((s) => s.scrolling);

  const data = useFixedGlobeData();

  const { data: baseData } = useApi({
    url: 'base',
    method: 'GET',
  }) as {
    data: { followers: number };
  };

  useRealTimePosts();

  useEffect(() => {
    if (!globeRef.current) {
      console.warn('globeRef.current is not initialized.');
      return;
    }
    const currentCamera = globeRef.current.camera();
    if (!currentCamera) {
      console.warn('currentCamera is not initialized.');
      return;
    }
    if (globeActive) {
      activateGlobe();
    } else if (about) {
      deactivateGlobe(true);
    } else {
      deactivateGlobe();
    }
  }, [globeActive, globeRef.current, about]);

  // useEffect(() => {
  //   const handleScroll = (e: WheelEvent | TouchEvent) => {
  //     e.preventDefault();
  //     if (!ready || about) {
  //       e.preventDefault();
  //       return;
  //     }
  //     const elem = e.target as HTMLElement;
  //     const isScrollable = elem.classList.contains('scrollable');
  //     const containerScrollable = elem.offsetHeight < elem.scrollHeight;

  //     if (!containerScrollable && elem.classList.contains('cancel')) {
  //       elem.classList.remove('cancel');
  //     }

  //     // if (!globeActive) {
  //     //   e.preventDefault();
  //     //   if (
  //     //     (e instanceof WheelEvent && e.deltaY > 0) ||
  //     //     e instanceof TouchEvent
  //     //   ) {
  //     //     activateGlobe();
  //     //     setGlobeActive(true);
  //     //   }
  //     // } else if (globeActive && !isScrollable && !containerScrollable) {
  //     //   e.preventDefault();
  //     // }
  //   };

  //   const container = scrollContainerRef.current;
  //   if (container) {
  //     container.addEventListener('wheel', handleScroll, {
  //       passive: false,
  //     });
  //     container.addEventListener('touchmove', handleScroll, {
  //       passive: false,
  //     });
  //   }

  //   if (globeActive) {
  //     document.body.style.cursor = 'pointer';
  //   } else {
  //     document.body.style.cursor = 'auto';
  //   }

  //   return () => {
  //     if (container) {
  //       container.removeEventListener('wheel', handleScroll);
  //       container.removeEventListener('touchmove', handleScroll);
  //     }
  //     document.body.style.cursor = 'auto';
  //   };
  // }, [scrollContainerRef, globeActive, ready]);

  const memoizedGlobe = useMemo(() => {
    if (!data) return null;

    return (
      <Globe
        data={(data as ActiveCity[])?.sort((a, b) => a.longitude - b.longitude)}
      />
    );
  }, [data]);

  const [temp, setTemp] = useState<any>();

  const debouncedCity = useDebounce(temp, 300);

  useEffect(() => {
    if (!globeActive) return;
    if (debouncedCity) {
      zoomInCity(temp, 'right');
    }
  }, [debouncedCity, globeRef]);

  const userTotalCount = data
    ? data?.reduce((acc, curr) => acc + curr.followers, 0) + baseData?.followers
    : 0;

  return (
    <div
      ref={scrollContainerRef}
      className="relative flex h-screen w-screen items-center bg-transparent scrollbar-hide"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: globeActive && !activeCity ? 1 : 0 }}
        transition={{ duration: 0.5, staggerChildren: 1 }}
        style={{
          pointerEvents: globeActive && !activeCity ? 'auto' : 'none',
        }}
        className="absolute left-0 top-1/2 z-[10] hidden h-1/2 -translate-y-1/2 flex-col items-start justify-start overflow-visible text-white transition-all padded-left mobile:flex"
      >
        <div className="relative h-full overflow-visible scrollbar-hide">
          <ExpandableCardDemo />
          {/* <Image
            src={batwLogo}
            alt="Base Around The World"
            width={400}
            className="min-w-[400px]"
          /> */}
          {/* <div className="flex w-full flex-col justify-start">
            {baseAroundTheWorld.map((d, i) => {
              const { channelId } = d;
              return (
                <motion.div
                  key={i}
                  onClick={() => !activeCity && setTemp(d)}
                  className={`group relative flex min-h-[min-content] w-full items-center justify-start overflow-visible rounded-sm px-1.5 py-1 text-base font-thin transition-all hover:bg-white hover:font-normal hover:text-black`}
                >
                  <span className="ml-1 whitespace-nowrap">{channelId}</span>
                </motion.div>
              );
            })}
          </div> */}
        </div>
      </motion.div>
      <div className="h-full w-full">
        <div
          className={`absolute z-0 ${
            ready ? 'opacity-100' : 'opacity-0'
          } h-screen w-screen transition-opacity`}
        >
          {memoizedGlobe}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: globeActive || about ? 0 : 1,
            pointerEvents: globeActive || about ? 'none' : 'auto',
          }}
          transition={{ staggerChildren: 0.2, staggerDirection: -1 }}
          className={`absolute top-[40%] z-[1000] flex w-full -translate-y-1/2 flex-col items-center justify-between gap-5 overflow-hidden bg-transparent py-20 transition-opacity duration-1000 se:top-[30%]`}
        >
          <div className="flex h-fit w-fit flex-col items-center text-white">
            <h1 className="flex w-full flex-col items-center justify-start gap-2 whitespace-pre-wrap text-center text-xl font-thin text-white se:text-2xl detail:mt-0 detail:flex detail:flex-row detail:whitespace-nowrap detail:text-3xl laptop:text-4xl">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0 }}
              >
                Bringing the world onchain,
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                a community of builders
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
              >
                on Base
              </motion.span>
            </h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: data && data?.length !== 0 ? 1 : 0 }}
              transition={{ delay: 1.4 }}
              className={`mt-3 block text-sm font-extralight text-gray-300 tablet:text-lg`}
            >
              {data?.length} countries, {userTotalCount} users on Warpcast
            </motion.div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: data && data?.length !== 0 ? 1 : 0 }}
              transition={{ delay: 1.4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                activateGlobe();
                setGlobeActive(true);
              }}
              onTouchStart={() => {
                activateGlobe();
                setGlobeActive(true);
              }}
              className={`mt-5 flex w-auto items-center rounded-lg bg-white px-3 py-1.5 text-xl text-black hover:bg-white/90 mobile:mt-10 mobile:text-2xl`}
            >
              Explore
            </motion.button>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: about ? 1 : 0,
            pointerEvents: about ? 'auto' : 'none',
            backdropFilter: about ? `blur(4px)` : `blur(20px)`,
            transition: {
              backdropFilter: { delay: about ? 1 : 0 },
              opacity: {
                delay: about ? 1 : 0,
              },
            },
          }}
          className={`absolute left-0 top-0 z-[1000] flex h-screen w-screen flex-col items-center justify-center padded-horizontal-wide`}
        >
          <div className="flex h-full w-full flex-col items-center justify-center text-white">
            <div className="mt-10 flex h-full flex-col items-center justify-center gap-5 mobile:mt-5 tablet:gap-[120px]">
              <div className="flex w-full max-w-full flex-col items-start justify-start gap-2 text-xl font-thin text-white tablet:max-w-[1000px] lg:gap-5">
                <div className="whitespace-nowrap text-xl font-semibold tablet:text-5xl">{`BASE\nIS FOR EVERYONE`}</div>
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
              <div className="flex w-full flex-col items-start justify-start gap-2 text-xl font-thin text-white tablet:max-w-[1000px] lg:gap-5">
                <div className="whitespace-nowrap text-xl font-semibold tablet:text-5xl">{`ONCHAIN SUMMER\nIS FOR EVERYONE`}</div>
                <div className="text-sm leading-tight mobile:text-xl">
                  Onchain Summer is a global movement calling on the ecosystem
                  to build and create projects that will usher in the next wave
                  of users onchain. To celebrate the diversity and creativity of
                  our Base Global Communities, creators worldwide created an NFT
                  collection to spread the word about Onchain Summer in their
                  native languages!
                </div>
                {/* <div className="text-base mobile:text-xl">
                  See the gallery on Coinbase Wallet web app:{' '}
                  <Link
                    className="underline"
                    href="https://wallet.coinbase.com/nft/gallery"
                    passHref
                  >
                    wallet.coinbase.com/nft/gallery/........
                  </Link>
                </div> */}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      {/* <List data={data} /> */}
    </div>
  );
}
