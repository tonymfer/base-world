"use client";

import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Icons } from "@/components/icons";

const MyProfileBtn = () => {
  const { isConnected, address } = useAccount();
  return (
    <>
      {isConnected && address && (
        <Button size="icon" variant="outline" asChild>
          <Link href={`/${address}`}>
            <Icons.user className="h-4 w-4" />
          </Link>
        </Button>
      )}
    </>
  );
};

export default MyProfileBtn;
