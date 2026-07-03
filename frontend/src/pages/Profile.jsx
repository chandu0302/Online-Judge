import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText } from "lucide-react";
import useAuth from "../hooks/useAuth.js";
import { getUserProfile } from "../services/authService.js";
import { getMySubmissions } from "../services/submissionService.js";
import { getMyStanding } from "../services/leaderboardService.js";
import { getErrorMessage } from "../utils/getErrorMessage.js";

const Profile = () => {
  const { user: contextUser } = useAuth();
  const [profile, setProfile] = useState(contextUser);
  const [submissions, setSubmissions] = useState([]);
  const [standing, setStanding] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfileAndSubmissions = async () => {
      try {
        setError("");
        const [profileRes, submissionsRes, standingRes] = await Promise.all([
          getUserProfile(),
          getMySubmissions(),
          getMyStanding(),
        ]);
        setProfile(profileRes.data);
        setSubmissions(submissionsRes.data);
        setStanding(standingRes.data);
      } catch (apiError) {
        setError(getErrorMessage(apiError));
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileAndSubmissions();
  }, []);

  const getVerdictClass = (verdict) => {
    switch (verdict) {
      case "Accepted":
        return "verdict-badge verdict-accepted";
      case "Wrong Answer":
        return "verdict-badge verdict-wa";
      case "Compilation Error":
        return "verdict-badge verdict-ce";
      case "Runtime Error":
        return "verdict-badge verdict-re";
      case "Time Limit Exceeded":
        return "verdict-badge verdict-tle";
      case "Memory Limit Exceeded":
        return "verdict-badge verdict-mle";
      default:
        return "verdict-badge";
    }
  };

  if (isLoading) {
    return (
      <div className="page-status" style={{ padding: "4rem 0" }}>
        <div className="spinner" style={{ margin: "0 auto 1.5rem" }} />
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return <div className="alert error">{error}</div>;
  }

  return (
    <div className="problems-page-container" style={{ display: "grid", gap: "2rem" }}>
      <section className="problems-hero problems-hero-dark">
        <div className="hero-content">
          <p className="eyebrow">Developer Dashboard</p>
          <h1>{profile?.name}</h1>
          <p className="hero-subtext">
            Manage your credentials, view submission performance, and track your
            competitive programming journey.
          </p>
        </div>
      </section>

      <section className="stats-row">
        <div className="stat-card">
          <span className="stat-num">{submissions.length}</span>
          <span className="stat-label">Total Submissions</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{standing?.problemsSolved ?? 0}</span>
          <span className="stat-label">Problems Solved</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{standing?.score ?? 0}</span>
          <span className="stat-label">Score</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{standing?.rank ? `#${standing.rank}` : "Unranked"}</span>
          <span className="stat-label">Leaderboard Rank</span>
        </div>
      </section>

      <section className="stats-row">
        <div className="stat-card stat-easy">
          <span className="stat-num">{standing?.breakdown?.easy ?? 0}</span>
          <span className="stat-label">Easy Solved</span>
        </div>
        <div className="stat-card stat-medium">
          <span className="stat-num">{standing?.breakdown?.medium ?? 0}</span>
          <span className="stat-label">Medium Solved</span>
        </div>
        <div className="stat-card stat-hard">
          <span className="stat-num">{standing?.breakdown?.hard ?? 0}</span>
          <span className="stat-label">Hard Solved</span>
        </div>
      </section>

      <section className="filters-container filters-container-flat">
        <h2 className="section-heading">Account Details</h2>
        <div className="profile-grid">
          <div className="profile-stat-item">
            <span className="profile-stat-label">Full Name</span>
            <strong className="profile-stat-value">{profile?.name}</strong>
          </div>
          <div className="profile-stat-item">
            <span className="profile-stat-label">Email Address</span>
            <strong className="profile-stat-value">{profile?.email}</strong>
          </div>
          <div className="profile-stat-item">
            <span className="profile-stat-label">Joined Since</span>
            <strong className="profile-stat-value">
              {profile?.createdAt
                ? new Date(profile.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "Not available"}
            </strong>
          </div>
        </div>
      </section>

      <section className="submissions-section">
        <div className="section-header-row">
          <div>
            <h2 className="section-heading">Submission History</h2>
            <p className="section-subheading">
              Review your past code performance metrics
            </p>
          </div>
          <span className="count-badge">{submissions.length} Total</span>
        </div>

        {submissions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <FileText size={24} />
            </div>
            <p>You haven&apos;t submitted any solutions yet.</p>
            <Link
              to="/problems"
              className="primary-button"
              style={{ marginTop: "1rem", display: "inline-flex" }}
            >
              Explore Problems
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="problems-table">
              <thead>
                <tr>
                  <th>Problem Name</th>
                  <th>Language</th>
                  <th>Verdict Result</th>
                  <th>Submitted Time</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub) => (
                  <tr key={sub.submissionId}>
                    <td>
                      <Link
                        to={`/problems/${sub.problemId?._id || sub.problemId}`}
                        className="problem-link-title"
                      >
                        {sub.problemId?.title || "Unknown Problem"}
                      </Link>
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      {sub.language.toUpperCase()}
                    </td>
                    <td>
                      <span className={getVerdictClass(sub.verdict)}>
                        {sub.verdict}
                      </span>
                    </td>
                    <td className="muted-text">
                      {new Date(sub.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default Profile;
