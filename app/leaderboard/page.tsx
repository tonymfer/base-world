import React from "react";
import LeaderboardContent from "../components/Leaderboard/leaderboard-content";
import BaseLogo from "../components/base-logo";

const Leaderboard = () => {
  return (
    <div>
      <div className="container px-4 mx-auto h-[8vh] flex items-end justify-between">
        <BaseLogo />
      </div>
      <LeaderboardContent />
    </div>
  );
};

export default Leaderboard;
