"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  deletePortfolioRecord,
  getPortfolioRecord,
  mapPortfolioRecord,
} from "../utils/portfolio";
import "../styles/manage.css";

export default function PortfolioManager() {
  const router = useRouter();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadPortfolio() {
      try {
        const portfolioId = localStorage.getItem("portfolioId");
        if (!portfolioId) {
          if (active) setLoading(false);
          return;
        }

        const record = await getPortfolioRecord(
          localStorage.getItem("portfolioAccessToken")
        );
        if (active) {
          setPortfolio(
            mapPortfolioRecord(record, localStorage.getItem("portfolioTitle"))
          );
        }
      } catch (loadError) {
        console.error("Portfolio management load failed:", loadError);
        if (active) {
          setError(loadError.message || "Could not load your portfolio.");
        }
      } finally {
        if (active) setLoading(false);
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
      await deletePortfolioRecord(
        localStorage.getItem("portfolioAccessToken")
      );

      localStorage.removeItem("portfolioId");
      localStorage.removeItem("portfolioAccessToken");
      localStorage.removeItem("portfolioTitle");
      localStorage.removeItem("selectedTemplate");
      router.push("/create");
    } catch (deleteError) {
      console.error("Portfolio deletion failed:", deleteError);
      setError(deleteError.message || "Could not delete your portfolio.");
      setDeleting(false);
    }
  }

  return (
    <main className="manage-page">
      <section className="manage-card">
        <Link href="/WEB" className="manage-back">← Home</Link>
        <p className="manage-eyebrow">PORTFOLIOGEN</p>
        <h1>Manage your portfolio</h1>
        {loading ? (
          <p role="status">Loading your saved portfolio…</p>
        ) : error ? (
          <p className="manage-error" role="alert">{error}</p>
        ) : portfolio ? (
          <>
            <div className="manage-summary">
              <strong>{portfolio.fullName}</strong>
              <span>{portfolio.title}</span>
            </div>
            <div className="manage-actions">
              <Link href="/create?edit=1">Edit information</Link>
              <Link href="/templates">Choose a template</Link>
              <button type="button" onClick={deletePortfolio} disabled={deleting}>
                {deleting ? "Deleting…" : "Delete portfolio"}
              </button>
            </div>
          </>
        ) : (
          <>
            <p>You have no saved portfolio in this browser yet.</p>
            <Link className="manage-create" href="/create">Create a portfolio</Link>
          </>
        )}
        {error && portfolio && <p className="manage-error" role="alert">{error}</p>}
      </section>
    </main>
  );
}
