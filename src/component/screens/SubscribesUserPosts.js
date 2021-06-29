import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../App.js";
const SubscribesUserPosts = () => {
  const [user, setUser] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    onfetch();
  }, []);

  const onfetch = async () => {
    await fetch("/getsubpost", {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result, "subscribe");
        setUser(result.post);
      });
  };

  const likePost = async (id) => {
    console.log("function is called111");
    await fetch("/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = user.map((item) => {
          if (item._id === result.result._id) {
            return result.result;
          } else {
            return item;
          }
        });
        setUser(newData);
      });
  };

  const unlikePost = async (id) => {
    await fetch("/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = user.map((item) => {
          if (item._id === result.result._id) {
            return result.result;
          } else {
            return item;
          }
        });
        setUser(newData);
      });
  };

  const makeComment = async (comment, id) => {
    await fetch("/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
        text: comment,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = user.map((item) => {
          if (item._id === result.result._id) {
            return result.result;
          } else {
            return item;
          }
        });
        setUser(newData);
      })
      .catch((err) => console.log(err));
  };

  const deletePost = async (id) => {
    await fetch(`/deletepost/:${id}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result, "delete post");
        const newData = user.filter((item) => {
          return item._id != result.result._id;
        });
        setUser(newData);
      });
  };

  const deleteComment = async (id) => {
    await fetch(`/deleteComment/:${id}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result, "delete post");
        const newData = user.comments.filter((item) => {
          return item._id != result.result._id;
        });
        setUser(newData);
      });
  };

  return (
    <div>
      {user
        .slice(0)
        .reverse()
        .map((value) => (
          <div className="home" key={value._id}>
            <div className="card home-card center">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingRight: "10px",
                  paddingLeft: "10px",
                }}
              >
                <h5>
                  <Link
                    to={
                      value.postedBy._id != state._id
                        ? "/profile/" + value.postedBy._id
                        : "/profile/"
                    }
                  >
                    {value.postedBy.name}
                  </Link>
                </h5>
                {value.postedBy._id == state._id && (
                  <i
                    onClick={() => deletePost(value._id)}
                    style={{ marginTop: "15px" }}
                    class="material-icons"
                  >
                    delete
                  </i>
                )}
              </div>
              <div className="card-image">
                {value.photo == "no photo" ? (
                  <img src="https://images.unsplash.com/photo-1500964757637-c85e8a162699?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" />
                ) : (
                  <img src={value.photo} />
                )}
              </div>
            </div>
            <div className="card-content">
              <i className="material-icons" style={{ color: "red" }}>
                favorite
              </i>
              {value.likes.includes(state._id) ? (
                <i
                  style={{ color: "blue" }}
                  onClick={() => unlikePost(value._id)}
                  class="material-icons"
                >
                  thumb_down
                </i>
              ) : (
                <i
                  onClick={() => likePost(value._id)}
                  class="material-icons"
                  style={{
                    marginRight: 10,
                    marginLeft: 10,
                    color: "blue",
                  }}
                >
                  thumb_up
                </i>
              )}

              <h6> likes {value.likes.length}</h6>
              <h6>{value.title}</h6>
              <p>{value.body}</p>
              {value.comments.map((comment) => {
                return (
                  <h6
                    key={comment._id}
                    style={{ display: "flex", padding: "5px" }}
                  >
                    {value.postedBy._id == state._id && (
                      <i
                        // onClick={() => deleteComment(comment._id)}
                        class="material-icons"
                      >
                        delete
                      </i>
                    )}
                    <span style={{ fontWeight: "500", marginRight: "6px" }}>
                      {comment.postedBy.name}
                    </span>
                    {comment.text}
                  </h6>
                );
              })}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  makeComment(e.target[0].value, value._id);
                }}
              >
                <input type="text" placeholder="add a comment" />
              </form>
            </div>
          </div>
        ))}
    </div>
  );
};

export default SubscribesUserPosts;
