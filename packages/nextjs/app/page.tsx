"use client";

import React, { useEffect, useRef, useState } from "react";
import ArenaGame from "./ArenaGame";
import gsap from "gsap";
import { FaCheckCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const characters = [
  { name: "Numbuh 1", fullName: "Nigel Uno", power: "Leadership & Strategy", image: "/1.png" },
  { name: "Numbuh 2", fullName: "Hoagie P. Gilligan Jr.", power: "Inventor & Pilot", image: "/main2.png" },
  { name: "Numbuh 3", fullName: "Kuki Sanban", power: "Animal Whisperer & Joy", image: "/3.png" },
  { name: "Numbuh 4", fullName: "Wallabee Beatles", power: "Hand-to-Hand Combat", image: "/4.pg" },
  { name: "Numbuh 5", fullName: "Abigail Lincoln", power: "Stealth & Intelligence", image: "/no5.png" },
  { name: "Granny", fullName: "Gramma Stuffum", power: "Super Dooboo Whooping", image: "/granny6.png" },
];

const HomePage = () => {
  const gridRef = useRef(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [missionStarted, setMissionStarted] = useState(false);

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

  return (
    <div className="min-h-screen flex flex-row bg-black text-white">
      {/* Left Sidebar */}
      <div className="w-1/5 min-h-screen bg-gray-900 flex flex-col items-center py-10 border-r border-gray-700">
        <button
          className="w-4/5 py-3 mb-4 text-left px-4 text-white border border-gray-500 hover:bg-yellow-500 transition-all"
          onClick={startMission}
        >
          Start Mission
        </button>
        {["Select Difficulty", "Settings", "Multiplayer", "End Game"].map((text, index) => (
          <button
            key={index}
            className="w-4/5 py-3 mb-4 text-left px-4 text-white border border-gray-500 hover:bg-yellow-500 transition-all"
          >
            {text}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-grow">
        {!missionStarted ? (
          <>
            <h1 className="text-4xl font-bold mb-8">Kids Next Door: Mission Monad</h1>
            <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {characters.map((char, index) => (
                <div
                  key={index}
                  className="relative character p-4 bg-gray-800 rounded-xl shadow-lg flex flex-col items-center justify-center text-center cursor-pointer"
                  onClick={() => toggleSelect(index)}
                >
                  {selected === index && <FaCheckCircle className="absolute top-2 right-2 text-green-500 text-xl" />}
                  <img src={char.image} alt={char.name} className="w-40 h-40 object-contain" />
                  <p className="text-center mt-2 font-semibold">
                    {char.name} {char.fullName}
                  </p>
                  <p className="text-center mt-2 font-semibold">{char.power}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          selected !== null && <ArenaGame selectedCharacter={characters[selected]} />
        )}
      </div>
    </div>
  );
};

export default HomePage;
