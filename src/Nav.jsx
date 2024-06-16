import { Link } from "react-router-dom";

export default function Nav() {
  return (
    <div className="div-navigation">
      <Link to="/">Home</Link>
      <Link to="/collection">My Collection</Link>
    </div>
  );
}
