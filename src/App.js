import React from "react";
import Home from "./components/Home";
import { Route, Switch } from "react-router-dom/cjs/react-router-dom.min";
import "./App.css";

const App = () => {
  return (
    <div>
      <div className="header">
        <img src="../logo.svg" alt="Logo" />
      </div>
      <Switch>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </div>
  );
};
export default App;
