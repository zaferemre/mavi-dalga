"use client";

import { useState, useEffect } from "react";
import TeamModal from "../../components/TeamModal";
import TeamCard from "../../components/TeamCard";
import { getTeamMembers } from "../../sanity/lib/getTeam"; // Fetch team members

export default function Ekibimiz() {
  const [members, setMembers] = useState([]); // Initialize state
  const [selectedMember, setSelectedMember] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    async function fetchData() {
      try {
        const teamData = await getTeamMembers();
        setMembers(teamData);
      } catch (error) {
        console.error("Error fetching team members:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-6 ">
      <h1 className="text-4xl font-bold mb-6">Ekibimiz</h1>

      {/* Show loading state while fetching data */}
      {loading ? (
        <p className="text-center text-gray-500">Loading team members...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {members.map((member) => (
            <TeamCard
              key={member._id}
              member={member}
              onClick={setSelectedMember}
            />
          ))}
        </div>
      )}

      {/* Render modal if a member is selected */}
      {selectedMember && (
        <TeamModal
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
        />
      )}
    </div>
  );
}
