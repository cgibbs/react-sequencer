import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import BD from './assets/BD.wav';
import SD from './assets/SD.wav';
import HH from './assets/HH.wav';
import {Howl} from 'howler';

function Step(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value ? 1 : 0}
    </button>
  )
}

class SequencerRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sequencer: props.sequencer
    }
  }

  handleClick(i) {
    let seq = this.state.sequencer
    seq[i] = !seq[i];
    this.setState({
      sequencer: seq
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
      bpm: 170,
      playing: false,
      sequencers: {
        kickSeq: Array(16).fill(0),
        snareSeq: Array(16).fill(0),
        hatSeq: Array(16).fill(0),
      },
      stepNumber: 0,
    }

    // this.kickSound = new Audio(BD);
    // this.snareSound = new Audio(SD);
    // this.hatSound = new Audio(HH);
    this.kickSound = new Howl({
      src: BD,
    })
    this.snareSound = new Howl({
      src: SD,
    })
    this.hatSound = new Howl({
      src: HH,
    })
  }

  startStop = () => {
    if (this.state.playing) {
      this.setState({
        playing: false,
        stepNumber: 0,
      })
      clearInterval(this.timer);
      return;
    }
    this.timer = setInterval(() => this.playSounds(), (15 / this.state.bpm) * 1000);
    this.setState({
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
      stepNumber: (this.state.stepNumber + 1) % 16,
    })
    console.log(this.state);
  }

  handleInputChange = event => {
    const bpm = event.target.value;

    if (this.state.playing) {
      // stop old timer and start a new one
      clearInterval(this.timer);
      this.timer = setInterval(() => this.playSounds(), (15 / bpm) * 1000);
      this.setState({
        bpm
      });
    } else {
      // otherwise, just update the bpm
      this.setState({ bpm });
    }
  };

  render() {
    return (
      <div>
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
          <button onClick={this.startStop}>
            Start/Stop
          </button>
        </div>
        <div className="bpm-slider">
          <span>
            <p>{this.state.bpm} BPM</p>
            <input
              type="range"
              min="60"
              max="240"
              value={this.state.bpm}
              onChange={this.handleInputChange}
            />
          </span>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

