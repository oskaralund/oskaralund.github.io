import React from "react"
import { Routes, Route } from "react-router"
import { HashRouter } from "react-router-dom"
import { createRoot } from "react-dom/client"
import "./styles/styles.scss"
import PublicationsPage from "./components/PublicationsPage"
import AboutPage from "./components/AboutPage"
import ContactPage from "./components/ContactPage"


const root = createRoot(document.getElementById("app"))
root.render(
  <HashRouter>
    <Routes>
      <Route path="/" element={<AboutPage />} />
      <Route path="/publications" element={<PublicationsPage />} />
      <Route path="/contact" element={<ContactPage />} />
    </Routes>
  </HashRouter>
)
