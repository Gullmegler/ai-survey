import React, { useEffect } from "react";
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import Footer from "./components/Footer";

function App() {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      const ws = new WebSocket("ws://localhost:3000");

      return () => {
        ws.close();
      };
    }
  }, []);

  return (
    <div className="font-sans text-gray-800">
      <Navbar />
      <LandingPage />
      <Footer />
    </div>
  );
}

export default App;
