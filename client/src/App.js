import React, { Fragment, useEffect } from "react";
import "./App.css";
import Landing from "./Component/Landing";
import Navbar from "./Component/Navbar";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Register from "./Component/Authentication/Register";
import Login from "./Component/Authentication/Login";
import Alert from "./Component/Layout/Alert";
import { loadUser } from "./Component/actions/authaction";
// Redux
import { Provider } from "react-redux";
import store from "./store";
import setAuthToken from "./Utils/setAuthToken";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}
const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);
  return (
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
};

export default App;
