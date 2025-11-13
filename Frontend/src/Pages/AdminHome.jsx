import React from 'react'
import logo from '../assets/logo.png'
import { Link } from 'react-router-dom'
export default function AdminHome() {
  return (
    <div>
       <nav>
        <div  className='logo'><img src={logo} alt="alt"/></div>

       </nav>
       <div className="main-container">
            <Link to="/Newsbund" className="mc-c1-b1">raw news</Link>
            <Link className="mc-c1-b2">Edit Paper</Link>
            <Link to="/Newspaper" className="mc-c1-b2">Newspaper</Link>
              <Link to="/ResizableDragPage" className="mc-c1-b2">Try</Link>
          
       </div>

    </div>
  )
}
