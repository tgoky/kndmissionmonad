"use client";

import React, { useEffect, useRef, useState } from "react";
import ArenaGame from "./ArenaGame";
import Leaderboard from "./Leaderboard";
import gsap from "gsap";
import { FaCheckCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  const startMission = () => {
    if (selected === null) {
      toast.warning("Please select a character before starting the mission!");
    } else {
      toast.success(`Mission started with ${characters[selected].name}!`);
      setMissionStarted(true);
    }
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
    toast.info("Game has been exited.");
  };

  return (
    <div className="min-h-screen flex flex-row bg-black text-white">
      {/* Left Sidebar */}
      <div className="w-1/5 min-h-screen bg-gray-900 flex flex-col items-center py-10 border-r border-gray-700">
        <button
          className="w-4/5 py-3 mb-4 text-left px-4 text-white border border-gray-500 border-dashed hover:bg-green-500 transition-all"
          onClick={startMission}
        >
          Start Mission
        </button>
        <button
          className="w-4/5 py-3 mb-4 text-left px-4 text-white border border-gray-500 border-dashed hover:bg-yellow-500 transition-all"
          onClick={toggleLeaderboard}
        >
          {showLeaderboard ? "Go back to home" : "Leaderboard"}
        </button>
        <button className="w-4/5 py-3 mb-4 text-left px-4 text-white border border-gray-500 border-dashed hover:bg-yellow-500 transition-all">
          Multiplayer
        </button>
        <button className="w-4/5 py-3 mb-4 text-left px-4 text-white border border-gray-500 border-dashed hover:bg-yellow-500 transition-all">
          Settings
        </button>
        <button
          className="w-4/5 py-3 mb-4 text-left px-4 text-white border border-gray-500 border-dashed hover:bg-red-500 transition-all"
          onClick={handleEndGame} // Handle "End Game" button click
        >
          End Game
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-grow">
        {!showLeaderboard ? (
          !missionStarted ? (
            <>
              <h1 className="text-4xl font-bold mb-8">Muffled Birdie: Mission Monad</h1>
              <h1 className="text-2xl font-bold mb-8">Select your character and Start Mission</h1>
              <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {characters.map((char, index) => (
                  <div
                    key={index}
                    className={`relative character p-4 bg-gray-800 rounded-xl shadow-lg flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 
                  ${selected === index ? "scale-110 border-4 border-yellow-500 bg-yellow-500" : "bg-gray-700 hover:bg-black"}`}
                    onClick={() => toggleSelect(index)}
                  >
                    {selected === index && <FaCheckCircle className="absolute top-2 right-2 text-green-500 text-xl" />}
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
