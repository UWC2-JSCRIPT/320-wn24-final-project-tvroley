import {useNavigate} from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();

    const goGrandpa = () => {
        navigate('/grandpa');
    }

    const goUncle = () => {
        navigate('/uncle');
    }

    return (
        <div className="div-cards-buttons">
          <button onClick={goGrandpa}>Grandpa's Collection</button>
          <button onClick={goUncle}>Uncle's Collection</button>
        </div>
    );
}