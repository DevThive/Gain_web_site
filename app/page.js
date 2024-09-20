"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Sidebar from "./components/Sidebar";

// 랜덤 닉네임 생성 함수
const generateRandomNickname = () => {
  const nicknames = [
    "사람1",
    "사람2",
    "사람3",
    "사람4",
    "사람5",
    "사람6",
    "사람7",
    "사람8",
  ];
  const randomIndex = Math.floor(Math.random() * nicknames.length);
  return nicknames[randomIndex];
};

// 시간 형식 변환 함수
const formatTimeAgo = (timestamp) => {
  const now = new Date();
  const messageTime = new Date(timestamp);
  const timeDiff = Math.floor((now - messageTime) / 1000); // 초 단위 차이

  if (timeDiff < 60) {
    return `${timeDiff}초 전`;
  } else if (timeDiff < 3600) {
    const minutes = Math.floor(timeDiff / 60);
    return `${minutes}분 전`;
  } else {
    const hours = Math.floor(timeDiff / 3600);
    return `${hours}시간 전`;
  }
};

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("일상");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [nickname, setNickname] = useState("");
  const chatBoxRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const fetchMessages = async () => {
    try {
      const encodedCategory = encodeURIComponent(selectedCategory);
      const response = await axios.get(
        `http://localhost:4000/chat/${encodedCategory}`
      );

      if (Array.isArray(response.data)) {
        setChatMessages(response.data);
      } else {
        console.error("받은 데이터가 배열이 아닙니다:", response.data);
        setChatMessages([]);
      }
    } catch (error) {
      console.error("메시지 불러오기 실패:", error);
      setChatMessages([]);
    }
  };

  const handleSendMessage = async () => {
    if (!message) return;

    try {
      const response = await axios.post(
        "http://localhost:4000/chat/send-message",
        {
          category: selectedCategory,
          content: message,
          user: nickname,
        }
      );

      setChatMessages((prevMessages) => [
        ...prevMessages,
        {
          content: message,
          user: nickname,
          timestamp: new Date().toISOString(),
        },
      ]);
      setMessage("");
      scrollToBottom();
    } catch (error) {
      console.error("메시지 전송 실패:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [selectedCategory]);

  useEffect(() => {
    const randomNickname = generateRandomNickname();
    setNickname(randomNickname);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  return (
    <div className="flex">
      {isSidebarOpen && <Sidebar onSelect={setSelectedCategory} />}
      <div className="flex-grow bg-gray-100 min-h-screen flex flex-col">
        <header className="bg-white shadow p-4 flex items-center">
          <button onClick={toggleSidebar} className="btn btn-primary">
            사이드바 열기
          </button>
          <h2 className="text-lg font-bold ml-4">{selectedCategory} 채팅방</h2>
        </header>
        <div className="flex-grow p-4">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-md mx-auto flex-grow">
            <div
              className="p-4 h-96 overflow-y-scroll"
              id="chat-box"
              ref={chatBoxRef}
            >
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
                      <p className="text-gray-500 text-xs">
                        {msg.user} - {formatTimeAgo(msg.timestamp)}{" "}
                        {/* 형식 변환 */}
                      </p>
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
                  onKeyDown={handleKeyDown} // 엔터 키 이벤트 핸들러 추가
                  className="input input-bordered flex-grow"
                />
                <button
                  className="btn btn-primary ml-2"
                  onClick={handleSendMessage}
                >
                  전송
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
