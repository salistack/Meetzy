import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, AlertTriangle, Shield, Lightbulb } from 'lucide-react';
import axios from 'axios';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatSafetyInfo = (safetyInfo) => (
    <div className="mt-3 p-3 bg-orange-50 border-l-4 border-orange-400 rounded-lg text-sm space-y-2">
      {safetyInfo.related_risks?.length > 0 && (
        <div className="mb-2">
          <div className="flex items-center gap-2 text-orange-600 mb-2">
            <AlertTriangle size={16} />
            <p className="font-semibold">Related Risks</p>
          </div>
          <ul className="list-disc pl-6 space-y-1">
            {safetyInfo.related_risks.map((risk, i) => (
              <li key={i} className="text-orange-700">{risk}</li>
            ))}
          </ul>
        </div>
      )}
      {safetyInfo.platform_protections?.length > 0 && (
        <div className="mb-2">
          <div className="flex items-center gap-2 text-green-600 mb-2">
            <Shield size={16} />
            <p className="font-semibold">Platform Protections</p>
          </div>
          <ul className="list-disc pl-6 space-y-1">
            {safetyInfo.platform_protections.map((protection, i) => (
              <li key={i} className="text-green-700">{protection}</li>
            ))}
          </ul>
        </div>
      )}
      {safetyInfo.user_tips?.length > 0 && (
        <div>
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <Lightbulb size={16} />
            <p className="font-semibold">User Tips</p>
          </div>
          <ul className="list-disc pl-6 space-y-1">
            {safetyInfo.user_tips.map((tip, i) => (
              <li key={i} className="text-blue-700">{tip}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post(
        '/api/chatbot/chat',
        { message: input },
        {
          withCredentials: true,
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          }
        }
      );

      const botMessage = {
        text: response.data.response,
        safetyInfo: response.data.safety_info,
        sender: 'bot',
        rawData: response.data
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat Error:', error.response?.data || error.message);
      const errorMessage = {
        text: error.response?.data?.error || "Service temporarily unavailable",
        sender: 'bot'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const sampleQuestions = [
    "Is it safe to meet people on Meetzy?",
    "What if someone bothers me?",
    "Does Meetzy protect my personal information?",
    "How do I report illegal or suspicious activity on Meetzy?"
  ];

  const handleSampleQuestionClick = (question) => {
    if (!isLoading) {
      setInput(question);
      handleSubmit({ preventDefault: () => {} }); // Simulate form submission
    }
  };

  return (
    <div
      className={`fixed bottom-5 right-5 ${
        isOpen ? 'w-full max-w-md bg-white rounded-xl shadow-2xl h-[500px]' : 'w-16 h-16 rounded-full bg-gradient-to-r from-indigo-700 to-purple-600'
      } transition-all duration-300`}
    >
      {/* Header */}
      <div
        className={`cursor-pointer flex justify-center items-center ${
          isOpen ? 'p-4 rounded-t-xl bg-gradient-to-r from-indigo-700 to-purple-600' : 'w-full h-full'
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bot className="text-white" size={isOpen ? 20 : 28} />
        {isOpen && (
          <h3 className="text-white font-semibold text-base ml-2">Meetzy Safety Assistant</h3>
        )}
      </div>

      {/* Chat Body */}
      {isOpen && (
        <div className="flex flex-col h-[calc(100%-64px)]">
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
            {/* Sample Questions */}
            {messages.length === 0 && (
              <div className="mb-4">
                <p className="text-gray-600 font-semibold mb-2">Try asking:</p>
                <ul className="space-y-2">
                  {sampleQuestions.map((question, index) => (
                    <li key={index}>
                      <button
                        onClick={() => handleSampleQuestionClick(question)}
                        className="text-indigo-600 hover:underline"
                      >
                        {question}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Messages */}
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-end gap-2 max-w-[85%]`}>
                  {msg.sender === 'bot' && <Bot className="text-gray-400" size={20} />}
                  <div
                    className={`p-4 rounded-xl text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-white text-black-900 border border-gray-200 shadow'
                        : 'bg-white text-gray-900 border border-gray-200 shadow'
                    }`}
                  >
                    <p>{msg.text}</p>
                    {msg.safetyInfo && formatSafetyInfo(msg.safetyInfo)}
                  </div>
                  {msg.sender === 'user' && <User className="text-indigo-600" size={20} />}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-gray-500">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300" />
                </div>
                <span className="text-sm">Thinking...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                disabled={isLoading}
                aria-label="Chat input"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="absolute right-2 top-2.5 p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send size={18} />
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
