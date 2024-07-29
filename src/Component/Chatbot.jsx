import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { marked } from "marked";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);
  const [userInput, setUserInput] = useState("");
  const API_KEY = "AIzaSyCEckqpho1EsIP5jYZ26PaGu6jkRDWHdww";
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  async function run() {
    let userInput = document.getElementById("userInput").value;
    if (userInput.trim() !== "") {
      const result = await model.generateContent(userInput);
      const response = result.response;
      const text = response.text();

      // Add user's message to the chatbox
      setMessages([...messages, { sender: "user", text: userInput }]);

      // Add user's input to the history
      setHistory([...history, { text: userInput }]);

      // Add chatbot's response to the chatbox
      setMessages((prevMessages) => [...prevMessages, { sender: "bot", text }]);

      // Clear user input field
      setUserInput("");

      let chatbox = document.getElementById("chatbox");
      chatbox.scrollTop = chatbox.scrollHeight;
    }
  }

  return (
    <div className="flex h-screen">
      <div className="bg-zinc-900 overflow-y-auto text-white w-1/4 p-4 fixed left-0 top-0 h-full">
        <h2 className="text-xl font-semibold mb-4">History :</h2>
        <ul>
          {history.map((entry, index) => (
            <li key={index} className="mb-2">
              <h3 className="bg-zinc-600 p-2 rounded">{entry.text}</h3>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex bg-zinc-800 w-3/4 fixed right-0 top-0 h-full">
        <div className="flex-1 flex flex-col rounded-lg shadow-lg m-4 overflow-hidden">
          <div className="p-4 border-b bg-white border-black">
            <h1 className="text-xl text-gray-700 font-semibold">
              Vansh AI BOT
            </h1>
          </div>
          <div
            className="p-4 text-white h-96 overflow-y-scroll flex-grow"
            id="chatbox"
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
              >
                <div
                  className={`inline-block p-2 m-2 rounded-lg ${msg.sender === "user" ? "bg-blue-600" : "bg-gray-700"
                    }`}
                  dangerouslySetInnerHTML={{ __html: marked(msg.text) }}
                />
              </div>
            ))}
          </div>
          <div className="p-4 border-t flex">
            <input
              id="userInput"
              type="text"
              className="flex-grow p-2 border rounded-l-lg focus:outline-none bg-gray-100"
              placeholder="Type your message..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
            <button
              className="bg-blue-700 text-white px-4 rounded-r-lg"
              onClick={run}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
