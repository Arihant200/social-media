import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import Navbar from '../components/Navbar';

const Profile = () => {
  const { id } = useParams(); 
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loggedInUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, postsRes] = await Promise.all([
          axios.get(`/users/${id}`),
          axios.get(`/posts?authorId=${id}`)
        ]);
        setUser(userRes.data);
        setPosts(postsRes.data);
      } catch (err) {
        console.error('Error loading profile', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <p className="text-center mt-6">Loading...</p>;
  if (!user) return <p className="text-center mt-6 text-red-500">User not found.</p>;

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto p-4">
        <div className="flex items-center gap-4 mb-4">
          <img
            src={user?.avatar || '/default-avatar.png'}
            alt="Avatar"
            className="w-20 h-20 rounded-full"
          />
          <div>
            <h2 className="text-xl font-semibold">{user?.username || 'Unknown'}</h2>
            <p className="text-gray-600">{user?.bio || 'No bio yet.'}</p>
            {loggedInUser?._id === id ? (
              <button
                onClick={() => navigate('/edit-profile')}
                className="mt-2 px-4 py-1 bg-blue-500 text-white rounded"
              >
                Edit Profile
              </button>
            ) : (
              <button
                onClick={() => navigate(`/chat/${id}`)}
                className="mt-2 px-4 py-1 bg-green-500 text-white rounded"
              >
                Message
              </button>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Posts</h3>
          {posts.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className="border rounded shadow hover:shadow-lg cursor-pointer"
                  onClick={() => navigate(`/post/${post._id}`)}
                >
                  {post.imageUrl && (
                    <img
                      src={post.imageUrl}
                      alt="Post"
                      className="w-full h-40 object-cover rounded-t"
                    />
                  )}
                  <div className="p-2">
                    <p className="truncate">{post.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No posts yet.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
