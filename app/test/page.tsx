"use client";

import Header from "../components/header";
import { useEffect, useState } from "react";
import Link from "next/link";
import "../test/test.css";

export default function page() {
  const [phase, setPhase] = useState("Name");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (phase === "Name") {
      setName(event.target.value);
    } else {
      setLocation(event.target.value);
    }
  };

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;

    if (phase === "Name") {
      if (name.trim().length === 0) return;
      setPhase("Location");
    }

    if (phase === "Location") {
      if (location.trim().length === 0) return;
      setLoading(true);
      setFinished(false);

      try {
        const response = await fetch(
          "https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseOne",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, location }),
          },
        );
        const data = await response.json();
        setFinished(true);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }

      await new Promise((resolve) => setTimeout(resolve, 700));

      setLoading(false);
      setFinished(true);
    }
  };

  return (
    <div id="testPage">
      <Header section="Intro" />
      <div id="testContainer">
        <p className="testTitle uppercase">To Start Analysis</p>
        <div className="testMiddle">
          <img src="/rombuses.svg" alt="" className="rombuses" />
          <div className="middleText">
            {loading ? (
              <p className="loadingText">Processing</p>
            ) : finished ? (
              <p className="thankYouText">
                Thank You!
                <br /> Proceed to the next step!
              </p>
            ) : (
              <>
                <p className="uppercase">
                  <span className="gray clickToType">Click to Type</span>
                </p>
                <input
                  type="text"
                  className="nameInput"
                  value={phase === "Name" ? name : location}
                  onChange={handleInput}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    phase === "Name"
                      ? "Introduce Yourself"
                      : "Where are you from?"
                  }
                />
              </>
            )}
          </div>
        </div>

      </div>
      <div className="buttons">
        <Link href="/" className="startButton uppercase leftTestButton">
          <img src="/buttin-icon-shrunk (left).svg" alt="" className="arrowIcon" />
          Back
        </Link>
        <Link href="/results" className="startButton uppercase">
        Proceed
        <img src="/buttin-icon-shrunk (right).svg" alt="" className="arrowIcon arrowFlipped" /></Link>
      </div>
    </div>
  );
}
