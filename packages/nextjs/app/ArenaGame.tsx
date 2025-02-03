import React, { useEffect, useState } from "react";
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

const gemImages = [
  "/autumn.png",
  "/autumn2.png",
  "/autumn3.png",
  "/autumn4.png",
  "/autumn5.png",
  "/autumn6.png",
  "/autumn7.png",
];

const ArenaGame: React.FC<ArenaGameProps> = ({ selectedCharacter }) => {
  const [playerPosition, setPlayerPosition] = useState({ x: 50, y: 80 });
  const [obstacles, setObstacles] = useState<{ x: number; y: number; id: number }[]>([]);
  const [gems, setGems] = useState<{ x: number; y: number; id: number; image: string }[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [pointSound, setPointSound] = useState<HTMLAudioElement | null>(null);
  const [gameOverSound, setGameOverSound] = useState<HTMLAudioElement | null>(null);
  const [gameStartSound, setGameStartSound] = useState<HTMLAudioElement | null>(null);

  // Load sounds only on the client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      setPointSound(new Audio("/gamestart.mp3"));
      setGameOverSound(new Audio("/gameover.mp3"));
      setGameStartSound(new Audio("/restart.mp3"));
    }
  }, []);

  // Play game start sound on first load
  useEffect(() => {
    if (gameStartSound) {
      gameStartSound.preload = "auto";
      gameStartSound.play();
    }
  }, [gameStartSound]);

  // Handle keyboard movement
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

  // Spawn obstacles every second
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setObstacles(prev => [...prev, { x: Math.random() * 90, y: 0, id: Math.random() }]);
    }, 1000);

    return () => clearInterval(interval);
  }, [gameOver]);

  // Spawn gems every 3 seconds
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setGems(prev => [
        ...prev,
        {
          x: Math.random() * 90,
          y: Math.random() * 90,
          id: Math.random(),
          image: gemImages[Math.floor(Math.random() * gemImages.length)],
        },
      ]);
    }, 3000);

    return () => clearInterval(interval);
  }, [gameOver]);

  // Move obstacles downward
  useEffect(() => {
    const moveObstacles = setInterval(() => {
      setObstacles(prev => prev.map(ob => ({ ...ob, y: ob.y + 5 })));
    }, 100);

    return () => clearInterval(moveObstacles);
  }, []);

  // Check for collision with obstacles
  useEffect(() => {
    obstacles.forEach(obstacle => {
      if (Math.abs(playerPosition.x - obstacle.x) < 5 && Math.abs(playerPosition.y - obstacle.y) < 5) {
        setGameOver(true);
        if (gameOverSound) gameOverSound.play(); // Play game-over sound
        toast.error("Game Over! You got hit!");
      }
    });
  }, [obstacles, playerPosition, gameOverSound]);

  // Check for gem collection
  useEffect(() => {
    setGems(prev =>
      prev.filter(gem => {
        if (Math.abs(playerPosition.x - gem.x) < 5 && Math.abs(playerPosition.y - gem.y) < 5) {
          setScore(prevScore => prevScore + 10);
          toast.success("+10 Points!");
          if (pointSound) pointSound.play(); // Play sound on gem collection
          return false;
        }
        return true;
      }),
    );
  }, [playerPosition, pointSound]);

  // Restart the game
  const restartGame = () => {
    setGameOver(false);
    setPlayerPosition({ x: 50, y: 80 });
    setObstacles([]);
    setGems([]);
    setScore(0);
    if (gameStartSound) gameStartSound.play();
  };

  return (
    <div className="relative w-full h-screen bg-gray-900 overflow-hidden flex justify-center items-center">
      <h2 className="absolute top-4 text-white text-xl">Score: {score}</h2>

      {/* Player Character */}
      {!gameOver && selectedCharacter && (
        <img
          src={selectedCharacter.image}
          alt="player"
          className="absolute w-16 h-16"
          style={{ left: `${playerPosition.x}%`, top: `${playerPosition.y}%` }}
        />
      )}

      {/* Obstacles */}
      {obstacles.map(obstacle => (
        <div
          key={obstacle.id}
          className="absolute w-6 h-6 bg-red-600 rounded-full"
          style={{ left: `${obstacle.x}%`, top: `${obstacle.y}%` }}
        ></div>
      ))}

      {/* Gems */}
      {gems.map(gem => (
        <img
          key={gem.id}
          src={gem.image}
          alt="gem"
          className="absolute w-8 h-8"
          style={{ left: `${gem.x}%`, top: `${gem.y}%` }}
        />
      ))}

      {/* Game Over Screen */}
      {gameOver && (
        <div className="absolute flex flex-col items-center text-white text-3xl">
          <h1>Game Over!</h1>
          <button onClick={restartGame} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg">
            Restart
          </button>
        </div>
      )}

      {/* Mobile Touch Controls */}
      <div className="absolute bottom-5 flex space-x-2">
        <button
          onClick={() => setPlayerPosition(prev => ({ ...prev, x: prev.x - 5 }))}
          className="bg-gray-600 text-white px-3 py-2 rounded-lg"
        >
          ←
        </button>
        <button
          onClick={() => setPlayerPosition(prev => ({ ...prev, x: prev.x + 5 }))}
          className="bg-gray-600 text-white px-3 py-2 rounded-lg"
        >
          →
        </button>
        <button
          onClick={() => setPlayerPosition(prev => ({ ...prev, y: prev.y - 5 }))}
          className="bg-gray-600 text-white px-3 py-2 rounded-lg"
        >
          ↑
        </button>
        <button
          onClick={() => setPlayerPosition(prev => ({ ...prev, y: prev.y + 5 }))}
          className="bg-gray-600 text-white px-3 py-2 rounded-lg"
        >
          ↓
        </button>
      </div>
    </div>
  );
};

export default ArenaGame;
