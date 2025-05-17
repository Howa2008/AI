import React, { useState, useRef, useEffect } from 'react';
import { aiAPI } from '../api';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';

export default function DemoPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'system',
      content: 'Welcome to Omnia AI! I\'m here to assist you with various tasks. What can I help you with today?'
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const endOfMessagesRef = useRef(null);
  
  // Scroll to bottom of chat when messages change
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!input.trim() || isProcessing) return;
    
    // Add user message to chat
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);
    
    try {
      // Create a prompt from the conversation history
      const conversationHistory = messages
        .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
        .join('\n');
      
      const prompt = `${conversationHistory}\nUser: ${input}\nAssistant:`;
      
      // Get AI response
      const response = await aiAPI.generateText(prompt, 300);
      
      // Add AI response to chat
      setMessages(prev => [...prev, { role: 'assistant', content: response.text }]);
    } catch (error) {
      console.error('Error generating response:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I apologize, but I encountered an error while processing your request. Please try again later.' 
      }]);
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <Layout>
      <PageHeader 
        title="Omnia AI Demo"
        description="Experience the power of Omnia AI with this interactive demo"
      />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Chat container */}
          <div className="h-96 overflow-y-auto p-4 bg-gray-50">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`flex mb-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`rounded-lg px-4 py-2 max-w-xs sm:max-w-md ${
                    message.role === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="flex justify-start mb-4">
                <div className="bg-gray-200 text-gray-800 rounded-lg px-4 py-2">
                  <div className="flex space-x-2">
                    <div className="animate-ping h-2 w-2 bg-gray-400 rounded-full"></div>
                    <div className="animate-ping h-2 w-2 bg-gray-400 rounded-full animation-delay-200"></div>
                    <div className="animate-ping h-2 w-2 bg-gray-400 rounded-full animation-delay-400"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={endOfMessagesRef} />
          </div>
          
          {/* Input form */}
          <div className="border-t border-gray-200 p-4">
            <form onSubmit={handleSubmit} className="flex">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                disabled={isProcessing}
              />
              <button
                type="submit"
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={isProcessing || !input.trim()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </form>
            <p className="mt-2 text-xs text-gray-500 text-center">
              This is a demo of Omnia AI's conversational capabilities. Try asking questions or giving it tasks to complete.
            </p>
          </div>
        </div>
        
        {/* Demo features */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Try asking about:</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900">General Knowledge</h3>
              <p className="text-sm text-gray-600 mt-1">
                "What is artificial intelligence?"
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900">Task Planning</h3>
              <p className="text-sm text-gray-600 mt-1">
                "Help me plan a weekly content schedule."
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900">Creative Writing</h3>
              <p className="text-sm text-gray-600 mt-1">
                "Write a short poem about technology."
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900">Problem Solving</h3>
              <p className="text-sm text-gray-600 mt-1">
                "How might I optimize my website's loading time?"
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900">Code Help</h3>
              <p className="text-sm text-gray-600 mt-1">
                "Write a function to find prime numbers in JavaScript."
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900">Omnia AI Features</h3>
              <p className="text-sm text-gray-600 mt-1">
                "What makes Omnia AI different from other platforms?"
              </p>
            </div>
          </div>
        </div>
        
        {/* Full version CTA */}
        <div className="mt-10 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg shadow-lg p-6 text-white">
          <h2 className="text-xl font-bold">Experience the full power of Omnia AI</h2>
          <p className="mt-2">
            This demo showcases just a fraction of Omnia AI's capabilities. Sign up for the full version to access all features including local computer control, multi-agent collaboration, and more.
          </p>
          <div className="mt-4">
            <a
              href="/register"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-blue-700 bg-white hover:bg-gray-100"
            >
              Sign up for free
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}
