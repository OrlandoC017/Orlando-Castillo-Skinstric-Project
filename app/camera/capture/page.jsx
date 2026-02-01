"use client"
import "./camera.css"
import Header from '../../components/header'
import { useRouter } from 'next/navigation'

import React, { useEffect } from 'react'
import Link from "next/link"

export default function page() {
    const [loading, setLoading] = React.useState(false);
    const [cameraActive, setCameraActive] = React.useState(false);
    const [photoDataUrl, setPhotoDataUrl] = React.useState(null);
    const [name, setName] = React.useState("");
    const [showTipsModal, setShowTipsModal] = React.useState(true);
    const [isMobile, setIsMobile] = React.useState(false);
    const videoRef = React.useRef(null);
    const streamRef = React.useRef(null);
    const router = useRouter();

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setName(storedName);
    }
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleCameraClick = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;

      setCameraActive(true);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play().catch(console.error);
          };
        }
      }, 50);
    } catch (err) {
      console.error("Camera access denied or unavailable:", err);
      alert(
        "Unable to access camera. Please allow camera access or use gallery."
      );
    }
  };

  useEffect(() => {
    handleCameraClick();
  }, []);

  const handleTakePhoto = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/png");
    setPhotoDataUrl(dataUrl);
    stopCamera();
  };

  const handleRetake = () => {
    setPhotoDataUrl(null);
    setCameraActive(true);
    handleCameraClick();
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const handleCancel = () => {
    stopCamera();
    setPhotoDataUrl(null);
    setCameraActive(false);
    setLoading(false);
    router.push('/camera/capture/intro');
  }

  const processFile = async (file) => {
    setLoading(true);
    try {
      const toBase64 = (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });
      };
      // Add your file processing logic here
    } catch (error) {
      console.error("Error processing file:", error);
    } finally {
      setLoading(false);
    }
  };

const handleAccept = async () => {
  if (!photoDataUrl) return;
  setLoading(true);
  
  const startTime = Date.now();
  
  try {
    const payload = { image: photoDataUrl };
    const res = await fetch(
      "https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseTwo",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    
    const data = await res.json();
    localStorage.setItem("analysisResults", JSON.stringify(data));
    
    // Ensure at least 3 seconds of loading state
    const elapsedTime = Date.now() - startTime;
    const remainingTime = Math.max(0, 3000 - elapsedTime);
    
    setTimeout(() => {
      router.push('/AI.Analysis');
    }, remainingTime);
  } catch (error) {
    console.error("Error processing file:", error);
    setLoading(false);
    setCameraActive(false);
    setPhotoDataUrl(null);
    alert("There was an error processing the image. Please try again.");
  }
};

  return (
    <div id ="camera">
        <Header section="Intro" />
        <div className="cameraContainer">
            {isMobile && showTipsModal && cameraActive && (
                <div className="tipsModal">
                    <div className="tipsModalContent">
                        <h2 className="uppercase">Camera Tips</h2>
                        <p className="uppercase">To get better results, make sure to have:</p>
                        <ul className="uppercase">
                            <li className="uppercase">Neutral expression</li>
                            <li className="uppercase">Frontal pose</li>
                            <li className="uppercase">Adequate lighting</li>
                        </ul>
                        <button className="closeTipsBtn uppercase" onClick={() => setShowTipsModal(false)}>Got it</button>
                    </div>
                </div>
            )}
            {cameraActive && (
                <div className="cameraPopup">
                    <video
                        className="video"
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted />

                        <div className="videoButtons">
                            {!isMobile && (
                                <>
                                    <button className="videoButton" onClick={handleTakePhoto}>Take Photo</button>
                                    <button className="cameraCircle" onClick={handleTakePhoto} type="button">
                                        <img src="/camera icon.svg" alt="Camera" className="cameraIcon" />
                                    </button>
                                </>
                            )}
                            {isMobile && (
                                <button className="cameraCircle mobileOnly" onClick={handleTakePhoto} type="button">
                                    <img src="/camera icon.svg" alt="Camera" className="cameraIcon" />
                                </button>
                            )}
                        </div>
                </div>
            )}

            {photoDataUrl && (
                <div className="photoReviewPopup">
                    <p className="photoCaption">Great shot!</p>
                    <img src={photoDataUrl} alt="Preview" className="photoReview" />
                    <div className="photoReviewButtons">
                        <button className="retake" onClick={handleRetake}>
                            <img className="arrowIcon" src="/buttin-icon-shrunk (left).svg" alt="back" />
                            Retake
                        </button>
                        <button className="acceptPhoto" onClick={handleAccept} disabled={loading}>
                            {loading ? "Processing..." : "Proceed"}
                            <img className="arrowIcon" src="/buttin-icon-shrunk (right).svg" alt="forward" />
                        </button>
                    </div>
                </div>
            )}
            {loading && (
                <div className="photoReviewPopup">
                    <div className="analyzingBox">
                        <p className="analyzingText">Analyzing your image</p>
                    </div>
                </div>
            )}

            <div className="cameraBottom">
                {!isMobile && (
                    <>
                        <div className="bottomLeft">
                            <Link
                              href="/results"
                              className="startButtonCamera uppercase"
                              onClick={handleCancel}
                            >
                              <img className="arrowIconCamera" src="/buttin-icon-shrunk (left).svg" />
                              Back
                            </Link>
                        </div>

                        <div className="bottomMid">
                            <p className="uppercase">To get better results, make sure to have</p>
                            <ol>
                                <li className="uppercase">neutral expression</li>
                                <li className="uppercase">frontal pose</li>
                                <li className="uppercase">adequate lighting</li>
                            </ol>
                        </div>

                        <div className="bottomRight">
                            {photoDataUrl && (
                                <button className="proceed startButrton uppercase" onClick={handleAccept} disabled={loading}>
                                    {loading ? "Processing..." : "Proceed"}
                                    <img className="arrowIcon" src="/buttin-icon-shrunk (right).svg" />
                                </button>
                            )}
                        </div>
                    </>
                )}
                {isMobile && (
                    <div className="mobileBottomContainer">
                        <Link
                          href="/results"
                          className="startButtonCamera uppercase mobileBackBtn"
                          onClick={handleCancel}
                        >
                          <img className="arrowIconCamera" src="/buttin-icon-shrunk (left).svg" />
                          Back
                        </Link>
                    </div>
                )}
            </div>
        </div>
    </div>
  )
}
