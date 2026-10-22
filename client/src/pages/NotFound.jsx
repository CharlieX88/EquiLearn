import { Link } from "react-router-dom";
import { Home, AlertTriangle } from "lucide-react";

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900 px-4">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-danger/10 mb-6">
          <AlertTriangle className="w-10 h-10 text-danger" />
        </div>
        <h1 className="text-7xl font-bold text-gradient mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-dark-50 mb-3">
          Page Not Found
        </h2>
        <p className="text-dark-100 mb-8">
          Bhai, ye page exist nahi karta. Ghar wapas chalo.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;