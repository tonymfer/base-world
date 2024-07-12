"use client";

import { zoomInCity, zoomOutCity } from "@/app/utils/globe";

import queryString from "query-string";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";

import moment from "moment";

import { Sheet, SheetContent } from "@/app/components/ui/sheet";
import { ImageSlider } from "./image-slider";
import UserList from "./user-list";
import { Icons } from "../icons";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import Image from "next/image";
import { circles } from "@/app/constants";

import { Attendees, Coordinates, Event } from "@/types";

import { useEffect, useState } from "react";

import Link from "next/link";
import { normalize } from "viem/ens";
import { cn, publicClient, zdk } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { env } from "@/env.mjs";
import { motion } from "framer-motion";
import SupportersList from "./supporters";
import { copyToClipboard } from "@/lib/utils";
import { toast } from "sonner";
import { usePassport } from "@/app/stores/passport";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useMapStore } from "@/app/stores/map";
import useApi from "@/app/hooks/useApi";

export function DetailsSheet() {
  const setActiveCityResponse = useMapStore(
    (state) => state.setActiveCityResponse
  );
  const setActiveCity = useMapStore((state) => state.setActiveCity);
  const activeCity = useMapStore((state) => state.activeCity);

  const chosenCoordinates = usePassport((state) => state.chosenCoordinates);
  const handleOpenAndReset = usePassport((state) => state.handleOpenAndReset);
  const open = usePassport((state) => state.open);

  const chosenCity = chosenCoordinates?.name?.toLowerCase();

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
      channelUrl: string;
    }[];
  };

  const pathname = usePathname();
  const ensParams = pathname.substring(1);
  const [address, setAddress] = useState<string | null>("");

  useEffect(() => {
    async function getEnsAddress() {
      if (ensParams.includes(".eth")) {
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

  let cityData = circles.find((circle) => circle.city === chosenCity);
  let cityDetails =
    (data &&
      data.find((city) => city.countryName.toLowerCase() === chosenCity)) ||
    null;

  console.log("cityData: ", cityData);
  console.log("cityDetails: ", cityDetails);

  const attendees = cityData?.events.reduce(
    (acc: number, event: Event) => acc + (event.users?.length ?? 0),
    0
  );

  const filteredEvents: Event[] = cityData ? cityData.events : [];

  const [selectedEventId, setSelectedEventId] = useState<number | null>(0);
  const selectedIndex = filteredEvents.findIndex(
    (event) => event.id === selectedEventId
  );
  const selectedEvent: Event = filteredEvents[selectedIndex];

  // check if user has attended an event
  let eventIds: number[] = [];
  if (address) {
    filteredEvents.forEach((event: Event) => {
      event.users?.forEach((user: Attendees) => {
        if (user.address && user.address !== null && user.address === address) {
          eventIds.push(event.id);
        }
      });
    });
  }

  const [isStampVisible, setIsStampVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const handleButtonClick = () => {
    setIsStampVisible(!isStampVisible);
  };

  // Function to detect if the user is on a mobile device
  const checkMobileDevice = () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setIsMobile(isMobile);
  };

  useEffect(() => {
    checkMobileDevice();
  }, []);

  const [mints, setMints] = useState([]);
  const [contract, setContract] = useState<string | null>(null);

  useEffect(() => {
    async function fetchToken(collectionAddress: string) {
      try {
        const {
          mints: { nodes },
        } = await zdk.mints({
          where: {
            collectionAddresses: [collectionAddress],
          },
        });
        const owner = nodes.map((node) => node.mint.toAddress);
        const eventContract = `${nodes[0].mint.collectionAddress}/${nodes[0].mint.tokenId}`;
        setContract(eventContract);
        setMints(owner as any);
      } catch (error) {
        console.error(error);
      }
    }

    if (selectedEvent && selectedEvent.contract) {
      const contract = selectedEvent.contract.split("/")[0];
      fetchToken(contract);
    }
  }, [selectedEvent]);

  // check if supporters are in the event
  let tempEventIds: number[] = [];
  if (filteredEvents.length > 0 && filteredEvents[0].contract !== undefined) {
    filteredEvents.forEach((event: Event) => {
      if (
        contract === event.contract &&
        address &&
        mints.includes(address.toLowerCase() as never)
      ) {
        tempEventIds.push(event.id);
      }
    });
  }

  const handleCopy = async (link: string) => {
    try {
      await copyToClipboard(link);
      toast.success("Copied!", {
        position: "bottom-right",
        duration: 1000,
      });
    } catch (error) {
      toast.error("Failed to copy text"); // Show error toast
    }
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(open: boolean) => {
        handleOpenAndReset(open);
        setSelectedEventId(0);
        setActiveCity(null);
        setActiveCityResponse(null);
        zoomOutCity(activeCity as NonNullable<typeof activeCity>);
      }}
    >
      <SheetContent side="right" className="z-[40000] px-0 cursor-default">
        <div className="space-y-3">
          <div className="px-6 space-y-3">
            <div>
              <div className="text-xl font-bold">
                {cityDetails?.countryName}
              </div>
              <Link
                href={cityDetails?.channelUrl || "#"}
                target="_blank"
                className="text-based hover:underline"
                rel="noreferrer noopener"
              >
                /{cityDetails?.channelId}
              </Link>
            </div>
            <div className="font-thin">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
              porta ultricies risus eget luctus.
            </div>
            <div className="flex gap-4">
              {cityDetails?.followers && (
                <StatsItem title="Follows" value={cityDetails.followers} />
              )}
              {cityDetails?.casts && (
                <StatsItem title="Casts" value={cityDetails?.casts} />
              )}
              {cityData?.events && cityData?.events.length > 0 && (
                <StatsItem title="Events" value={cityData?.events.length} />
              )}
              {attendees && <StatsItem title="Attendees" value={attendees} />}
            </div>
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
      <div className="text-muted-foreground font-thin">{title}</div>
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
          <CastItem data={data} key={activeCityResponse.id + "-" + i} />
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
    "embeds[]": [
      `https://warpcast.com/${username}/${castHash}`,
      `https://tip.hunt.town/allowance/${fid}?t=${Date.now()}`,
    ],
  });

  const shareLink = `https://warpcast.com/~/compose?${shareQs}`;

  const time = moment(createdAt).fromNow();

  return (
    <div className="flex gap-2 border-b py-3 px-6">
      <Avatar>
        <AvatarImage
          src={`https://res.cloudinary.com/merkle-manufactory/image/fetch/c_fill,w_30,h_30/${pfp_url}`}
        />
        <AvatarFallback>AA</AvatarFallback>
      </Avatar>
      <div className="max-w-md">
        <div className="flex gap-1 items-center">
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
          className="text-[26px] pointer-events-auto pt-2 text-xs hover:opacity-70"
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
        <div className="text-center text-muted-foreground font-thin">
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
  return (
    <div className="flex gap-2 border-b py-3 items-center hover:bg-muted px-6">
      <div className="bg-based w-10 h-10 rounded-full" />
      <div>
        <div className="text-xs font-thin text-muted-foreground">
          {event.date}
        </div>
        <div className="font-bold">{event.name}</div>
        <div className="font-thin text-xs text-muted-foreground">
          by {event.host}
        </div>
      </div>
    </div>
  );
};
