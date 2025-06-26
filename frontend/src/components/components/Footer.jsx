import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-center py-4 mt-10 text-sm text-gray-600">
      © {new Date().getFullYear()} AI Survey by Airemovals. All rights reserved.
    </footer>
  );
}
