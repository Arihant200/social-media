import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../api/axios";
import Navbar from "../components/Navbar";

const PostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postRes, commentsRes] = await Promise.all([
          axios.get(`/posts/${id}`),
          axios.get(`/comments?postId=${id}`),
        ]);
        setPost(postRes.data);
        setComments(commentsRes.data);
        setLoading(false);
      } catch (err) {
        console.error(" Failed to load post/comments:", err);
        setError("Failed to load post.");
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleComment = async () => {
    if (!commentText.trim()) return;

    try {
      const res = await axios.post(
        "/comments",
        {
          postId: id,
          content: commentText,
        },
        {
          headers: { Authorization: `Bearer ${user?.token}` },
        }
      );
      setComments((prev) => [...prev, res.data]); 
      setCommentText("");
    } catch (err) {
      console.error(" Error posting comment:", err);
    }
  };

  const handleLike = async () => {
    try {
      const res = await axios.post(
        `/posts/${id}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${user?.token}` },
        }
      );
      setPost(res.data); 
    } catch (err) {
      console.error(" Failed to like post:", err);
    }
  };

  const handleProfileClick = () => {
    const authorId =
      typeof post.author === "object" ? post.author._id : post.author;
    navigate(`/profile/${authorId}`);
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  if (loading) return <div className="text-center mt-6">Loading post...</div>;
  if (error) return <div className="text-center text-red-500 mt-6">{error}</div>;

  const likedBy = post.likedBy || [];
  const isLiked = likedBy.includes(user.id);

  const authorUsername =
    typeof post.author === "object" ? post.author.username : "Unknown";
  const authorAvatar =
    typeof post.author === "object"
      ? post.author.avatar
      : "/default-avatar.png";

  return (
    <>
      <Navbar />
      <div className="max-w-xl mx-auto p-4">
        <div className="bg-white shadow p-4 rounded mb-6">
          <div className="flex items-center mb-2">
            <img
              onClick={handleProfileClick}
              src={authorAvatar}
              alt="avatar"
              className="w-10 h-10 rounded-full cursor-pointer"
            />
            <span
              className="ml-2 font-semibold cursor-pointer"
              onClick={handleProfileClick}
            >
              {authorUsername}
            </span>
          </div>

          <p className="text-lg">{post.content}</p>
          {post.imageUrl && (
            <img src={post.imageUrl} alt="post" className="mt-2 rounded" />
          )}

          <div className="mt-4 text-gray-700 flex items-center gap-4">
            <button onClick={handleLike} className="hover:text-red-500">
              {isLiked ? "❤️" : "🤍"} {likedBy.length}
            </button>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-2">Comments</h2>

        <div className="space-y-3 mb-4">
          {comments.map((c) => (
            <div key={c._id} className="bg-gray-100 p-2 rounded">
              <p>{c.content}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="border p-2 flex-1 rounded"
            placeholder="Write a comment"
          />
          <button
            onClick={handleComment}
            className="bg-blue-500 text-white px-4 rounded"
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
};

export default PostDetails;
