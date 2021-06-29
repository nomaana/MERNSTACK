import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";

const Signup = () => {
  const history = useHistory();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (url) {
      uploadFields();
    }
  }, [url]);

  const uploadPic = () => {
    console.log(image, "image url");
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "insta-clone");
    data.append("cloud_name", "dsi86xggc");
    fetch("https://api.cloudinary.com/v1_1/dsi86xggc/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.url, "uuu");
        setUrl(data.url);
      })
      .catch((err) => console.log(err));
  };

  const uploadFields = async () => {
    await fetch("/signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
        pic: url,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.error) {
          M.toast({ html: result.error, classes: "red" });
        } else {
          M.toast({ html: result.message, classes: "green" });
          history.push("/login");
        }
      });
  };
  const onSubmit = async () => {
    if (image) {
      uploadPic();
    } else {
      uploadFields();
    }
  };
  return (
    <div>
      <div class="card  auth-card .input-field">
        <h2>Instagram</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="name"
        />
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
        />
        <input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
        />
        <div class="file-field input-field">
          <div class="btn waves-effect waves-light #64b5f6 blue lighten-2">
            <span>UPLOAD PIC</span>
            <input type="file" onChange={(e) => setImage(e.target.files[0])} />
          </div>
          <div class="file-path-wrapper">
            <input
              class="file-path validate"
              type="text"
              placeholder="Upload Image"
            />
          </div>
        </div>
        <button
          onClick={() => onSubmit()}
          type="submit"
          className="btn waves-effect waves-light #64b5f6 blue lighten-2 "
        >
          Signup
        </button>
        <h5>
          <Link to="/login">Already have an account ?</Link>
        </h5>
      </div>
    </div>
  );
};

export default Signup;
