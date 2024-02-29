import { Link } from 'react-router-dom';

export default function Nav() {
    return (
      <div className='div-navigation'>
        <Link to="/">Home</Link>
        <Link to="/grandpa">Grandpa's Collection</Link>
        <Link to="/uncle">Uncle's Collection</Link>
      </div>
    );
}