import React, { Component } from 'react'

import './style.css'

import Trains from './Trains'

window.trains = []
window.forceUpdate = null

const getBgColor = (state) => {
  if (state === 0) {
    return 'white'
  } else if (state === 1) {
    return 'red'
  } else if (state === 2) {
    return 'white'
  } else {
    return 'yellow'
  }
}
class App extends Component {
  constructor () {
    super()
    this.state = {
      selectedTrain: null,
      value: ''
    }
  }

  componentDidMount () {
    window.forceUpdate = this.forceUpdate
    setTimeout(() => {
      this.forceUpdate()
    }, 1)

    setInterval(() => {
      this.forceUpdate()
    }, 10)
  }

  onClick (train) {
    console.log(train)
    this.setState({ selectedTrain: train })
  }

  close () {
    this.setState({ selectedTrain: null, value: '' })
  }

  onChange (e) {
    this.setState({ value: e.target.value })
  }

  searchTrain () {
    const id = this.state.value
    const train = window.trains.filter(t => t.tracking == id)[0]
    if (train !== null) {
      this.setState({ selectedTrain: train })
    }
  }

  render () {
    return (
      <div className='App'>
        <div className='row'>
          <div className='col-12 col-md-3 text-center' style={{ backgroundColor: '#e6ffe6' }}>
            <h2>Active Trains</h2>
            <div className='input-group mb-3'>
              <input type='text' class='form-control' placeholder='Train #' onChange={this.onChange.bind(this)} value={this.state.value} />
              <div className='input-group-append'>
                <button className='btn btn-outline-secondary' type='button' onClick={this.searchTrain.bind(this)}>Search</button>
              </div>
            </div>
            {this.state.selectedTrain ? <TrainDetail
              train={this.state.selectedTrain}
              close={this.close.bind(this)}
              fa={this.forceUpdate.bind(this)} />
              : <ul className='list-group'>
                {window.trains.map(train => (
                  <li
                    key={train.tracking}
                    className='list-group-item'
                    onClick={() => this.onClick(train)}
                    style={{ backgroundColor: getBgColor(train.state) }}
                  >
                    #{train.tracking} - {train.speed}mph / <span className='small'>{train.maxSpeed}mph</span>
                  </li>
                ))}
              </ul>
            }

          </div>

          <div className='col-12 col-md-9'>
            <Trains />
          </div>

        </div>

      </div>
    )
  }
}

const mapStateToName = (state) => {
  if (state === 0) {
    return 'In motion'
  } else if (state === 1) {
    return 'Stopped'
  } else if (state === 2) {
    return 'OOS'
  } else if (state === 3) {
    return 'Slowed'
  }
}

const TrainDetail = (props) => (
  <div>
    <h1>#{props.train.tracking}</h1>
    <h3>Speed: {props.train.speed}</h3>
    <h4>State: {mapStateToName(props.train.state)}</h4>

    {props.train.state === 0 || props.train.state === 3
      ? <button className='btn btn-block btn-warning' onClick={() => { props.train.state = 1; props.train.speed = 0; props.fa() }}>Stop</button>
      : <button className='btn btn-block btn-primary'onClick={() => { props.train.state = 0; props.train.speed = props.train.maxSpeed; props.fa() }}>Resume</button>
    }
    <button className='btn btn-block btn-secondary' onClick={props.close}>Back</button>
  </div>
)

export default App
