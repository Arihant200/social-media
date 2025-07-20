import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from '../api/axios';

const PostCard = ({ post }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const [liked, setLiked] = useState(post.likedBy.includes(user.id));
  const [likesCount, setLikesCount] = useState(post.likedBy.length);

  const handleLike = async () => {
    try {
      await axios.post(`/posts/${post._id}/like`, {}, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

     
      setLiked(!liked);
      setLikesCount(prev => liked ? prev - 1 : prev + 1);
    } catch (err) {
      console.error('Failed to like the post', err);
    }
  };

  const handleCommentClick = () => {
    navigate(`/post/${post._id}`);
  };

  const handleProfileClick = () => {
    const authorId = typeof post.author === 'object' ? post.author._id : post.author;
    navigate(`/profile/${authorId}`);
  };

  const authorUsername = typeof post.author === 'object' ? post.author.username : 'Unknown';
  const authorAvatar = typeof post.author === 'object' ? post.author.avatar : '/default-avatar.png';

  return (
    <div className="bg-white shadow rounded-xl p-4">
      <div className="flex items-center mb-2">
        <img
          onClick={handleProfileClick}
          src={authorAvatar || '/default-avatar.png'}
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

      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt="Post"
          className="w-full h-auto rounded-md mb-2"
        />
      )}

      <p className="mb-2">{post.content}</p>

      <div className="flex gap-6 text-gray-600">
        <button onClick={handleLike} className="hover:text-red-500">
          {liked ? '❤️' : '🤍'} {likesCount}
        </button>
        <button onClick={handleCommentClick} className="hover:text-blue-500">
          💬 Comments
        </button>
      </div>
    </div>
  );
};

export default PostCard;
