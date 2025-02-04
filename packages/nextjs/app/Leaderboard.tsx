import React, { useEffect, useState } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

const generateRandomAddress = () => {
  const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let address = "0x";
  for (let i = 0; i < 40; i++) {
    address += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return address;
};

const generateRandomScore = () => Math.floor(Math.random() * 1000);

interface LeaderboardItem {
  walletAddress: string;
  score: number;
}

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const generateDummyLeaderboard = () => {
      const dummyLeaderboard: LeaderboardItem[] = [];
      for (let i = 0; i < 15; i++) {
        dummyLeaderboard.push({
          walletAddress: generateRandomAddress(),
          score: generateRandomScore(),
        });
      }
      dummyLeaderboard.sort((a, b) => b.score - a.score);
      setLeaderboard(dummyLeaderboard);
      setLoading(false);
    };

    generateDummyLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white py-10 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center text-orange-500">Leaderboard</h1>
      <h1 className="text-2xl font-bold mb-8 text-center text-green-500">
        <span className="animate-pulse text-green-400 font-bold">birdie winners: .... last 2 mins</span>
      </h1>
      {loading ? (
        <div className="text-center text-2xl">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full text-left border-separate border-spacing-2">
            <thead>
              <tr className="text-lg font-semibold text-gray-300">
                <th className="px-4 py-2">Rank</th>
                <th className="px-4 py-2">Wallet Address</th>
                <th className="px-4 py-2">Score</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((item, index) => (
                <tr key={index} className="bg-gray-800 hover:bg-gray-700 transition-all duration-300 rounded-lg">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2 text-sm">
                    {item.walletAddress.slice(0, 6)}...{item.walletAddress.slice(-4)}
                  </td>
                  <td className="px-4 py-2 flex items-center">
                    {item.score}
                    {index > 0 && item.score > leaderboard[index - 1].score ? (
                      <FaArrowUp style={{ marginLeft: "0.5rem", color: "rgb(34 197 94)" }} />
                    ) : index < leaderboard.length - 1 && item.score < leaderboard[index + 1].score ? (
                      <FaArrowDown style={{ marginLeft: "0.5rem", color: "rgb(239 68 68)" }} />
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
