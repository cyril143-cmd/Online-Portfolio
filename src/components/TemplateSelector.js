"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import "../styles/selection.css";

const templates = [
  {
    id: "simple",
    number: "01",
    name: "Simple",
    description: "A clean, professional layout that puts your story first.",
    href: "/WEB/template1",
  },
  {
    id: "modern",
    number: "02",
    name: "Modern",
    description: "A bright card-based design for skills, projects, and more.",
    href: "/WEB/template2",
  },
  {
    id: "creative",
    number: "03",
    name: "Creative",
    description: "An artistic, colorful layout with expressive details.",
    href: "/WEB/template3",
  },
];

function TemplatePreview({ variant }) {
  return (
    <div className={`template-preview preview-${variant}`} aria-hidden="true">
      <div className="mini-page">
        <div className="mini-topbar">
          <span className="mini-logo">ALEX MORGAN</span>
          <span className="mini-nav-dots"><i /><i /><i /></span>
        </div>
        <div className="mini-hero">
          <div className="mini-avatar">A</div>
          <div className="mini-intro">
            <span className="mini-eyebrow">DESIGNER &amp; DEVELOPER</span>
            <strong>Alex Morgan</strong>
            <span>Building thoughtful digital experiences.</span>
          </div>
        </div>
        <div className="mini-lower">
          <div className="mini-section">
            <b>ABOUT</b><span /><span className="short" />
          </div>
          <div className="mini-section">
            <b>SKILLS</b>
            <div className="mini-pills"><i /><i /><i /></div>
          </div>
          <div className="mini-projects">
            <b>SELECTED WORK</b>
            <div><i /><i /></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TemplateSelector() {
  const router = useRouter();

  function chooseTemplate(template) {
    localStorage.setItem("selectedTemplate", template.id);
    router.push(template.href);
  }

  return (
    <main className="selection-page">
      <div className="selection-container">
        <Link className="selection-back" href="/create?edit=1">
          ← Edit your information
        </Link>

        <header className="selection-heading">
          <p>MAKE IT YOURS</p>
          <h1>Choose your template</h1>
          <span>Three unique designs, filled with the information you saved.</span>
        </header>

        <section className="template-options" aria-label="Portfolio templates">
          {templates.map((template) => (
            <article className={`template-option option-${template.id}`} key={template.id}>
              <TemplatePreview variant={template.id} />
              <div className="template-option-info">
                <p className="template-number">TEMPLATE {template.number}</p>
                <h2>{template.name}</h2>
                <p>{template.description}</p>
                <button
                  type="button"
                  onClick={() => chooseTemplate(template)}
                >
                  Choose This Template <span aria-hidden="true">→</span>
                </button>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
