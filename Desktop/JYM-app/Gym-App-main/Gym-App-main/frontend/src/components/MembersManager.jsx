import React, { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const MembersManager = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    try {
      const response = await fetch(`${API_URL}/members`);
      const data = await response.json();
      if (data.success) {
        setMembers(data.members);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteMember = async (memberId) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        const response = await fetch(`${API_URL}/members/${memberId}`, {
          method: 'DELETE'
        });
        const data = await response.json();
        if (data.success) {
          setMembers(members.filter(member => member._id !== memberId));
          alert('Member deleted successfully');
        } else {
          alert(data.message);
        }
      } catch (error) {
        alert('Error deleting member');
      }
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  if (loading) return <div>Loading members...</div>;

  return (
    <div className="members-manager">
      <h2>Gym Members ({members.length})</h2>
      <div className="members-list">
        {members.map(member => (
          <div key={member._id} className="member-card">
            <h3>{member.name}</h3>
            <p>Email: {member.email}</p>
            <p>Phone: {member.phone}</p>
            <p>Plan: {member.plan}</p>
            <p>Price: Rs {member.price}</p>
            <p>End Date: {new Date(member.endDate).toLocaleDateString()}</p>
            <button 
              onClick={() => deleteMember(member._id)}
              className="delete-btn"
            >
              Delete Member
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MembersManager;