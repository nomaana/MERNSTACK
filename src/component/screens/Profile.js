import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
import "./profile.css";
const Profile = () => {
  const { state, dispatch } = useContext(UserContext);
  const [image, setImage] = useState("");
  const [mypics, setPics] = useState([]);

  useEffect(() => {
    mypost();
  }, []);

  const mypost = async () => {
    await fetch("/mypost", {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setPics(result.data);
      });
  };

  useEffect(() => {
    if (image) {
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
          console.log(data, "update profile");

          fetch("/updatepic", {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
              pic: data.url,
            }),
          })
            .then((res) => res.json())
            .then((result) => {
              localStorage.setItem(
                "user",
                JSON.stringify({ ...state, pic: result.pic })
              );
              dispatch({ type: "UPDATEPIC", payload: result.pic });
            });
        })
        .catch((err) => console.log(err));
    }
  }, [image]);

  const UpdatePhoto = (file) => {
    setImage(file);
  };

  return (
    <div>
      <div style={{ maxWidth: "550px", margin: "0px auto" }}>
        <div
          style={{
            margin: "18px 0px",
            borderBottom: "1px solid grey",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              margin: "18px 0px",
              // borderBottom: "1px solid grey",
            }}
          >
            <div>
              <img
                style={{
                  width: "160px",
                  height: "160px",
                  borderRadius: "80px",
                }}
                src={state ? state.pic : "loading"}
              />
            </div>
            <div>
              <h4>{state ? state.name : "loading"}</h4>
              <h6>{state ? state.email : "loading"}</h6>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "300px",
                }}
              >
                <h6>{mypics.length} post</h6>
                <h6>{state ? state.followers.length : "0"} followers</h6>
                <h6>{state ? state.following.length : "0"} following</h6>
              </div>
            </div>
          </div>
          <div class="file-field input-field" style={{ margin: "10px" }}>
            <div class="btn waves-effect waves-light #64b5f6 blue lighten-2">
              <span>update pic</span>
              <input
                type="file"
                onChange={(e) => UpdatePhoto(e.target.files[0])}
              />
            </div>
            <div class="file-path-wrapper">
              <input
                class="file-path validate"
                type="text"
                placeholder="Upload Image"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="gallery">
        {mypics.map((value) => (
          <img className="item" src={value.photo} />
        ))}
      </div>
    </div>
  );
};

export default Profile;
