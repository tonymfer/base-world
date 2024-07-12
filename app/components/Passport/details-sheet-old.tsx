"use client";

import { Button } from "@/app/components/ui/button";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/app/components/ui/sheet";
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

export function DetailsSheet() {
  const router = useRouter();

  const chosenCoordinates = usePassport((state) => state.chosenCoordinates);
  const handleOpenAndReset = usePassport((state) => state.handleOpenAndReset);
  const open = usePassport((state) => state.open);

  const chosenCity = chosenCoordinates?.name?.toLowerCase();

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

  const cityData = circles.find((circle) => circle.city === chosenCity);
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
      }}
    >
      <SheetContent
        side="left"
        className="flex flex-col-reverse justify-between md:flex-row z-[40000]"
      >
        {isMobile && (
          <Button variant="outline" onClick={handleButtonClick}>
            {isStampVisible ? "Show Event" : "Show Stamp"}
          </Button>
        )}
        <div
          id="stamp"
          className="hidden h-[90vh] w-full flex-col gap-16 md:flex md:w-[40rem]"
        >
          {filteredEvents.map((event, index) => (
            <motion.div
              key={index}
              className={cn(
                "flex items-center text-lg font-semibold",
                index % 2 === 0 && "items-end"
              )}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 1,
                delay: index * 0.1,
                type: "spring",
                bounce: 0.5,
              }}
            >
              <div
                className={cn(
                  `mx-16 flex h-24 w-full cursor-pointer items-center justify-end gap-x-4`,
                  index % 2 === 0 && "flex-row-reverse"
                )}
                onClick={() => setSelectedEventId(event.id)}
              >
                <div className="flex flex-col justify-center">
                  <div>
                    {event.name && event.name.length > 20
                      ? event?.name.slice(0, 20) + "..."
                      : event.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {event.host && event.host.length > 40
                      ? event?.host.slice(0, 40) + "..."
                      : event.host}
                  </div>
                </div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 1,
                    type: "spring",
                    bounce: 0.5,
                  }}
                  whileHover={{ scale: 1.05, transition: { delay: 0 } }}
                >
                  <Image
                    src={
                      eventIds.includes(event.id) ||
                      tempEventIds.includes(event.id)
                        ? "/images/active.png"
                        : "/images/inactive-event.png"
                    }
                    alt="Event Stamp"
                    width={100}
                    height={100}
                  />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
        <div
          id="event"
          className="hidden h-screen w-full md:block md:w-[384px]"
        >
          <>
            {selectedEvent && (
              <>
                <SheetHeader className="w-[20rem] px-1">
                  <SheetTitle>
                    <div className="text-xs text-muted-foreground">
                      {selectedEvent.date}
                    </div>
                    <div className="text-xl font-bold">
                      {selectedEvent.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      by{" "}
                      <span className="text-primary underline">
                        {selectedEvent.host}
                      </span>
                    </div>
                  </SheetTitle>
                  <div className="flex w-full items-center gap-2">
                    <Button
                      size="sm"
                      className={cn("w-full font-bold")}
                      disabled={!selectedEvent.contract}
                    >
                      <Link
                        href={`${env.NEXT_PUBLIC_ZORA_URL}${selectedEvent.contract}`}
                        target="_blank"
                      >
                        MINT TO SUPPORT
                      </Link>
                    </Button>
                    <Button
                      disabled={!selectedEvent.contract}
                      onClick={() =>
                        handleCopy(
                          `${env.NEXT_PUBLIC_ZORA_URL}${selectedEvent.contract}`
                        )
                      }
                      size="icon"
                      variant="ghost"
                    >
                      <Icons.share className="h-4 w-4" />
                    </Button>
                  </div>
                </SheetHeader>
                <ScrollArea className="mt-8 h-[80vh]">
                  <SheetDescription>
                    {selectedEvent.description}
                  </SheetDescription>
                  <ImageSlider />
                  <UserList
                    title="ATTENDEES"
                    users={selectedEvent.users || []}
                    description="Ticket holders who attended the event"
                  />
                  <SupportersList
                    title="SUPPORTERS"
                    supporters={mints || []}
                    selectedEvent={selectedEvent.contract}
                    eventContract={contract}
                    description="Supporters of the event who minted the collectibles"
                  />
                </ScrollArea>
              </>
            )}
          </>
        </div>

        {/* ------------ MOBILE ----------------- */}
        {isStampVisible ? (
          <div
            id="stamp"
            className="flex h-screen w-full flex-col gap-y-5 overflow-x-hidden md:hidden md:w-[40rem]"
          >
            {filteredEvents.map((event, index) => (
              <motion.div
                key={index}
                className={cn("flex w-full items-center text-lg font-semibold")}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 1,
                  delay: index * 0.1,
                  type: "spring",
                  bounce: 0.5,
                }}
              >
                <div
                  className={cn(
                    `flex h-24 w-full cursor-pointer items-center justify-end gap-x-4`,
                    index % 2 === 0 && "flex-row-reverse"
                  )}
                  onClick={() => {
                    setSelectedEventId(event.id);
                    handleButtonClick();
                  }}
                >
                  <div className="flex flex-col justify-center">
                    <div>
                      {event.name && event.name.length > 20
                        ? event.name.slice(0, 20) + "..."
                        : event.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {event.host && event.host.length > 40
                        ? event?.host.slice(0, 40) + "..."
                        : event.host}
                    </div>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 1,
                      type: "spring",
                      bounce: 0.5,
                    }}
                    whileHover={{ scale: 1.05, transition: { delay: 0 } }}
                  >
                    <Image
                      src={
                        eventIds.includes(event.id) ||
                        tempEventIds.includes(event.id)
                          ? "/images/active.png"
                          : "/images/inactive-event.png"
                      }
                      alt="Event Stamp"
                      width={70}
                      height={70}
                    />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div id="event" className="flex w-full flex-1 flex-col md:hidden">
            {selectedEvent && (
              <>
                <div className="flex w-full flex-col px-1">
                  <SheetHeader>
                    <SheetTitle className="text-left">
                      <div className="text-xs text-muted-foreground">
                        {selectedEvent.date}
                      </div>
                      <div className="text-xl font-bold">
                        {selectedEvent.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        by{" "}
                        <span className="text-primary underline">
                          {selectedEvent.host}
                        </span>
                      </div>
                    </SheetTitle>
                    <div className="flex w-full items-center gap-2">
                      <Button
                        size="sm"
                        className={cn("w-full font-bold")}
                        disabled={!selectedEvent.contract}
                      >
                        <Link
                          href={`${env.NEXT_PUBLIC_ZORA_URL}${selectedEvent.contract}`}
                          target="_blank"
                        >
                          MINT TO SUPPORT
                        </Link>
                      </Button>
                      <Button size="icon" variant="ghost" disabled>
                        <Icons.share className="h-4 w-4" />
                      </Button>
                    </div>
                  </SheetHeader>
                </div>
                <ScrollArea className="mt-2 h-[50vh] grow overflow-auto px-2">
                  <SheetDescription>
                    {selectedEvent.description}
                  </SheetDescription>
                  <ImageSlider />
                  <UserList
                    title="ATTENDEES"
                    users={selectedEvent.users || []}
                    description="Ticket holders who attended the event"
                  />
                  <SupportersList
                    title="SUPPORTERS"
                    supporters={mints || []}
                    user={address}
                    selectedEvent={selectedEvent.contract}
                    eventContract={contract}
                    description="Supporters of the event who minted the collectibles"
                  />
                </ScrollArea>
              </>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
