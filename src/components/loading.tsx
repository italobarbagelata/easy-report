'use client';
import React from 'react';

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="border-t-4 border-blue-500 rounded-full animate-spin w-30 h-30" />
    </div>
  );
};

export default Loading;