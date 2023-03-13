import React from "react"
import { Routes, Route } from "react-router"
import { HashRouter } from "react-router-dom"
import { createRoot } from "react-dom/client"
import "./styles/styles.scss"
import HomePage from "./components/HomePage"


const root = createRoot(document.getElementById("app"))
root.render(
  <HashRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  </HashRouter>
)
