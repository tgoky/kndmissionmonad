import React, { useEffect, useState } from "react";
import { ArrowDownCircleIcon, ArrowUpCircleIcon } from "@heroicons/react/24/solid";

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
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black text-white py-10 px-4 font-mono">
      {/* Title */}
      <h1 className="text-5xl font-extrabold mb-8 text-center text-yellow-400 drop-shadow-[4px_4px_0px_rgba(255,50,0,1)] uppercase tracking-widest">
        Leaderboard
      </h1>

      {/* Blinking Birdie Winners */}
      <h1 className="text-2xl font-extrabold mb-8 text-center text-green-500">
        <span className="animate-pulse text-green-400 font-extrabold">there is no leaderboard.... i love you</span>
      </h1>

      {loading ? (
        <div className="text-center text-3xl font-extrabold text-yellow-400 animate-pulse">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full text-left border-separate border-spacing-2 border-[3px] border-yellow-300 rounded-lg">
            <thead>
              <tr className="text-lg font-extrabold text-yellow-400 uppercase tracking-wider bg-gradient-to-r from-gray-800 to-gray-700 border-b-4 border-yellow-300">
                <th className="px-6 py-3">Rank</th>
                <th className="px-6 py-3">Wallet Address</th>
                <th className="px-6 py-3">Score</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((item, index) => (
                <tr
                  key={index}
                  className="bg-gray-900 hover:bg-gray-800 transition-all duration-300 border-b-2 border-yellow-300 shadow-md"
                >
                  <td className="px-6 py-3 text-yellow-300 font-bold text-lg drop-shadow-lg">{index + 1}</td>
                  <td className="px-6 py-3 text-lg text-blue-400 font-bold">
                    {item.walletAddress.slice(0, 6)}...
                    {item.walletAddress.slice(-4)}
                  </td>
                  <td className="px-6 py-3 flex items-center text-lg font-extrabold text-green-400">
                    {item.score}
                    {index > 0 && item.score > leaderboard[index - 1].score ? (
                      <ArrowUpCircleIcon className="ml-2 text-green-500 animate-bounce" />
                    ) : index < leaderboard.length - 1 && item.score < leaderboard[index + 1].score ? (
                      <ArrowDownCircleIcon className="ml-2 text-red-500 animate-bounce" />
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
