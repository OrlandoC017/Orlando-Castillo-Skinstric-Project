"use client"

import { useEffect, useState } from 'react'
import "./summary.css"
import Header from '../components/header';
import Link from 'next/link';

export default function Summary() {
    const [selectedCategory, setSelectedCategory] = useState("race");
    const [optionsData, setOptionsData] = useState<Record<string, any[]>>({});
    const [selectedOption, setSelectedOption] = useState<Record<string, any> | null>(null);
    const [name, setName] = useState("");

    const percentage = selectedOption?.percentage || 0;
    const radius = 180;
    const strokeWidth = 8;
    const normalizedRadius = radius - strokeWidth / 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

useEffect(() => {
    if (optionsData[selectedCategory]?.length > 0) {
        setSelectedOption(optionsData[selectedCategory][0]);
    }
}, [selectedCategory, optionsData]);

useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
        setName(storedName);
    }
}, []);


useEffect(() => {
    const stored = localStorage.getItem("analysisResults");
    
    if (!stored) {
      console.warn("No analysisResults found in localStorage");
      return;
    }

    try {
      const data = JSON.parse(stored);
      console.log("Raw API Response:", data);

      // Extract predictions from the API response
      const predictions = data.predictions || data.data || {};
      console.log("Predictions:", predictions);

      const convertObjectToArray = (obj: Record<string, any>) => {
        if (!obj || typeof obj !== 'object') return [];
        return Object.entries(obj).map(([key, value]) => ({
          label: key,
          percentage: Math.round(parseFloat(value as string) * 100),
        }));
      };

      const formatted = {
        race: convertObjectToArray(predictions.race || {}),
        age: convertObjectToArray(predictions.age || {}),
        sex: convertObjectToArray(predictions.gender || {}),
      };

      console.log("Formatted options:", formatted);
      setOptionsData(formatted);
    } catch (error) {
      console.error("Error parsing analysisResults:", error);
    }
}, [])

const capitalize = (s: string) => {
    if (!s) return "";
    return s
    .split(" ")
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("  ")
}

const getHighestOption = (category: string) => {
    const options = optionsData[category];
    if (!options || options.length === 0) return null;
    return options.reduce((max, current) => 
        current.percentage > max.percentage ? current : max
    );
}
  return (
    <div id = "summary">
      <Header section = "ANALYSIS" />
      <div className="summaryContainer">
        <div className="summaryTop">
            <p className="title uppercase">A.I Analysis</p>
            <h1 className="uppercase">Demographics</h1>
            <p className="predicted uppercase">{name}'s Predicted race & age</p>
        </div>

        <div className="summaryMiddle">
            <div className="summaryMidLeft">
                <button
                    className={`button race ${selectedCategory === "race" ? "active" : ""}`}
                    onClick={() => setSelectedCategory("race")}>
                        <p className="raceResult">
                            {capitalize(getHighestOption("race")?.label || "")}
                        </p>
                        <p className="uppercase">Race</p>
                </button>

                <button className={`button age ${selectedCategory === "age" ? "active" : ""}`} onClick={() => setSelectedCategory("age")}>
                    <p className="ageResult">
                        {capitalize(getHighestOption("age")?.label || "")}
                    </p>
                    <p className="uppercase">Age</p>
                
                </button>
                <button className={`button sex ${selectedCategory === "sex" ? "active" : ""}`} onClick={() => setSelectedCategory("sex")}>
                    <p className="sexResult">
                        {capitalize(getHighestOption("sex")?.label || "")}
                    </p>
                    <p className="uppercase">Gender</p>
                
                </button>

            </div>

            <div className="summaryMidCenter">
                <h1 className="resultLabelLarge">
                    {capitalize(selectedOption?.label || "")}
                </h1>
                <div className="graphWrapper">
                    <div className="graph">
                        <svg className="progressRing" width="100%" height="100%" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet">
                            <circle
                            className='progressRing-bg'
                            cx='200'
                            cy='200'
                            r={normalizedRadius}
                            strokeWidth={strokeWidth}
                            />
                            <circle
                            className='progressRing-fg'
                            cx='200'
                            cy='200'
                            r={normalizedRadius}
                            strokeWidth={strokeWidth}
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            />
                        </svg>
                        <div className="graphText">{percentage}%</div>
                    </div>
                </div>
            </div>

            <div className="summaryMidRight">
                <div className="rightTitle">
                    <p className="uppercase">{selectedCategory}</p>
                    <p className="uppercase">A.I Confidence</p>
                </div>
                <div className="resultsList">
                    <div className="listExplanations">
                        {optionsData[selectedCategory]
                        ?.slice()
                        .sort((a, b) => b.percentage - a.percentage)
                        .map((option, index) => (
                            <div key={index} className={`listExplanation ${selectedOption?.label === option.label ? "active" : ""}`} onClick={() => setSelectedOption(option)}>
                        <input
                          className="radio"
                          type="radio"
                          name="option"
                          id={`option-${selectedCategory}-${index}`}
                          checked={selectedOption?.label === option.label}
                          onChange={() => setSelectedOption(option)}
                        />
                        <span className="diamondRadio"></span>
                        <h1 className="resultLabel">
                          {capitalize(option.label)}
                        </h1>                    
                      <p className="percentage">{option.percentage}%</p>
                    </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        <div className="summaryBottom">
            <Link href="/AI.Analysis" className="startButton uppercase">
                <img className="arrowIcon" src="/buttin-icon-shrunk (left).svg" />
                Back
            </Link>

                        <span className="gray">If A.I estimate is wrong, select the correct one</span>

            <Link href="/" className="startButton uppercase">
                Home
                <img className="arrowIcon arrowFlipped" src="/buttin-icon-shrunk (right).svg" />
            </Link>
        </div>
      </div>
    </div>
  )
}
