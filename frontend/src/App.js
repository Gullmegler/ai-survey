import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import UploadSection from "./components/UploadSection";

function App() {
  return (
    <div className="font-sans text-gray-800">
      <Navbar />
      <UploadSection />
      <Footer />
    </div>
  );
}

export default App;
