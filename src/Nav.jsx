import { Link } from "react-router-dom";

export default function Nav() {
  return (
    <div className="div-navigation">
      <Link to="/">Home</Link>
      <Link to="/signup">Sign Up</Link>
      <Link to="/collection">My Collection</Link>
      <Link to="/allcollections">All Collections</Link>
      <Link to="/findanycard">Find Any Card</Link>
    </div>
  );
}
