"use client"

import Header from '../components/header'
import Link from 'next/link'
import React from "react"
import "../results/results.css"
import { useRouter } from 'next/navigation'

export default function Results() {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  }

  const toBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      alert("Please upload an Image");
      return;
    }

    setLoading(true);

    try {
      const base64string = await toBase64(file);

      const payload = {
        image: base64string
      }

      const res = await fetch('https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseTwo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      localStorage.setItem("analysisResults", JSON.stringify(data));
      
      // Wait at least 2 seconds before showing alert and redirecting
      setTimeout(() => {
        alert("Image Analyzed Successfully");
        router.push("/AI.Analysis")
      }, 3000);
      
      console.log("API Response:", data);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error analyzing image. Please try again.");
      setLoading(false);
    }
  }
  return (
    <div id="results">
      <Header section="Intro" />
      <div className="resultsContainer">
        <p className="resultsTitle uppercase">To start analysis</p>
        {!loading ? (
          <>
            <div className="resultsMiddle">
              <Link href="/camera/capture" className="cameraButton resultsButton">
                <img src="/CameraPackage.svg" />
              </Link>
              <button className="galleryButton resultsButton" onClick={handleClick}>
                <img src="/GalleryPackage.svg" />
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </>
        ) : (
          <div className="resultsLoadingState">
            <img className="rombuses" src="/rombuses.svg" />
            <h3>Preparing Your Analysis</h3>
          </div>
        )}
        <Link href="/test" className="startButton uppercase">
          <img className="arrowIcon" src="/buttin-icon-shrunk (left).svg" />
          Back
        </Link>
      </div>
    </div>
  );
}
