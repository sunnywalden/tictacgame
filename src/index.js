import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {

  renderSquare(i) {
    return (
        <Square
            value={this.props.squares[i]}
            onClick={() =>
                this.props.onClick(i)
            }
        />
    );
  }

  render() {

    return (
      <div>
        {/*<div className="status">{status}</div>*/}
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                rowNumber: 0,
                columnNumber: 0,
            }],
            stepNumber: 0,
            xIsNext: true,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length -1];
        const squares = current.squares.slice();
        const rowNumber = 1 + parseInt(i / 3);
        if ((i % 3) === 0) {
            var columnNumber = 1;
        } else if ((i % 3) === 1) {
            columnNumber = 2;
        } else {
            columnNumber = 3;
        }
        if (caculateWinner(squares) || squares[i]) {
            // return;
            alert('Game over!Start again!');
            return;
        }
        squares[i] = this.state.xIsNext? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                rowNumber: rowNumber,
                columnNumber: columnNumber,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

  render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = caculateWinner(current.squares);

        const moves = history.map((step, move) => {
                const desc = move ?
                    'Go to move #' + move + '(' + history[move - 1].rowNumber + ',' + history[move - 1].rowNumber + ')' :
                    'Go to game start';
                if (move === history.length - 1) {
                    return (
                        <li>
                            <button className="latest" onClick={() => this.jumpTo(move)}>{desc}</button>
                        </li>
                    )
                } else {
                    return (
                        <li>
                            <button onClick={() => this.jumpTo(move)}>{desc}</button>
                        </li>
                    )
                }
            }


        );

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext? 'X' : 'O');
        }

    return (
      <div className="game">
        <div className="game-board">
          <Board
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
              />
        </div>
        <div className="game-info">
          <div>{ status }</div>
          <ol>{ moves }</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function caculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

