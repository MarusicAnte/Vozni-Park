import { Outlet } from "react-router-dom";
import "../App.css";
import Navbar from "../components/Navbar";

function Home() {
  return (
    <div className="flex flex-col gap-6">
      <Navbar />
      <Outlet />
    </div>
  );
}

export default Home;
