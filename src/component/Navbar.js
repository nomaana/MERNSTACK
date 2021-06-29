import React, { useContext, useRef, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";
import { UserContext } from "../App";

const NavBar = () => {
  const { state, dispatch } = useContext(UserContext);
  const [search, setSearch] = useState("");
  const [userDetails, setUserDetails] = useState([]);
  const searchModel = useRef(null);
  const history = useHistory();
  const onLogout = () => {
    localStorage.clear();
    dispatch({ type: "CLEAR" });
    history.push("/login");
  };

  useEffect(() => {
    M.Modal.init(searchModel.current);
  }, []);

  const onSearchChange = (query) => {
    setSearch(query);
    fetch("/search-user", {
      method: "post",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        query,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        setUserDetails(result.user);
        console.log(result.user, "searhch");
      });
  };

  const renderList = () => {
    if (state) {
      return [
        <li key="1">
          <i
            data-target="modal1"
            className="large material-icons modal-trigger"
            style={{ color: "black" }}
          >
            search
          </i>
        </li>,
        <li key="2">
          <Link to="/profile">Profile</Link>
        </li>,
        <li key="3">
          <Link to="/createpost">Create Post</Link>
        </li>,
        <li key="4">
          <Link to="/myfollowingpost">My Following Post</Link>
        </li>,

        <li key="5">
          <button
            onClick={() => onLogout()}
            style={{
              marginRight: 20,
              backgroundColor: localStorage.getItem("user") ? "red" : "green",
            }}
            className="btn #C62828 red darken-3"
          >
            LOGOUT
          </button>
        </li>,
      ];
    } else {
      return [
        <li key="6">
          <Link to="/signup">Signup</Link>
        </li>,
        <li key="7">
          <Link to="/login">Signin</Link>
        </li>,
      ];
    }
  };

  return (
    <nav>
      <div className="nav-wrapper white">
        <Link to={state ? "/" : "/login"} className="brand-logo">
          Instagram
        </Link>
        <ul id="nav-mobile" className="right hide-on-med-and-down">
          {renderList()}
        </ul>
      </div>

      <div
        id="modal1"
        className="modal"
        ref={searchModel}
        style={{ color: "black" }}
      >
        <div className="modal-content">
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search user"
          />
          <ul className="collection">
            {userDetails.map((item) => {
              return (
                <Link
                  to={
                    item._id !== state._id
                      ? "/profile/" + item._id
                      : "/profile/"
                  }
                  onClick={() => {
                    M.Modal.getInstance(searchModel.current).close();
                    setUserDetails([]);
                    setSearch("");
                  }}
                >
                  <li className="collection-item">{item.email}</li>
                </Link>
              );
            })}
          </ul>
        </div>
        <div className="modal-footer">
          <button className="modal-close waves-effect waves-green btn-flat">
            search
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
