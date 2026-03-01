
import './App.css'
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './Pages/Login';
import AdminHome from './Pages/AdminHome';

import Newsbund from './Pages/Newsbund';
import Templatepage from './Pages/TemplatePage/Templatepage';
import Newspaper from "./Trash/Newspaper";
import ResizableDragPage from './Trash/ResizableDragPage';
import PreviewPage from './Pages/PreviewPage/PreviewPage';
import NewsPageEdit from './Pages/NewsPageEdit/NewsPageEdit';
import NewsPaperM from './Pages/Newspaper/NewsPaperM';
import Editpaper from './Pages/Editpaper/Editpaper';
import Tryout from './Tryout';
import Adminop from "./Pages/AdminOperationPage/Adminop"
import { getAllNews } from "./Api/newsApi";
import { getLayout } from "./Api/layoutApi";
import { getAdminConfig } from "./Api/adminApi";
import { getNewsPageConfig } from "./Api/newsPageApi";
import { getUsers } from "./Api/userApi";
import { setAllNews } from "./Pages/Slice/newsformSlice.js";
import { setLayoutHydrated, setLayoutState } from "./Pages/Slice/editpaperSlice/editpaperSlice.js";
import { setAdminConfig } from "./Pages/Slice/adminSlice.js";
import { setUsers } from "./Pages/Slice/userSlice.js";
import { setNewsPageConfig } from "./Pages/Slice/newspageSlice.js";
function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadInitialData = async () => {
      const token = localStorage.getItem("userToken");
      const usersPromise = token ? getUsers() : Promise.resolve(null);

      const [newsRes, layoutRes, adminRes, newsPageRes, usersRes] = await Promise.allSettled([
        getAllNews(),
        getLayout(),
        getAdminConfig(),
        getNewsPageConfig(),
        usersPromise
      ]);

      if (newsRes.status === "fulfilled" && Array.isArray(newsRes.value)) {
        dispatch(setAllNews(newsRes.value));
      }

      if (layoutRes.status === "fulfilled" && layoutRes.value) {
        dispatch(setLayoutState(layoutRes.value));
      }
      dispatch(setLayoutHydrated());

      if (adminRes.status === "fulfilled" && adminRes.value) {
        dispatch(setAdminConfig(adminRes.value));
      }

      if (newsPageRes.status === "fulfilled" && newsPageRes.value) {
        dispatch(setNewsPageConfig(newsPageRes.value));
      }

      if (usersRes.status === "fulfilled" && Array.isArray(usersRes.value)) {
        dispatch(setUsers(usersRes.value));
      }
    };

    loadInitialData();
  }, [dispatch]);


  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<NewsPaperM />} />
        <Route path="/login" element={<Login />} />
        <Route path="/AdminHome" element={<AdminHome />} />

          <Route path="/Newsbund" element={<Newsbund />} />
            <Route path="/Newsupload" element={<Templatepage />} />
            <Route path="/Newspaper" element={<NewsPaperM />} />
  <Route path="/preview/:id" element={<PreviewPage />} />
  <Route path="/newspage-edit" element={<NewsPageEdit />} />

               <Route path="/editpaper" element={<Editpaper />} />
                <Route path="/Tryout" element={<Tryout />} />
                  <Route path="/adminop" element={<Adminop />} />

      </Routes>
    </BrowserRouter>
    </>
    
  )
}

export default App
