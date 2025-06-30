import React, { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-orange-500 text-white px-4 py-3 shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <a href="/" className="text-xl font-bold">AI Survey</a>
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            ☰
          </button>
        </div>
        <ul className="hidden md:flex space-x-6">
          <li><a href="/">Home</a></li>
          <li><a href="#upload">Start Survey</a></li>
          <li><a href="https://crm.airemovals.co.uk" target="_blank">CRM</a></li>
        </ul>
      </div>
      {isOpen && (
        <ul className="md:hidden mt-3 space-y-2 px-2">
          <li><a href="/" className="block">Home</a></li>
          <li><a href="#upload" className="block">Start Survey</a></li>
          <li><a href="https://crm.airemovals.co.uk" className="block">CRM</a></li>
        </ul>
      )}
    </nav>
  );
}
