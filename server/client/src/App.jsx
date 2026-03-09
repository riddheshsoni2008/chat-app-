import { useState, useEffect } from "react";
import { io } from "socket.io-client";

function App() {
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [room] = useState("riddhesh-riya");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  // socket connect
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join_room", (room) => {
      socket.join(room);
    });

    socket.on("send_message", (data) => {
      console.log("message:", data);
      socket.to(data.room).emit("receive_message", data);
    });
  });

  const joinChat = () => {
    if (nameInput !== "" && socket) {
      setUsername(nameInput);
      socket.emit("join_room", room);
    }
  };

  const sendMessage = () => {
    if (message === "" || !socket) return;

    const messageData = {
      room: room,
      user: username,
      text: message,
    };

    socket.emit("send_message", messageData);

    // show own message
    setChat((prev) => [...prev, messageData]);

    setMessage("");
  };

  if (!username) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-xl shadow w-[90%] max-w-sm text-center">
          <h1 className="text-xl font-bold mb-4">Private Chat</h1>

          <input
            className="border w-full p-2 rounded mb-3"
            placeholder="Enter your name"
            onChange={(e) => setNameInput(e.target.value)}
          />

          <button
            onClick={joinChat}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          >
            Join Chat
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <div className="w-full max-w-md h-full md:h-[600px] bg-white flex flex-col shadow-lg">
        <div className="bg-blue-600 text-white p-4 text-center font-bold">
          Couple Chat 💬
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-2">
          {chat.map((msg, index) => (
            <div
              key={index}
              className={`max-w-[70%] p-2 rounded-lg text-sm ${
                msg.user === username
                  ? "bg-blue-500 text-white ml-auto"
                  : "bg-gray-300"
              }`}
            >
              <p className="text-xs opacity-70">{msg.user}</p>
              {msg.text}
            </div>
          ))}
        </div>

        <div className="flex p-3 border-t">
          <input
            className="flex-1 border rounded-lg px-3 py-2"
            placeholder="Type message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <button
            onClick={sendMessage}
            className="ml-2 bg-blue-600 text-white px-4 rounded-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
