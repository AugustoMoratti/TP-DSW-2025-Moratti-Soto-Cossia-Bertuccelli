import React from "react";
import Navbar from "./components/navbar/navbar";
import Hero from "./components/hero/hero";
import "./app.css";

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <Navbar />
      <Hero />
    </div>
  );
};

export default Home;

