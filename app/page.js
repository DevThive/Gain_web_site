'use client'
import React, { useState } from 'react';
import axios from 'axios'; // Axios 임포트
import Sidebar from './components/Sidebar';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('일상');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // 사이드바 상태 추가
  const [message, setMessage] = useState(''); // 메시지 상태 추가
  const [chatMessages, setChatMessages] = useState([]); // 채팅 메시지 배열 추가

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // 사이드바 토글 함수
  };

  const handleSendMessage = async () => {
    if (!message) return; // 메시지가 비어있으면 전송하지 않음

    try {
      // API 요청
      const response = await axios.post('https://your-api-url.com/send-message', {
        category: selectedCategory,
        content: message,
      });

      // 성공적으로 메시지를 보낸 후, 입력한 메시지를 업데이트
      setChatMessages([...chatMessages, { ...response.data, user: '나', timestamp: new Date().toLocaleTimeString() }]);
      setMessage(''); // 메시지 입력창 비우기
    } catch (error) {
      console.error('메시지 전송 실패:', error);
    }
  };

  return (
    <div className="flex">
      {isSidebarOpen && <Sidebar onSelect={setSelectedCategory} />} {/* 사이드바 조건부 렌더링 */}
      <div className="flex-grow bg-gray-100 min-h-screen flex flex-col">
        <header className="bg-white shadow p-4 flex items-center">
          <button onClick={toggleSidebar} className="btn btn-primary">사이드바 열기</button>
          <h2 className="text-lg font-bold ml-4">{selectedCategory} 채팅방</h2>
        </header>
        <div className="flex-grow p-4">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-md mx-auto flex-grow">
            <div className="p-4 h-96 overflow-y-scroll" id="chat-box">
              {chatMessages.map((msg, index) => (
                <div key={index} className="mb-4">
                  <div className="flex items-start">
                    <div className="avatar">
                      <div className="w-10 rounded-full">
                        <img src="https://via.placeholder.com/150" alt="User" />
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className="bg-blue-500 text-white p-2 rounded-lg">
                        {msg.content}
                      </div>
                      <p className="text-gray-500 text-xs">{msg.user} - {msg.timestamp}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t">
              <div className="flex">
                <input 
                  type="text" 
                  placeholder="메시지를 입력하세요..." 
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)} 
                  className="input input-bordered flex-grow" 
                />
                <button className="btn btn-primary ml-2" onClick={handleSendMessage}>전송</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
