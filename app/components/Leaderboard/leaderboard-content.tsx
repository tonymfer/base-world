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
    <div className="padded-horizontal-wide mx-auto md:py-10 flex flex-col justify-center">
      <div className="mb-4">
        <h2 className="text-2xl font-bold tracking-tight mb-1">Leaderboard</h2>
        <p className="text-muted-foreground">
          Check out the activity and progress of base global communities.
        </p>
      </div>
      {data ? (
        <DataTable data={data} columns={columns} />
      ) : (
        <h1>Loading data...</h1>
      )}
    </div>
  );
};

export default LeaderboardContent;
