import React from "react";
import Navbar from "./components/navbar/navbar";
import Hero from "./components/hero/hero";
import "./app.css";


const Home: React.FC = () => {

  return (
    <div className="home-container">
      <Navbar />
      <div className="divisor"></div>
      <Hero />
    </div>
  );
  
};

export default Home;

