import React, { useState } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Layout } from "antd";
import Homepage from "@Containers/Homepage";
import Game from "@Containers/Game";
import Header from "@Layouts/Header";
import Aside from "@Layouts/Aside";

import "./index.scss";

const { Content, Footer, Sider } = Layout;

const App = () => {
  

  return (
    <BrowserRouter>
      <Header />
      <main className="main">
        <Aside />
        <Switch>
          <Route exact path="/" component={Homepage} />
          <Route path="/game" component={() => <Game gameEngine={1} />} />
        </Switch>
      </main>
    </BrowserRouter>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
