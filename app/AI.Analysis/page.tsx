import React from 'react'
import "./analysis.css"
import Header from '../components/header'
import Link from 'next/link'

export default function page() {
  return (
    <div id="analysis">
      <Header section = "INTRO" />
      <div id="analysisContainer">
        <div className="analysisTop">
          <p className="title uppercase">A.I Analysis</p>
          <p className="uppercase">A.I has estimated the following.</p>
          <p className="uppercase">Fix Estimated information if needed</p>
        </div>

        <div className="analysisMiddle">
          <div className="diamondWrapper">
            <img className="rombuses analysisRombuses" src="/rombuses.svg" />
            <Link href="/summary" className='diamond diamondTop uppercase'>Demographics</Link>
            <button className="diamond diamondLeft uppercase"><span>Skin Type Details</span></button>
            <button className="diamond diamondRight uppercase"><span>Cosmetic Concerns</span></button>
            <button className="diamond diamondBottom uppercase"><span>Weather</span></button>
            
          </div>
        </div>

        <div className="analysisBottom">
          <Link href="/results" className="startButton uppercase">
            <img className="arrowIcon" src="/buttin-icon-shrunk (left).svg" />
            Back
          </Link>
          <Link href="/summary" className="startButton uppercase">
            Get Summary
            <img className="arrowIcon arrowFlipped" src="/buttin-icon-shrunk (right).svg" />
          </Link>
        </div>
      </div>
    </div>
  )
}
