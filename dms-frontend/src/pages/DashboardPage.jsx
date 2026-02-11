import { Link } from "react-router-dom";
import SummaryCards from "../components/Dashboard/SummaryCards";

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </header>

      <SummaryCards />
    </div>
  );
};

export default DashboardPage;