import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home-page">
      <div>
        <p className="text py-3">KOD ACIKTIRIR</p>
        <p className="text py-3">PİZZA, DOYURUR</p>
      </div>

      <div className="my-5">
        <Link to="/pizza">
          <button id="order-pizza" type="button">
            ACIKTIM
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
