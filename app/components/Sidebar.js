'use client'
import React from 'react';

const categories = [
  { name: '일상', id: 1 },
  { name: '취미', id: 2 },
  { name: '기술', id: 3 },
  { name: '여행', id: 4 },
  { name: '운동', id: 5 },
  { name: '음악', id: 6 },
  { name: '영화', id: 7 },
  { name: '독서', id: 8 },
];

const Sidebar = ({ onSelect }) => {
  return (
    <div className="bg-gray-800 text-white w-64 h-full p-4 shadow-lg">
      <h2 className="text-lg font-bold mb-4">카테고리</h2>
      <ul>
        {categories.map((category) => (
          <li key={category.id} className="mb-2">
            <button
              className="flex items-center bg-gray-700 hover:bg-gray-600 w-full text-left p-2 rounded transition duration-200"
              onClick={() => onSelect(category.name)}
            >
              <span className="mr-2">
                {/* 카테고리 아이콘 추가 (예시로 이모지 사용) */}
                {category.name === '운동' && '🏋️‍♂️'}
                {category.name === '음악' && '🎶'}
                {category.name === '영화' && '🎬'}
                {category.name === '독서' && '📚'}
                {category.name === '일상' && '🗓️'}
                {category.name === '취미' && '🎨'}
                {category.name === '기술' && '💻'}
                {category.name === '여행' && '✈️'}
              </span>
              {category.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
