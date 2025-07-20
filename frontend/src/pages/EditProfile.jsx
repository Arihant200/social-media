import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import Navbar from '../components/Navbar';

const EditProfile = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [form, setForm] = useState({ username: '', bio: '', avatar: '' });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/users/${user._id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        const { username, bio, avatar } = res.data;
        setForm({ username, bio, avatar });
      } catch (err) {
        console.error('Failed to fetch user info');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await axios.put(`/users/${user._id}`, form, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      navigate(`/profile/${user._id}`);
    } catch (err) {
      console.error('Failed to update profile', err);
    }
  };

  if (loading) return <p className="text-center mt-4">Loading...</p>;

  return (
    <div>
      <Navbar />
      <div className="max-w-xl mx-auto p-4">
        <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>
        <div className="space-y-4">
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Username"
          />
          <input
            name="avatar"
            value={form.avatar}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Avatar URL"
          />
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Bio"
          />
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
