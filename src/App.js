import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { scaleLinear } from 'd3-scale';
import throttle from 'lodash.throttle';
import Pythagoras from './Pythagoras';

const baseW = 80;

class App extends Component {
    svg = {
        width: 1280,
        height: 600,
        style: {
            border: "1px solid lightgray"
        }
    };

    currentMax = 0;
    heightFactor = 0;
    lean = 0;

    state = {
        currentMax: this.currentMax,
        heightFactor: this.heightFactor,
        lean: this.lean
    };

    running = false;
    realMax = 11;
    scaleFactor = scaleLinear().domain([this.svg.height, 0]).range([0, .8]);
    scaleLean = scaleLinear().domain([0, this.svg.width/2, this.svg.width]).range([.5, 0, -.5]);

    rafRender = () => {
        requestAnimationFrame(() => {
            this.setState({
                currentMax: this.currentMax,
                heightFactor: this.heightFactor,
                lean: this.lean
            }, this.rafRender);
        });
    }

    next = () => {
        if (this.currentMax < this.realMax) {
            this.currentMax += 1;
            setTimeout(this.next, 500);
        }
    }

    onMouseMove = event => {
        const  { offsetX: x, offsetY: y } = event;
        this.heightFactor = this.scaleFactor(y);
        this.lean = this.scaleLean(x);
    }

    throttledOnMouseMove = throttle(this.onMouseMove, Number(location.hash.substr(1)) || 12);

    componentDidMount() {
        this.refs.svg.addEventListener('mousemove', this.throttledOnMouseMove);
        this.rafRender();
        this.next();
    }

    shouldComponentUpdate(nextProps, { currentMax, heightFactor, lean }) {
        return heightFactor !== this.state.heightFactor
            || lean !== this.state.heightFactor
            || currentMax !== this.state.currentMax;
    }

    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h2>This is a dancing Pythagoras tree</h2>
                </div>
                <p className="App-intro">
                    <svg
                        ref="svg"
                        width={this.svg.width}
                        height={this.svg.height}
                        style={this.svg.style}
                    >
                        <Pythagoras w={baseW}
                                    h={baseW}
                                    heightFactor={this.state.heightFactor}
                                    lean={this.state.lean}
                                    x={this.svg.width/2-40}
                                    y={this.svg.height-baseW}
                                    lvl={0}
                                    maxlvl={this.state.currentMax}/>

                    </svg>
                </p>
            </div>
        );
    }
}

export default App;
