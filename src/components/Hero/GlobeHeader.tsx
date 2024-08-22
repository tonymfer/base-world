'use client';
import BaseLogo from '@/components/base-logo';
import { useLandingStore } from '@/stores/landing';
import { useMapStore } from '@/stores/map';
import { activateGlobe, deactivateGlobe } from '@/utils/globe';
import Link from 'next/link';
import { Button } from '../ui/button';
import { usePathname, useRouter } from 'next/navigation';
import SideMenu from '../mobile-menu';

export default function GlobeHeader() {
  const ready = useMapStore((s) => s.ready);
  const about = useMapStore((s) => s.about);
  const activeCity = useMapStore((s) => s.activeCity);
  const globeActive = useMapStore((s) => s.globeActive);
  const mobile = useLandingStore((s) => s.mobile);
  const pathname = usePathname();
  const isHome = pathname === '/';
  const router = useRouter();
  return null;

  return (
    <div
      className={`${
        mobile
          ? 'pointer-events-auto opacity-100'
          : 'pointer-events-auto opacity-100'
      } fixed z-[30000] flex h-20 w-screen items-center justify-between overflow-visible pt-10 padded-horizontal-wide md:gap-8 lg:justify-start`}
    >
      <button
        // onMouseDown={() => {
        //   deactivateGlobe();
        // }}
        // onTouchStart={() => {
        //   deactivateGlobe();
        // }}
        className={`h-8 w-auto overflow-y-hidden tablet:h-10 ${
          !about && (!globeActive || !ready || activeCity)
            ? 'pointer-events-none opacity-100'
            : 'pointer-events-auto opacity-100'
        } `}
        style={{
          filter: 'drop-shadow(3px 5px 2px rgb(255 255 255 / 0.2))',
        }}
      >
        <BaseLogo />
      </button>
      {/* SideMenu - Mobile */}
      <SideMenu />
      <div className="hidden tablet:gap-1 lg:flex">
        <Button
          variant="ghost"
          className="text-sm hover:bg-white hover:text-black tablet:text-base"
          onClick={() => {
            if (isHome) {
              useMapStore.setState({
                globeActive: true,
                about: false,
              });
              activateGlobe();
            } else {
              activateGlobe();
              router.push('/');
            }
          }}
        >
          Home
        </Button>
        <Button
          asChild
          variant="ghost"
          className="text-sm hover:bg-white hover:text-black tablet:text-base"
        >
          <Link href="/leaderboard">Leaderboard</Link>
        </Button>
        {pathname !== '/leaderboard' && (
          <Button
            className="text-sm hover:bg-white hover:text-black tablet:text-base"
            onClick={() => {
              deactivateGlobe(true);
              useMapStore.setState({ about: true });
            }}
            variant="ghost"
          >
            About
          </Button>
        )}
      </div>
    </div>
  );
}
