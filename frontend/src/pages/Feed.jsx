import { useEffect, useState } from 'react';
import axios from '../api/axios'; 
import PostCard from '../components/PostCard';
import Navbar from '../components/Navbar';

const Feed = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get('/posts');
        console.log("Fetched posts:", res.data); 
        setPosts(res.data);
      } catch (err) {
        console.error('Failed to load posts', err);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="max-w-xl mx-auto p-4 space-y-6">
        {posts.length === 0 ? (
          <p className="text-center text-gray-500">No posts found</p>
        ) : (
          posts.map(post => <PostCard key={post._id} post={post} />)
        )}
      </div>
    </div>
  );
};

export default Feed;
