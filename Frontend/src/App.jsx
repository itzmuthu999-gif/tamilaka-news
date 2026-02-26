
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './Pages/Login';
import AdminHome from './Pages/AdminHome';

import Newsbund from './Pages/Newsbund';
import Templatepage from './Pages/TemplatePage/Templatepage';
import Newspaper from "./Trash/Newspaper";
import ResizableDragPage from './Trash/ResizableDragPage';
import PreviewPage from './Pages/PreviewPage/PreviewPage';
import NewsPaperM from './Pages/Newspaper/NewsPaperM';
import Editpaper from './Pages/Editpaper/Editpaper';
import Tryout from './Tryout';
import Adminop from "./Pages/AdminOperationPage/Adminop"
function App() {


  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/AdminHome" element={<AdminHome />} />

          <Route path="/Newsbund" element={<Newsbund />} />
            <Route path="/Newsupload" element={<Templatepage />} />
            <Route path="/Newspaper" element={<NewsPaperM />} />
  <Route path="/preview/:id" element={<PreviewPage />} />

               <Route path="/editpaper" element={<Editpaper />} />
                <Route path="/Tryout" element={<Tryout />} />
                  <Route path="/adminop" element={<Adminop />} />

      </Routes>
    </BrowserRouter>
    </>
    
  )
}

export default App
