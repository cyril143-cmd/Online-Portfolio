"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  deletePortfolioRecord,
  getPortfolioRecord,
  mapPortfolioRecord,
  splitList,
  splitProjects,
} from "../utils/portfolio";
import "../styles/portfolio-templates.css";

const templateNames = {
  simple: "Simple",
  modern: "Modern",
  creative: "Creative",
};

export default function PortfolioTemplate({ template }) {
  const router = useRouter();
  const [portfolio, setPortfolio] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadPortfolio() {
      try {
        const portfolioId = localStorage.getItem("portfolioId");

        if (!portfolioId) {
          throw new Error("No saved portfolio was found. Please create one first.");
        }

        const record = await getPortfolioRecord(
          localStorage.getItem("portfolioAccessToken")
        );

        if (active) {
          setPortfolio(
            mapPortfolioRecord(record, localStorage.getItem("portfolioTitle"))
          );
          setStatus("ready");
        }
      } catch (loadError) {
        console.error("Portfolio retrieval failed:", loadError);
        if (active) {
          setError(
            loadError.message ||
              "Could not retrieve your saved portfolio. Please try again."
          );
          setStatus("error");
        }
      }
    }

    loadPortfolio();

    return () => {
      active = false;
    };
  }, []);

  async function deletePortfolio() {
    if (!window.confirm("Delete this portfolio? This cannot be undone.")) {
      return;
    }

    setDeleting(true);
    setError("");

    try {
      await deletePortfolioRecord(localStorage.getItem("portfolioAccessToken"));

      localStorage.removeItem("portfolioId");
      localStorage.removeItem("portfolioAccessToken");
      localStorage.removeItem("portfolioTitle");
      localStorage.removeItem("selectedTemplate");
      router.push("/create");
    } catch (deleteError) {
      console.error("Portfolio deletion failed:", deleteError);
      setError(
        deleteError.message ||
          "Could not delete your portfolio. Please try again."
      );
      setDeleting(false);
    }
  }

  if (status === "loading") {
    return (
      <main className={`portfolio-view view-${template}`}>
        <p className="portfolio-status" role="status">
          Loading your saved portfolio…
        </p>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className={`portfolio-view view-${template}`}>
        <section className="portfolio-message">
          <h1>Portfolio unavailable</h1>
          <p role="alert">{error}</p>
          <Link href="/create">Create or edit your portfolio</Link>
        </section>
      </main>
    );
  }

  const skills = splitList(portfolio.skills);
  const projects = splitProjects(portfolio.projects);
  const initials = portfolio.fullName
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <main className={`portfolio-view view-${template}`}>
      <nav className="portfolio-toolbar" aria-label="Portfolio actions">
        <Link href="/WEB" className="portfolio-brand">PortfolioGen</Link>
        <div>
          <Link href="/manage">Manage</Link>
          <Link href="/templates">Change template</Link>
          <Link href="/create?edit=1">Edit information</Link>
          <button type="button" onClick={() => window.print()}>Print / Save PDF</button>
          <button
            type="button"
            className="portfolio-delete"
            onClick={deletePortfolio}
            disabled={deleting}
          >
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </nav>

      {error && <p className="portfolio-inline-error" role="alert">{error}</p>}

      {template === "simple" && (
        <article className="simple-portfolio">
          <header className="simple-profile">
            <ProfileImage portfolio={portfolio} initials={initials} className="simple-profile-image" />
            <p className="portfolio-kicker">PERSONAL PORTFOLIO</p>
            <h1>{portfolio.fullName}</h1>
            <h2>{portfolio.title}</h2>
            <p className="portfolio-about">{portfolio.about}</p>
          </header>
          <div className="simple-sections">
            <section><h2>Skills</h2><SkillTags skills={skills} /></section>
            <section><h2>Education</h2><p>{portfolio.education || "No education details added."}</p></section>
            <section><h2>Projects</h2><ProjectCards projects={projects} /></section>
            <section><h2>Work Experience</h2><p>{portfolio.workExperience || "No work experience added."}</p></section>
            <ContactDetails portfolio={portfolio} />
          </div>
        </article>
      )}

      {template === "modern" && (
        <article className="modern-portfolio">
          <header className="modern-hero">
            <div className="modern-hero-copy">
              <p className="portfolio-kicker">HELLO, I&apos;M</p>
              <h1>{portfolio.fullName}</h1>
              <h2>{portfolio.title}</h2>
              <p>{portfolio.about || "Welcome to my portfolio."}</p>
              {portfolio.email && <a href={`mailto:${portfolio.email}`}>Let&apos;s connect →</a>}
            </div>
            <ProfileImage portfolio={portfolio} initials={initials} className="modern-profile-image" />
          </header>
          <div className="modern-grid">
            <section className="modern-card modern-skills"><h2>Skills</h2><SkillTags skills={skills} /></section>
            <section className="modern-card"><h2>Education</h2><p>{portfolio.education || "No education details added."}</p></section>
            <section className="modern-card modern-projects"><h2>Selected Projects</h2><ProjectCards projects={projects} /></section>
            <section className="modern-card"><h2>Work Experience</h2><p>{portfolio.workExperience || "No work experience added."}</p></section>
            <section className="modern-card"><h2>Contact</h2><ContactDetails portfolio={portfolio} /></section>
          </div>
        </article>
      )}

      {template === "creative" && (
        <article className="creative-portfolio">
          <header className="creative-profile">
            <div className="creative-profile-image-wrap"><ProfileImage portfolio={portfolio} initials={initials} className="creative-profile-image" /></div>
            <div>
              <p className="portfolio-kicker">A LITTLE ABOUT ME ✦</p>
              <h1>{portfolio.fullName}</h1>
              <h2>{portfolio.title}</h2>
              <p>{portfolio.about || "A creative professional sharing work, ideas, and inspiration."}</p>
            </div>
          </header>
          <div className="creative-grid">
            <section className="creative-section creative-skills"><h2>✳ Skills</h2><SkillTags skills={skills} /></section>
            <section className="creative-section"><h2>⌑ Education</h2><p>{portfolio.education || "No education details added."}</p></section>
            <section className="creative-section creative-work"><h2>▱ Selected Work</h2><ProjectCards projects={projects} /></section>
            <section className="creative-section"><h2>✦ Work Experience</h2><p>{portfolio.workExperience || "No work experience added."}</p></section>
            <section className="creative-section"><h2>♡ Contact</h2><ContactDetails portfolio={portfolio} /></section>
          </div>
        </article>
      )}

      <footer className="portfolio-view-footer">
        {templateNames[template]} design · PortfolioGen
      </footer>
    </main>
  );
}

function ProfileImage({ portfolio, initials, className = "" }) {
  return portfolio.profilePicture ? (
    <Image
      className={className}
      src={portfolio.profilePicture}
      alt={`${portfolio.fullName}'s profile`}
      width={400}
      height={400}
      unoptimized
    />
  ) : (
    <div className={`${className} portfolio-avatar-fallback`} aria-hidden="true">
      {initials || "P"}
    </div>
  );
}

function ProjectCards({ projects }) {
  return projects.length ? (
    <div className="portfolio-project-grid">
      {projects.map((project, index) => (
        <article className="portfolio-project-card" key={`${project.name}-${index}`}>
          <span className="portfolio-project-index">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3>{project.name}</h3>
          <p>{project.details || "A project showcasing my work and skills."}</p>
        </article>
      ))}
    </div>
  ) : (
    <p className="portfolio-empty-copy">No projects added yet.</p>
  );
}

function SkillTags({ skills }) {
  return skills.length ? (
    <div className="portfolio-skill-tags">
      {skills.map((skill, index) => <span key={`${skill}-${index}`}>{skill}</span>)}
    </div>
  ) : (
    <p className="portfolio-empty-copy">No skills added yet.</p>
  );
}

function ContactDetails({ portfolio }) {
  const social =
    typeof portfolio.github === "string" ? portfolio.github.trim() : "";

  return (
    <div className="portfolio-contact-details">
      {portfolio.email && <a href={`mailto:${portfolio.email}`}>{portfolio.email}</a>}
      {portfolio.contactNumber && <span>{portfolio.contactNumber}</span>}
      {portfolio.address && <span>{portfolio.address}</span>}
      {social && <a href={social} target="_blank" rel="noreferrer">Website / GitHub ↗</a>}
      {!portfolio.email && !portfolio.contactNumber && !portfolio.address && !social && (
        <p className="portfolio-empty-copy">No contact details added yet.</p>
      )}
    </div>
  );
}
