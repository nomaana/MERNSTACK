import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
import { useParams } from "react-router-dom";
import "./profile.css";
const UserProfile = () => {
  const { state, dispatch } = useContext(UserContext);
  const { userid } = useParams();
  const [userProfile, setprofile] = useState(null);
  const [showfollow, setShowFollow] = useState(
    state ? !state.following.includes(userid) : true
  );
  useEffect(() => {
    mypost();
  }, []);

  const mypost = async () => {
    await fetch(`/user/${userid}`, {
      method: "get",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result, "userprofile");
        setprofile(result);
      })
      .catch((err) => console.log(err));
  };

  const followUser = () => {
    console.log("follow called");
    fetch("/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userid,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        dispatch({
          type: "UPDATE",
          payload: { following: result.following, followers: result.followers },
        });
        localStorage.setItem("user", JSON.stringify(result));
        console.log(result, "followews");
        setprofile((prevState) => {
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: [...prevState.user.followers, result._id],
            },
          };
        });
        setShowFollow(false);
      })
      .catch((err) => console.log(err));
  };

  const unfollowUser = () => {
    console.log("unfollow called");
    fetch("/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        unfollowId: userid,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        dispatch({
          type: "UPDATE",
          payload: { following: result.following, followers: result.followers },
        });
        localStorage.setItem("user", JSON.stringify(result));
        console.log(result, "unfollow");
        setprofile((prevState) => {
          const newFollower = prevState.user.followers.filter(
            (item) => item != result._id
          );
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: newFollower,
            },
          };
        });
        setShowFollow(true);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      {userProfile ? (
        <div>
          <div style={{ maxWidth: "550px", margin: "0px auto" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                margin: "18px 0px",
                borderBottom: "1px solid grey",
              }}
            >
              <div>
                <img
                  style={{
                    width: "160px",
                    height: "160px",
                    borderRadius: "80px",
                  }}
                  src={userProfile.user.pic}
                />
              </div>
              <div>
                <h4>{userProfile.user.name}</h4>
                <h6>{userProfile.user.email}</h6>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "300px",
                  }}
                >
                  <h6> {userProfile.posts.length} post</h6>
                  <h6>{userProfile.user.followers.length} followers</h6>
                  <h6>{userProfile.user.following.length} following</h6>
                </div>
                {showfollow ? (
                  <button
                    style={{ margin: "10px" }}
                    onClick={() => followUser()}
                    type="submit"
                    className="btn waves-effect waves-light #64b5f6 blue lighten-2 "
                  >
                    Follow
                  </button>
                ) : (
                  <button
                    style={{ margin: "10px" }}
                    onClick={() => unfollowUser()}
                    type="submit"
                    className="btn waves-effect waves-light #64b5f6 blue lighten-2 "
                  >
                    UnFollow
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="gallery">
            {userProfile.posts.map((value) => (
              <img className="item" src={value.photo} />
            ))}
          </div>
        </div>
      ) : (
        <h6>loading...</h6>
      )}
    </>
  );
};

export default UserProfile;
