import React from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes
} from "react-router-dom";
import "./App.css";


import About from "./components/About/About";
import Home from "./components/Home/Home";
import Layout from "./components/Layout/Layout";
import MainSearchContainer from "./components/MainSearchContainer/MainSearchContainer";
import PageNotFound from "./components/PageNotFound/PageNotFound";

function App() {
  return (
    <div className="font-face-gm">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/" element={<Layout />}>
            <Route path="/home" element={<Home />}>
              <Route path="main" element={<MainSearchContainer/>}/>
            </Route>
            <Route path="/about" element={<About />} />
            <Route path="/*" element={<PageNotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
