import React, { Fragment } from "react";
import "./App.css";
import Landing from "./Component/Landing";
import Navbar from "./Component/Navbar";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Register from "./Component/Authentication/Register";
import Login from "./Component/Authentication/Login";
import Alert from "./Component/Layout/Alert";
// Redux
import { Provider } from "react-redux";
import store from "./store";
const App = () => (
  <Provider store={store}>
    <Router>
      <Fragment>
        <Navbar />
        <Route exact path="/" component={Landing} />
        <section className="container">
          <Alert />
          <Switch>
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
          </Switch>
        </section>
      </Fragment>
    </Router>
  </Provider>
);

export default App;
