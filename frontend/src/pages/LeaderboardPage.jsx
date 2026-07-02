import { useEffect, useState } from "react";
import { Trophy } from "lucide-react";
import { getLeaderboard } from "../services/leaderboardService.js";
import { getErrorMessage } from "../utils/getErrorMessage.js";
import useAuth from "../hooks/useAuth.js";

const LeaderboardPage = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 50, total: 0, pages: 1 });
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setError("");
        setIsLoading(true);
        const response = await getLeaderboard({ page, limit: 50 });
        setLeaderboard(response.data?.leaderboard || []);
        setPagination(response.data?.pagination || { page: 1, limit: 50, total: 0, pages: 1 });
      } catch (apiError) {
        setError(getErrorMessage(apiError) || "Failed to fetch leaderboard");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [page]);

  return (
    <section className="problems-page-container">
      <header className="problems-hero">
        <div className="hero-content">
          <p className="eyebrow">Rankings</p>
          <h1>Leaderboard</h1>
          <p className="hero-subtext">
            Users ranked by problems solved and a difficulty-weighted score. Ties are broken by
            who reached their score first.
          </p>
        </div>
      </header>

      {isLoading ? (
        <div className="page-status" style={{ padding: "4rem 0" }}>
          <div className="spinner" style={{ margin: "0 auto 1.5rem" }} />
          <p>Loading leaderboard...</p>
        </div>
      ) : error ? (
        <div className="alert error">{error}</div>
      ) : leaderboard.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Trophy size={24} />
          </div>
          <h3>No Rankings Yet</h3>
          <p>Solve a problem to be the first one on the leaderboard.</p>
        </div>
      ) : (
        <>
          <div className="table-responsive card-fade-in">
            <table className="problems-table">
              <thead>
                <tr>
                  <th style={{ width: "80px", textAlign: "center" }}>Rank</th>
                  <th>User</th>
                  <th style={{ width: "140px", textAlign: "center" }}>Solved</th>
                  <th style={{ width: "100px", textAlign: "center" }}>Score</th>
                  <th style={{ width: "220px" }}>Breakdown</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry) => (
                  <tr
                    key={entry.userId}
                    className={entry.userId === user?.id ? "leaderboard-row-you" : ""}
                  >
                    <td style={{ textAlign: "center" }}>
                      <span className={`rank-badge rank-${entry.rank}`}>{entry.rank}</span>
                    </td>
                    <td>
                      <span className="problem-link-title">{entry.name}</span>
                      {entry.userId === user?.id && <span className="you-tag">You</span>}
                    </td>
                    <td style={{ textAlign: "center" }} className="muted-text">
                      {entry.problemsSolved}
                    </td>
                    <td style={{ textAlign: "center" }} className="muted-text">
                      {entry.score}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                        <span className="difficulty-badge difficulty-easy">
                          {entry.breakdown.easy} Easy
                        </span>
                        <span className="difficulty-badge difficulty-medium">
                          {entry.breakdown.medium} Med
                        </span>
                        <span className="difficulty-badge difficulty-hard">
                          {entry.breakdown.hard} Hard
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="leaderboard-pagination">
            <button
              className="secondary-button"
              type="button"
              onClick={() => setPage((current) => current - 1)}
              disabled={pagination.page <= 1}
            >
              Previous
            </button>
            <span className="page-status-text">
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              className="secondary-button"
              type="button"
              onClick={() => setPage((current) => current + 1)}
              disabled={pagination.page >= pagination.pages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </section>
  );
};

export default LeaderboardPage;
