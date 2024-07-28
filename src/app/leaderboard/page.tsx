import React from "react";
import LeaderboardContent from "@/components/Leaderboard/leaderboard-content";
import GlobeHeader from "@/components/Hero/GlobeHeader";

const Leaderboard = () => {
  return (
    <div>
      <GlobeHeader />
      <div className="pt-24">
        <LeaderboardContent />
      </div>
    </div>
  );
};

export default Leaderboard;
