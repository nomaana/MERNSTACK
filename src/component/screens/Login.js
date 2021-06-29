import React, { useState, useEffect, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../../App";
import M from "materialize-css";
const Login = () => {
  const { state, dispatch } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {}, []);
  const history = useHistory();
  const onSubmit = async () => {
    if (
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      M.toast({ html: "invalid Email", classes: "red" });
    } else if (password === "") {
      M.toast({ html: "Enter Password", classes: "red" });
    } else {
      await fetch("/signin", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            M.toast({ html: data.error, classes: "red" });
          } else {
            localStorage.setItem("jwt", data.tocken);
            localStorage.setItem("user", JSON.stringify(data.user));
            dispatch({ type: "USER", payload: data.user });
            M.toast({ html: data.message, classes: "green" });
            // history.push("/");
            console.log(data.user);
          }
        });
    }
  };

  const onEmailChange = (value) => {
    // if (
    //   !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    //     value
    //   )
    // ) {
    //   M.toast({ html: "invalid Email", classes: "red" });
    // }
    setEmail(value);
  };
  return (
    <div>
      <div class="card  auth-card .input-field">
        <h2>Instagram</h2>
        <input
          type="text"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="email"
        />
        <input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
        />
        <button
          onClick={() => onSubmit()}
          type="submit"
          className="btn waves-effect waves-light #64b5f6 blue lighten-2 "
        >
          Login
        </button>
        <h5>
          <Link to="/signup">Create an account ?</Link>
          <Link to="/reset">reset password?</Link>
        </h5>
      </div>
    </div>
  );
};

export default Login;
