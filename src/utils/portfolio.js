import { supabase } from "../lib/supabase";

export const emptyPortfolio = {
  fullName: "",
  title: "",
  about: "",
  education: "",
  skills: "",
  projects: "",
  workExperience: "",
  email: "",
  contactNumber: "",
  address: "",
  github: "",
  profilePicture: "",
};

export function fromPortfolioRecord(record) {
  return mapPortfolioRecord(record, "");
}

export function mapPortfolioRecord(record, fallbackTitle) {
  const socialLinks = record.social_links;
  const github =
    typeof socialLinks === "string"
      ? socialLinks
      : socialLinks?.github || socialLinks?.website || "";

  return {
    fullName: record.full_name || "",
    title: record.title || fallbackTitle || "",
    about: record.about_me || "",
    education: record.education || "",
    skills: record.skills || "",
    projects: record.projects || "",
    workExperience: record.work_experience || "",
    email: record.email || "",
    contactNumber: record.contact_number || "",
    address: record.address || "",
    github,
    profilePicture: record.profile_picture || "",
  };
}

export function toPortfolioRecord(form) {
  return {
    full_name: form.fullName.trim(),
    title: form.title.trim(),
    profile_picture: form.profilePicture.trim() || null,
    email: form.email.trim() || null,
    contact_number: form.contactNumber.trim() || null,
    address: form.address.trim() || null,
    about_me: form.about.trim() || null,
    education: form.education.trim() || null,
    skills: form.skills.trim() || null,
    projects: form.projects.trim() || null,
    work_experience: form.workExperience.trim() || null,
    social_links: form.github.trim() || null,
  };
}

export async function savePortfolioRecord(form, portfolioId, accessToken) {
  if (!accessToken) {
    throw new Error(
      "Portfolio access information is missing. Create a new portfolio to continue."
    );
  }

  const { data, error } = await supabase.rpc(
    portfolioId ? "update_portfolio" : "create_portfolio",
    {
      p_access_token: accessToken,
      p_data: toPortfolioRecord(form),
    }
  );

  if (error) {
    throw portfolioRpcError(error);
  }

  return data;
}

export async function getPortfolioRecord(accessToken) {
  if (!accessToken) {
    throw new Error(
      "This browser does not have the access key for the saved portfolio. Open it in the browser where it was created."
    );
  }

  const { data, error } = await supabase.rpc("get_portfolio", {
    p_access_token: accessToken,
  });

  if (error) {
    throw portfolioRpcError(error);
  }

  if (!data) {
    throw new Error(
      "No portfolio was found for this browser. It may have been deleted."
    );
  }

  return data;
}

export async function deletePortfolioRecord(accessToken) {
  if (!accessToken) {
    throw new Error(
      "This browser does not have the access key for the saved portfolio."
    );
  }

  const { data, error } = await supabase.rpc("delete_portfolio", {
    p_access_token: accessToken,
  });

  if (error) {
    throw portfolioRpcError(error);
  }

  if (!data) {
    throw new Error("No portfolio was found to delete.");
  }
}

function portfolioRpcError(error) {
  if (
    error.code === "PGRST202" ||
    error.code === "42501" ||
    error.code === "42883"
  ) {
    return new Error(
      "Supabase is not configured for secure portfolio access yet. Run supabase/setup.sql in the Supabase SQL Editor, then retry."
    );
  }

  return error;
}

export function splitList(value) {
  return (value || "")
    .split(/,|\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function splitProjects(value) {
  return (value || "")
    .split("\n")
    .map((project) => project.trim())
    .filter(Boolean)
    .map((project) => {
      const [name, ...details] = project.split("|");
      return {
        name: name.trim(),
        details: details.join("|").trim(),
      };
    });
}
