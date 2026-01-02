import React from 'react'
import Line from './Line'
import logo from "../../../assets/logo1.png";
import { RiTwitterXLine } from "react-icons/ri";
import { RiInstagramFill } from "react-icons/ri";
import { FaYoutube } from "react-icons/fa";
export default function Footer() {
  return (
    <div className='foot-con'>
    <Line direction="H" length="100%" thickness="2px" color="#e80d8c"/>
    <div className="foot-con-c1">
       <div className="foot-con-inn">
                                <div className="nav-c1-logo" style={{position: "relative"}}>
                   <div className="nav-c1l-t1" > <img src={logo}/></div>
                   <div className="nav-c1l-t2" style={{position: "absolute", transform: "translateY(20px)"}}>நடுநிலை நாளிதழ்</div>
                </div>
       </div>
    <div className="foot-con-c11" style={{display: "flex", padding: "0px 150px",justifyContent: "space-between"}}>

    <div className="foot-con-c111">
            <div className="fcc111-1" style={{fontWeight: "bold"}}>Follow Us on</div>
        <div style={{display: "flex", gap: "20px"}}>
            <RiTwitterXLine />
            <RiInstagramFill />
            <FaYoutube />
        </div>
    </div>
        <div className="foot-con-c111">
            <div className="fcc111-1" style={{fontWeight: "bold"}}>Support</div>
        <div >
             <div>About Us</div>
             <div>Contact Us</div>
             <div>Authors </div>
             <div>Feed back </div>
        </div>
    </div>
            <div className="foot-con-c111">
            <div className="fcc111-1" style={{fontWeight: "bold"}}>Sections</div>
        <div >
             <div>Politics </div>
             <div>Astrology </div>
             <div>weather </div>
              <div> cinema </div>
             <div> sports </div>
              <div> World news </div>
               <div> finance </div>
                <div> style </div>
              
        </div>
    </div>
    <div className="foot-con-c111">
            <div className="fcc111-1" style={{fontWeight: "bold"}}>Legal Terms</div>
        <div >
             <div>Terms of use</div>
              <div>privacy policy  </div>
               <div> cod of business  </div>
                <div> cookie policies </div>

        </div>
    </div>
        
    </div>            
    </div>
        <Line direction="H" length="100%" thickness="2px" color="#e80d8c"/>
        <div className="foot-cont-c113" style={{display: "flex", flexDirection: "column", alignItems: "center", fontWeight: "bold"}}>
            <div style={{color: "#e80d8c"}}> © {new Date().getFullYear()} Tamilaga News. All Rights Reserved.</div>
            <div> Designed & Developed by Tamilaga News Team</div>
        </div>
 
                    
    </div>
  )
}
