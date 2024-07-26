"use client";

import { CountriesInfo } from "@/types";
import { CellContext, ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { ArrowUpDown } from "lucide-react";
import Link from "next/link";

export const columns: ColumnDef<CountriesInfo>[] = [
  {
    accessorKey: "channelId",
    header: "Channel ID",
    // In case we ever want to change this to link to the channel page, we do it here
    cell: ({ row }) => `/${row.original.channelId}`,
  },
  {
    accessorKey: "countryName",
    header: "Country",
  },
  {
    accessorKey: "followers",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0 text-xs md:text-sm"
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
          className="px-0 text-xs md:text-sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Casts
          <ArrowUpDown className="ml-1 h-3 w-3 md:w-4 md:h-4" />
        </Button>
      );
    },
  },
];
