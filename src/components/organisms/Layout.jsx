import { Outlet } from "react-router-dom";
import Header from "@/components/organisms/Header";

const Layout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-cyan-50">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;