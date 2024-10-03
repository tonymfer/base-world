'use client';
import Image from 'next/image';
import React, { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import africaLogo from '@/images/BATW_Devfolio_logo_Africa_600x600.png';
import indiaLogo from '@/images/BATW_Devfolio_logo_India_600x600.png';
import seaLogo from '@/images/BATW_Devfolio_logo_SEA_600x600.png';
import latamLogo from '@/images/BATW_Devfolio_logo_LatAm_600x600.png';
import africaHackImage from '@/images/BATW_Devfolio_featured_Africa_576x268.png';
import indiaHackImage from '@/images/BATW_Devfolio_featured_India_576x268.png';
import seaHackImage from '@/images/BATW_Devfolio_featured_SEA_576x268.png';
import latamHackImage from '@/images/BATW_Devfolio_featured_LatAm_576x268.png';
import { baseAroundTheWorld } from './Hero/baseAroundTheWorld';
import { zoomInCity } from '@/utils/globe';
import logo from '@/images/batw-logo.png';
import { barlowCondensed } from '@/app/font';

export function ExpandableCardDemo() {
  const [active, setActive] = useState<(typeof cards)[number] | boolean | null>(
    null,
  );
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setActive(false);
      }
    }

    if (active && typeof active === 'object') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <>
      <div className={`${barlowCondensed.className} text-4xl text-white`}>
        BASE AROUND THE WORLD
      </div>
      {/* <Image
        src={logo}
        alt="Base Around The World"
        width={300}
        className="min-w-[300px]"
      /> */}
      <AnimatePresence>
        {active && typeof active === 'object' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-10 h-full w-full bg-black/20"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === 'object' ? (
          <div className="absolute inset-0 z-[100] grid min-w-[500px] place-items-center">
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
                transition: {
                  duration: 0.05,
                },
              }}
              className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white lg:hidden"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="flex h-full w-full max-w-[500px] flex-col overflow-hidden sm:rounded-3xl md:h-fit md:max-h-[90%]"
            >
              <motion.div layoutId={`image-${active.title}-${id}`}>
                <Image
                  priority
                  width={600}
                  src={active.hackImage}
                  alt={active.title}
                  className="w-full object-contain sm:rounded-tl-lg sm:rounded-tr-lg"
                />
              </motion.div>

              <div className="bg-white">
                <div className="flex items-start justify-between p-4">
                  <div className="">
                    <motion.h3
                      layoutId={`title-${active.title}-${id}`}
                      className="text-lg font-bold text-neutral-700"
                    >
                      {active.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${active.description}-${id}`}
                      className="text-neutral-600"
                    >
                      {active.description}
                    </motion.p>
                  </div>

                  <motion.a
                    layoutId={`button-${active.title}-${id}`}
                    href={active.ctaLink}
                    target="_blank"
                    className="rounded-lg bg-[#3770FF] px-2.5 py-2 text-base font-bold text-white"
                  >
                    {active.ctaText}
                  </motion.a>
                </div>
                <div className="relative px-4 pt-4">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex h-40 flex-col items-start gap-4 overflow-auto pb-10 text-xs text-neutral-600 [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] md:h-fit md:text-sm lg:text-base"
                  >
                    {typeof active.content === 'function'
                      ? active.content()
                      : active.content}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <ul className="mx-auto mt-5 flex h-full w-full max-w-2xl flex-col justify-start gap-4">
        {cards.map((card) => (
          <motion.div
            layoutId={`card-${card.title}-${id}`}
            whileHover={{
              background: `linear-gradient(to right, ${card.data.color},  transparent)`,
            }}
            initial={{
              background: 'transparent',
            }}
            key={`card-${card.title}-${id}`}
            onClick={() => {
              setActive(card);
              zoomInCity(card.data, 'right');
            }}
            className="flex cursor-pointer flex-col items-center justify-between rounded-lg py-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 md:flex-row"
          >
            <div className="flex flex-col gap-4 md:flex-row">
              <motion.div layoutId={`image-${card.title}-${id}`}>
                <Image
                  width={150}
                  src={card.src}
                  alt={card.title}
                  className="h-40 w-40 rounded-lg object-cover object-top md:h-14 md:w-14"
                />
              </motion.div>
              <div className="">
                <motion.h3
                  layoutId={`title-${card.title}-${id}`}
                  className="text-center text-lg font-medium text-neutral-100 md:text-left"
                >
                  {card.title}
                </motion.h3>
                <motion.p
                  layoutId={`description-${card.description}-${id}`}
                  className="text-center text-neutral-600 dark:text-neutral-300 md:text-left"
                >
                  {card.description}
                </motion.p>
              </div>
            </div>
          </motion.div>
        ))}
      </ul>
    </>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};

const cards = [
  {
    description: '/base-africa',
    title: 'Based Africa',
    src: africaLogo,
    data: baseAroundTheWorld[0],
    hackImage: africaHackImage,
    ctaText: 'Devfolio',
    ctaLink: 'https://based-africa.devfolio.co/',
    content: () => {
      return (
        <p>
          Covering Thailand, Vietnam, Singapore, Laos, Cambodia, Myanmar,
          Indonesia, Brunei, Malaysia, and the Philippines, and co-presented by{' '}
          <a
            href="https://warpcast.com/~/channel/base-sea"
            rel="noreferrer"
            target="_blank"
            className="text-blue-500 underline underline-offset-2"
          >
            Base Southeast Asia
          </a>
          ,{' '}
          <a
            href="https://www.yieldguild.io/"
            rel="noreferrer"
            target="_blank"
            className="text-blue-500 underline underline-offset-2"
          >
            Yield Guild Games
          </a>
          ,{' '}
          <a
            href="https://www.bitkubcapital.com/"
            rel="noreferrer"
            target="_blank"
            className="text-blue-500 underline underline-offset-2"
          >
            Bitkub
          </a>
          , and{' '}
          <a
            href="https://coins.ph/"
            rel="noreferrer"
            target="_blank"
            className="text-blue-500 underline underline-offset-2"
          >
            Coins.ph
          </a>
          . Connect with builders across Southeast Asia on{' '}
          <a
            href="https://warpcast.com/~/channel/base-sea"
            rel="noreferrer"
            target="_blank"
            className="text-blue-500 underline underline-offset-2"
          >
            /base-sea
          </a>{' '}
          on Base Warpcast, and join #based-sea on the{' '}
          <a
            href="https://discord.com/invite/buildonbase"
            rel="noreferrer"
            target="_blank"
            className="text-blue-500 underline"
          >
            Base Discord
          </a>{' '}
          for dev support.
        </p>
      );
    },
  },
  {
    description: '/base-india',
    title: 'Based India',
    src: indiaLogo,
    data: baseAroundTheWorld[1],
    hackImage: indiaHackImage,
    ctaText: 'Devfolio',
    ctaLink: 'https://based-india.devfolio.co/',
    content: () => {
      return (
        <p>
          Focused on all of India and co-presented by{' '}
          <a
            href="https://warpcast.com/~/channel/base-india"
            rel="noreferrer"
            target="_blank"
          >
            Base India
          </a>{' '}
          (powered by{' '}
          <a
            href="https://warpcast.com/callusfbi"
            rel="noreferrer"
            target="_blank"
          >
            Farcaster Builders India
          </a>
          ),{' '}
          <a
            href="https://www.levitatelabs.xyz/"
            rel="noreferrer"
            target="_blank"
          >
            Levitate Labs
          </a>
          ,{' '}
          <a href="https://www.kgen.io/" rel="noreferrer" target="_blank">
            KGeN
          </a>{' '}
          and{' '}
          <a href="https://www.okto.tech/" rel="noreferrer" target="_blank">
            Okto by CoinDCX
          </a>
          . Get in touch with builders across India on{' '}
          <a
            href="https://warpcast.com/~/channel/base-india"
            rel="noreferrer"
            target="_blank"
          >
            /base-india
          </a>
          , and join #based-india on{' '}
          <a
            href="https://discord.com/invite/buildonbase"
            rel="noreferrer"
            target="_blank"
          >
            Discord
          </a>{' '}
          to get support building your product.
        </p>
      );
    },
  },

  {
    description: '/base-sea',
    title: 'Based SouthEast Asia',
    src: seaLogo,
    data: baseAroundTheWorld[2],
    hackImage: seaHackImage,
    ctaText: 'Devfolio',
    ctaLink: 'https://based-sea.devfolio.co/',
    content: () => {
      return (
        <p>
          Covering Thailand, Vietnam, Singapore, Laos, Cambodia, Myanmar,
          Indonesia, Brunei, Malaysia, and the Philippines, and co-presented by{' '}
          <a
            href="https://warpcast.com/~/channel/base-sea"
            rel="noreferrer"
            target="_blank"
            className="text-blue-500 underline underline-offset-2"
          >
            Base Southeast Asia
          </a>
          ,{' '}
          <a
            href="https://www.yieldguild.io/"
            rel="noreferrer"
            target="_blank"
            className="text-blue-500 underline underline-offset-2"
          >
            Yield Guild Games
          </a>
          ,{' '}
          <a
            href="https://www.bitkubcapital.com/"
            rel="noreferrer"
            target="_blank"
            className="text-blue-500 underline underline-offset-2"
          >
            Bitkub
          </a>
          , and{' '}
          <a
            href="https://coins.ph/"
            rel="noreferrer"
            target="_blank"
            className="text-blue-500 underline underline-offset-2"
          >
            Coins.ph
          </a>
          . Connect with builders across Southeast Asia on{' '}
          <a
            href="https://warpcast.com/~/channel/base-sea"
            rel="noreferrer"
            target="_blank"
            className="text-blue-500 underline underline-offset-2"
          >
            /base-sea
          </a>{' '}
          on Base Warpcast, and join #based-sea on the{' '}
          <a
            href="https://discord.com/invite/buildonbase"
            rel="noreferrer"
            target="_blank"
            className="text-blue-500 underline underline-offset-2"
          >
            Base Discord
          </a>{' '}
          for dev support.
        </p>
      );
    },
  },
  {
    description: '/base-latam',
    title: 'Based Latin America',
    src: latamLogo,
    data: baseAroundTheWorld[3],
    hackImage: latamHackImage,
    ctaText: 'Devfolio',
    ctaLink: 'https://based-latam.devfolio.co/',
    content: () => {
      return (
        <p>
          Spanning Central and South America, from Mexico to Argentina, and
          co-presented by{' '}
          <a
            href="https://baselatam.com/"
            rel="noreferrer"
            target="_blank"
            className="text-blue-500 underline"
          >
            Base LatAm
          </a>{' '}
          (
          <a
            href="https://www.odisea.xyz/"
            rel="noreferrer"
            target="_blank"
            className="text-blue-500 underline"
          >
            powered by Odisea
          </a>
          ) and{' '}
          <a
            href="https://buenbit.com/"
            rel="noreferrer"
            target="_blank"
            className="text-blue-500 underline"
          >
            Buenbit
          </a>
          . Meet builders across Latin America on{' '}
          <a
            href="https://warpcast.com/~/channel/base-latam"
            rel="noreferrer"
            target="_blank"
            className="text-blue-500 underline"
          >
            /base-latam
          </a>
          , and join #based-latam on{' '}
          <a
            href="https://discord.com/invite/buildonbase"
            rel="noreferrer"
            target="_blank"
            className="text-blue-500 underline"
          >
            Discord
          </a>{' '}
          for buildathon questions and updates.
        </p>
      );
    },
  },
];

<p>
  Covering Thailand, Vietnam, Singapore, Laos, Cambodia, Myanmar, Indonesia,
  Brunei, Malaysia, and the Philippines, and co-presented by{' '}
  <a
    href="https://warpcast.com/~/channel/base-sea"
    rel="noreferrer"
    target="_blank"
    className="text-blue-500 underline"
  >
    Base Southeast Asia
  </a>
  ,{' '}
  <a
    href="https://www.yieldguild.io/"
    rel="noreferrer"
    target="_blank"
    className="text-blue-500 underline"
  >
    Yield Guild Games
  </a>
  ,{' '}
  <a
    href="https://www.bitkubcapital.com/"
    rel="noreferrer"
    target="_blank"
    className="text-blue-500 underline"
  >
    Bitkub
  </a>
  , and{' '}
  <a
    href="https://coins.ph/"
    rel="noreferrer"
    target="_blank"
    className="text-blue-500 underline"
  >
    Coins.ph
  </a>
  . Connect with builders across Southeast Asia on{' '}
  <a
    href="https://warpcast.com/~/channel/base-sea"
    rel="noreferrer"
    target="_blank"
    className="text-blue-500 underline"
  >
    /base-sea
  </a>{' '}
  on Base Warpcast, and join #based-sea on the{' '}
  <a
    href="https://discord.com/invite/buildonbase"
    rel="noreferrer"
    target="_blank"
    className="text-blue-500 underline"
  >
    Base Discord
  </a>{' '}
  for dev support.
</p>;
