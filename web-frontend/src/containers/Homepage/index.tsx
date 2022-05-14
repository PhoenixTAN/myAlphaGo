import React from "react";
import Board from "@Components/Board";
import "./style.scss";

const Homepage = () => {
  return (
    <div className="homepage-container">
      <aside className="aside"></aside>
      <main className="main">
        <Board />
      </main>
    </div>
  );
};

export default Homepage;
