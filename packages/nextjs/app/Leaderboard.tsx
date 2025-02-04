import React, { useEffect, useState } from "react";
import gsap from "gsap";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

interface LeaderboardItem {
  walletAddress: string;
  score: number;
}

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch leaderboard data
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const response = await fetch("/api/leaderboard"); // Example API endpoint
        const data = await response.json();
        setLeaderboard(data);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);

  // Animate the table rows using gsap
  useEffect(() => {
    if (leaderboard.length > 0) {
      gsap.fromTo(".leaderboard-row", { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.5 });
    }
  }, [leaderboard]);

  return (
    <div className="min-h-screen bg-gray-900 text-white py-10 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Leaderboard</h1>

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
                <tr
                  key={index}
                  className="leaderboard-row bg-gray-800 hover:bg-gray-700 transition-all duration-300 rounded-lg"
                >
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2 text-sm">
                    {item.walletAddress.slice(0, 6)}...{item.walletAddress.slice(-4)}
                  </td>
                  <td className="px-4 py-2 flex items-center">
                    {item.score}
                    {index > 0 && item.score > leaderboard[index - 1].score ? (
                      <FaArrowUp className="ml-2 text-green-500" />
                    ) : index < leaderboard.length - 1 && item.score < leaderboard[index + 1].score ? (
                      <FaArrowDown className="ml-2 text-red-500" />
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
