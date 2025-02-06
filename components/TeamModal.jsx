"use client";

import { useEffect, useRef } from "react";

const TeamModal = ({ member, onClose }) => {
  const modalRef = useRef(null);

  if (!member) return null;

  // Close modal when Escape key is pressed
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      {/* Modal Content */}
      <div
        ref={modalRef}
        className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-700 hover:text-black"
        >
          ✖
        </button>

        {/* Modal Body */}
        <img
          src={member.image?.asset?.url}
          alt={member.name}
          className="w-full h-64 object-cover rounded-t-lg mb-4"
        />
        <h2 className="text-2xl font-bold">{member.name}</h2>
        <p className="text-lg text-gray-500">{member.role}</p>
        <p className="mt-3 text-gray-700">{member.bio}</p>
      </div>
    </div>
  );
};

export default TeamModal;
