import { Check } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import JoinForm from "./JoinForm";
import MembersManager from "./MembersManager";
import "./styles.css";

const Pricing = () => {
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [showMembers, setShowMembers] = useState(false);

  const handleJoinClick = (planTitle) => {
    setSelectedPlan(planTitle);
    setShowJoinForm(true);
  };

  const handleJoinSuccess = (user) => {
    alert(`Welcome ${user.name}! You've joined the ${user.plan} plan successfully!`);
  };

  const pricing = [
    {
      imgUrl: "/pricing.jpg",
      title: "QUARTERLY",
      price: 7000,
      length: 3,
    },
    {
      imgUrl: "/pricing.jpg",
      title: "HALF_YEARLY",
      price: 12000,
      length: 6,
    },
    {
      imgUrl: "/pricing.jpg",
      title: "YEARLY",
      price: 17000,
      length: 12,
    },
  ];
  return (
    <section className="pricing">
      <h1>PRIME FITNESS PLANS</h1>
      <div className="admin-controls">
        <button onClick={() => setShowMembers(!showMembers)}>
          {showMembers ? 'Hide Members' : 'View All Members'}
        </button>
      </div>
      
      {showMembers && <MembersManager />}
      
      <div className="wrapper">
        {pricing.map((element) => {
          return (
            <div className="card" key={element.title}>
              <img src={element.imgUrl} alt={element.title} />
              <div className="title">
                <h1>{element.title}</h1>
                <h1>PACKAGE</h1>
                <h3>Rs {element.price}</h3>
                <p>For {element.length} Months</p>
              </div>
              <div className="description">
                <p>
                  <Check /> Equipment
                </p>
                <p>
                  <Check /> All Day Free Training
                </p>
                <p>
                  <Check /> Free Restroom
                </p>
                <p>
                  <Check /> 24/7 Skilled Support
                </p>
                <p>
                  <Check /> 20 Days Freezing Option
                </p>
                <button 
                  className="journey-btn" 
                  onClick={() => handleJoinClick(element.title)}
                >
                  Join Now
                </button>
              </div>
            </div>
          );
        })}
      </div>
      
      {showJoinForm && (
        <JoinForm 
          plan={selectedPlan}
          onClose={() => setShowJoinForm(false)}
          onSuccess={handleJoinSuccess}
        />
      )}
    </section>
  );
};

export default Pricing;
