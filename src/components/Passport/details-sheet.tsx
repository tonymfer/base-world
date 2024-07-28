'use client';

import { zoomOutCity } from '@/utils/globe';
import queryString from 'query-string';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import moment from 'moment';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { circles } from '@/constants';
import { Event } from 'types';

import { useEffect, useState } from 'react';

import Link from 'next/link';
import { normalize } from 'viem/ens';
import { publicClient } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { usePassport } from '@/stores/passport';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useMapStore } from '@/stores/map';
import useApi from '@/hooks/useApi';
import { Button } from '../ui/button';

export function DetailsSheet() {
  const setActiveCityResponse = useMapStore(
    (state) => state.setActiveCityResponse,
  );
  const setActiveCity = useMapStore((state) => state.setActiveCity);
  const activeCity = useMapStore((state) => state.activeCity);

  const chosenCoordinates = usePassport((state) => state.chosenCoordinates);
  const handleOpenAndReset = usePassport((state) => state.handleOpenAndReset);
  const open = usePassport((state) => state.open);
  const currentEventId = usePassport((state) => state.currentEventId);

  const setFilteredEvents = usePassport((state) => state.setFilteredEvents);

  const chosenCountry = chosenCoordinates?.name?.toLowerCase();

  const { data } = useApi({
    url: 'countries',
    method: 'GET',
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
      channelUrl: string;
    }[];
  };

  const pathname = usePathname();
  const ensParams = pathname.substring(1);
  const [address, setAddress] = useState<string | null>('');

  useEffect(() => {
    async function getEnsAddress() {
      if (ensParams.includes('.eth')) {
        const addressFromEns = await publicClient.getEnsAddress({
          name: normalize(ensParams),
        });
        setAddress(addressFromEns);
      } else {
        setAddress(ensParams);
      }
    }

    if (ensParams !== null) {
      getEnsAddress();
    }
  }, [ensParams]);

  const cityData = circles.find((circle) => circle.country === chosenCountry);
  const cityDetails =
    (data &&
      data.find((city) => city.countryName.toLowerCase() === chosenCountry)) ||
    null;

  const attendees = cityData?.events.reduce(
    (acc: number, event: Event) => acc + (event.users?.length ?? 0),
    0,
  );

  const filteredEvents: Event[] = cityData ? cityData.events : [];

  useEffect(() => setFilteredEvents(filteredEvents), [filteredEvents]);

  // const [isMobile, setIsMobile] = useState(false);

  // // Function to detect if the user is on a mobile device
  // const checkMobileDevice = () => {
  //   const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  //   setIsMobile(isMobile);
  // };

  // useEffect(() => {
  //   checkMobileDevice();
  // }, []);

  return (
    <Sheet
      open={open}
      onOpenChange={(open: boolean) => {
        handleOpenAndReset(open);
        setActiveCity(null);
        setActiveCityResponse(null);
        if (activeCity) {
          zoomOutCity(activeCity);
        }
      }}
    >
      <SheetContent side="right" className="z-[40000] cursor-default px-0">
        <div className="space-y-3">
          <div className="space-y-3 px-6">
            <div>
              <div className="text-xl font-bold">
                {cityDetails?.countryName}
              </div>
              <Link
                href={cityDetails?.channelUrl || '#'}
                target="_blank"
                className="text-based hover:underline"
                rel="noreferrer noopener"
              >
                /{cityDetails?.channelId}
              </Link>
            </div>
            {/* <div className="font-thin">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
              porta ultricies risus eget luctus.
            </div> */}
            <div className="flex gap-4">
              {cityDetails?.followers && (
                <StatsItem title="Follows" value={cityDetails.followers} />
              )}
              {cityDetails?.casts && (
                <StatsItem title="Casts" value={cityDetails?.casts} />
              )}
              {/* {cityData?.events && cityData?.events.length > 0 && (
                <StatsItem title="Events" value={cityData?.events.length} />
              )} */}
              {/* {attendees && <StatsItem title="Attendees" value={attendees} />} */}
            </div>
            {cityData?.mintToSupportLink && (
              <Button className="w-full" size="sm" asChild>
                <Link
                  href={cityData.mintToSupportLink}
                  passHref
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {`Mint NFT to support /${cityDetails?.channelId}`}
                </Link>
              </Button>
            )}
          </div>
          <Tabs defaultValue="casts">
            <TabsList className="px-6">
              <TabsTrigger value="casts">Casts</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
            </TabsList>
            <TabsContent value="casts">
              <Casts />
            </TabsContent>
            <TabsContent value="events">
              <Events events={filteredEvents} />
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}

const StatsItem = ({ title, value }: { title: string; value: number }) => {
  return (
    <div className="flex gap-1 text-xs">
      <div>{value}</div>
      <div className="font-thin text-muted-foreground">{title}</div>
    </div>
  );
};

const Casts = () => {
  const activeCityResponse = useMapStore((state) => state.activeCityResponse);

  return (
    <ScrollArea className="h-[600px]">
      {activeCityResponse?.casts
        .slice()
        .sort((a, b) => {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        })
        .map((data, i) => (
          <CastItem data={data} key={activeCityResponse.id + '-' + i} />
        ))}
    </ScrollArea>
  );
};

type CastItemProps = {
  data: {
    id: number;
    createdAt: string;
    castHash: string;
    fid: number;
    username: string;
    pfp_url: string;
    text: string;
    timestamp: string;
    channelUrl: string;
    countryId: number;
  };
};

const CastItem = ({ data }: CastItemProps) => {
  const { id, username, pfp_url, text, fid, castHash, createdAt } = data;

  const shareQs = queryString.stringify({
    text: `this cast deserves some 👏`,
    'embeds[]': [
      `https://warpcast.com/${username}/${castHash}`,
      `https://tip.hunt.town/allowance/${fid}?t=${Date.now()}`,
    ],
  });

  const shareLink = `https://warpcast.com/~/compose?${shareQs}`;

  const time = moment(createdAt).fromNow();

  return (
    <div className="flex gap-2 border-b px-6 py-3">
      <Avatar>
        <AvatarImage
          src={`https://res.cloudinary.com/merkle-manufactory/image/fetch/c_fill,w_30,h_30/${pfp_url}`}
        />
        <AvatarFallback>AA</AvatarFallback>
      </Avatar>
      <div className="max-w-md">
        <div className="flex items-center gap-1">
          {/* <div className="font-bold">ayvee</div> */}
          <div className="text-sm font-thin text-muted-foreground">
            @{username}
          </div>
          <div className="text-xs font-thin text-muted-foreground">
            {`・${time}`}
          </div>
        </div>
        <div className="font-thin">{text}</div>
        <Link
          className="pointer-events-auto pt-2 text-[26px] text-xs hover:opacity-70"
          href={shareLink}
          target="_blank"
          rel="noreferrer noopener"
        >
          👏
        </Link>
      </div>
    </div>
  );
};

const Events = ({ events }: { events: Event[] }) => {
  return (
    <ScrollArea className="h-[500px]">
      {events.length === 0 ? (
        <div className="text-center font-thin text-muted-foreground">
          No events yet
        </div>
      ) : (
        events.map((event: Event, index: number) => (
          <EventItem key={index} event={event} />
        ))
      )}
    </ScrollArea>
  );
};

const EventItem = ({ event }: { event: Event }) => {
  const setSecondaryOpen = usePassport((state) => state.setSecondaryOpen);
  const secondaryOpen = usePassport((state) => state.secondaryOpen);
  const setCurrentEventId = usePassport((state) => state.setCurrentEventId);

  return (
    <div
      onClick={() => {
        setSecondaryOpen(!secondaryOpen);
        setCurrentEventId(event.id);
      }}
      className="flex cursor-pointer items-center gap-2 border-b px-6 py-3 hover:bg-muted"
    >
      <div className="h-10 w-10 rounded-full bg-based" />
      <div>
        <div className="text-xs font-thin text-muted-foreground">
          {event.date}
        </div>
        <div className="font-bold">{event.name}</div>
        <div className="text-xs font-thin text-muted-foreground">
          by {event.host}
        </div>
      </div>
    </div>
  );
};
