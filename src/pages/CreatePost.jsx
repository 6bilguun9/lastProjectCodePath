import "/src/styles/createPost.css";

import { supabase } from "/src/supabaseClient";
import { useState } from "react";

export default function CreatePost() {
  const [Title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");

  const handleCreate = async () => {
    const { data, error } = await supabase
      .from("Posts")
      .insert([{ Title, content, image }])
      .select();
    if (data) {
      console.log("Post created:", data);
      setTitle("");
      setContent("");
      setImage("");
    } else if (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    if (name === "title") {
      setTitle(value);
    } else if (name === "content") {
      setContent(value);
    } else if (name === "image") {
      setImage(value);
    }
  };
  return (
    <div className="createPost-container">
      <input
        className="title"
        name="title"
        placeholder="Title"
        onChange={handleChange}
        value={Title}
      />
      <input
        className="content"
        name="content"
        placeholder="Content"
        onChange={handleChange}
        value={content}
      />
      <input
        className="image"
        name="image"
        placeholder="Image Url"
        onChange={handleChange}
        value={image}
      />

      <button onClick={handleCreate}>Create Post</button>
    </div>
  );
}
