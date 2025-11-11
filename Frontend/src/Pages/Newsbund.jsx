import React from 'react'
import logo from '../assets/logo.png'
import { Link } from 'react-router-dom'

export default function Newsbund() {
  return (
<div>
       <nav className='navbar'>
          <div  className='logo'><img src={logo} alt="alt"/></div>     
          <Link className='link' to="/Newsupload"> upload News</Link>    
       </nav>
    
    <div className="nb-container">
      <div className="nb-card">
      <div className="img-cont"><img src={luffy} alt="" /></div>
      <div className="textbox">gear5 money d luffy recently rereleased in tam dubed </div>
      </div>
       <div className="nb-container2">
      <div className="nb-card2">
      <div className="img-cont"><img src={dmk} alt="" /></div>
      <div className="textbox">Social Media: Political cartoons and art often appear on social media platforms like X (formerly Twitter) and Instagram. News outlets and cartoonists share their work, such as this example from Ananda Vikatan on X and various posts on Instagram using hashtags like #MKStalin or #DMK. </div>
      </div>
    </div>
    
    </div>
    
    </div>
  )
}
