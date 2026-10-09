
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  emptyPortfolio,
  getPortfolioRecord,
  mapPortfolioRecord,
  savePortfolioRecord,
} from "../utils/portfolio";
import "../styles/form.css";

export default function PortfolioForm({ editing = false }) {
  const router = useRouter();

  const [form, setForm] = useState(emptyPortfolio);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(editing);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [imageError, setImageError] = useState("");

  useEffect(() => {
    if (!editing) return;

    let active = true;

    async function loadPortfolio() {
      try {
        const portfolioId = localStorage.getItem("portfolioId");
        const accessToken = localStorage.getItem(
          "portfolioAccessToken"
        );

        if (!portfolioId || !accessToken) {
          throw new Error("No saved portfolio was found to edit.");
        }

        const record = await getPortfolioRecord(accessToken);
        const mappedForm = mapPortfolioRecord(
          record,
          localStorage.getItem("portfolioTitle")
        );

        if (active) {
          setForm(mappedForm);
          setImagePreview(mappedForm.profilePicture || "");
        }
      } catch (loadError) {
        console.error("Portfolio load failed:", loadError);

        if (active) {
          setError(
            loadError.message ||
              "Could not load your portfolio. Please try again."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadPortfolio();

    return () => {
      active = false;
    };
  }, [editing]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0];

    setImageError("");

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setImageError("Please select a valid image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 1024 * 1024) {
      setImageError("Please choose an image smaller than 1 MB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const imageData = reader.result;

      setImagePreview(imageData);

      setForm((previous) => ({
        ...previous,
        profilePicture: imageData,
      }));
    };

    reader.onerror = () => {
      setImageError("Could not read the image. Please try again.");
    };

    reader.readAsDataURL(file);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const portfolioId = editing
        ? localStorage.getItem("portfolioId")
        : null;

      const accessToken = editing
        ? localStorage.getItem("portfolioAccessToken")
        : crypto.randomUUID();

      if (editing && (!portfolioId || !accessToken)) {
        throw new Error("No saved portfolio was found to update.");
      }

      const record = await savePortfolioRecord(
        form,
        portfolioId,
        accessToken
      );

      localStorage.setItem("portfolioId", String(record.id));
      localStorage.setItem("portfolioAccessToken", accessToken);
      localStorage.setItem("portfolioTitle", form.title.trim());

      router.push("/templates");
    } catch (err) {
      console.error("Portfolio save failed:", err);

      setError(
        err.message ||
          "Could not save your portfolio. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="form-page">
      <div className="form-container">
        <Link className="form-back" href="/WEB">
          ← Back to Home
        </Link>

        <h1>
          {editing ? "Edit Your Portfolio" : "Create Your Portfolio"}
        </h1>

        <p className="form-subtitle">
          Enter your information, save it, and choose your favorite design.
        </p>

        <form onSubmit={handleSubmit}>
          <h2>Personal Information</h2>

          <label htmlFor="fullName">Full Name *</label>
          <input
            id="fullName"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />

          <label htmlFor="title">Professional Title *</label>
          <input
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Web Developer"
            required
          />

          <label htmlFor="profilePicture">Profile Picture</label>

          <div className="profile-upload">
            {imagePreview ? (
              <img
                className="profile-image-preview"
                src={imagePreview}
                alt="Profile picture preview"
              />
            ) : (
              <div className="profile-image-placeholder">
                <span className="upload-symbol">＋</span>
                <span>No picture selected</span>
              </div>
            )}

            <input
              id="profilePicture"
              name="profilePictureFile"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />

            <p className="profile-upload-help">
              Select a picture from your device. Maximum size: 1 MB.
            </p>

            {imageError && (
              <p className="form-error" role="alert">
                {imageError}
              </p>
            )}
          </div>

          <label htmlFor="about">About Me</label>
          <textarea
            id="about"
            name="about"
            value={form.about}
            onChange={handleChange}
            placeholder="Write a short introduction about yourself"
            rows={4}
          />

          <h2>Education and Experience</h2>

          <label htmlFor="education">Educational Background</label>
          <textarea
            id="education"
            name="education"
            value={form.education}
            onChange={handleChange}
            placeholder="Your school, course, or degree"
            rows={3}
          />

          <label htmlFor="workExperience">Work Experience</label>
          <textarea
            id="workExperience"
            name="workExperience"
            value={form.workExperience}
            onChange={handleChange}
            placeholder="Work, internship, or relevant experience"
            rows={4}
          />

          <h2>Skills and Projects</h2>

          <label htmlFor="skills">Skills</label>
          <textarea
            id="skills"
            name="skills"
            value={form.skills}
            onChange={handleChange}
            placeholder="Separate skills with commas, e.g. HTML, CSS, JavaScript"
            rows={3}
          />

          <label htmlFor="projects">Projects</label>
          <textarea
            id="projects"
            name="projects"
            value={form.projects}
            onChange={handleChange}
            placeholder="One project per line. Use Project name | details for project cards."
            rows={4}
          />

          <h2>Contact Information</h2>

          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
          />

          <label htmlFor="contactNumber">Contact Number</label>
          <input
            id="contactNumber"
            name="contactNumber"
            type="tel"
            value={form.contactNumber}
            onChange={handleChange}
            placeholder="Enter your contact number"
          />

          <label htmlFor="address">Address</label>
          <input
            id="address"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="City or address"
          />

          <label htmlFor="github">GitHub or Website Link</label>
          <input
            id="github"
            name="github"
            type="url"
            value={form.github}
            onChange={handleChange}
            placeholder="https://github.com/yourusername"
          />

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" disabled={saving || loading}>
            {loading
              ? "Loading Portfolio..."
              : saving
                ? "Saving Portfolio..."
                : editing
                  ? "Save Changes →"
                  : "Save & Choose Template →"}
          </button>

          {editing && (
            <Link className="form-manage-link" href="/manage">
              Cancel and return to portfolio management
            </Link>
          )}
        </form>
      </div>
    </main>
  );
}