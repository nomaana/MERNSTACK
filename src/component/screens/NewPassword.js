import React, { useState, useEffect, useContext } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { UserContext } from "../../App";
import M from "materialize-css";
const NewPassword = () => {
  const [password, setPassword] = useState("");

  useEffect(() => {}, []);
  const history = useHistory();
  const tocken = useParams();
  console.log(tocken.tocken, "tocken111");
  const onSubmit = async () => {
    if (password === "") {
      M.toast({ html: "Enter Password", classes: "red" });
    } else {
      await fetch("/new-password", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: password,
          tocken: tocken.tocken,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            M.toast({ html: data.error, classes: "red" });
          } else {
            M.toast({ html: data.message, classes: "green" });
            // history.push("/");
            // console.log(data.user);
          }
        });
    }
  };

  return (
    <div>
      <div class="card  auth-card .input-field">
        <h2>Instagram</h2>
        <input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter New Password"
        />
        <button
          onClick={() => onSubmit()}
          type="submit"
          className="btn waves-effect waves-light #64b5f6 blue lighten-2 "
        >
          Update Password
        </button>
      </div>
    </div>
  );
};

export default NewPassword;
