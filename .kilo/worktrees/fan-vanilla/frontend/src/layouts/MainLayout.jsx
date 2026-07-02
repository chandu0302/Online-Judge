import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import PageMotion from "../components/ui/PageMotion.jsx";

const MainLayout = () => {
  const location = useLocation();

  const isWorkspace =
    /^\/problems\/[a-f0-9]{24}$/i.test(location.pathname) ||
    (/^\/problems\/[a-zA-Z0-9_-]+$/.test(location.pathname) &&
      location.pathname !== "/problems");

  return (
    <div className="app-shell">
      <Navbar />
      <main className={isWorkspace ? "workspace-main-content" : "main-content"}>
        {isWorkspace ? (
          <Outlet />
        ) : (
          <PageMotion key={location.pathname}>
            <Outlet />
          </PageMotion>
        )}
      </main>
    </div>
  );
};

export default MainLayout;
