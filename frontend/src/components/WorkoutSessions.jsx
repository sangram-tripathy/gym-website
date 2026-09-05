import React from "react";

const WorkoutSessions = () => {
  return (
    <section className="workout_session">
  <div className="wrapper">
    <h1>TOP WORKOUT SESSIONS</h1>
    <p>
      Achieve your fitness goals with expertly designed workout sessions for
      every fitness level. Whether you're building strength, improving
      endurance, or losing weight, our personalized training programs help you
      stay motivated and see real results.
    </p>
    <img src="/img5.jpg" alt="workout" />
  </div>

  <div className="wrapper">
    <h1>FEATURED BOOTCAMPS</h1>
    <p>
      Challenge yourself with high-energy bootcamp programs led by certified
      trainers. Improve your strength, stamina, agility, and confidence in a
      supportive group environment designed to keep you pushing forward.
    </p>

    <div className="bootcamps">
      <div>
        <h4>Strength & Muscle Building</h4>
        <p>
          Build lean muscle, increase strength, and improve overall performance
          with progressive resistance training programs.
        </p>
      </div>

      <div>
        <h4>Weight Loss & Fat Burn</h4>
        <p>
          Burn calories efficiently through high-intensity workouts and
          personalized fitness plans designed for sustainable weight loss.
        </p>
      </div>

      <div>
        <h4>Functional Fitness Training</h4>
        <p>
          Enhance flexibility, balance, mobility, and core strength with
          exercises that improve your everyday movement and athletic
          performance.
        </p>
      </div>

      <div>
        <h4>Cardio & Endurance Challenge</h4>
        <p>
          Boost your cardiovascular health and stamina with energetic cardio
          sessions that keep your heart strong and your body active.
        </p>
      </div>
    </div>
  </div>
</section>
  );
};

export default WorkoutSessions;
