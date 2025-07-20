import { useEffect, useState, useRef } from "react";
import axios from "../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

const Chat = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);

  const { id: selectedUserIdFromUrl } = useParams();
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const messagePollerRef = useRef(null);

 
  useEffect(() => {
    if (!loggedInUser?.token) {
      navigate("/login");
    }
  }, [loggedInUser, navigate]);

 
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/users");
        setUsers(res.data);

        if (selectedUserIdFromUrl) {
          const found = res.data.find((u) => u._id === selectedUserIdFromUrl);
          if (found) setSelectedUser(found);
        }
      } catch (err) {
        console.error("Error loading users", err);
      }
    };

    fetchUsers();
  }, [selectedUserIdFromUrl]);


  useEffect(() => {
    if (!selectedUser) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(`/chat/${selectedUser._id}`);
        const newMessages = res.data;

        const isDifferent =
          messages.length !== newMessages.length ||
          JSON.stringify(messages) !== JSON.stringify(newMessages);

        if (isDifferent) {
          setMessages(newMessages);
        }
      } catch (err) {
        console.error(" Failed to fetch messages:", err);
      } finally {
        setLoadingMessages(false);
      }
    };

    setLoadingMessages(true);
    fetchMessages();

    if (messagePollerRef.current) {
      clearInterval(messagePollerRef.current);
    }
    messagePollerRef.current = setInterval(fetchMessages, 5000);

    return () => clearInterval(messagePollerRef.current);
  }, [selectedUser]);

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    const optimistic = {
      senderId: loggedInUser.id,
      content: newMessage,
      tempId: Date.now(),
    };

    setMessages((prev) => [...prev, optimistic]);
    setNewMessage("");

    try {
      await axios.post("/chat/send", {
        senderId: loggedInUser.id,
        receiverId: selectedUser._id,
        message: newMessage,
      });

      const res = await axios.get(`/chat/${selectedUser._id}`);
      setMessages(res.data);
    } catch (err) {
      console.error("Send failed:", err);
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    navigate(`/chat/${user._id}`);
  };

  return (
    <div>
      <Navbar />
      <div className="flex max-w-5xl mx-auto p-4 gap-6">
       
        <div className="w-1/3 border-r pr-4">
          <h2 className="font-semibold mb-3">Chats</h2>
          <ul className="space-y-2">
            {users.map((u) => (
              <li
                key={u._id}
                className={`cursor-pointer p-2 rounded hover:bg-gray-100 ${
                  selectedUser?._id === u._id ? "bg-gray-200" : ""
                }`}
                onClick={() => handleUserClick(u)}
              >
                {u.username}
              </li>
            ))}
          </ul>
        </div>

       
        <div className="w-2/3">
          {selectedUser ? (
            <div className="flex flex-col h-full">
              <h2 className="font-semibold mb-4 border-b pb-2">
                Chat with {selectedUser.username}
              </h2>

              <div className="flex-1 overflow-y-auto space-y-2 mb-4 max-h-[400px]">
                {loadingMessages ? (
                  <p className="text-sm text-gray-500">Loading messages...</p>
                ) : messages.length > 0 ? (
                  messages.map((msg, i) => (
                    <div
                      key={msg._id || msg.tempId || i}
                      className={`p-2 rounded max-w-xs text-sm ${
                        msg.senderId === loggedInUser.id
                          ? "bg-blue-500 text-white ml-auto"
                          : "bg-gray-200"
                      }`}
                    >
                      {msg.content}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No messages yet.</p>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message"
                  className="border p-2 flex-1 rounded"
                />
                <button
                  onClick={handleSend}
                  className="bg-blue-500 text-white px-4 rounded"
                >
                  Send
                </button>
              </div>
            </div>
          ) : (
            <p>Select a user to start chatting</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
