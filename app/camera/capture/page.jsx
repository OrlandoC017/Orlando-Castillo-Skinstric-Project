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
    const videoRef = React.useRef(null);
    const streamRef = React.useRef(null);
    const router = useRouter();

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setName(storedName);
    }
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
  const base64Data = photoDataUrl.split(',')[1];
  try {
    const file = new File([Uint8Array.from(atob(base64Data), c => c.charCodeAt(0))], 'photo.png', { type: 'image/png' });
    await processFile(file);
    
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
    router.push('/AI.Analysis');
  } catch (error) {
    console.error("Error processing file:", error);
    alert("There was an error processing the image. Please try again.");
  } finally {
    setLoading(false);
    setCameraActive(false);
    setPhotoDataUrl(null);
  }
};

  return (
    <div id ="camera">
        <Header section="Intro" />
        <div className="cameraContainer">
            {cameraActive && (
                <div className="cameraPopup">
                    <video
                        className="video"
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted />

                        <div className="videoButtons">
                            <button className="videoButton" onClick={handleTakePhoto}>Take Photo</button>
                            <button className="cameraCircle" onClick={handleTakePhoto} type="button">
                                <img src="/camera icon.svg" alt="Camera" className="cameraIcon" />
                            </button>
                        </div>
                </div>
            )}

            {photoDataUrl && (
                <div className="photoReviewPopup">
                    <img src={photoDataUrl} alt="Preview" className="photoReview" />
                    <div className="photoReviewButtons">
                        <button className="retake" onClick={handleRetake}>Retake</button>
                        <button className="acceptPhoto" onClick={handleAccept} disabled={loading}>
                            {loading ? "Processing..." : "Proceed"}
                        </button>
                    </div>
                </div>
            )}
            {loading && (
                <div className="resultsLoadingState">
                    <img src="/rombuses.svg" alt="" className="rombuses" />
                    <h3>Preparing your analysis, {name}</h3>
                </div>
            )}

            <div className="cameraBottom">
                <div className="bottomLeft">
            <Link
              href="/Results"
              className="startButton uppercase"
              onClick={handleCancel}
            >
              <img className="arrowIcon" src="/buttin-icon-shrunk (left).svg" />
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
                    <Link className="proceed startButrton uppercase" href = "/AI.Analysis" onClick={handleAccept}>
                        Proceed
                        <img className="arrowIcon" src="/buttin-icon-shrunk (right).svg" />
                    </Link>
                )}
            </div>

            </div>
        </div>
    </div>
  )
}
