import React from "react";

const WorkoutSessions = () => {
  return (
    <section className="workout_session">
      <div className="wrapper">
        <h1>TOP WORKOUT SESSION</h1>
        <p>A well-structured workout targeting all major muscle groups, including warm-up,
          main exercises, and cool-down. Designed for all fitness levels to build strength,
          stamina, and flexibility safely.</p>
      
        <img src="/img5.jpg" alt="workout" />
      </div>
      <div className="wrapper">
        <h1>FEATURED BOOTCAMPS</h1>
        <p>
       Intense, focused training programs designed to burn fat, build strength, and boost endurance.
       Handpicked sessions led by expert trainers to help you achieve fast and effective results. </p>
        <div className="bootcamps">
          <div>
            <h4>Fat Burn Bootcamp</h4>
            <p>
             A high-intensity program focused on burning maximum calories through cardio and strength moves.
              Perfect for weight loss and improving endurance.
            </p>
          </div>
          <div>
            <h4>Strength & Power Bootcamp.</h4>
            <p>
            Designed to build muscle and increase overall strength with weight training, resistance, and functional exercises. 
            Ideal for boosting power and stamina.
            </p>
          </div>
          <div>
            <h4>Cardio Blast Bootcamp</h4>
            <p>
              An energetic session packed with heart-pumping cardio exercises to improve stamina, speed, and cardiovascular health.
               Great for fat loss and energy.
            </p>
          </div>
          <div>
            <h4>Core & Abs Bootcamp</h4>
            <p>
            Targets the abdominal muscles and core stability with focused exercises like planks, crunches, and twists.
             Builds a strong, toned midsection.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkoutSessions;
