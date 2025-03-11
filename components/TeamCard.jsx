"use client";

const TeamCard = ({ member, onClick }) => {
  return (
    <div
      className="bg-white border border-gray-200 rounded-lg shadow-sm cursor-pointer"
      onClick={() => onClick(member)}
    >
      {/* Image with rounded top */}
      <img
        src={member.image?.asset?.url || "logoBig.webp"}
        alt={member.name}
        className="w-full h-64 object-cover rounded-t-lg"
      />

      {/* Content */}
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {member.role}
        </p>
      </div>
    </div>
  );
};

export default TeamCard;
