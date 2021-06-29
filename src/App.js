import React, { useEffect, createContext, useReducer, useContext } from "react";
import Navbar from "./component/Navbar";
import "./App.css";
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import Home from "./component/screens/Home";
import Login from "./component/screens/Login";
import Signup from "./component/screens/Signup";
import Profile from "./component/screens/Profile";
import UserProfile from "./component/screens/UserProfile";

import CreatePost from "./component/screens/CreatePost";
import { initialState, reducer } from "../src/redux/reducers/UserReducer";
import SubscribesUserPosts from "./component/screens/SubscribesUserPosts";
import NewPassword from "./component/screens/NewPassword";
import Reset from "./component/screens/Reset";

export const UserContext = createContext();

const Routing = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "USER", payload: user });
      history.push("/");
    } else {
      if (!history.location.pathname.startsWith("/reset"))
        history.push("/login");
    }
  }, []);

  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/signup">
        <Signup />
      </Route>
      <Route path="/reset/:tocken">
        <NewPassword />
      </Route>
      <Route exact path="/reset">
        <Reset />
      </Route>
      <Route path="/login">
        <Login />
      </Route>
      <Route exact path="/profile">
        <Profile />
      </Route>
      <Route path="/createpost">
        <CreatePost />
      </Route>
      <Route path="/profile/:userid">
        <UserProfile />
      </Route>
      <Route path="/myfollowingpost">
        <SubscribesUserPosts />
      </Route>
    </Switch>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Navbar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
