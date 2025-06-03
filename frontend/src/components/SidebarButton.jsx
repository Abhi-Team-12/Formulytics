import React from 'react';

export default function SidebarButton({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="
        flex items-center w-full gap-3 
        px-3 py-2 sm:px-4 sm:py-2 
        rounded-md bg-white text-green-900 font-semibold 
        hover:bg-green-100 transition-all
      "
    >
      <span className="text-lg sm:text-xl">{icon}</span>
      <span className="text-xs sm:text-sm">{label}</span>
    </button>
  );
}
