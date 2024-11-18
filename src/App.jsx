import { useEffect, useState } from "react";
import { useRoutes, Route, Routes } from "react-router-dom";

import reactLogo from "./assets/react.svg";
import "./App.css";

import Navbar from "./components/navbar.jsx";
import Home from "./pages/home.jsx";
import CreatePost from "./pages/CreatePost.jsx";
import Post from "./pages/post.jsx";
import UpdatePost from "./pages/UpdatePost.jsx";

import { supabase } from "./supabaseClient";

function App() {
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    try {
      const { data, error } = await supabase.from("Posts").select();
      if (error) console.log("error", error);
      setPosts(data);
    } catch (error) {
      console.log("error in getData", error);
    }
  }
  const handleSearch = (filtered) => {
    setFilteredPosts(filtered);
  };

  return (
    <div className="container">
      <Navbar posts={posts} onSearch={handleSearch} />
      <Routes>
        <Route
          path="/"
          element={
            <Home
              postsInfo={filteredPosts.length > 0 ? filteredPosts : posts}
            />
          }
        ></Route>
        <Route path="/CreatePost" element={<CreatePost />}></Route>
        <Route path="/Post/:id" element={<Post posts={posts} />}></Route>
        <Route path="/UpdatePost:id" element={<UpdatePost />}></Route>
      </Routes>
    </div>
  );
}

export default App;
