import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BarChart3,
  Bot,
  Code2,
  Container,
  Sparkles,
} from "lucide-react";
import useAuth from "../hooks/useAuth.js";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, delay: i * 0.08, ease: "easeOut" },
  }),
};

const features = [
  {
    icon: Code2,
    title: "Monaco Code Editor",
    description:
      "Write C++, Java, or Python in a fully featured Monaco editor with syntax highlighting and smart auto-tabbing.",
  },
  {
    icon: Container,
    title: "Docker Sandbox Security",
    description:
      "Every submission builds and runs inside an isolated Linux container, keeping execution safe and measurements accurate.",
  },
  {
    icon: Bot,
    title: "Gemini Code Reviewer",
    description:
      "Stuck on an algorithm? Request an automated AI review for instant feedback on bugs, efficiency, and edge cases.",
  },
  {
    icon: BarChart3,
    title: "Execution Analytics",
    description:
      "Track test case results, memory footprint, execution time, compiler output, and your full submission history in real-time.",
  },
];

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <article className="home-container">
      <motion.section
        className="home-hero"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        <div className="hero-badge">
          <Sparkles size={14} />
          Powered by Google Gemini & Docker isolation
        </div>
        <h1 className="hero-title">
          The Intelligent <br />
          <span>Online Judge Platform</span>
        </h1>
        <p className="hero-subtitle">
          Practice data structures and algorithms, compile and run your code
          instantly inside isolated Docker sandboxes, and get smart AI-powered
          feedback on every submission.
        </p>

        <div className="hero-cta-buttons">
          <Link className="primary-button hero-btn-main" to="/problems">
            Get Coding →
          </Link>
          {!isAuthenticated ? (
            <Link className="secondary-button hero-btn-sub" to="/register">
              Create Free Account
            </Link>
          ) : (
            <span className="welcome-back-text">
              Welcome back, <strong>{user?.name}</strong>! Ready to solve?
            </span>
          )}
        </div>
      </motion.section>

      <motion.section
        className="stats-row"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        variants={fadeUp}
      >
        {[
          { num: "< 100ms", label: "Compile & Execute Speed" },
          { num: "100%", label: "Isolated Docker Sandbox" },
          { num: "3 Languages", label: "C++, Java & Python Supported" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            className="stat-card"
            custom={i}
            variants={fadeUp}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <span className="stat-num">{stat.num}</span>
            <span className="stat-label">{stat.label}</span>
          </motion.div>
        ))}
      </motion.section>

      <section className="features-grid-section">
        <motion.h2
          className="section-title"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          Engineered for Modern Developers
        </motion.h2>

        <div className="features-grid">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                className="feat-card"
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-20px" }}
                variants={fadeUp}
                whileHover={{ scale: 1.015 }}
                transition={{ duration: 0.2 }}
              >
                <div className="feat-icon">
                  <Icon size={22} strokeWidth={1.75} />
                </div>
                <h3>{feat.title}</h3>
                <p>{feat.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>
    </article>
  );
};

export default Home;
