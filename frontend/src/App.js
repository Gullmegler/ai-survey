import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AIMovingEstimator from "./components/UploadSection";

function App() {
  return (
    <div className="font-sans text-gray-800">
      <Navbar />
      <AIMovingEstimator />
      <Footer />
    </div>
  );
}

export default App;
