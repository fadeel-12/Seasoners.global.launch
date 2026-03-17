"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import AnimatedPage from "../../../components/AnimatedPage";

const SEASON_ICONS = { winter: "❄️", summer: "☀️", spring: "🌸", autumn: "🍂" };

function Avatar({ src, name, size = 24 }) {
  const [imgError, setImgError] = useState(false);
  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  if (src && !imgError) {
    return (
      <img
        src={src}
        alt={name}
        onError={() => setImgError(true)}
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className="rounded-full bg-sky-100 border-2 border-sky-200 flex items-center justify-center font-bold text-sky-700"
      style={{ width: size, height: size, fontSize: size * 0.35 }}
    >
      {initials}
    </div>
  );
}

function SkillTag({ label }) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-sm font-medium">
      {label}
    </span>
  );
}

function LangTag({ label }) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-sm font-medium">
      🗣 {label}
    </span>
  );
}

function RegionTag({ label }) {
  const icon = SEASON_ICONS[label.toLowerCase()] ?? "📍";
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-sm">
      {icon} {label}
    </span>
  );
}

function StarRating({ rating }) {
  const full = Math.round(rating ?? 0);
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= full ? "text-amber-400" : "text-slate-200"}>
          ★
        </span>
      ))}
    </span>
  );
}

function TrustRing({ score }) {
  const pct = Math.min(100, Math.max(0, score ?? 0));
  const color =
    pct >= 75 ? "#10b981" : pct >= 50 ? "#0ea5e9" : pct >= 25 ? "#f59e0b" : "#94a3b8";
  const dash = (pct / 100) * 251.2;
  return (
    <div className="relative w-20 h-20">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="8" />
        <circle
          cx="50" cy="50" r="40" fill="none"
          stroke={color} strokeWidth="8"
          strokeDasharray={`${dash} 251.2`}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-bold text-slate-800">{Math.round(pct)}</span>
      </div>
    </div>
  );
}

export default function PortfolioPage() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) return;
    fetch(`/api/portfolio/${userId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setUser(data.user);
      })
      .catch(() => setError("Failed to load portfolio"))
      .finally(() => setLoading(false));
  }, [userId]);

  const avatarSrc = user?.profilePicture || user?.image;
  const skills = Array.isArray(user?.skills) ? user.skills : [];
  const languages = Array.isArray(user?.spokenLanguages) ? user.spokenLanguages : [];
  const interests = Array.isArray(user?.interests) ? user.interests : [];
  const regions = Array.isArray(user?.preferredRegions) ? user.preferredRegions : [];
  const workPermitCountries = Array.isArray(user?.workPermitCountries) ? user.workPermitCountries : [];
  const reviews = Array.isArray(user?.reviews) ? user.reviews : [];

  if (loading) {
    return (
      <main>
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-24 flex flex-col items-center gap-4">
          <div className="w-24 h-24 rounded-full bg-slate-200 animate-pulse" />
          <div className="h-6 w-48 bg-slate-200 rounded animate-pulse" />
          <div className="h-4 w-72 bg-slate-100 rounded animate-pulse" />
        </div>
        <Footer />
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <Navbar />
        <div className="max-w-2xl mx-auto px-6 py-24 text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Profile unavailable</h1>
          <p className="text-slate-600">{error}</p>
          <a href="/jobs" className="mt-6 inline-block px-5 py-2.5 rounded-lg bg-sky-600 text-white hover:bg-sky-700">
            Browse Jobs →
          </a>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main>
      <Navbar />
      <AnimatedPage>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 pb-20 space-y-6">

          {/* Hero card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border bg-white/80 backdrop-blur shadow-sm overflow-hidden"
          >
            {/* Banner */}
            <div className="h-28 bg-gradient-to-r from-sky-500 via-sky-600 to-sky-700" />

            <div className="px-6 pb-6">
              <div className="flex items-end gap-4 -mt-12 mb-4">
                <div className="ring-4 ring-white rounded-full shadow-md">
                  <Avatar src={avatarSrc} name={user.name} size={80} />
                </div>
                {user.openToOpportunities && (
                  <span className="mb-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Open to Opportunities
                  </span>
                )}
              </div>

              <h1 className="text-2xl font-extrabold text-sky-900">{user.name ?? "Seasoner"}</h1>

              <div className="flex flex-wrap items-center gap-2 mt-1 text-slate-600 text-sm">
                {user.occupation && <span>💼 {user.occupation}</span>}
                {user.nationality && <span>· 🌍 {user.nationality}</span>}
                {user.workExperience && <span>· ⏱ {user.workExperience} yrs exp.</span>}
              </div>

              {(user.aboutMe || user.bio) && (
                <p className="mt-4 text-slate-700 leading-relaxed">
                  {user.aboutMe || user.bio}
                </p>
              )}
            </div>
          </motion.div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Trust Score", value: <TrustRing score={user.trustScore} /> },
              { label: "Completed Stays", value: <span className="text-3xl font-bold text-sky-700">{user.completedStays ?? 0}</span> },
              { label: "Reviews", value: <span className="text-3xl font-bold text-sky-700">{user.reviewsReceivedCount ?? 0}</span> },
              { label: "Response Rate", value: <span className="text-3xl font-bold text-sky-700">{user.responseRate ? `${Math.round(user.responseRate * 100)}%` : "—"}</span> },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-2xl border bg-white/80 p-4 flex flex-col items-center gap-1 shadow-sm">
                {value}
                <span className="text-xs text-slate-500 font-medium text-center">{label}</span>
              </div>
            ))}
          </div>

          {/* Skills */}
          {skills.length > 0 && (
            <section className="rounded-2xl border bg-white/80 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-sky-900 mb-3">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((s) => <SkillTag key={s} label={s} />)}
              </div>
            </section>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <section className="rounded-2xl border bg-white/80 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-sky-900 mb-3">Languages</h2>
              <div className="flex flex-wrap gap-2">
                {languages.map((l) => <LangTag key={l} label={l} />)}
              </div>
            </section>
          )}

          {/* Availability & Mobility */}
          <section className="rounded-2xl border bg-white/80 p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-sky-900">Availability & Mobility</h2>

            <div className="flex flex-wrap gap-4 text-sm text-slate-700">
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${user.willingToRelocate ? "bg-emerald-400" : "bg-slate-300"}`} />
                {user.willingToRelocate ? "Willing to relocate" : "Not willing to relocate"}
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${user.hasWorkPermit ? "bg-emerald-400" : "bg-slate-300"}`} />
                {user.hasWorkPermit ? "Has work permit" : "No work permit"}
              </div>
            </div>

            {workPermitCountries.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Work Permit Countries</p>
                <div className="flex flex-wrap gap-2">
                  {workPermitCountries.map((c) => (
                    <span key={c} className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {regions.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Preferred Regions</p>
                <div className="flex flex-wrap gap-2">
                  {regions.map((r) => <RegionTag key={r} label={r} />)}
                </div>
              </div>
            )}

            {user.availability && typeof user.availability === "object" && (
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Available Periods</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(user.availability).map(([k, v]) => (
                    <span key={k} className="px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-sm">
                      {k}: {String(v)}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Interests */}
          {interests.length > 0 && (
            <section className="rounded-2xl border bg-white/80 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-sky-900 mb-3">Interests</h2>
              <div className="flex flex-wrap gap-2">
                {interests.map((i) => (
                  <span key={i} className="px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-sm">
                    {i}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Reviews */}
          {reviews.length > 0 && (
            <section className="rounded-2xl border bg-white/80 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-sky-900 mb-4">
                Reviews <span className="text-slate-400 font-normal text-base">({user.reviewsReceivedCount ?? reviews.length})</span>
              </h2>
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="border rounded-2xl p-4 bg-slate-50">
                    <div className="flex items-center gap-3 mb-2">
                      <Avatar
                        src={rev.reviewer?.profilePicture || rev.reviewer?.image}
                        name={rev.reviewer?.name}
                        size={36}
                      />
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">{rev.reviewer?.name ?? "Anonymous"}</p>
                        <StarRating rating={rev.rating} />
                      </div>
                      <span className="ml-auto text-xs text-slate-400">
                        {new Date(rev.createdAt).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
                      </span>
                    </div>
                    {rev.comment && <p className="text-slate-600 text-sm leading-relaxed">{rev.comment}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* CTA */}
          <div className="rounded-3xl border bg-gradient-to-r from-sky-600 to-sky-700 p-8 text-white text-center shadow-md">
            <h2 className="text-xl font-bold mb-2">Interested in {user.name?.split(" ")[0] ?? "this Seasoner"}?</h2>
            <p className="text-sky-100 mb-5 text-sm">
              Browse available jobs and stays, or post your own listing to connect.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="/jobs"
                className="px-5 py-2.5 rounded-xl bg-white text-sky-700 font-semibold hover:bg-sky-50 transition text-sm"
              >
                Browse Jobs
              </a>
              <a
                href="/stays"
                className="px-5 py-2.5 rounded-xl bg-sky-500 text-white font-semibold border border-sky-400 hover:bg-sky-400 transition text-sm"
              >
                Browse Stays
              </a>
            </div>
          </div>

          <p className="text-center text-xs text-slate-400">
            Member since {new Date(user.createdAt).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
          </p>
        </div>
      </AnimatedPage>
      <Footer />
    </main>
  );
}
