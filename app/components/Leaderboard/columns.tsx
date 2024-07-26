"use client";

import { CountriesInfo } from "@/types";
import { CellContext, ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { ArrowUpDown } from "lucide-react";
import Link from "next/link";

export const columns: ColumnDef<CountriesInfo>[] = [
  {
    accessorKey: "channelId",
    header: "Channel",
    // In case we ever want to change this to link to the channel page, we do it here
    //
    cell: ({ row }) => {
      return (
        <Link
          href={`https://warpcast.com/~/channel/${row.original.channelId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="min-w-40 underline hover:text-primary"
        >{`/${row.original.channelId}`}</Link>
      );
    },
  },
  {
    accessorKey: "countryName",
    header: "Country",
    cell: ({ row }) => {
      return <div className="min-w-40">{row.original.countryName}</div>;
    },
  },
  {
    accessorKey: "followers",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="-ml-5 text-xs md:text-sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Followers
          <ArrowUpDown className="ml-1 h-3 w-3 md:w-4 md:h-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "casts",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="-ml-5 text-xs md:text-sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Casts
          <ArrowUpDown className="ml-1 h-3 w-3 md:w-4 md:h-4" />
        </Button>
      );
    },
  },
];
