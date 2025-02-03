"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { FaCheckCircle } from "react-icons/fa";

const characters = [
  { name: "Numbuh 1", fullName: "Nigel Uno", power: "Leadership & Strategy", image: "/111.png" },
  { name: "Numbuh 2", fullName: "Hoagie P. Gilligan Jr.", power: "Inventor & Pilot", image: "/22.PNG" },
  { name: "Numbuh 3", fullName: "Kuki Sanban", power: "Animal Whisperer & Joy", image: "/3333.png" },
  { name: "Numbuh 4", fullName: "Wallabee Beatles", power: "Hand-to-Hand Combat", image: "/number33.jpeg" },
  { name: "Numbuh 5", fullName: "Abigail Lincoln", power: "Stealth & Intelligence", image: "/no5.png" },
  { name: "Granny", fullName: "Gramma Stuffum", power: "Super Dooboo Whooping", image: "/granny.png" },
];

const HomePage = () => {
  const gridRef = useRef(null);
  const [selected, setSelected] = useState<number | null>(null);

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

  return (
    <div className="min-h-screen flex flex-row bg-black text-white">
      {/* Left Sidebar */}
      <div className="w-1/5 min-h-screen bg-gray-900 flex flex-col items-center py-10 border-r border-gray-700">
        {["Start Mission", "Select Difficulty", "Settings", "Multiplayer", "End Game"].map((text, index) => (
          <button
            key={index}
            className="w-4/5 py-3 mb-4 text-left px-4 text-white border border-gray-500 hover:bg-yellow-500 transition-all hover:text-black"
          >
            {text}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-grow">
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
      </div>
    </div>
  );
};

export default HomePage;
