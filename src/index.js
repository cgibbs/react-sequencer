import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import BD from './assets/BD.wav';
import SD from './assets/SD.wav';
import HH from './assets/HH.wav';

function Step(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value ? 1 : 0}
    </button>
  )
}

// class Board extends React.Component {
//   renderSquare(i) {
//     return (
//       <Square 
//         value={this.props.squares[i]} 
//         onClick={() => this.props.onClick(i)}
//       />
//     );
//   }

//   render() {
//     const kickSteps = this.props.sequencers.kickSeq.map()
//     return (
//       <div>
//         <div className="status">{this.props.status}</div>
//         <div className="board-row">
//           {this.renderSquare(0)}
//           {this.renderSquare(1)}
//           {this.renderSquare(2)}
//         </div>
//         <div className="board-row">
//           {this.renderSquare(3)}
//           {this.renderSquare(4)}
//           {this.renderSquare(5)}
//         </div>
//         <div className="board-row">
//           {this.renderSquare(6)}
//           {this.renderSquare(7)}
//           {this.renderSquare(8)}
//         </div>
//       </div>
//     );
//   }
// }

class SequencerRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sequencer: props.sequencer
    }
  }

  handleClick(i) {
    this.state.sequencer[i] = !this.state.sequencer[i];
    this.setState({
      sequencer: this.state.sequencer
    })
  }

  renderStep(i) {
    return (
      <Step 
        value={this.state.sequencer[i]} 
        onClick={() => this.handleClick(i)}
      />
    );
  }

  render() {
    const seqSteps = this.state.sequencer.map(
      (step, stepState) => {
        return(
          <span key={'Kick' + stepState}>{this.renderStep(stepState)}</span>
        );
      }
    );

    return (
      <div>
        <div className="board-row">
          {seqSteps}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bpm: 130,
      playing: false,
      sequencers: {
        kickSeq: Array(16).fill(0),
        snareSeq: Array(16).fill(0),
        hatSeq: Array(16).fill(0),
      },
      stepNumber: 0,
    }

    this.kickSound = new Audio(BD);
    this.snareSound = new Audio(SD);
    this.hatSound = new Audio(HH);
  }

  // handleClick(i) {
  //   const history = this.state.history.slice(0, this.state.stepNumber + 1);
  //   const current = history[this.state.stepNumber];
  //   const squares = current.squares.slice();
  //   if (calculateWinner(squares) || squares[i]) {
  //     return;
  //   }
  //   squares[i] = this.state.xIsNext ? 'X' : 'O';
  //   this.setState({
  //     history: history.concat([{
  //       squares: squares,
  //     }]),
  //     stepNumber: history.length,
  //     xIsNext: !this.state.xIsNext,
  //   });
  // }

  // jumpTo(step) {
  //   this.setState({
  //     stepNumber: step,
  //     xIsNext: (step % 2) === 0,
  //   });
  // }

  startStop = () => {
    if (this.state.playing) {
      this.setState({
        playing: false,
        stepNumber: 0,
      })
      clearInterval(this.timer);
      return;
    }
    this.timer = setInterval(() => this.playSounds(), (30 / this.state.bpm) * 1000);
    this.setState({
      //sequencers: this.state.sequencers,
      playing: true,
    })
  }

  playSounds() {
    let step = this.state.stepNumber;
    if(this.state.sequencers.kickSeq[step]) {
      this.kickSound.play();
    }

    if(this.state.sequencers.snareSeq[step]) {
      this.snareSound.play();
    }

    if(this.state.sequencers.hatSeq[step]) {
      this.hatSound.play();
    }

    this.setState({
      //sequencers: this.state.sequencers,
      stepNumber: (this.state.stepNumber + 1) % 16,
    })
    console.log(this.state);
  }

  render() {
    return (
      <div className="game">
        <div className="game-board">
          <span>
            KICK: 
          <SequencerRow 
            sequencer={this.state.sequencers.kickSeq}
          />
          </span>
          <span>
            SNARE:
          <SequencerRow 
            sequencer={this.state.sequencers.snareSeq}
          />
          </span>
          <span>
            HAT:
          <SequencerRow 
            sequencer={this.state.sequencers.hatSeq}
          />
          </span>
        </div>
        <div className="game-info">
          {/* <div>{status}</div> */}
          {/* <ol>{moves}</ol> */}
        </div>
        <button onClick={this.startStop}>
          Start/Stop
        </button>
      </div>
    );
  }
}

// function calculateWinner(squares) {
//   const lines = [
//     [0, 1, 2],
//     [3, 4, 5],
//     [6, 7, 8],
//     [0, 3, 6],
//     [1, 4, 7],
//     [2, 5, 8],
//     [0, 4, 8],
//     [2, 4, 6],
//   ];
//   for (let i = 0; i < lines.length; i++) {
//     const [a, b, c] = lines[i];
//     if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
//       return squares[a];
//     }
//   }
//   return null;
// }

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

