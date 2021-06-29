import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import M from "materialize-css";

const Reset = () => {
  const [email, setEmail] = useState("");

  useEffect(() => {}, []);
  const history = useHistory();
  const onSubmit = async () => {
    if (
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      M.toast({ html: "invalid Email", classes: "red" });
    } else {
      await fetch("/reset-password", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            M.toast({ html: data.error, classes: "red" });
          } else {
            M.toast({ html: data.message, classes: "green" });
            history.push("/login");
            console.log(data.user);
          }
        });
    }
  };

  const onEmailChange = (value) => {
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
        <button
          onClick={() => onSubmit()}
          type="submit"
          className="btn waves-effect waves-light #64b5f6 blue lighten-2 "
        >
          Reset Password
        </button>
      </div>
    </div>
  );
};

export default Reset;
