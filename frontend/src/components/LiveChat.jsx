import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import gsap from 'gsap';

const socket = io('http://localhost:5000');

const LiveChat = () => {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [username, setUsername] = useState('');
  const [hasJoined, setHasJoined] = useState(false);
  
  const chatBoxRef = useRef(null);
  const containerRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // GSAP Entrance
    gsap.fromTo(containerRef.current, 
      { y: 50, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    );

    socket.on('receive_message', (data) => {
      setMessages((prev) => [...prev, data]);
      scrollToBottom();
    });

    return () => {
      socket.off('receive_message');
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleJoin = (e) => {
    e.preventDefault();
    if(username.trim() !== '') {
      setHasJoined(true);
      // GSAP bounce
      gsap.from(chatBoxRef.current, { scale: 0.9, duration: 0.4, ease: "back.out(1.7)" });
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (currentMessage.trim() !== '') {
      const messageData = {
        id: Math.random(),
        author: username,
        message: currentMessage,
        time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
      };

      await socket.emit('send_message', messageData);
      setMessages((prev) => [...prev, messageData]);
      setCurrentMessage('');
      scrollToBottom();
    }
  };

  return (
    <div ref={containerRef} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-3xl shadow-xl shadow-purple-500/10 border border-purple-100 dark:border-gray-700 overflow-hidden flex flex-col h-[500px]">
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-4 text-white">
        <h3 className="font-black text-xl flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          Live Fan Lounge
        </h3>
        <p className="text-xs font-bold opacity-80">Chat in real-time with Swifties worldwide!</p>
      </div>

      {!hasJoined ? (
        <div className="flex-grow flex flex-col items-center justify-center p-8 text-center">
          <div className="bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-gray-700 dark:to-gray-800 p-6 rounded-3xl w-full max-w-sm">
            <h4 className="font-black text-xl mb-4 text-gray-800 dark:text-gray-100">Enter the Lounge</h4>
            <form onSubmit={handleJoin}>
              <input 
                type="text" 
                placeholder="Pick a display name..." 
                maxLength="15"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-purple-500 mb-4 font-bold"
              />
              <button className="w-full bg-purple-600 text-white font-black py-3 rounded-xl hover:bg-purple-700 transition transform hover:-translate-y-1">
                Join Chat
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div ref={chatBoxRef} className="flex-grow flex flex-col h-full bg-gray-50/50 dark:bg-gray-900/50">
          <div className="flex-grow p-4 overflow-y-auto space-y-4 custom-scrollbar">
            {messages.length === 0 ? (
              <div className="text-center text-gray-400 dark:text-gray-500 font-bold mt-10">
                It's quiet in here... say hello!
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.author === username ? 'items-end' : 'items-start'}`}>
                  <span className="text-xs font-bold text-gray-500 mb-1 px-2">{msg.author} • {msg.time}</span>
                  <div className={`px-4 py-2 rounded-2xl max-w-[85%] ${msg.author === username ? 'bg-purple-500 text-white rounded-tr-sm' : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-sm shadow-sm'}`}>
                    <p className="font-medium leading-relaxed">{msg.message}</p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
            <form onSubmit={sendMessage} className="flex gap-2">
              <input 
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                placeholder="Message the lounge..."
                className="flex-grow p-3 rounded-xl bg-gray-100 dark:bg-gray-900 border-transparent focus:ring-2 focus:ring-purple-500 font-medium text-gray-900 dark:text-gray-100"
              />
              <button type="submit" disabled={!currentMessage.trim()} className="bg-purple-600 disabled:opacity-50 text-white p-3 rounded-xl hover:bg-purple-700 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-90" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveChat;
