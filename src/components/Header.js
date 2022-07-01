import React from "react";
import logo from "../assests/logo.jpg";

function Header() {
  return (
    <div className="header">
      <img src={logo} alt="logo notes" className="img" />
      <a
        className="heading"
        href="https://khush-ramdev.github.io/"
        target="blank"
      >
        Keep Notes{" "}
      </a>
    </div>
  );
}

export default Header;
