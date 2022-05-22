import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Homepage from "@Containers/Homepage";
import "./index.scss";
import Header from "layouts/Header";

const App = (
    <BrowserRouter>
    <Header></Header>
        <Switch>
            <Route path='/' component={Homepage}/>
        </Switch>
    </BrowserRouter>
);

ReactDOM.render(App, document.getElementById("root"));
