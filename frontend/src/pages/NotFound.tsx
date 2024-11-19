import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex items-center mb-8">
        <span className="text-4xl font-bold mr-4">404</span>
        <div className="border-l-4 pl-4">
          <h1 className="text-4xl font-semibold">
            Page Not Found
          </h1>
        </div>
      </div>
      <p className="text-lg mb-8">
        The page you are looking for doesn't exist or has been removed.
      </p>
      <Link
        to="/"
        className="px-6 py-3 underline font-semibold rounded-md"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;
