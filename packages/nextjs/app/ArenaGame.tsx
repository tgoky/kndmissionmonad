import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
  const [hasClaimed, setHasClaimed] = useState(false);
  const [playerPosition, setPlayerPosition] = useState({ x: 50, y: 80 });
  const [obstacles, setObstacles] = useState<{ x: number; y: number; id: number }[]>([]);
  const [gems, setGems] = useState<{ x: number; y: number; id: number; image: string }[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [pointSound, setPointSound] = useState<HTMLAudioElement | null>(null);
  const [gameOverSound, setGameOverSound] = useState<HTMLAudioElement | null>(null);
  const [gameStartSound, setGameStartSound] = useState<HTMLAudioElement | null>(null);
  const [floatingPoints, setFloatingPoints] = useState<{ id: number; x: number; y: number }[]>([]);
  const [exitGame, setExitGame] = useState(false);

  // Load sounds only on the client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      setPointSound(new Audio("/gamestart.mp3"));
      setGameOverSound(new Audio("/gameover.mp3"));
      setGameStartSound(new Audio("/stt.wav"));
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

  useEffect(() => {
    if (exitGame) {
      setTimeout(() => window.location.reload(), 500); // Simulate going to the main menu
    }
  }, [exitGame]);

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

  const handleExit = () => {
    if (score > 0 && !hasClaimed) {
      toast.info("You have earned tokens! Claim them before exiting.");
    } else {
      setExitGame(true);
    }
  };

  return (
    <div className="relative w-full h-screen bg-gray-900 overflow-hidden flex justify-center items-center">
      <motion.h2
        key={score} // Re-animates when score changes
        initial={{ scale: 1, opacity: 0.6 }}
        animate={{ scale: 1.4, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="absolute top-6 text-yellow-400 font-bold text-3xl tracking-widest drop-shadow-lg"
      >
        Score: {score}
      </motion.h2>

      <AnimatePresence>
        {floatingPoints.map(point => (
          <motion.div
            key={point.id}
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 0, y: -40 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute text-green-500 font-bold text-lg"
            style={{ left: `${point.x}%`, top: `${point.y}%` }}
          >
            +10
          </motion.div>
        ))}
      </AnimatePresence>

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

      {/* Game Over Modal */}
      {/* Game Over Modal */}
      <AnimatePresence>
        {gameOver && (
          <motion.div
            className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-80"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <motion.div
              className="bg-gray-900 text-white p-10 rounded-lg shadow-2xl border-4 border-yellow-400 flex flex-col items-center"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(255, 223, 0, 0.6)" }}
            >
              <motion.h1
                className="text-5xl font-extrabold text-red-500 drop-shadow-lg"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1.1, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut", type: "spring", stiffness: 120 }}
              >
                Game Over
              </motion.h1>
              <p className="mt-4 text-lg text-gray-300">
                Accumulated <span className="text-yellow-400 font-bold">$KND</span> Tokens:{" "}
                <span className="text-yellow-400 font-bold">{score}</span>
              </p>

              {/* Claim Button */}
              <motion.button
                onClick={() => setHasClaimed(true)}
                className="mt-6 bg-blue-500 hover:bg-green-500 text-white hover:text-black font-bold py-3 px-8 rounded-lg shadow-md border-2 border-yellow-300"
                whileHover={{
                  scale: 1.1,
                  backgroundColor: "rgb(255, 223, 0)",
                  color: "black",
                  boxShadow: "0px 0px 15px rgba(255, 223, 0, 0.8)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                Claim $KND
              </motion.button>

              {/* Restart Button (Initially Disabled) */}
              <motion.button
                onClick={restartGame}
                className={`mt-6 font-bold py-3 px-8 rounded-lg shadow-md border-2 border-yellow-300 
              ${hasClaimed ? "bg-blue-500 hover:bg-yellow-400 text-white hover:text-black" : "bg-gray-500 text-gray-300 cursor-not-allowed"}`}
                whileHover={hasClaimed ? { scale: 1.1, boxShadow: "0px 0px 15px rgba(255, 223, 0, 0.8)" } : {}}
                whileTap={hasClaimed ? { scale: 0.95 } : {}}
                disabled={!hasClaimed} // Disable when hasn't claimed
              >
                Restart
              </motion.button>
              <AnimatePresence>
                {exitGame && (
                  <motion.div
                    className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-80"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    onAnimationComplete={() => window.location.reload()} // Simulate navigation to the main menu
                  />
                )}
              </AnimatePresence>
              <motion.button
                onClick={handleExit}
                className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg"
                whileHover={{ scale: 1.1 }}
              >
                Exit to Main Menu
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
