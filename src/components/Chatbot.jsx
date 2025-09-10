import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen]       = useState(false);
  const [messages, setMessages]   = useState([
    { sender: 'bot', text: "Hi! Ask me anything." }
  ]);
  const [input, setInput]         = useState('');
  const [loading, setLoading]     = useState(false);

  const toggleChat = () => setIsOpen(o => !o);

const handleSend = async () => {
  if (!input.trim() || loading) return;
  const userText = input.trim();
  setMessages(msgs => [...msgs, { sender:'user', text:userText }]);
  setInput('');
  setLoading(true);

  try {
    const res = await fetch('http://127.0.0.1:5000/api/chat', {  // 👈 explicit backend URL
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      credentials: 'include', // optional if using cookies
      body: JSON.stringify({ message: userText })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const { reply } = await res.json();
    setMessages(msgs => [...msgs, { sender:'bot', text: reply }]);
  } catch (err) {
    console.error(err);
    setMessages(msgs => [
      ...msgs,
      { sender:'bot', text: "⚠️ Sorry, something went wrong." }
    ]);
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      <div
        className="fixed bottom-6 right-6 bg-blue-600 p-3 rounded-full shadow-lg cursor-pointer z-50"
        onClick={toggleChat}
      >
        {isOpen ? <X size={24}/> : <MessageCircle size={24}/>}
      </div>

      {isOpen && (
        <div className="fixed bottom-20 right-6 w-[300px] sm:w-[350px] bg-gray-900 rounded-xl shadow-xl text-white flex flex-col z-50">
          <div className="p-4 border-b border-gray-700 text-blue-400 font-semibold">
            🤖 AI Assistant
          </div>
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((m,i) => (
              <div
                key={i}
                className={`max-w-[80%] p-2 rounded-md text-sm ${
                  m.sender==='bot'
                   ? 'bg-gray-800 text-left'
                   : 'bg-blue-600 text-right self-end'
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>
          <div className="flex items-center border-t border-gray-700 px-3 py-2 bg-gray-800">
            <input
              type="text"
              placeholder="Type a question..."
              value={input}
              onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>e.key==='Enter' && handleSend()}
              className="flex-1 bg-transparent outline-none text-white placeholder-gray-400 pr-3"
              disabled={loading}
            />
            <button
              onClick={handleSend}
              className="text-blue-400 hover:text-blue-500 transition disabled:opacity-50"
              disabled={loading}
            >
              <Send size={20}/>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
