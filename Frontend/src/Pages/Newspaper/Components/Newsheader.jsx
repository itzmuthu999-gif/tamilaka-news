import React from 'react'

export default function Newsheader({name}) {
  return (
    <div className='nh-cont'>
      <style>
        {
          `
          .nh-cont {
  display: flex;
  gap: 5px;
  align-items: center;
}

.nh-cont-txt {
  font-weight: bold;
  white-space: nowrap;   /* prevent wrapping */
  flex-shrink: 0;        /* 🔑 stop shrinking */
}

.nh-cont-line {
  flex: 1;               /* 🔑 take remaining space */
  height: 2px;
  background-color: #e80d8c;
}
          `
        }
      </style>
        <div className="nh-cont-txt">{name}</div>
        <div className="nh-cont-line"></div>
    </div>
  )
}
