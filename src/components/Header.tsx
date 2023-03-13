import React from "react"
import { NavLink } from "react-router-dom"


const Header = (): JSX.Element => (
  <div className="header">
    <a href="/" className="plain-link">
      <h1 className="header__logo">
        Oskar Ålund
      </h1>
    </a>
    <div className="header__links">
      <NavLink
        to="/"
        className={({ isActive }) => (
          isActive ? "header__link--active" : "header__link"
        )}
      >
        About
      </NavLink>
      <NavLink
        to="/publications/"
        className={({ isActive }) => (
          isActive ? "header__link--active" : "header__link"
        )}
      >
        Publications
      </NavLink>
      <NavLink
        to="/contact/"
        className={({ isActive }) => (
          isActive ? "header__link--active" : "header__link"
        )}
      >
        Contact
      </NavLink>
    </div>
  </div>
)


export default Header
