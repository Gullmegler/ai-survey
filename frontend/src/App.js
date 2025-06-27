import React, { useEffect } from "react";
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import Footer from "./components/Footer";

function App() {
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000");

    ws.onopen = () => {
      console.log("WebSocket-forbindelse åpnet");
    };

    ws.onmessage = (event) => {
      console.log("Melding mottatt:", event.data);
    };

    ws.onerror = (error) => {
      console.error("WebSocket-feil:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket-forbindelse lukket");
    };

    return () => {
      ws.close();
    };
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
