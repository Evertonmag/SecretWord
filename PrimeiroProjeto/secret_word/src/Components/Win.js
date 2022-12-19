import "./Win.css";

const Win = ({ retry, score }) => {
  return (
    <div>
      <h1>Parabéns</h1>
      <h2>
        Você conseguiu fazer <span>{score}</span> pontos
      </h2>
      <button onClick={retry}>Reiniciar Jogo</button>
    </div>
  );
};

export default Win;
