"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Icons } from "@/components/icons";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useModal } from "connectkit";
import { AddressForm } from "./address-form";
import { DialogClose } from "@radix-ui/react-dialog";

export function LoginDialog({ address }: { address: string }) {
  const { isConnected } = useAccount();
  const [open, setOpen] = useState(true);
  const { setOpen: setModalOpen } = useModal();

  useEffect(() => {
    if (isConnected || address) {
      setOpen(false);
    }
  }, [isConnected, address]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex w-full items-center gap-2">
            <Icons.logo className="h-7" />
            <div className="text-3xl font-semibold text-primary">PASSPORT</div>
          </DialogTitle>
          <DialogDescription>
            View every based event you have attended or supported.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          <AddressForm />
          <div className="text-sm text-muted-foreground">OR</div>
          <Button
            onClick={() => {
              setModalOpen(true);
            }}
            className="w-full font-bold"
          >
            CONNECT WALLET
          </Button>
        </div>
        <DialogClose asChild>
          <Button className="w-full font-bold" variant="outline">
            JUST EXPLORE
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
