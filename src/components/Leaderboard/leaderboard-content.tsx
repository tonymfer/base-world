'use client';
import React from 'react';
import useApi from '@/hooks/useApi';
import { CountriesInfo } from 'types';
import { DataTable } from './data-table';
import { columns } from './columns';
import { useRouter } from 'next/navigation';

const LeaderboardContent = () => {
  const { data } = useApi({
    url: 'countries',
    method: 'GET',
  }) as {
    data: CountriesInfo[];
  };
  // HACK: update /base-arabic to have the correct coordinates to dubai in api
  const tempFixedData = data?.reduce((acc: GlobeDataType[], cur) => {
    const channelId = cur.channelId;
    if (channelId === 'base-arabic') {
      return [
        ...acc,
        {
          ...cur,
          longitude: 55.296249,
          latitude: 25.276987,
          countryName: 'UAE',
        },
      ];
    } else return [...acc, cur];
  }, []);

  const router = useRouter();

  return (
    <div className="mx-auto flex flex-col justify-center padded-horizontal-wide md:py-10">
      <div className="mb-4">
        <h2 className="mb-1 text-2xl font-bold tracking-tight">Leaderboard</h2>
        <p className="text-muted-foreground">
          Check out the activity and progress of base global communities.
        </p>
      </div>
      {data ? (
        <DataTable data={tempFixedData} columns={columns} />
      ) : (
        <h1>Loading data...</h1>
      )}
    </div>
  );
};

export default LeaderboardContent;
