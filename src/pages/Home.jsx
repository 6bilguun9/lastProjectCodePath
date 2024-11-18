import "/src/styles/home.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { faUpLong } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { supabase } from "/src/supabaseClient";

export default function Home(props) {
  const [updatePosts, setUpdatePosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  console.log(updatePosts);

  const [count, setCount] = useState(0);
  const [color, setColor] = useState(false);

  useEffect(() => {
    setUpdatePosts(props.postsInfo);
  }, [props.postsInfo]);

  const updateLike = async (id, LikeCount, ColorCount) => {
    try {
      const { data, error } = await supabase
        .from("Posts")
        .update({
          LikeCount: LikeCount + (count === 0 ? 1 : -1),
          ColorCount: !ColorCount,
        })
        .eq("id", id)
        .select();

      if (error) throw error;
      setUpdatePosts(
        updatePosts.map((prevData) =>
          prevData.id === id
            ? {
                ...prevData,
                LikeCount: data[0].LikeCount,
                ColorCount: data[0].ColorCount,
              }
            : prevData
        )
      );
      console.log(data);
      return data;
    } catch (error) {
      console.log("error", error);
    }
  };
  const addLike = async (id, LikeCount, ColorCount) => {
    try {
      count === 0 ? setCount(1) : setCount(0);
      color === false ? setColor(true) : setColor(false);
      await updateLike(id, LikeCount, ColorCount);
    } catch (error) {
      console.error("Error in addLike:", error);
    }
  };
  const popularSort = () => {
    const sortedPosts = updatePosts.sort((a, b) => {
      return b.LikeCount - a.LikeCount;
    });
    setUpdatePosts([...sortedPosts]);
  };
  const latestSort = () => {
    const sortedPosts = updatePosts.sort((a, b) => {
      return new Date(b.created_at) - new Date(a.created_at);
    });
    setUpdatePosts([...sortedPosts]);
  };

  return (
    <div className="home-container">
      <div className="filter">
        <button onClick={popularSort}>Popular</button>
        <button onClick={latestSort}>Latest</button>
      </div>
      {updatePosts
        ? updatePosts.map((post) => {
            const formatTimestamp = (timestamp) => {
              const date = new Date(timestamp);
              return new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }).format(date);
            };
            return (
              <Link
                className="post-container"
                to={`/Post/${post.id}`}
                key={post.id}
              >
                <p className="post-time">{formatTimestamp(post.created_at)}</p>
                <h1 className="title">{post.Title}</h1>
                <p className="content">{post.content}</p>
                <img
                  src={post.image ? post.image : null}
                  alt=""
                  className="image"
                />
                <div className="like-count">
                  <FontAwesomeIcon
                    icon={faUpLong}
                    style={
                      post.ColorCount === false
                        ? { color: "#f9f9f9" }
                        : { color: "#563A9C" }
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      addLike(post.id, post.LikeCount, post.ColorCount);
                    }}
                  />
                  <p>{post.LikeCount}</p>
                </div>
              </Link>
            );
          })
        : "Loading..."}
    </div>
  );
}
