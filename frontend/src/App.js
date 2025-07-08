import React, { useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AIMovingEstimator from "./components/UploadSection"; // 👈 Importer her

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
      <AIMovingEstimator /> {/* 👈 Her bruker du den */}
      <Footer />
    </div>
  );
}

export default App;
