import React from "react";
import UploadSection from "./UploadSection";

export default function LandingPage() {
  return (
    <section className="text-center py-20 bg-white px-4" id="upload">
      <h1 className="text-4xl md:text-5xl font-bold mb-6">
        AI-Powered Moving Survey
      </h1>
      <p className="text-lg max-w-xl mx-auto mb-8 text-gray-700">
        Submit your moving video and receive a tailored quote powered by our AI.
        No home visit needed.
      </p>
      <a
        href="#upload-section"
        className="inline-block bg-orange-500 text-white px-6 py-3 rounded hover:bg-orange-600 transition"
      >
        Start Free Survey
      </a>

      {/* Upload section */}
      <div id="upload-section" className="mt-12">
        <UploadSection />
      </div>
    </section>
  );
}

