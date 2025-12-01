import React, { useEffect, useState } from "react";
import axios from "axios";


const Profile = () => {
  const [volunteer, setVolunteer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const id = localStorage.getItem("userId");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:8800/volunteer/${id}`);
        setVolunteer(res.data);
      } catch (err) {
        console.error("Error loading profile", err);
        setError("Failed to load profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProfile();
    else {
      setError("No user ID found in localStorage.");
      setLoading(false);
    }
  }, [id]);

  if (loading) return <div className="profile-container">Loading profile...</div>;
  if (error) return <div className="profile-container error">{error}</div>;

  return (
    <div className="profile-container">
      <h2>👤 My Profile</h2>
      <div className="profile-card">
        <p><strong>Name:</strong> {volunteer.Name}</p>
        <p><strong>Contact Info:</strong> {volunteer.Contact_Info}</p>
        <p><strong>Skill:</strong> {volunteer.Skill}</p>
      </div>
    </div>
  );
};

export default Profile;
