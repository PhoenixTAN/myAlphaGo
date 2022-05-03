import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import "./index.scss";
import Homepage from "@Containers/Homepage";

const App = (
    <BrowserRouter>
        <Switch>
            <Route path='/' component={Homepage}/>
        </Switch>
    </BrowserRouter>
);

ReactDOM.render(App, document.getElementById("root"));
