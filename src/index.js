import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './index.css';
import App from './App';
import Ap from './pages/SignupLogin/SingIU';
import Layout from './pages/mainlay/Lay';
import reducer from './utils/reducer';
import { StateProvider } from './utils/StateProvider';
import { initialState } from './utils/reducer';
import Home from './pages/Home/Home';
import Search from './pages/Search/Search';
import Test from './pages/mainlay/Test'
import PrivateRoutes from './utils/PrivateRoutes';
import Album from './pages/Album/Album'
import Artist from './pages/Artist/Artist'
export default function App1() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Ap/>} />
        <Route path="/layout" element={<PrivateRoutes Component={Layout} />} />
        <Route path="/home" element={<PrivateRoutes Component={Home} />} />
        <Route path="/search/:searchParam" element={<PrivateRoutes Component={Search} />} />
        <Route path="/album/:alParam" element={<PrivateRoutes Component={Album} />} />
        <Route path="/artist/:arParam" element={<PrivateRoutes Component={Artist} />} />


      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
        <StateProvider initialState={initialState} reducer={reducer}>

    <App1 />
    </StateProvider>

  </React.StrictMode>
);

