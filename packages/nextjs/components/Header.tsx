"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Accelerate from "./Accelerate";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useOutsideClick } from "~~/hooks/scaffold-eth";

type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

export const menuLinks: HeaderMenuLink[] = [];

export const HeaderMenuLinks = () => {
  const pathname = usePathname();

  return (
    <>
      {menuLinks.map(({ label, href, icon }) => {
        const isActive = pathname === href;
        return (
          <li key={href}>
            <Link
              href={href}
              passHref
              className={`${
                isActive ? "bg-secondary shadow-md" : ""
              } hover:bg-secondary hover:shadow-md focus:!bg-secondary active:!text-neutral py-1.5 px-3 bg-black text-sm rounded-full gap-2 grid grid-flow-col`}
            >
              {icon}
              <span>{label}</span>
            </Link>
          </li>
        );
      })}
    </>
  );
};

export const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal
  const burgerMenuRef = useRef<HTMLDivElement>(null);

  useOutsideClick(burgerMenuRef, () => setIsDrawerOpen(false));

  return (
    <div className="sticky lg:static bg-gradient-to-r from-yellow-400 via-black to-[#000080] top-0 navbar bg-base-200 min-h-0 flex-shrink-0 justify-between z-20 border-b-2 border-base-100 px-0 sm:px-2 py-4">
      <div className="navbar-start w-auto lg:w-1/2">
        {/* Mobile Menu */}
        <div className="lg:hidden dropdown" ref={burgerMenuRef}>
          <label
            tabIndex={0}
            className={`ml-1 btn btn-ghost ${isDrawerOpen ? "hover:bg-secondary" : "hover:bg-transparent"}`}
            onClick={() => setIsDrawerOpen(prev => !prev)}
          >
            <Bars3Icon className="h-1/2" />
          </label>
          {isDrawerOpen && (
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
              onClick={() => setIsDrawerOpen(false)}
            >
              <HeaderMenuLinks />
            </ul>
          )}
        </div>
        {/* Logo */}
        <Link href="/" passHref className="hidden lg:flex items-center gap-2 ml-4 mr-6 shrink-0">
          <div className="flex relative w-6 h-6">
            <Image alt="SE2 logo" className="cursor-pointer" fill src="./logo.svg" />
          </div>
        </Link>
        {/* Desktop Menu */}
        <ul className="hidden lg:flex lg:flex-nowrap menu menu-horizontal px-1 gap-2">
          <HeaderMenuLinks />
        </ul>
      </div>

      {/* Center Button */}
      <div className="navbar-center">
        <button
          className="relative bg-black text-white font-bold px-6 py-2 rounded-full border-4 border-gray-700 shadow-[4px_4px_0px_#1f1f1f] 
            transition-all duration-200 ease-in-out hover:shadow-[2px_2px_0px_#2d2d2d] hover:translate-x-[1px] hover:translate-y-[1px] 
            active:shadow-[1px_1px_0px_#3b3b3b] active:translate-x-[2px] active:translate-y-[2px]"
          onClick={() => setIsModalOpen(true)}
        >
          Earn XP on Muffled Birds : Mission Monad
        </button>
      </div>

      {/* Wallet Connect */}
      <div className="navbar-end flex-grow mr-4 flex items-center space-x-4">
        <RainbowKitCustomConnectButton />
        <FaucetButton />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>
            <Accelerate />
          </div>
        </div>
      )}
    </div>
  );
};
