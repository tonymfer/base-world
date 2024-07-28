"use client";

import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";
import Link from "next/link";
import { Icons } from "./icons";
import { Button } from "./ui/button";
import { useMapStore } from "../stores/map";
import { activateGlobe, deactivateGlobe } from "../utils/globe";
import { usePathname, useRouter } from "next/navigation";

const SideMenu = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const router = useRouter();
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <div className="flex items-center space-x-2 lg:hidden">
        <span className="flex items-center justify-center font-bold">
          <SheetTrigger>
            <Icons.menu />
          </SheetTrigger>
        </span>
      </div>
      <SheetContent className="z-[40000]" side="left">
        <SheetHeader>
          <SheetTitle className="text-center">
            <Link href="/">
              <Dialog.Close>
                <h1 className="focus:outline-none">BASE WORLD</h1>
              </Dialog.Close>
            </Link>
          </SheetTitle>
          <SheetDescription>
            <div className="flex flex-col items-start">
              <Button
                variant="ghost"
                className="text-sm tablet:text-base hover:bg-white hover:text-black"
                onClick={() => {
                  if (isHome) {
                    useMapStore.setState({
                      globeActive: true,
                      about: false,
                    });
                    setOpen(!open);
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
              {pathname !== "/leaderboard" && (
                <Button
                  className="text-sm tablet:text-base hover:bg-white hover:text-black"
                  onClick={() => {
                    deactivateGlobe(true);
                    setOpen(false);
                    useMapStore.setState({ about: true });
                  }}
                  variant="ghost"
                >
                  About
                </Button>
              )}
            </div>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default SideMenu;
