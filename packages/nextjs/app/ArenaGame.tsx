import React, { useEffect, useState } from "react";
import contractABI from "./abi/ards.json";
import mbABI from "./abi/mb.json";
import { ethers } from "ethers";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Define TypeScript type for the character
// Define TypeScript type for the character
interface Character {
  name: string;
  fullName: string;
  power: string;
  image: string;
  background: string; // Add background property
}

const contractAddress = "0x706e51256096F5aabA58A55B4e2B17416968E7D2";

const mb = "0xCF078031f890Ed361442e09ebA6Ec255A47d6E72";

const getMB = () => {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("Ethereum provider not found");
  }

  // Use Web3Provider for connecting to MetaMask
  const provider = new ethers.providers.Web3Provider(window.ethereum); // This is a Web3Provider, not a generic Provider

  // Get the signer (which is needed for sending transactions)
  const signer = provider.getSigner();

  return new ethers.Contract(mb, mbABI, signer);
};

const getContract = () => {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("Ethereum provider not found");
  }

  // Use Web3Provider for connecting to MetaMask
  const provider = new ethers.providers.Web3Provider(window.ethereum); // This is a Web3Provider, not a generic Provider

  // Get the signer (which is needed for sending transactions)
  const signer = provider.getSigner();

  return new ethers.Contract(contractAddress, contractABI, signer);
};

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

  const backgroundImage = selectedCharacter.background;

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

  const handleClaim = async (score: number) => {
    try {
      // Get the contract
      const contract = getContract(); // Ensure getContract is correctly set up

      // Get the provider from the window.ethereum object (Web3Provider)
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      // Get the signer (connected wallet) from the provider
      const signer = provider.getSigner();

      // Get the player's address (signer's address)
      const playerAddress = await signer.getAddress();

      // Call the contract's handleClaim function, passing the player address and score
      const tx = await contract.handleClaim(playerAddress, score);

      // Wait for the transaction to be mined
      await tx.wait();

      // Disable claim button and show restart button
      setHasClaimed(true);

      // Notify the user of the successful claim
      toast.success("Reward claimed successfully!");
    } catch (error) {
      toast.error("There was an error claiming the reward.");
      console.error(error);
    }
  };

  const [balance, setBalance] = useState<number>(0);

  // Function to fetch token balance
  const fetchBalance = async () => {
    try {
      const contract = getMB();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const playerAddress = await signer.getAddress();

      // Call the contract method to get the balance
      const balanceBigNumber = await contract.balanceOf(playerAddress);

      // Convert balance from BigNumber to a readable format
      const balanceFormatted = ethers.utils.formatUnits(balanceBigNumber, 18); // Assuming 18 decimals
      setBalance(parseFloat(balanceFormatted));
    } catch (error) {
      console.error("Error fetching balance:", error);
      toast.error("Failed to fetch token balance.");
    }
  };

  // Fetch balance on mount and when score changes
  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      fetchBalance();
    }
  }, [score]); // Update when the score changes

  // Restart the game
  const restartGame = () => {
    setGameOver(false);
    setPlayerPosition({ x: 50, y: 80 });
    setObstacles([]);
    setGems([]);
    setScore(0);
    setHasClaimed(false);
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
    <div
      className="relative w-full h-screen bg-gray-900 overflow-hidden flex justify-center items-center"
      style={{
        backgroundImage: `url(${backgroundImage})`, // Add the background image URL here
        backgroundSize: "cover", // Makes sure the image covers the entire game area
        backgroundPosition: "center", // Center the image
        backgroundRepeat: "no-repeat", // Prevent repeating the image
      }}
    >
      <motion.h2
        key={score} // Re-animates when score changes
        initial={{ scale: 1, opacity: 0.6 }}
        animate={{ scale: 1.4, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="absolute top-6 left-1/2 translate-x-[20%] text-yellow-400 font-extrabold text-4xl 
        tracking-widest drop-shadow-[4px_4px_0px_rgba(255,100,0,1)] 
        shadow-[0_0_20px_rgba(255,255,0,0.8)] outline-none uppercase"
      >
        Score: {score}
      </motion.h2>

      <motion.h2
        initial={{ scale: 1, opacity: 0.6 }}
        animate={{ scale: 1.2, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="absolute top-6 right-6 text-green-400 font-extrabold text-xl 
  tracking-widest drop-shadow-[4px_4px_0px_#9a2a9c] 
        shadow-[0_0_20px_rgba(255,255,0,0.8)] outline-none uppercase"
      >
        💰: {balance} MB
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
              className="bg-gray-900 text-white p-10 rounded-lg shadow-2xl border-4 border-yellow-400 border-dashed flex flex-col items-center"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(255, 223, 0, 0.6)" }}
            >
              <motion.h1
                className="text-6xl font-extrabold text-red-500 uppercase 
                drop-shadow-[6px_6px_0px_rgba(0,0,0,1)] 
                shadow-[0_0_25px_rgba(255,0,0,0.8)] tracking-widest 
                animate-pulse"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1.1, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut", type: "spring", stiffness: 120 }}
              >
                Game Over
              </motion.h1>
              <p className="mt-4 text-xl font-semibold text-gray-300 bg-gray-900/60 px-4 py-2 rounded-lg shadow-lg">
                Accumulated <span className="text-yellow-400 font-extrabold drop-shadow-md">$MB</span> Tokens:{" "}
                <span className="text-yellow-400 font-extrabold drop-shadow-md">{score}</span>
              </p>

              {/* Claim Button */}
              <motion.button
                onClick={() => handleClaim(score)}
                className={`relative mt-6 font-extrabold py-3 px-8 rounded-lg border-2 border-green-400 
  text-xl uppercase tracking-widest transition-all duration-300 ease-in-out
  ${
    hasClaimed
      ? "bg-gray-600 text-gray-300 cursor-not-allowed shadow-[0_6px_0_#444]"
      : "bg-gradient-to-b from-green-500 to-green-700 text-white shadow-[0_6px_0_#166534] hover:shadow-[0_4px_0_#166534] active:shadow-[0_2px_0_#166534] active:translate-y-1"
  }`}
                whileHover={
                  hasClaimed
                    ? {}
                    : {
                        scale: 1.05,
                        backgroundColor: "rgb(255, 223, 0)", // Turns gold on hover
                        color: "black",
                        boxShadow: "0px 0px 20px rgba(255, 223, 0, 0.9)", // Glowing effect
                      }
                }
                whileTap={hasClaimed ? {} : { scale: 0.95 }}
                disabled={hasClaimed}
              >
                Claim $MB
              </motion.button>

              {/* Restart Button (Initially Disabled) */}
              <motion.button
                onClick={restartGame}
                className={`relative mt-6 font-extrabold py-3 px-8 rounded-lg border-2 border-yellow-400 
  text-xl uppercase tracking-widest transition-all duration-300 ease-in-out 
  ${
    hasClaimed
      ? "bg-gradient-to-b from-yellow-300 to-yellow-500 text-black shadow-[0_6px_0_#b8860b] hover:shadow-[0_4px_0_#b8860b] active:shadow-[0_2px_0_#b8860b] active:translate-y-1"
      : "bg-gray-600 text-gray-300 cursor-not-allowed shadow-[0_6px_0_#444]"
  }`}
                whileHover={hasClaimed ? { scale: 1.05 } : {}}
                whileTap={hasClaimed ? { scale: 0.95 } : {}}
                disabled={!hasClaimed}
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
                className="mt-4 bg-red-600 hover:bg-red-700 text-white font-extrabold py-3 px-8 rounded-lg text-lg 
                tracking-wide transition-all duration-300 ease-in-out
                shadow-[0_5px_0_#991b1b] hover:shadow-[0_3px_0_#991b1b] active:shadow-[0_1px_0_#991b1b] active:translate-y-1"
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
