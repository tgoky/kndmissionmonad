"use client";

import React, { useState } from "react";
import Link from "next/link";

const Accelerate = () => {
  const image = { src: "/mmmfd.jpeg", alt: "Birdy Tasks" };

  const initialTasks = [
    {
      id: "twitter",
      title: "Follow us on X",
      description: "Stay updated with our latest updates.",
      link: "https://x.com/muffledbird",
      buttonText: "Follow on X",
      completed: false,
    },
    {
      id: "twitter",
      title: "Follow the CTO",
      description: "get in touch us",
      link: "https://x.com/0x80f",
      buttonText: "Follow on X",
      completed: false,
    },
    {
      id: "telegram",
      title: "Join our Telegram",
      description: "Be part of the discussions",
      link: "https://t.me/muffledbirdmarket",
      buttonText: "Join Telegram",
      completed: false,
    },
    {
      id: "discord",
      title: "Join our Discord",
      description: "Engage with the community",
      link: "https://discord.gg/WnYeg4Qxkz",
      buttonText: "Join Discord",
      completed: false,
    },
  ];

  const [tasks, setTasks] = useState(initialTasks);

  const handleVerify = (id: string) => {
    setTimeout(() => {
      setTasks(prevTasks => prevTasks.map(task => (task.id === id ? { ...task, completed: true } : task)));
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold text-white mb-6 neon-text">Be a Muffled Bird!</h1>
      <h1 className="text-sm font-semibold text-white mb-6">
        Notice: It’s peremptory to follow instructions and become a full-fledged muffled bird.
      </h1>

      <h1 className="text-lg font-semibold text-purple-500 mb-8">
        We would love to build an eligible community with you!
      </h1>

      <div className="bg-gray-800 shadow-xl rounded-lg overflow-hidden w-full max-w-5xl">
        <img src={image.src} alt={image.alt} className="object-cover w-full h-64" />

        <div className="p-6">
          {tasks.map((task, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row md:items-center justify-between mb-6 border-b border-gray-700 pb-4 last:border-b-0"
            >
              <div className="mb-4 md:mb-0">
                <h3 className="text-lg text-white font-semibold">{task.title}</h3>
                <p className="text-gray-400">{task.description}</p>
              </div>

              {!task.completed ? (
                <div className="flex gap-3">
                  <Link href={task.link} target="_blank" rel="noopener noreferrer" passHref>
                    <button className="btn-3d bg-pink-500 hover:bg-pink-600">{task.buttonText}</button>
                  </Link>
                  <button onClick={() => handleVerify(task.id)} className="btn-3d bg-blue-500 hover:bg-blue-600">
                    Verify
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-green-500 font-semibold text-lg">✔ Done</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .neon-text {
          text-shadow:
            0 0 10px #ff00ff,
            0 0 20px #ff00ff,
            0 0 30px #ff00ff;
        }
        .btn-3d {
          color: white;
          font-weight: bold;
          padding: 12px 24px;
          border-radius: 12px;
          box-shadow:
            0 6px 0 rgba(0, 0, 0, 0.2),
            0 10px 20px rgba(0, 0, 0, 0.3);
          transition: all 0.2s ease-in-out;
          transform: translateY(-2px);
        }
        .btn-3d:hover {
          transform: translateY(-5px);
          box-shadow:
            0 10px 0 rgba(0, 0, 0, 0.2),
            0 15px 30px rgba(0, 0, 0, 0.4);
        }
        .btn-3d:active {
          transform: translateY(2px);
          box-shadow:
            0 2px 0 rgba(0, 0, 0, 0.2),
            0 5px 10px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
};

export default Accelerate;
