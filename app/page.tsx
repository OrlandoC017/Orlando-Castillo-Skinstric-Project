import Header from "./components/header";
import Link from "next/link";

export default function Home() {
  return (
    <div id="landingPage">
      <Header section="Intro" />
      <div className="landingContainer">
        <div className="landingMain">


          <div className="landingLeft">
            <button className="option leftOption uppercase">
              <img src="/buttin-icon-shrunk (left).svg" alt="left arrow" className="arrowIcon" />
              Discover A.I
            </button>
            <img src="/RectangleLeft.svg" alt="left rectangle" className="rectangle leftRectangle" />
          </div>

          <div data-aos="fade-up">

                   <div className="landingCenter">
          <h1 className="landingTitle">Sophisticated Skincare</h1>
        </div> 
          </div>





        <div className="landingRight">
          <Link className="option rightOption uppercase" href="/test">
            <img src="/buttin-icon-shrunk (right).svg" alt="right arrow" className="arrowIcon" />
            Take Test
          </Link>
          <img src="/RectangleRight.svg" alt="right rectangle" className="rectangle rightRectangle" />
        </div>
        
      </div>
    </div>
    <div className="landingBottom">
          <p className="landingPara uppercase">
            Skinstric developed an A.I that creates a highly personalized routine tailored to what you skin needs.
          </p>
        </div>
  </div>
  );
}
