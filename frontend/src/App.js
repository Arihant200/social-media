import { BrowserRouter, Routes, Route,Navigate } from 'react-router-dom';
import Login from './auth/Login';
import Register from './auth/Register';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import PostDetails from './pages/PostDetails';
import Chat from './pages/Chat';
import PrivateRoute from './components/PrivateRoute';
import EditProfile from './pages/EditProfile';
function App() {
    const token = localStorage.getItem('token');
  return (
   
      <Routes>
        <Route
          path="/"
          element={
            token ? <Navigate to="/feed" /> : <Navigate to="/login" />
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/feed"
          element={
            <PrivateRoute>
              <Feed />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile/:id"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/post/:id"
          element={
            <PrivateRoute>
              <PostDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />
        <Route path="/chat/:id" element={<Chat />} />
        <Route path="/edit-profile" element={<EditProfile />} />

      </Routes>
    
  );
}

export default App;
