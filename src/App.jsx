import '../src/App.css'
import { useEffect, useState } from 'react'
import confetti from 'canvas-confetti'

const turns = {
  X: "❌",
  O: "⚪"
}

const winnerCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]

export function Square({ children, isSelected, updateBoard, index }) {
  const className = `square ${isSelected ? 'is-selected' : ''}`

  function handleClick() {
    updateBoard(index)
  }

  return (
    <div onClick={handleClick} className={className}>
      {children}
    </div>
  )
}

export default function App() {
  const [board, setBoard] = useState(Array(9).fill(null))
  const [turn, setTurn] = useState(turns.X)
  const [winner, setWinner] = useState(null)

  // Función para verificar si hay un ganador
  function checkWinner(boardToCheck) {
    for (const combination of winnerCombinations) {
      const [a, b, c] = combination
      if (boardToCheck[a] && boardToCheck[a] === boardToCheck[b] && boardToCheck[a] === boardToCheck[c]) {
        return boardToCheck[a]
      }
    }
    return null // Si no hay ganador
  }

  //funcion para actualizar el tablero
  function updateBoardFunction(index) {

    // No actualizar si hay un ganador o la casilla ya está ocupada
    if (winner || board[index]) return;

    // Cambiar el turno al siguiente jugador
    const newTurn = turn === turns.X ? turns.O : turns.X;
    setTurn(newTurn);
  
    // Crear una copia del tablero actual
    const newBoard = [...board];
    
    // Asignar el turno actual (X u O) a la casilla seleccionada
    newBoard[index] = turn;
  
    // Actualizar el estado del tablero
    setBoard(newBoard);


    window.localStorage.setItem('board', JSON.stringify(newBoard)) //Se guarda el tablero pasandolo a string
    window.localStorage.setItem('turn',newTurn) //Se guardan los turnos

    
    // Verificar si hay un ganador con el nuevo estado del tablero
    const newWinner = checkWinner(newBoard);
    if (newWinner) {
      setWinner(newWinner);  // Si hay un ganador, actualizar el estado del ganador
      confetti()
    } else if(checkForDraw(newBoard)){
      setWinner(false)
    }
  }

  //Funcion para verificar si hay un empate
  function checkForDraw(newBoard){
    //Se verifica que haya un empate viendo que no haya ningun Square en Null.
    return newBoard.every((square) => square != null)
  }

  //Funcion para cargar el progreso del juego.
  useEffect(function(){
    const savedBoard = window.localStorage.getItem('board') //Captura el board guardado
    const savedTurn = window.localStorage.getItem('turn') //Captura los turnos guardados

    if(savedBoard){
      setBoard(JSON.parse(savedBoard)) //Se vuelve a pasar el board al formato original (arreglo)
    }

    if(savedTurn){
      setTurn(savedTurn)
    }
  },[])

  //Funcion para reiniciar el juego.
  function resetGame(){
    setBoard(Array(9).fill(null))
    setTurn(turns.X)
    setWinner(null)
    window.localStorage.removeItem('board')
    window.localStorage.removeItem('turn')
  }

  return (
    <main className="board">
      <h1>Tic Tac Toe</h1>
      <hr />
      <section className="game">
        {board.map((value, index) => (
          <Square key={index} index={index} updateBoard={updateBoardFunction}>
            {value}
          </Square>
        ))}
      </section>

      <section className="turn">
        <Square isSelected={turn === turns.X}>{turns.X}</Square>
        <Square isSelected={turn === turns.O}>{turns.O}</Square>
      </section>

      {winner !== null &&(
        <div className="winner">
          <div className="text">
            <h2>
              {winner === false ? 'Empate' : 'Ganó:'}
            </h2>

            <div className='win'>
              {winner && <Square>{winner}</Square>}
            </div>

            <footer>
              <button onClick={resetGame}>Empezar de nuevo</button>
            </footer>
          </div>
        </div>
      )}
    </main>
  )
}
