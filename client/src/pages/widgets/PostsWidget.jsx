import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import PostWidget from "./PostWidget";

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);

  const getPosts = async () => {
    try {
      const response = await fetch("http://localhost:5000/posts", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // console.log("no error");
      const data = await response.json();
      dispatch(setPosts({ posts: data }));
    } catch (error) {
      console.log(error);
    }
  };

  const getUserPosts = async () => {
    try {
      const response = await fetch(`http://localhost:5000/posts/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // console.log("no error");

      const data = await response.json();
      dispatch(setPosts({ posts: data }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isProfile) {
      // console.log("user posts");
      getUserPosts();
    } else {
      // console.log("user posts ");

      getPosts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // console.log(posts);

  return (
    <>
      {posts.message !== "connect ETIMEDOUT 34.197.224.93:27017" &&
        posts?.map(
          ({
            _id,
            userId,
            firstName,
            lastName,
            description,
            occupation,
            picturePath,
            userPicturePath,
            likes,
            comments,
          }) => {
            return (
              <PostWidget
                key={_id}
                postId={_id}
                postUserId={userId}
                name={`${firstName} ${lastName !== undefined ? lastName : ""}`}
                description={description}
                occupation={occupation}
                picturePath={picturePath}
                userPicturePath={userPicturePath}
                likes={likes}
                comments={comments}
              />
            );
          }
        )}
    </>
  );
};

export default PostsWidget;
