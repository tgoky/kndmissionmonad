"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const characters = [
  { name: "Numbuh 1", image: "/111.png" },
  { name: "Numbuh 2", image: "/22.PNG" },
  { name: "Numbuh 3", image: "/3333.png" },
  { name: "Numbuh 4", image: "/number33.jpeg" },
  { name: "Numbuh 5", image: "/no5.png" }
];

const HomePage = () => {
  const gridRef = useRef(null);

  useEffect(() => {
    gsap.to(".character", { 
      y: -10, 
      duration: 1.5, 
      repeat: -1, 
      yoyo: true, 
      ease: "easeInOut" 
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-4xl font-bold mb-8">Kids Next Door: Mission Monad</h1>
      <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {characters.map((char, index) => (
          <div key={index} className="character p-4 bg-gray-800 rounded-xl shadow-lg">
            <img src={char.image} alt={char.name} className="w-40 h-40 object-contain" />
            <p className="text-center mt-2 font-semibold">{char.name}</p>
          </div>
        ))}
      </div>
      <button className="mt-8 px-6 py-3 bg-green-600 hover:bg-green-700 text-lg font-bold rounded-lg">
        Start Mission
      </button>
    </div>
  );
};

export default HomePage;
