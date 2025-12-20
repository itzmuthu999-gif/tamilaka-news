import React from 'react'

export default function Newsheader({name}) {
  return (
    <div className='nh-cont'>
        <div className="nh-cont-txt">{name}</div>
        <div className="nh-cont-line"></div>
    </div>
  )
}
