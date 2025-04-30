import { useState, useEffect } from "react";

function App3() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [turnPlayer, setTurnPlayer] = useState(true); // true = human 'X', false = AI 'O'
  const [winner, setWinner] = useState(null);
  const [caseWinning, setCaseWinning] = useState([]);
  const [aiPoints, setAiPoints] = useState(0);
  const [playerPoints, setPlayerPoints] = useState(0);

  useEffect(() => {
    if (!turnPlayer && !winner) {
      const timeout = setTimeout(() => {
        const bestMove = getBestMove(board);
        if (bestMove !== -1) handleClick(bestMove);
      }, 2000); // wait 2 seconds
      return () => clearTimeout(timeout);
    }
  }, [turnPlayer]);

  useEffect(() => {
    if (aiPoints === 3 || playerPoints === 3) {
      setTimeout(() => {
        resetAllGame();
      }, 2000);
    }
  }, [aiPoints, playerPoints]);

  const resetAllGame = () => {
    setBoard(Array(9).fill(null));
    setTurnPlayer(true);
    setWinner(null);
    setCaseWinning([]);
    setAiPoints(0);
    setPlayerPoints(0);
  };

  const handleClick = (index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = turnPlayer ? "X" : "O";
    setBoard(newBoard);
    handleWin(newBoard);
    setTurnPlayer((prev) => !prev);
  };

  const handleWin = (board) => {
    const winningCases = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let pattern of winningCases) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setWinner(board[a]);
        setCaseWinning([a, b, c]);
        if (board[a] === "X") {
          setPlayerPoints((x) => x + 1);
        } else {
          setAiPoints((x) => x + 1);
        }
        setTimeout(() => {
          setBoard(Array(9).fill(null));
          setWinner(null);
          setCaseWinning([]);
          setTurnPlayer(true);
        }, 2000);
        return;
      }
    }

    if (board.every((cell) => cell !== null)) {
      setTimeout(() => {
        setBoard(Array(9).fill(null));
        setWinner(null);
        setCaseWinning([]);
        setTurnPlayer(true);
      }, 2000);
    }
  };

  // ---- MINIMAX ALGORITHM ----
  const getBestMove = (board) => {
    let bestScore = -Infinity;
    let move = -1;

    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = "O";
        const score = minimax(board, 0, false);
        board[i] = null;
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }

    return move;
  };

  const minimax = (board, depth, isMaximizing) => {
    const result = checkWinner(board);
    if (result !== null) {
      const scores = { X: -1, O: 1, tie: 0 };
      return scores[result];
    }

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (!board[i]) {
          board[i] = "O";
          const score = minimax(board, depth + 1, false);
          board[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (!board[i]) {
          board[i] = "X";
          const score = minimax(board, depth + 1, true);
          board[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  const checkWinner = (board) => {
    const win = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let [a, b, c] of win) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    if (board.every((cell) => cell !== null)) return "tie";
    return null;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100">
      <Result
        turnPlayer={turnPlayer}
        winner={winner}
        ai={aiPoints}
        player={playerPoints}
      />

      <div className="grid grid-cols-3 gap-6 place-items-center p-4 py-12 rounded-lg shadow-md shadow-gray-700 max-w-[900px] w-[95%] bg-white">
        {board.map((cell, index) => (
          <div
            onClick={() => handleClick(index)}
            key={index}
            className={`w-32 h-32 border-2 border-gray-400 flex items-center justify-center text-4xl font-bold cursor-pointer hover:bg-gray-100 ${
              caseWinning.includes(index)
                ? "bg-green-600 text-white"
                : "bg-white"
            }`}
          >
            {cell}
          </div>
        ))}
      </div>
    </div>
  );
}

function Result({ ai, player, turnPlayer, winner }) {
  return (
    <div className="flex justify-between items-center text-2xl font-bold text-blue-700 w-[95%] max-w-[900px] mb-6">
      <div>
        <h4>AI: {ai}</h4>
      </div>
      {winner ? (
        <h1 className="text-3xl text-blue-800">Winner: {winner}</h1>
      ) : (
        <h1 className="text-3xl text-blue-800">
          {turnPlayer ? "Your Turn (X)" : "AI Turn (O)"}
        </h1>
      )}
      <div>
        <h4>Player: {player}</h4>
      </div>
    </div>
  );
}

export default App3;
