import React, { useEffect, useRef } from 'react';
import './tooplate-stellaris-style.css';
import Slider from './Slider.jsx';
import ResumeSection from "./ResumeSection";

export default function App() {
  const canvasRef = useRef(null);


  useEffect(() => {
    // ---------- Starfield setup ----------
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let stars = [];
    let animationId;


    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }


    class Star {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.z = Math.random() * 1000;
        this.prevX = this.x;
        this.prevY = this.y;
      }


      update() {
        this.z -= 2;
        if (this.z <= 0) {
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
          this.z = 1000;
          this.prevX = this.x;
          this.prevY = this.y;
        }


        this.prevX = this.x;
        this.prevY = this.y;


        this.x = (this.x - canvas.width / 2) * (1000 / this.z) + canvas.width / 2;
        this.y = (this.y - canvas.height / 2) * (1000 / this.z) + canvas.height / 2;
      }


      draw() {
        const opacity = Math.max(0, 1 - this.z / 1000);
        const size = Math.max(0, (1000 - this.z) / 1000 * 3);


        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
        ctx.fillStyle = '#f8fafc';
        ctx.fill();


        if (size > 1) {
          ctx.beginPath();
          ctx.moveTo(this.prevX, this.prevY);
          ctx.lineTo(this.x, this.y);
          ctx.strokeStyle = '#8b5cf6';
          ctx.lineWidth = size * 0.5;
          ctx.stroke();
        }
        ctx.restore();
      }
    }


    function initStars() {
      stars = [];
      for (let i = 0; i < 800; i++) {
        stars.push(new Star());
      }
    }


    function animate() {
      ctx.fillStyle = 'rgba(15, 15, 35, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);


      stars.forEach(star => {
        star.update();
        star.draw();
      });


      animationId = requestAnimationFrame(animate);
    }


    // ---------- Cosmic particles ----------
    const createdParticles = [];
    function createCosmicParticles() {
      for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'cosmic-particle';
        const size = Math.random() * 6 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = Math.random() * 4 + 6 + 's';
        document.body.appendChild(particle);
        createdParticles.push(particle);
      }
    }


    // ---------- Tab / Menu / Scroll behaviour ----------
    function setupUI() {
      // Mission tabs
      const missionTabs = document.querySelectorAll('.mission-tab');
      const missionContents = document.querySelectorAll('.mission-content');


      missionTabs.forEach(tab => {
        tab.addEventListener('click', () => {
          missionTabs.forEach(t => t.classList.remove('active'));
          missionContents.forEach(c => c.classList.remove('active'));


          tab.classList.add('active');
          const tabId = tab.getAttribute('data-tab');
          const el = document.getElementById(tabId);
          if (el) el.classList.add('active');
        });
      });


      // Mobile menu toggle
      const mobileToggle = document.getElementById('mobile-toggle');
      const navMenu = document.getElementById('nav-menu');
      if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
          mobileToggle.classList.toggle('active');
          navMenu.classList.toggle('active');
        });


        document.querySelectorAll('.nav-menu a').forEach(link => {
          link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
          });
        });
      }


      // Smooth scroll for anchor links
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
          const href = this.getAttribute('href');
          if (!href || href === '#') return;
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      });


      // Navbar scroll effects and fade in
      function onScroll() {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 50) {
          navbar && navbar.classList.add('scrolled');
        } else {
          navbar && navbar.classList.remove('scrolled');
        }


        const sections = document.querySelectorAll('.fade-in');
        sections.forEach(section => {
          const rect = section.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.8) {
            section.classList.add('visible');
          }
        });
      }


      window.addEventListener('scroll', onScroll);


      // Contact form demo submit
      const contactForm = document.querySelector('.contact-form');
      function onSubmit(e) {
        e.preventDefault();
        alert('Research proposal submitted! 🌌 (This is a demo)');
      }
      contactForm && contactForm.addEventListener('submit', onSubmit);


      // Active menu highlighting using IntersectionObserver
      const sections = document.querySelectorAll('section');
      const navLinks = document.querySelectorAll('nav ul a');


      const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -70% 0px',
        threshold: 0
      };


      function onIntersect(entries) {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const activeId = entry.target.getAttribute('id');
            navLinks.forEach(link => link.classList.remove('active'));
            const activeLink = document.querySelector(`nav ul a[href="#${activeId}"]`);
            if (activeLink) activeLink.classList.add('active');
          }
        });
      }


      const observer = new IntersectionObserver(onIntersect, observerOptions);
      sections.forEach(section => observer.observe(section));


      // set home active on load
      if (navLinks && navLinks[0]) navLinks[0].classList.add('active');


      // return cleanup function for scroll/form listeners when needed
      return () => {
        window.removeEventListener('scroll', onScroll);
        contactForm && contactForm.removeEventListener('submit', onSubmit);
        // disconnect IntersectionObserver
        observer && observer.disconnect();
      };
    }


    // ---------- Initialize ----------
    resizeCanvas();
    initStars();
    animate();
    createCosmicParticles();


    // Setup UI and capture cleanup
    const cleanupUI = setupUI();


    // Handle window resize
    function handleResize() {
      resizeCanvas();
      initStars();
    }
    window.addEventListener('resize', handleResize);


    // cleanup on unmount
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      // remove created cosmic particles
      createdParticles.forEach(p => p.remove());
      // cleanup UI listeners
      cleanupUI && cleanupUI();
    };
  }, []);


  return (
    <>
      <canvas id="starfield" ref={canvasRef}></canvas>


      <nav id="navbar">
        <div className="nav-container">
          <a href="#home" className="logo-container">
            <svg className="logo-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="35" fill="none" stroke="#f65cdaff" strokeWidth="1.5" opacity="0.6" />
              <circle cx="50" cy="50" r="20" fill="none" stroke="#0bf5e2ff" strokeWidth="2" />
              <circle cx="50" cy="50" r="12" fill="#7c3aed" />


              <circle cx="85" cy="50" r="4" fill="#0b22f5ff">
                <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 50 50" to="360 50 50" dur="8s" repeatCount="indefinite" />
              </circle>
              <circle cx="15" cy="50" r="3" fill="#5b48ecff">
                <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 50 50" to="-360 50 50" dur="12s" repeatCount="indefinite" />
              </circle>


              <circle cx="50" cy="50" r="8" fill="#f59e0b" opacity="0.3" />
            </svg>
            <span className="logo-text">PERSONAL PORTFOLIO</span>
          </a>


          <div className="mobile-menu-toggle" id="mobile-toggle">
            <span></span>
            <span></span>
            <span></span>
          </div>


          <div className="nav-menu" id="nav-menu">
            <ul>
              <li><a href="#home">BIOGRAPHY</a></li>
              <li><a href="#about">PROJECTS</a></li>
              <li><a href="#missions">SKILLS</a></li>
              <li><a href="#equipment">RESUME</a></li>
              <li><a href="#contact">CONTACT</a></li>
            </ul>
          </div>
        </div>
      </nav>


      <section id="home" className="hero">
        <div className="stars-layer"></div>
        <div className="space-orb"></div>
        <div className="space-orb"></div>
        <div className="space-orb"></div>
        <div className="space-orb"></div>


        <div className="shooting-star" style={{ ['--delay']: '0s', ['--top']: '10%', ['--left']: '10%' }}></div>
        <div className="shooting-star" style={{ ['--delay']: '1.5s', ['--top']: '30%', ['--left']: '60%' }}></div>
        <div className="shooting-star" style={{ ['--delay']: '3s', ['--top']: '20%', ['--left']: '80%' }}></div>
        <div className="shooting-star" style={{ ['--delay']: '4.5s', ['--top']: '60%', ['--left']: '30%' }}></div>
        <div className="shooting-star" style={{ ['--delay']: '6s', ['--top']: '80%', ['--left']: '70%' }}></div>

         
        <div className="hero-content">
           <Slider />
        </div>


        <a href="#about" className="scroll-btn">
          <div className="scroll-btn-inner">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
            </svg>
          </div>
        </a>
      </section>


      <section id="about" className="fade-in">
        <h2 className="section-title">PROJECT SOON TO WORK</h2>
        <div className="about-section">
          <div className="about-hero">
            <h3>Crafting Digital Experiences</h3>
            <p className="about-description"> Building interactive web applications using modern technologies and user-centered design to deliver seamless and engaging digital experiences — not only in websites but also in animations and graphics through the use of advanced tools and technologies.</p>
          </div>

          <div className="mission-tabs">
            <button className="mission-tab active" data-tab="exploration">Web Applications</button>
            <button className="mission-tab" data-tab="research">Animation</button>
            <button className="mission-tab" data-tab="discovery">Photography</button>
            <button className="mission-tab" data-tab="future">Upcoming Projects</button>
          </div>


          <div className="mission-content active" id="exploration">
            <div className="mission-grid">
              <div className="mission-card">
                <h4>Lazappe</h4>
                <p>Comprehensive full-stack e-commerce solution developed with React and Node.js, incorporating secure payment gateways, inventory management systems, and responsive design for seamless user experiences.</p>
                <span className="mission-status">Completed</span>
              </div>
              <div className="mission-card">
                <h4>Personal Website</h4>
                <p>A professional portfolio website showcasing my background, skills, and projects.
    Designed with responsive layouts, smooth navigation, and modern technologies
    to deliver a clean, engaging user experience.</p>
                <span className="mission-status">Live</span>
              </div>
              <div className="mission-card">
                <h4>Portfolio Website</h4>
                <p>Dynamic interactive portfolio website showcasing creative projects with fluid animations, optimized performance metrics, and mobile-first responsive design principles.</p>
                <span className="mission-status">Active</span>
              </div>
               <div className="mission-card">
                <h4>Laverdad Herald Publisher</h4>
                <p> A dynamic and interactive digital publication platform developed for Laverdad Christian College. 
  Showcases creative and journalistic works through fluid animations, optimized performance, and 
  a fully responsive, mobile-first design for an engaging reader experience.</p>
                <span className="mission-status">in Development</span>
              </div>
            </div>
          </div>


          <div className="mission-content" id="research">
            <div className="mission-grid">
              <div className="mission-card">
                <h4>Archictural Design</h4>
                <p>A visually engaging project focused on modern architectural concepts and digital design visualization. 
  Showcases realistic 3D renders, spatial layouts, and aesthetic compositions that emphasize structure, 
  functionality, and creativity in contemporary architecture.</p>
                <span className="mission-status">Completed</span>
              </div>
              <div className="mission-card">
                <h4>3D CAR </h4>
                <p>A detailed 3D car modeling and visualization project showcasing realistic textures, lighting, 
  and animation. Designed using advanced rendering techniques to highlight precision, depth, 
  and creative presentation of automotive design in a digital environment.</p>
                <span className="mission-status">in Complate</span>
              </div>
              <div className="mission-card">
                <h4>Product 3D</h4>
                <p> A creative 3D product modeling and visualization project showcasing realistic textures, 
  lighting, and object detailing. Designed to highlight product aesthetics and structure 
  through modern rendering techniques and precise digital craftsmanship.</p>
                <span className="mission-status">In Development</span>
              </div>
            </div>
          </div>


          <div className="mission-content" id="discovery">
            <div className="mission-grid">
              <div className="mission-card">
                <h4>Birthday Event</h4>
                <p>  A creative multimedia project capturing the essence of a birthday celebration through 
  vibrant visuals, cinematic editing, and event storytelling. Designed to highlight 
  memorable moments with professional photo and video production techniques.</p>
                <span className="mission-status">Completed</span>
              </div>
              <div className="mission-card">
                <h4>Portrait Photoshoots</h4>
                <p> A professional photography project focused on capturing expressive and artistic portraits. 
  Highlights expertise in lighting, composition, and post-editing techniques to bring out 
  personality, emotion, and visual depth in every shot.</p>
                <span className="mission-status">Completed</span>
              </div>
              <div className="mission-card">
                <h4>RTR Event Photoshoots</h4>
                <p> A professional event photography project focused on capturing the highlights and emotions 
  of the RTR celebration. Features dynamic compositions, candid moments, and high-quality 
  post-production edits to deliver a visually engaging and memorable event showcase.</p>
                <span className="mission-status">Completed</span>
              </div>
            </div>
          </div>


          <div className="mission-content" id="future">
            <div className="mission-grid">
              <div className="mission-card">
                <h4>Street Photoshoots</h4>
                <p> A creative photography project that captures the raw energy and authenticity of everyday 
  life through street photography. Focused on natural lighting, candid moments, and urban 
  storytelling to showcase the beauty and emotion found in real-world environments.</p>
                <span className="mission-status">Planning</span>
              </div>
              <div className="mission-card">
                <h4>Mobile App</h4>
                <p> A modern mobile application designed to enhance user engagement through an intuitive 
  interface, smooth navigation, and responsive design. Developed with performance, 
  accessibility, and user experience in mind.</p>
                <span className="mission-status">Research</span>
              </div>
              <div className="mission-card">
                <h4>VFIX Animation</h4>
                <p>  A creative animation project focused on producing visually captivating motion graphics 
  and cinematic sequences. Utilized modern animation tools and techniques to deliver 
  high-quality visual storytelling and dynamic visual effects.</p>
                <span className="mission-status">Planning</span>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section id="missions" className="missions-section fade-in">
        <div className="missions-container">
        <h2 className="section-title">DEVELOPER PROFILE</h2>
        <div className="equipment-container">
          <div className="equipment-item"><span>React</span></div>
          <div className="equipment-item"><span>Node.js</span></div>
          <div className="equipment-item"><span>TypeScript</span></div>
          <div className="equipment-item"><span>Blender</span></div>
          <div className="equipment-item"><span>laravel</span></div>
          <div className="equipment-item"><span>Html/css</span></div>
        </div>
        </div>
         <div className="about-grid">
            <div className="about-card">
              <span className="about-card-icon">💻</span>
              <h4>Full-Stack Development</h4>
              <p>Proficient in modern web technologies including React, Node.js, and database design. Delivering scalable applications from initial concept through deployment and maintenance.</p>
            </div>


            <div className="about-card">
              <span className="about-card-icon">🎨</span>
              <h4>UI/UX Design</h4>
              <p>Designing intuitive and visually appealing user interfaces with emphasis on accessibility, performance, and adherence to user experience best practices.</p>
            </div>


            <div className="about-card">
              <span className="about-card-icon">🚀</span>
              <h4>Performance Optimization</h4>
              <p>Enhancing web applications for optimal speed, SEO, and cross-browser compatibility. Implementing industry best practices for modern web development.</p>
            </div>
          </div>


          <div className="achievements-grid">
            <div className="achievement-item">
              <div className="achievement-number">10+</div>
              <div className="achievement-label">Projects Completed</div>
            </div>
            <div className="achievement-item">
              <div className="achievement-number">3+</div>
              <div className="achievement-label">Months Experience</div>
            </div>
            <div className="achievement-item">
              <div className="achievement-number">8+</div>
              <div className="achievement-label">Technologies Mastered</div>
            </div>
            <div className="achievement-item">
              <div className="achievement-number">100%</div>
              <div className="achievement-label">Client Satisfaction</div>
            </div>
          </div>
      </section>

          
      <section id="equipment" className="fade-in">
        <div className="equipment-container">
            <h2 className="section-title">RESUME</h2>
              <ResumeSection />
        </div>
      </section>


      <section id="contact" className="fade-in">
        <h2 className="section-title">GET IN TOUCH</h2>
        <form className="contact-form">
          <div className="form-group"><input type="text" placeholder="Your Name" required /></div>
          <div className="form-group"><input type="email" placeholder="Your Email" required /></div>
          <div className="form-group"><textarea rows="5" placeholder="Project Details or Message" required></textarea></div>
          <button type="submit" className="launch-btn">SEND MESSAGE</button>
        </form>
      </section>


      <footer>
        <div className="footer-content">
          <div className="footer-section">
            <h3>Services</h3>
            <ul>
              <li><a href="#">Web Development</a></li>
              <li><a href="#">3D Animation</a></li>
              <li><a href="#">Photography</a></li>
              <li><a href="#">UI/UX Design</a></li>
              <li><a href="#">Video Editing</a></li>
            </ul>
          </div>


          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="#home">Biography</a></li>
              <li><a href="#about">Projects</a></li>
              <li><a href="#missions">skills</a></li>
              <li><a href="#equipment">Resume</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>


          <div className="footer-section">
            <h3>Connect</h3>
            <p style={{ color: 'var(--star-silver)', marginBottom: 15 }}>Let's build something amazing together</p>
            <div className="social-links">
              <a href="https://github.com/rolandomajait1-rgb/rolandomajait-rgb" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg></a>
              <a href="https://www.linkedin.com/in/rolando-majait-a81492337" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>
              <a href="https://www.facebook.com/share/1HzKhQ25hj/" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
             <a href="https://www.instagram.com/landz.aki?igsh=MW9lcXB3cWRmcGowZw==" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>
           
            </div>
          </div>
        </div>


        <div className="footer-bottom">
          <p>© 2024 Rolando Majait - Professional Web Developer Portfolio. Crafting innovative digital experiences. Design: <a href="https://www.tooplate.com" target="_blank" rel="noopener noreferrer">Tooplate</a></p>
        </div>
      </footer>
    </>
  );
}



