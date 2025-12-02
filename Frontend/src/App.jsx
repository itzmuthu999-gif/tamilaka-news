import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminHome from './Pages/AdminHome';

import Newsbund from './Pages/Newsbund';
import Templatepage from './Pages/TemplatePage/Templatepage';
import Newspaper from "./Pages/Newspaper";
import ResizableDragPage from './Pages/ResizableDragPage';
import PreviewPage from './Pages/PreviewPage';

function App() {


  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminHome />} />
          <Route path="/Newsbund" element={<Newsbund />} />
            <Route path="/Newsupload" element={<Templatepage />} />
            <Route path="/Newspaper" element={<Newspaper />} />
              <Route path="/preview" element={<PreviewPage />} />

      </Routes>
    </BrowserRouter>
    </>
    
  )
}

export default App
