import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "/src/supabaseClient";
import "/src/styles/Post.css"; // Import the CSS file for styling

function Post() {
  const { id } = useParams(); // Get the post ID from the URL
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editImage, setEditImage] = useState("");

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    const { data, error } = await supabase
      .from("Posts")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching post:", error);
    } else {
      setPost(data);
      setEditTitle(data.Title);
      setEditContent(data.content);
      setEditImage(data.image);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const updatedComments = [...(post.Comments || []), newComment];

    const { data, error } = await supabase
      .from("Posts")
      .update({ Comments: updatedComments })
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error adding comment:", error);
    } else {
      setPost(data[0]);
      setNewComment("");
    }
  };

  const handleDeletePost = async () => {
    const { error } = await supabase.from("Posts").delete().eq("id", id);

    if (error) {
      console.error("Error deleting post:", error);
    } else {
      navigate("/");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from("Posts")
      .update({ Title: editTitle, content: editContent, image: editImage })
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error updating post:", error);
    } else {
      setPost(data[0]);
      setIsEditing(false);
    }
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div className="post-detail-container">
      {isEditing ? (
        <form onSubmit={handleEditSubmit} className="edit-form">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Title"
            className="edit-input"
          />
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="Content"
            className="edit-textarea"
          />
          <input
            type="text"
            value={editImage}
            onChange={(e) => setEditImage(e.target.value)}
            placeholder="Image URL"
            className="edit-input"
          />
          <div className="edit-buttons">
            <button type="submit" className="save-button">
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="cancel-button"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <h1 className="title">{post.Title}</h1>
          <p className="content">{post.content}</p>
          <img src={post.image} alt="" className="image" />
          <div className="post-buttons">
            <button onClick={() => setIsEditing(true)} className="edit-button">
              Edit Post
            </button>
            <button onClick={handleDeletePost} className="delete-button">
              Delete Post
            </button>
          </div>
        </>
      )}
      <div className="comments-section">
        <h2>Comments</h2>
        {post.Comments &&
          post.Comments.map((comment, index) => (
            <p key={index} className="comment">
              {comment}
            </p>
          ))}
        <form onSubmit={handleCommentSubmit} className="comment-form">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment"
            className="comment-input"
          />
          <button type="submit" className="comment-submit-button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default Post;
