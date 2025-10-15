import React from 'react';
import './tooplate-stellaris-style.css';
function ResumeSection () {
  return (
    <div className='resume'>
      <h1 className='resume-name'>WORK EXPERIENCE AS FREELANCER</h1>
      <p className='p1'> Captured and edited high-quality photos and videos for various clients, including events, portraits, and creative projects.
          Utilized professional editing software such as Lightroom, Canva, and Davinci Resolve to enhance visual storytelling and ensure polished final outputs.
          Collaborated with clients to meet project goals, maintain visual consistency, and deliver content aligned with their creative vision.
          Managed the entire production process — from planning and shooting to post-production — ensuring timely and professional results. </p>
      <p className='resume-p'>Click the button below to download my resume.</p>
      <a
        href="/Rolando Majait RESUME.pdf" // Replace with your resume file path
        download="My_Resume.pdf"
        style={{
          padding: '10px 20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '5px',
          fontSize: '16px',
          marginTop: '20px',
          display: 'inline-block',
          transition: 'background-color 0.3s ease',
        }}
      >
        Download Resume
      </a>
    </div>
  );
}

export default ResumeSection;