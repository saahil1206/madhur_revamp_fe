import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <p className="not-found-text">Page not found</p>
        <Link to="/" className="btn btn-danger not-found-btn">
          Go to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
