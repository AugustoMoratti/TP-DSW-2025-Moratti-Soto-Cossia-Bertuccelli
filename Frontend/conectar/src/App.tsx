import React from "react";
import Hero from "./components/hero/hero";
import Navbar from "./components/navbar/navbar.tsx";
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

