import React, { Component } from 'react'

import './style.css'

import Trains from './Trains'

class App extends Component {
  render () {
    return (
      <div className='App'>
        <div className='row'>
          <div className='col-2'>
            <ul className='list-group'>
              <li className='list-group-item'>Cras justo odio</li>
              <li className='list-group-item'>Dapibus ac facilisis in</li>
              <li className='list-group-item'>Morbi leo risus</li>
              <li className='list-group-item'>Porta ac consectetur ac</li>
              <li className='list-group-item'>Vestibulum at eros</li>
            </ul>
          </div>
          <div className='col-10'>
            <Trains />
          </div>
        </div>

      </div>
    )
  }
}

export default App
