import React, { useState, useEffect } from "react";
import M from "materialize-css";

function CreatePost() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");

  const postDetails = () => {
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
        onCreatePost(data.url);
      })
      .catch((err) => console.log(err));
  };

  const onCreatePost = async (urlLink) => {
    console.log(urlLink, "urlLink11");
    await fetch("/createpost", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        title: title,
        body: body,
        pic: urlLink,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "response");
        M.toast({ html: data.message, classes: "green" });
      })
      .catch((err) => {
        M.toast({ html: err.message, classes: "red" });
      });
  };
  return (
    <div>
      <div
        class="card  auth-card .input-field"
        style={{
          margin: "30px auto",
          maxWidth: "500px",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />
        <input
          type="text"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Body"
        />

        <div class="file-field input-field">
          <div class="btn">
            <span>UPLOAD IMAGE</span>
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
          onClick={() => postDetails()}
          type="submit"
          className="btn waves-effect waves-light green lighten-2 "
        >
          SUBMIT POST
        </button>
      </div>
    </div>
  );
}

export default CreatePost;
