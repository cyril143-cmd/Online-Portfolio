"use client";

import { useState } from "react";
import Link from "next/link";
import "../styles/home.css";

export default function HomePage() {
const [darkMode, setDarkMode] = useState(false);

return (
<main className={`portfolio-home ${darkMode ? "dark" : ""}`}> <div className="background-shape shape-one"></div> <div className="background-shape shape-two"></div> <div className="background-shape shape-three"></div>

```
  <header className="navbar">
    <Link className="brand" href="/WEB">
      <span className="brand-icon">✧</span>
      <span>Portfolio<span className="brand-purple">Gen</span></span>
    </Link>

    <nav className="nav-links">
      <Link className="active" href="/WEB">Home</Link>
      <a href="#about">About</a>
    </nav>

    <div className="nav-actions">
      <button
        className="theme-button"
        onClick={() => setDarkMode(!darkMode)}
        aria-label="Toggle theme"
      >
        {darkMode ? "☾" : "☀"}
      </button>

      <Link href="/manage" className="sign-in">My Portfolio</Link>
    </div>
  </header>

  <section className="hero">
    <div className="hero-copy">
      <div className="eyebrow">
        ✨ Create · Customize · Showcase
      </div>

      <h1>
        Your Portfolio,
        <span>Made Simple</span>
      </h1>

      <p className="hero-description">
        Create a professional and modern portfolio in minutes.
        Choose a template, add your details, and let your work
        shine — all in one place.
      </p>

      <Link href="/create" className="generate-button">
        <span className="button-sparkle">✧</span>
        <span>Generate a Portfolio</span>
        <span className="button-arrow">→</span>
      </Link>

      <p className="hero-note">
        No design skills needed. Just bring your ideas.
      </p>
    </div>

    <div className="hero-visual">
      <div className="sparkle sparkle-one">✦</div>
      <div className="sparkle sparkle-two">✦</div>
      <div className="sparkle sparkle-three">✧</div>

      <div className="mockup mockup-back">
        <div className="mockup-top">
          <span>My Portfolio</span>
          <span>☰</span>
        </div>
        <div className="back-content">
          <p>PERSONAL WEBSITE</p>
          <h3>Who I Am</h3>
          <div className="fake-line wide"></div>
          <div className="fake-line"></div>
          <div className="fake-line short"></div>
          <div className="back-tags">
            <span>Design</span>
            <span>Development</span>
          </div>
        </div>
      </div>

      <div className="mockup mockup-side">
        <h4>My Projects</h4>
        <div className="project-grid">
          <div className="project-tile tile-purple"></div>
          <div className="project-tile tile-blue"></div>
          <div className="project-tile tile-pink"></div>
          <div className="project-tile tile-lavender"></div>
        </div>
        <div className="fake-line short"></div>
      </div>

      <div className="mockup mockup-front">
        <div className="portfolio-mini-nav">
          <strong>Group 6</strong>
          <div>Home&nbsp;&nbsp; About&nbsp;&nbsp; Projects</div>
          <span>Contact</span>
        </div>

        <div className="profile-content">
          <div className="profile-text">
            <span className="profile-label">Hello, we&apos;re</span>
            <h3>Group 6</h3>
            <p className="profile-job">
              BSIT Students | Aspiring Web Developers
            </p>
            <p className="profile-summary">
              We build simple and meaningful digital
              experiences through design and code.
            </p>
            <div className="mini-buttons">
              <span>View Our Projects</span>
              <span>Contact Us</span>
            </div>
            <div className="social-dots">
              <i>●</i><i>●</i><i>●</i><i>●</i>
            </div>
          </div>

          <div className="profile-picture">
            <span>YOUR<br />PHOTO</span>
          </div>
        </div>
      </div>

      <div className="handwritten-note">
        ↶ Turn your ideas<br />
        into a beautiful<br />
        portfolio!
      </div>
    </div>
  </section>

  <section className="about-section" id="about">
    <p>YOUR STORY DESERVES TO BE SEEN</p>
    <h2>Everything you need to show your best work.</h2>
    <Link href="/create" className="about-button">
      Start Building →
    </Link>
  </section>

  <footer className="home-footer">
    © 2026 Group 6 · Made for your next opportunity.
  </footer>
</main>


);
}
