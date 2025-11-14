import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminHome from './Pages/AdminHome';
import Newsupload from './Pages/Newsupload'
import Newsbund from './Pages/Newsbund';
import Templatepage from './Pages/Templatepage';
import Newspaper from "./Pages/Newspaper";
import ResizableDragPage from './Pages/ResizableDragPage';

function App() {


  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminHome />} />
          <Route path="/Newsbund" element={<Newsbund />} />
            <Route path="/Newsupload" element={<Templatepage />} />
            <Route path="/Newspaper" element={<Newspaper />} />
              <Route path="/ResizableDragPage" element={<ResizableDragPage />} />
      </Routes>
    </BrowserRouter>
    </>
    
  )
}

export default App
