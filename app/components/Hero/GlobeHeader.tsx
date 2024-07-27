"use client";
import BaseLogo from "@/app/components/base-logo";
import { useLandingStore } from "@/app/stores/landing";
import { useMapStore } from "@/app/stores/map";
import { activateGlobe, deactivateGlobe } from "@/app/utils/globe";
import Link from "next/link";
import { Button } from "../ui/button";
import { usePathname, useRouter } from "next/navigation";

export default function GlobeHeader() {
  const ready = useMapStore((s) => s.ready);
  const about = useMapStore((s) => s.about);
  const activeCity = useMapStore((s) => s.activeCity);
  const globeActive = useMapStore((s) => s.globeActive);
  const mobile = useLandingStore((s) => s.mobile);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const router = useRouter();

  return (
    <div
      className={`${
        mobile
          ? "pointer-events-auto opacity-100"
          : "pointer-events-auto opacity-100"
      } fixed z-[30000] md:gap-8 flex h-20 w-screen justify-between md:justify-start overflow-visible pt-10 padded-horizontal-wide items-center`}
    >
      <button
        // onMouseDown={() => {
        //   deactivateGlobe();
        // }}
        // onTouchStart={() => {
        //   deactivateGlobe();
        // }}
        className={`h-8 w-auto overflow-y-hidden tablet:h-10
        ${
          !about && (!globeActive || !ready || activeCity)
            ? "pointer-events-none opacity-100"
            : "pointer-events-auto opacity-100"
        }
          `}
        style={{
          filter: "drop-shadow(3px 5px 2px rgb(255 255 255 / 0.2))",
        }}
      >
        <BaseLogo />
      </button>
      <div className="flex tablet:gap-1">
        <Button
          variant="ghost"
          className="text-sm tablet:text-base hover:bg-white hover:text-black"
          onClick={() => {
            if (isHome) {
              useMapStore.setState({
                globeActive: true,
                about: false,
              });
              activateGlobe();
            } else {
              activateGlobe();
              router.push("/");
            }
          }}
        >
          Home
        </Button>
        <Button
          asChild
          variant="ghost"
          className="text-sm tablet:text-base hover:bg-white hover:text-black"
        >
          <Link href="/leaderboard">Leaderboard</Link>
        </Button>
        <Button
          className="text-sm tablet:text-base hover:bg-white hover:text-black"
          onClick={() => {
            deactivateGlobe(true);
            useMapStore.setState({ about: true });
          }}
          variant="ghost"
        >
          About
        </Button>
      </div>
    </div>
  );
}

export function Burger() {
  const burger = useLandingStore((state) => state.burger);
  const setBurger = useLandingStore((state) => state.setBurger);

  const handleChange = () => {
    setBurger(!burger);
  };

  function MenuItem({
    title,
    onClick,
  }: {
    title: string;
    onClick?: () => void;
  }) {
    return (
      <button
        disabled={disabled}
        onClick={() => {
          setBurger(false);
          onClick && onClick();
        }}
        className={`border-input-border flex h-[54px] w-full items-center justify-start border-b-[1px] border-primary border-opacity-20 bg-white px-4 text-start text-sm text-primary`}
      >
        <Link
          href={link}
          className="flex w-full items-center justify-center gap-3 text-xl"
        >
          {title}
        </Link>
      </button>
    );
  }

  return (
    <button
      onClick={handleChange}
      className="relative block mobile:hidden h-4 w-5 cursor-pointer"
    >
      <span
        className="absolute top-0 block h-[2px] w-full rounded-[9px] bg-black transition-all duration-500"
        style={{
          transform: burger ? "rotate(45deg)" : "rotate(0deg)",
          left: burger ? "2.5px" : "0",
          transformOrigin: "left center",
        }}
      />
      <span
        className="absolute left-0 top-1/2 block h-[2px] w-full -translate-y-1/2 rounded-[9px] bg-black transition-all duration-500"
        style={{
          opacity: burger ? 0 : 1,
        }}
      />
      <span
        className="absolute left-0 top-[100%] block h-[2px] w-full rounded-[9px] bg-black transition-all duration-500"
        style={{
          transform: burger ? "rotate(-45deg)" : "translateY(-100%)",
          left: burger ? "2.5px" : "0",
          top: burger ? "14px" : "",
          transformOrigin: "left center",
        }}
      />
    </button>
  );
}
