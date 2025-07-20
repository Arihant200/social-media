import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";

const Navbar = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return null;

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleSearch = async (e) => {
    setQuery(e.target.value);
    if (e.target.value.length > 1) {
      const res = await axios.get(`/users/search?name=${e.target.value}`);
      setResults(res.data);
    } else {
      setResults([]);
    }
  };

  const handleSelectUser = (id) => {
    navigate(`/profile/${id}`);
    setQuery("");
    setResults([]);
  };
  console.log(user.id,'1')
  return (
    <div className="bg-white shadow p-4 flex items-center justify-between">
      <Link to="/" className="text-xl font-bold text-blue-600">
        MySocialApp
      </Link>

      <div className="relative w-1/3">
        <input
          type="text"
          placeholder="Search users..."
          value={query}
          onChange={handleSearch}
          className="border px-3 py-2 w-full rounded"
        />
        {results.length > 0 && (
          <ul className="absolute bg-white shadow rounded mt-1 w-full max-h-48 overflow-y-auto z-10">
            {results.map((user) => (
              <li
                key={user._id}
                onClick={() => handleSelectUser(user._id)}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {user.username}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex items-center gap-4">
        <Link to="/" className="text-gray-700 hover:text-blue-600">Feed</Link>
        
        <Link to={`/profile/${user.id}`} className="text-gray-700 hover:text-blue-600">Profile</Link>
        <Link to="/chat" className="text-gray-700 hover:text-blue-600">Chat</Link>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Logout
        </button>
        <img
          src={user.avatar || "/default-avatar.png"}
          alt="Avatar"
          className="w-8 h-8 rounded-full"
        />
      </div>
    </div>
  );
};

export default Navbar;
