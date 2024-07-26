"use client";

import React, { useEffect } from "react";
import { Sheet, SheetContent, SheetOverlay } from "@/app/components/ui/sheet";
import { usePassport } from "@/app/stores/passport";
import Link from "next/link";
import UserList from "./user-list";
import SupportersList from "./supporters";
import { cn, copyToClipboard, zdk } from "@/lib/utils";
import { Attendees } from "@/types";
import { Button } from "../ui/button";
import { env } from "@/env.mjs";
import { Icons } from "../icons";
import { toast } from "sonner";

const EventSheet = () => {
  const secondaryOpen = usePassport((state) => state.secondaryOpen);
  const handleSecondaryOpenAndReset = usePassport(
    (state) => state.handleSecondaryOpenAndReset
  );
  const filteredEvents = usePassport((state) => state.filteredEvents);
  const currentEventId = usePassport((state) => state.currentEventId);
  const displayedEvent = filteredEvents.find(
    (event) => event.id === currentEventId
  );
  const mints = usePassport((state) => state.mints);
  const contract = usePassport((state) => state.contract);
  const setMints = usePassport((state) => state.setMints);
  const setContract = usePassport((state) => state.setContract);

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

    if (displayedEvent && displayedEvent.contract) {
      const contract = displayedEvent.contract.split("/")[0];
      fetchToken(contract);
    }
  }, [displayedEvent]);

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
      open={secondaryOpen}
      onOpenChange={(secondaryOpen: boolean) =>
        handleSecondaryOpenAndReset(secondaryOpen)
      }
    >
      <SheetContent
        hideOverlay
        side="right"
        className="z-[40000] px-0 cursor-default"
      >
        {displayedEvent ? (
          <>
            <SheetOverlay
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.1)",
                zIndex: -40000,
              }}
              asChild
              className="bg-transparent z-[-4000]"
              data-state="closed"
            />
            <div className="flex flex-col h-full justify-between">
              <div className="space-y-3">
                <div className="px-6 space-y-3">
                  <div>
                    <p className="text-gray-500 text-sm">
                      {displayedEvent.date}
                    </p>
                    <div className="text-2xl font-bold">
                      {displayedEvent.name}
                    </div>
                    <Link
                      href={"#"}
                      target="_blank"
                      className="text-based hover:underline"
                      rel="noreferrer noopener"
                    >
                      {displayedEvent.host}
                    </Link>
                  </div>
                  <div className="font-thin">{displayedEvent.description}</div>
                  <UserList
                    title="Attendees"
                    description="People who are attending this event"
                    users={displayedEvent?.users ?? []}
                  />
                  <SupportersList
                    title="SUPPORTERS"
                    supporters={mints as unknown as Attendees[]}
                    selectedEvent={displayedEvent.contract}
                    eventContract={contract}
                    description="Supporters of the event who minted the collectibles"
                  />
                </div>
              </div>
              <div className="px-5 flex w-full items-center gap-2">
                <Button
                  size="sm"
                  className={cn("w-full font-bold")}
                  disabled={!displayedEvent.contract}
                >
                  <Link
                    href={`${env.NEXT_PUBLIC_ZORA_URL}${displayedEvent.contract}`}
                    target="_blank"
                  >
                    MINT TO SUPPORT THIS EVENT
                  </Link>
                </Button>
                <Button
                  disabled={!displayedEvent.contract}
                  onClick={() =>
                    handleCopy(
                      `${env.NEXT_PUBLIC_ZORA_URL}${displayedEvent.contract}`
                    )
                  }
                  size="icon"
                  variant="ghost"
                >
                  <Icons.share className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>Data not yet available</>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default EventSheet;
