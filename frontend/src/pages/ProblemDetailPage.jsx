import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import CompilerWorkspace from "../components/compiler/CompilerWorkspace.jsx";
import DifficultyBadge from "../components/problems/DifficultyBadge.jsx";
import TagList from "../components/problems/TagList.jsx";
import { getProblemById } from "../services/problemService.js";
import { getErrorMessage } from "../utils/getErrorMessage.js";

const MIN_SPLIT = 25;
const MAX_SPLIT = 75;
const DEFAULT_SPLIT = 50;

const DetailBlock = ({ title, children }) => {
  if (!children) {
    return null;
  }

  return (
    <section className="detail-block">
      <h2>{title}</h2>
      <p>{children}</p>
    </section>
  );
};

const ProblemDetailPage = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [splitPercent, setSplitPercent] = useState(DEFAULT_SPLIT);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMouseDown = useCallback((event) => {
    event.preventDefault();
    setIsDragging(true);
  }, []);

  useEffect(() => {
    if (!isDragging) return undefined;

    const handleMouseMove = (event) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const rawPercent = ((event.clientX - rect.left) / rect.width) * 100;
      setSplitPercent(Math.min(MAX_SPLIT, Math.max(MIN_SPLIT, rawPercent)));
    };
    const handleMouseUp = () => setIsDragging(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  useEffect(() => {
    document.body.classList.toggle("is-resizing", isDragging);
    return () => document.body.classList.remove("is-resizing");
  }, [isDragging]);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setError("");
        const response = await getProblemById(id);
        setProblem(response.data);
      } catch (apiError) {
        setError(getErrorMessage(apiError) || "Failed To Fetch Problems");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  if (isLoading) {
    return <div className="page-status">Loading...</div>;
  }

  if (error) {
    return (
      <section className="detail-page">
        <Link className="back-link" to="/problems">
          <ChevronLeft size={16} />
          Back to problems
        </Link>
        <div className="alert error">{error}</div>
      </section>
    );
  }

  return (
    <div
      className="workspace-container"
      ref={containerRef}
      style={{ "--split": `${splitPercent}%` }}
    >
      {/* Left Column: Problem Details & Description */}
      <article className="problem-description-pane">
        <Link className="back-link" to="/problems" style={{ marginBottom: "1.5rem", display: "inline-flex" }}>
          <ChevronLeft size={16} />
          Back to problems
        </Link>

        <header className="problem-detail-header" style={{ marginBottom: "1rem" }}>
          <div>
            <p className="eyebrow" style={{ marginBottom: "0.25rem" }}>Problem details</p>
            <h1 style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", margin: "0 0 0.5rem 0" }}>{problem.title}</h1>
          </div>
          <DifficultyBadge difficulty={problem.difficulty} />
        </header>

        <div style={{ marginBottom: "1.5rem" }}>
          <TagList tags={problem.tags} />
        </div>

        <div className="problem-details-content">
          <DetailBlock title="Statement">{problem.statement}</DetailBlock>
          <DetailBlock title="Input Format">{problem.inputFormat}</DetailBlock>
          <DetailBlock title="Output Format">{problem.outputFormat}</DetailBlock>
          <DetailBlock title="Constraints">{problem.constraints}</DetailBlock>

          <section className="detail-block">
            <h2>Examples</h2>
            {problem.examples?.length ? (
              <div className="examples-list">
                {problem.examples.map((example, index) => (
                  <div className="example-card" key={`${example.input}-${index}`}>
                    <h3>Example {index + 1}</h3>
                    <div>
                      <span>Input:</span>
                      <pre>{example.input || "Not provided"}</pre>
                    </div>
                    <div>
                      <span>Output:</span>
                      <pre>{example.output || "Not provided"}</pre>
                    </div>
                    {example.explanation && (
                      <div>
                        <span>Explanation:</span>
                        <p>{example.explanation}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p>No examples provided.</p>
            )}
          </section>
        </div>
      </article>

      {/* Drag handle to resize description vs. editor panes (desktop only) */}
      <div
        className="pane-resizer"
        onMouseDown={handleMouseDown}
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize panels"
      />

      {/* Right Column: Code Editor & Compiler Workspace */}
      <div className="compiler-pane">
        <CompilerWorkspace problemId={id} problem={problem} />
      </div>
    </div>
  );
};

export default ProblemDetailPage;
