"use client";

import { motion } from "motion/react";

const TeamCard = ({ member }) => {
  const img = member?.image?.asset?.url || "/logoBig.webp";

  return (
    <motion.article
      className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm"
      whileHover={{ y: -4, boxShadow: "0 10px 30px rgba(0,0,0,0.12)" }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
    >
      {/* Shared image element */}
      <motion.div
        layoutId={`img-${member._id}`}
        className="relative w-full aspect-[4/5]"
      >
        <img
          src={img}
          alt={member.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </motion.div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
        <p className="text-sm text-gray-500">{member.role}</p>
      </div>
    </motion.article>
  );
};

export default TeamCard;
