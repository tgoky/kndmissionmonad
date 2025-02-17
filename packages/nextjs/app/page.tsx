"use client";

import React, { useEffect, useRef, useState } from "react";
import ArenaGame from "./ArenaGame";
import Leaderboard from "./Leaderboard";
import contractABI from "./abi/ards.json";
import { ethers } from "ethers";
import gsap from "gsap";
import { FaCheckCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

// const contractAddress = "0x706e51256096F5aabA58A55B4e2B17416968E7D2"; DEVNET

const contractAddress = "0xec035D9603bC3447BA0370F45693744FBcA6363F";

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

const characters = [
  {
    name: "Birdie 1",
    fullName: "Goldfinches",
    power: "Leadership & Strategy",
    image: "/m1.png",
    background: "/2dw.jpg", // Add a unique background for Numbuh 1
  },
  {
    name: "Birdie 2",
    fullName: "Northern cardinal",
    power: "Inventor & Pilot",
    image: "/m2.png",
    background: "/bg0.jpg", // Add a unique background for Numbuh 2
  },
  {
    name: "Birdie 3",
    fullName: "Funny Turacos",
    power: "Animal Whisperer & Joy",
    image: "/m3.png",
    background: "/bg3.jpg", // Add a unique background for Numbuh 3
  },
  {
    name: "Birdie 4",
    fullName: "Lesser goldfinch",
    power: "Hand-to-Hand Combat",
    image: "/m4.png",
    background: "/bg2.jpg", // Add a unique background for Numbuh 4
  },
  {
    name: "Birdie 5",
    fullName: "Abigail Lincoln",
    power: "Stealth & Intelligence",
    image: "/m5.png",
    background: "/bg3.jpg", // Add a unique background for Numbuh 5
  },
  {
    name: "Granny",
    fullName: "Seablue-fronted canary",
    power: "Super Dooboo Whooping",
    image: "/m6.png",
    background: "/bg1.jpg", // Add a unique background for Granny
  },
];

const HomePage = () => {
  const gridRef = useRef(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [missionStarted, setMissionStarted] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showModal, setShowModal] = useState(false); // State for the modal visibility
  const [wallet, setWallet] = useState<any>(null);

  const toggleLeaderboard = () => {
    setShowLeaderboard(!showLeaderboard); // Toggle the leaderboard view
  };

  useEffect(() => {
    gsap.to(".character", {
      y: -10,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "easeInOut",
    });
  }, []);

  const toggleSelect = (index: number) => {
    setSelected(prev => (prev === index ? null : index));
  };

  const startMission = async () => {
    if (selected === null) return;

    const contract = getContract();
    const entryFee = await contract.entryFee();

    const tx = await contract.startGame({
      value: entryFee,
    });

    await tx.wait();
    setMissionStarted(true);
  };

  const handleEndGame = () => {
    setShowModal(true); // Show the modal when "End Game" is clicked
  };

  const closeModal = () => {
    setShowModal(false); // Close the modal without taking any action
  };

  const confirmExit = () => {
    setShowModal(false); // Close the modal
    // Handle any logic needed to end the game (reset state, etc.)
    setMissionStarted(false);
    setSelected(null);
  };

  return (
    <div className="min-h-screen flex flex-row bg-black text-white">
      {/* Left Sidebar */}
      <div className="w-1/5 min-h-screen bg-gray-900 flex flex-col items-center py-10 border-r border-gray-700">
        <p className="text-xs text-center">
          connect wallet at the top right corner,{" "}
          <span className="blinking-text text-orange-400 font-bold"> select a character</span> Next and then click the
          start mission
        </p>
        <p className="text-xs text-center">
          the start mission needs a <span className="blinking-text text-pink-400 font-bold"> 🕊️ birdy tap</span> to
          start the mission. Tap the startMission button twice, one tap at a time!
        </p>

        <p className="text-xs text-center">
          Earn <span className="blinking-text text-yellow-400 font-bold">MuffledBird </span>
          <span className="blinking-text text-yellow-400 font-bold"> $MB</span> tokens by surviving the monad mission
          and dodging bombs.
        </p>
        <p className="text-xs text-center">
          desktop mode is most suitable for best experience{" "}
          <span className="blinking-text text-pink-400 font-bold">Use arrow keys to dodge bombs</span>
          <span className="blinking-text text-green-400 font-bold"> make contact with gems </span>
        </p>
        <p className="text-xs text-center">
          Character game pass fee : <span className="animate-pulse text-yellow-400 font-bold">0.34 MON</span>
        </p>
        <button
          className="relative w-4/5 py-3 mb-4 text-left px-4 text-white text-lg font-semibold 
  border border-gray-700 rounded-lg bg-gradient-to-br from-gray-900 to-gray-800 
  shadow-[4px_4px_10px_rgba(255,255,255,0.2)] 
  transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 
  before:absolute before:top-0 before:left-0 before:w-1/3 before:h-0.5 before:bg-white before:rounded-full 
  after:absolute after:bottom-0 after:right-0 after:w-1/3 after:h-0.5 after:bg-white after:rounded-full 
  hover:before:w-1/2 hover:after:w-1/2 hover:shadow-[6px_6px_20px_rgba(0,255,150,0.7)]"
          onClick={startMission}
        >
          Start Mission
        </button>

        <button
          className="relative w-4/5 py-3 mb-4 text-left px-4 text-white text-lg font-semibold 
  border border-gray-700 rounded-lg bg-gradient-to-br from-gray-900 to-gray-800 
  shadow-[4px_4px_10px_rgba(255,255,255,0.2)] 
  transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 
  before:absolute before:top-0 before:right-0 before:w-1/3 before:h-0.5 before:bg-yellow-500 before:rounded-full 
  after:absolute after:bottom-0 after:left-0 after:w-1/3 after:h-0.5 after:bg-yellow-500 after:rounded-full 
  hover:before:w-1/2 hover:after:w-1/2 hover:shadow-[6px_6px_20px_rgba(255,200,50,0.7)]"
          onClick={toggleLeaderboard}
        >
          {showLeaderboard ? "Go back to home" : "Leaderboard"}
        </button>

        <button
          className="relative w-4/5 py-3 mb-4 text-left px-4 text-white text-lg font-semibold 
  border border-gray-700 rounded-lg bg-gradient-to-br from-gray-900 to-gray-800 
  shadow-[4px_4px_10px_rgba(255,255,255,0.2)] 
  transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 
  before:absolute before:top-0 before:right-0 before:w-1/3 before:h-0.5 before:bg-cyan-400 before:rounded-full 
  after:absolute after:bottom-0 after:left-0 after:w-1/3 after:h-0.5 after:bg-cyan-400 after:rounded-full 
  hover:before:w-1/2 hover:after:w-1/2 hover:shadow-[6px_6px_20px_rgba(0,255,255,0.7)]"
        >
          Multiplayer
        </button>

        <button
          className="relative w-4/5 py-3 mb-4 text-left px-4 text-white text-lg font-semibold 
  border border-gray-700 rounded-lg bg-gradient-to-br from-gray-900 to-gray-800 
  shadow-[4px_4px_10px_rgba(255,255,255,0.2)] 
  transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 
  before:absolute before:top-0 before:right-0 before:w-1/3 before:h-0.5 before:bg-pink-500 before:rounded-full 
  after:absolute after:bottom-0 after:left-0 after:w-1/3 after:h-0.5 after:bg-pink-500 after:rounded-full 
  hover:before:w-1/2 hover:after:w-1/2 hover:shadow-[6px_6px_20px_rgba(255,100,250,0.7)]"
        >
          Settings
        </button>

        <button
          className="relative w-4/5 py-3 mb-4 text-left px-4 text-white text-lg font-semibold 
  border border-gray-700 rounded-lg bg-gradient-to-br from-gray-900 to-gray-800 
  shadow-[4px_4px_10px_rgba(255,255,255,0.2)] 
  transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 
  before:absolute before:top-0 before:right-0 before:w-1/3 before:h-0.5 before:bg-red-500 before:rounded-full 
  after:absolute after:bottom-0 after:left-0 after:w-1/3 after:h-0.5 after:bg-red-500 after:rounded-full 
  hover:before:w-1/2 hover:after:w-1/2 hover:shadow-[6px_6px_20px_rgba(255,50,50,0.7)]"
          onClick={handleEndGame}
        >
          End Game
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-grow">
        {!showLeaderboard ? (
          !missionStarted ? (
            <>
              <h1 className="text-5xl font-extrabold mb-6 text-center uppercase tracking-wide text-yellow-400 drop-shadow-[4px_4px_0px_rgba(255,50,0,1)]">
                Muffled Birdy: Mission Monad
              </h1>
              <h1 className="text-2xl font-bold mb-8">Select your character and Start Mission</h1>
              <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {characters.map((char, index) => (
                  <div
                    key={index}
                    className={`relative character p-4 bg-gray-800 rounded-xl shadow-lg flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 
                  ${selected === index ? "scale-110 border-4 border-yellow-500 bg-yellow-500" : "bg-gray-700 hover:bg-black"}`}
                    onClick={() => toggleSelect(index)}
                  >
                    {selected === index && (
                      <CheckCircleIcon className="absolute top-2 right-2 text-green-500 w-6 h-6" />
                    )}
                    <img src={char.image} alt={char.name} className="w-60 h-40 object-contain" />
                    <p className="text-center mt-2 font-semibold">{char.fullName}</p>
                    <p className="text-center mt-2 font-semibold">{char.power}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            selected !== null && <ArenaGame selectedCharacter={characters[selected]} />
          )
        ) : (
          <Leaderboard />
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full">
            <h2 className="text-xl text-black font-bold mb-4">Are you sure you want to exit?</h2>
            <div className="flex justify-between">
              <button
                className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                onClick={confirmExit} // Confirm exit
              >
                Yes
              </button>
              <button
                className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                onClick={closeModal} // Close modal without doing anything
              >
                No
              </button>
            </div>
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={closeModal} // Close modal when clicking on the close button
            >
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
