import { Link } from "react-router-dom";

const SummaryCards = () => (
  <div className="grid grid-cols-3 gap-6">
    <Link to="/documents" className="p-6 bg-white rounded shadow hover:bg-gray-50">
      <h2 className="text-xl font-semibold">Document Library</h2>
      <p>View, search, and manage documents</p>
    </Link>
    <div className="p-6 bg-white rounded shadow hover:bg-gray-50">
      <h2 className="text-xl font-semibold">Approvals / Workflows</h2>
      <p>View pending approvals and workflow tasks</p>
    </div>
    <div className="p-6 bg-white rounded shadow hover:bg-gray-50">
      <h2 className="text-xl font-semibold">Reports / Analytics</h2>
      <p>View document stats and usage reports</p>
    </div>
  </div>
);

export default SummaryCards;