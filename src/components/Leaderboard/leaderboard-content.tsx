'use client';
import { useFixedGlobeData } from '../Hero/useCountries';
import { columns } from './columns';
import { DataTable } from './data-table';

const LeaderboardContent = () => {
  const data = useFixedGlobeData();

  return (
    <div className="mx-auto flex flex-col justify-center padded-horizontal-wide md:py-10">
      <div className="mb-4">
        <h2 className="mb-1 text-2xl font-bold tracking-tight">Leaderboard</h2>
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
