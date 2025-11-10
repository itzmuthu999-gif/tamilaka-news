import React from 'react'
import logo from '../assets/logo.png'
import { Link } from 'react-router-dom'

export default function Newsbund() {
  return (
    <div>
       <nav>
          <div  className='logo'><img src={logo} alt="alt"/></div>     
          <Link to="/Newsupload"> upload News</Link>    
       </nav>

    </div>
  )
}
