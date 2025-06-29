
import React from 'react';
import GoogleAd from './GoogleAd';

const SidebarAd = () => {
  return (
    <div className="sticky top-4">
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <p className="text-xs text-gray-500 mb-2 text-center">Advertisement</p>
        <GoogleAd 
          adSlot="5566778899" 
          adFormat="rectangle"
          style={{ display: 'block', width: '300px', height: '250px' }}
        />
      </div>
    </div>
  );
};

export default SidebarAd;
