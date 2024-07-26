"use client";
import React from "react";
import useApi from "@/app/hooks/useApi";
import { CountriesInfo } from "@/types";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Button } from "../ui/button";
import { Icons } from "../icons";
import { useRouter } from "next/navigation";

const LeaderboardContent = () => {
  const { data } = useApi({
    url: "countries",
    method: "GET",
  }) as {
    data: CountriesInfo[];
  };

  const router = useRouter();

  return (
    <div className="container px-4 mx-auto py-5 md:py-10 flex flex-col justify-center">
      <h1 className="text-2xl mb-2 font-bold">
        <Button onClick={() => router.back()} className="px-2" variant="ghost">
          <Icons.chevronLeft className="h-4 w-4" />
        </Button>
        Leaderboard
      </h1>
      {data ? (
        <DataTable data={data} columns={columns} />
      ) : (
        <h1>Loading data...</h1>
      )}
    </div>
  );
};

export default LeaderboardContent;
