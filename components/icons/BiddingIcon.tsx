import React from 'react';

const BiddingIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 11V3m0 8h8m-8 0l-8 8m8-8l8 8m-4-4v4m0 0h4m-4 0l4-4m-4 4l-4 4" />
  </svg>
);

export default BiddingIcon;
