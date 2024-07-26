"use client";
import BaseLogo from "@/app/components/base-logo";
import { useLandingStore } from "@/app/stores/landing";
import { useMapStore } from "@/app/stores/map";
import { deactivateGlobe } from "@/app/utils/globe";
import Link from "next/link";
import { Button } from "../ui/button";

export default function GlobeHeader() {
  const setBurgerVisible = useLandingStore((s) => s.setBurgerVisible);
  const burgerVisible = useLandingStore((state) => state.burgerVisible);
  const ready = useMapStore((s) => s.ready);
  const globeActive = useMapStore((s) => s.globeActive);
  const activeCity = useMapStore((s) => s.activeCity);
  const mobile = useLandingStore((s) => s.mobile);

  return (
    <div
      className={`${
        burgerVisible || mobile
          ? "pointer-events-auto opacity-100"
          : "pointer-events-auto opacity-100"
      } fixed z-[30000] flex h-20 w-screen justify-between overflow-visible pt-10 padded-horizontal-wide`}
    >
      <button
        onMouseDown={() => {
          deactivateGlobe();
          setBurgerVisible(false);
        }}
        onTouchStart={() => {
          deactivateGlobe();
          setBurgerVisible(false);
        }}
        className={`h-8 w-auto overflow-y-hidden tablet:h-10
        ${
          !globeActive || !ready || activeCity
            ? "pointer-events-none opacity-100"
            : "pointer-events-auto opacity-100"
        }
          `}
        style={{
          filter: "drop-shadow(3px 5px 2px rgb(255 255 255 / 0.2))",
        }}
        // style={
        //   !activeCity
        //     ? {
        //         filter: "drop-shadow(3px 5px 2px rgb(0 0 0 / 0.7))",
        //       }
        //     : {}
        // }
      >
        <BaseLogo />
      </button>
      <Button
        className="uppercase flex items-start text-sm text-gray-400 md:hidden"
        variant="link"
      >
        <Link href="/leaderboard">Leaderboard</Link>
      </Button>

      {/* <div className="flex flex-col text-xs gap-1 items-center justify-center">
        <div className="text-white">made with ♥️ by</div>
        <div className="flex items-center justify-center gap-1">
          <a
            href="https://warpcast.com/to"
            rel="noopener noreferrer"
            target="_blank"
            className="px-2 py-1 w-fit rounded-lg bg-[#472A91] text-white text-xs"
          >
            @to
          </a>
          <a
            href="https://warpcast.com/undefined"
            rel="noopener noreferrer"
            target="_blank"
            className="px-2 py-1 w-fit rounded-lg bg-[#472A91] text-white text-xs"
          >
            @undefined
          </a>
        </div>
      </div> */}
      {/* <SideMenu /> */}
    </div>
  );
}
