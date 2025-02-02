import { Link } from "react-router-dom";

export default function Nav() {
  return (
    <div className="div-navigation">
      <Link to="/">Home</Link>
      <Link to="/account">Account</Link>
      <Link to="/signup">Sign Up</Link>
      <Link to="/collection">My Collection</Link>
      <Link to="/collectors">Collectors</Link>
      <Link to="/allcollections">All Collections</Link>
    </div>
  );
}
