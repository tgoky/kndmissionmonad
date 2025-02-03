"use client";

import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Define TypeScript type for the character
interface Character {
  name: string;
  fullName: string;
  power: string;
  image: string;
}

// Define props type for ArenaGame
interface ArenaGameProps {
  selectedCharacter: Character;
}

const ArenaGame: React.FC<ArenaGameProps> = ({ selectedCharacter }) => {
  const gameRef = useRef(null);
  const [playerPosition, setPlayerPosition] = useState({ x: 50, y: 80 });
  const [obstacles, setObstacles] = useState<{ x: number; y: number; id: number }[]>([]);
  const [gems, setGems] = useState<{ x: number; y: number; id: number }[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setPlayerPosition(prev => {
        let newX = prev.x;
        let newY = prev.y;

        if (e.key === "ArrowLeft" && prev.x > 5) newX -= 5;
        if (e.key === "ArrowRight" && prev.x < 95) newX += 5;
        if (e.key === "ArrowUp" && prev.y > 5) newY -= 5;
        if (e.key === "ArrowDown" && prev.y < 95) newY += 5;

        return { x: newX, y: newY };
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setObstacles(prev => [...prev, { x: Math.random() * 90, y: 0, id: Math.random() }]);
    }, 1000);

    return () => clearInterval(interval);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setGems(prev => [...prev, { x: Math.random() * 90, y: Math.random() * 90, id: Math.random() }]);
    }, 3000);

    return () => clearInterval(interval);
  }, [gameOver]);

  useEffect(() => {
    const moveObstacles = setInterval(() => {
      setObstacles(prev => prev.map(ob => ({ ...ob, y: ob.y + 5 })));
    }, 100);

    return () => clearInterval(moveObstacles);
  }, []);

  useEffect(() => {
    obstacles.forEach(obstacle => {
      if (Math.abs(playerPosition.x - obstacle.x) < 5 && Math.abs(playerPosition.y - obstacle.y) < 5) {
        setGameOver(true);
        toast.error("Game Over! You got hit!");
      }
    });
  }, [obstacles, playerPosition]);

  useEffect(() => {
    setGems(prev =>
      prev.filter(gem => {
        if (Math.abs(playerPosition.x - gem.x) < 5 && Math.abs(playerPosition.y - gem.y) < 5) {
          setScore(prevScore => prevScore + 10);
          toast.success("+10 Points!");
          return false;
        }
        return true;
      }),
    );
  }, [playerPosition]);

  return (
    <div className="relative w-full h-screen bg-gray-900 overflow-hidden flex justify-center items-center">
      <h2 className="absolute top-4 text-white text-xl">Score: {score}</h2>
      {!gameOver && selectedCharacter && (
        <img
          src={selectedCharacter.image}
          alt="player"
          className="absolute w-16 h-16"
          style={{ left: `${playerPosition.x}%`, top: `${playerPosition.y}%` }}
        />
      )}
      {obstacles.map(obstacle => (
        <div
          key={obstacle.id}
          className="absolute w-6 h-6 bg-red-600 rounded-full"
          style={{ left: `${obstacle.x}%`, top: `${obstacle.y}%` }}
        ></div>
      ))}
      {gems.map(gem => (
        <div
          key={gem.id}
          className="absolute w-6 h-6 bg-yellow-400 rounded-full"
          style={{ left: `${gem.x}%`, top: `${gem.y}%` }}
        ></div>
      ))}
      {gameOver && <h1 className="absolute text-white text-3xl">Game Over!</h1>}
    </div>
  );
};

export default ArenaGame;
