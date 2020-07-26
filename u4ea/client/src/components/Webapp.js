import React, { Component } from "react";

import Header from "./Header.js"

import "../css/style.css";
import data from '../data.json';
import { Modal } from 'react-bootstrap';

import { BinauralBeat } from '../js/beats'

var context = new AudioContext()
var bBeat = new BinauralBeat(context);
var volume = context.createGain();


class Webapp extends Component {
    constructor() {
        super();
        this.state = {
            feelings: [],
            boosts: [],
            activities:
                [],
            feeling: "",
            boost: "",
            activity: "",
            playing: false,
            paused: false,
            frequency: "",
            id: "",
            frequencies: [],
            isfeelingOpen: false,
            isBoostOpen: false,
            isActivityOpen: false,
        }
    }

    componentWillMount() {
        this.setState({
            feelings: data.feelings,
            boosts: data.boosts,
            activities: data.activities,
        })

    }

    setFeeling(name, f) {
        bBeat.stop();
        this.feelingClose();
        this.setState({
            feeling: name,
            frequency: f,
        })
        if (this.state.playing) {
            this.handlePlay()
        }
    }

    setBoost(name, f) {
        bBeat.stop();
        this.boostClose();
        this.setState({
            boost: name,
            id: f,
        })
        if (this.state.playing) {
            this.handlePlay()
        }
    }

    setActivity(name, f) {
        bBeat.stop();
        this.activityClose();
        this.setState({
            activity: name,
            frequencies: f,
        })
        if (this.state.playing) {
            this.handlePlay()
        }
    }

    handlePause = e => {
        this.setState({
            playing: false,
        })
        bBeat.stop();


    }

    handlePlay = e => {
        this.setState({
            playing: true
        })
        var options = {
            pitch: this.state.frequency,
            beatRate: this.state.frequencies[this.state.id],
        }
        bBeat = new BinauralBeat(context, options)
        bBeat.connect(volume)
        volume.connect(context.destination)
        volume.gain.value = .8

        bBeat.start()
    }

    feelingOpen = e => {
        this.setState({
            isfeelingOpen: true
        })
    }

    feelingClose = e => {
        this.setState({
            isfeelingOpen: false
        })
    }

    boostOpen = e => {
        this.setState({
            isboostOpen: true
        })
    }

    boostClose = e => {
        this.setState({
            isboostOpen: false
        })
    }

    activityOpen = e => {
        this.setState({
            isactivityOpen: true
        })
    }

    activityClose = e => {
        this.setState({
            isactivityOpen: false
        })
    }

    render() {
        const feelings = this.state.feelings.map((item, key) =>
            <div key={item.name} className="feelingContainer">
                <div className="chakra">
                    <img src={require(`../img/feelings/${item.color}.png`)} />
                </div>
                <div className={`${item.color}`}>
                    <b className="frequencyText">{item.frequency_range}</b>
                    <br />
                    <b> {item.title} </b>
                    <br />
                    <div className="details">
                        <b> Shift from: </b>
                        <p> {item.shift_from} </p>
                        <b> Shift to: </b>
                        <p> {item.shift_to} </p>
                    </div>
                    <div>
                    </div>
                    {item.feelings.map((feeling, key) => (
                        <button key={feeling} value={feeling} className={`btn btn-success ${item.color}`} onClick={e => this.setFeeling(e.target.value, item.frequency)}>
                            {feeling}
                        </button>
                    ))}
                </div>
            </div>
        );

        const boost = this.state.boosts.map((item, key) =>
            <div key={item.id} className="feelingContainer">
                <div className="chakra">
                    <img src={require(`../img/boosts/${item.name}.png`)} />
                </div>
                <div className={`${item.logo}`}>
                    <b className="frequencyText">{item.frequency}</b>

                    <div className="details">
                        <b> Shift from: </b>
                        <p> {item.shift_from} </p>
                        <b> Shift to: </b>
                        <p> {item.shift_to} </p>
                    </div>
                </div>
                <button key={item.name} value={item.name} className={`btn btn-success ${item.logo}`} onClick={e => this.setBoost(e.target.value, item.id)}>
                    {item.name}
                </button>

            </div>
        )

        const activity = this.state.activities.map((item, key) =>
            <button key={item.name} value={item.name} className={'btn btn-success activity'} onClick={e => this.setActivity(e.target.value, item.frequencies)}>
                {item.name}
            </button>
        );

        const playable = ((this.state.feeling !== "") &&
            (this.state.boost !== "") &&
            (this.state.activity !== ""))

        let player;
        if (playable) {
            if (this.state.playing) {
                player = <button className="btn btn-default btn-circle glyphicon glyphicon-pause" onClick={this.handlePause}></button>
            } else {
                player = <button className="btn btn-default btn-circle glyphicon glyphicon-play-circle" onClick={this.handlePlay}></button>
            }
        } else {
            player = <button className="btn btn-default btn-circle glyphicon glyphicon-play-circle" disabled></button>
        }

        return (
            <div>
                {console.log(this.state)}
                {console.log(this.state.frequency)}
                {console.log(this.state.frequencies[this.state.id])}

                <Header />
                <div>
                    <div className="div1">
                        <div className="text">
                            I WANT TO FEEL
                            <br />
                            <div className="selectText">
                                <b>
                                    {this.state.feeling ? <button type="button" className="btn btn-light" onClick={this.feelingOpen}>
                                        {this.state.feeling}
                                    </button> :
                                        <button type="button" className="btn btn-light" onClick={this.feelingOpen}>
                                            Select Mood
                                      </button>
                                    }
                                </b>
                            </div>
                        </div>
                        <Modal show={this.state.isfeelingOpen} onHide={this.feelingClose} animation={false}
                            dialogClassName="my-modal">
                            <Modal.Header>
                            </Modal.Header>
                            <Modal.Body>
                                <div className="selector">
                                    <h1>Choose a feeling:</h1>
                                    <br />
                                    {feelings}
                                </div>

                            </Modal.Body>
                            <Modal.Footer>
                                <button onClick={this.feelingClose}>Cancel</button>

                            </Modal.Footer>
                        </Modal>
                        <div className="waveWrapper waveAnimation">
                            <div className="waveWrapperInner bgMiddle">
                                <div className="wave waveMiddle" style={{ backgroundImage: "url(" + 'http://front-end-noobs.com/jecko/img/wave-mid.png' + ")" }}></div>
                            </div>
                        </div>
                    </div>
                    <div className="div2">
                        <div className="text">
                            AND BOOST MY
                            <br />
                            <div className="selectText">
                                <b>
                                    {this.state.boost ? <button type="button" className="btn btn-light" onClick={this.boostOpen}>
                                        {this.state.boost}
                                    </button> :
                                        <button className="btn btn-light" onClick={this.boostOpen}>
                                            Select Mood
                                      </button>
                                    }
                                </b>
                            </div>
                            <Modal show={this.state.isboostOpen} onHide={this.boostClose} animation={false}
                                dialogClassName="my-modal">
                                <Modal.Header>
                                </Modal.Header>
                                <Modal.Body>
                                    <div className="selector">
                                        <h1>Choose a boost:</h1>
                                        <br />
                                        {boost}
                                    </div>

                                </Modal.Body>
                                <Modal.Footer>
                                    <button onClick={this.boostClose}>Cancel</button>

                                </Modal.Footer>
                            </Modal>
                        </div>
                    </div>
                    <div className="div3">
                        <div className="text">
                            WHILE I
                            <br />
                            <div className="selectText">
                                <b>
                                    {this.state.activity ? <button type="button" className="btn btn-light" onClick={this.activityOpen}>
                                        {this.state.activity}
                                    </button> :
                                        <button className="btn btn-light" onClick={this.activityOpen}>
                                            Select Mood
                                      </button>
                                    }
                                </b>
                            </div>
                            <Modal show={this.state.isactivityOpen} onHide={this.activityClose} animation={false}
                                dialogClassName="my-modal">
                                <Modal.Header>
                                </Modal.Header>
                                <Modal.Body>
                                    <div className="selector">
                                        <h1>Choose an activity:</h1>
                                        <br />
                                        {activity}
                                    </div>
                                </Modal.Body>
                                <Modal.Footer>
                                    <button onClick={this.activityClose}>Cancel</button>

                                </Modal.Footer>
                            </Modal>
                        </div>
                    </div>
                </div>
                <div className="bg-light play-bar">
                    {player}
                </div>
            </div>
        )
    }
}

export default Webapp;