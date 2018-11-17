import React from 'react'
import Phaser from 'phaser'

const state = {
  MOTION: 0,
  IDLING: 1,
  OOS: 2
}

const rectangle = (scene, x, y, width, height) => {
  var rect = new Phaser.Geom.Rectangle(x, y, width, height)

  var graphics = scene.add.graphics({ fillStyle: { color: 'red' } })

  graphics.fillRectShape(rect)

  return graphics
}

let zoom = 0.25

const scrollListener = (e) => {
  zoom -= e.deltaY * 0.001
  if (zoom < 0.1) {
    zoom = 0.1
  }
  if (zoom > 10) { zoom = 10 }
  console.log(zoom)
}

let trains = []
export default class Trains extends React.Component {
  constructor () {
    super()

    this.state = {
      game: {},
      selected: null,
      camera: null
    }
  }
  async create () {
    const scene = this.state.game.scene.scenes[0]
    const width = 2000
    const height = 2000

    var cam = scene.cameras.main

    cam.setBounds(0, 0, width, height).setZoom(1)
    cam.scrollX = 0
    cam.scrollY = 0

    // click train
    scene.input.on('gameobjectdown', (pointer, gameobject) => {
      console.log(gameobject)
      console.log(cam)

      // Only follow if not a drag
      console.log(pointer)
      this.setState({ selected: gameobject, camera: cam })
      cam.startFollow(gameobject)
      console.log(gameobject.x - cam.scrollX, gameobject.y - cam.scrollY)
    })

    console.log(cam)

    let track1 = []
    for (let n = 0; n <= 1; n++) {
      for (let i = 0; i < 200; i++) {
        track1[i] = rectangle(scene, i * 15, 400 + (200 * n), 15, 25)
      }
    }

    let track2N = []
    for (let i = 0; i < 200; i++) {
      track2N[i] = rectangle(scene, 2200, i * 15, 25, 15)
    }

    let track2S = []
    for (let i = 0; i < 200; i++) {
      track2S[i] = rectangle(scene, 2400, i * 15, 25, 15)
    }

    let track3 = []
    for (let n = 0; n <= 1; n++) {
      for (let i = 0; i < 200; i++) {
        track3[i] = rectangle(scene, i * 15, 2200 + (200 * n), 15, 25)
      }
    }

    let train1 = {
      tracking: 12345,
      track: 1,
      pos: 0,
      speed: 25,
      state: state.MOTION,
      obj: rectangle(scene, 0, 0, 15, 50)
    }

    console.log(train1.obj)

    train1.obj.x = 500

    trains.push(train1)

    window.addEventListener('wheel', scrollListener)
  }

  worldToScreen (camera, pos) {
    return {
      x: pos.x - camera.scrollX,
      y: pos.y - camera.scrollY
    }
  }

  update (time, delta) {
    const camera = this.cameras.main

    if (this.input.activePointer.isDown) {
      if (this.game.origDragPoint) {
        camera.stopFollow()
        // Todo only stop follow on a proper drag
        camera.scrollX += (this.game.origDragPoint.x - this.input.activePointer.position.x) / zoom
        camera.scrollY += (this.game.origDragPoint.y - this.input.activePointer.position.y) / zoom
      }
      this.game.origDragPoint = this.input.activePointer.position.clone()
    } else {
      this.game.origDragPoint = null
    }

    for (let train of trains) {

    }

    camera.setZoom(zoom)
  }

  componentDidMount () {
    const config = {
      width: window.innerWidth,
      height: window.innerHeight,
      parent: 'trains',
      physics: {
        default: 'arcade',
        arcade: {
          debug: false,
          gravity: { y: 0 }
        }
      },
      scene: {
        preload: null,
        create: this.create.bind(this),
        update: this.update
      },
      backgroundColor: 'rgba(100,100,100,1)'
    }
    this.setState({ game: new Phaser.Game(config) })
  }

  componentWillUnmount () {
    this.state.game.runDestroy()
    window.removeEventListener('wheel', scrollListener)
  }

  render () {
    return (
      <div>
        <div id='trains' style={{ zIndex: '-1000', top: 0, left: 0, width: window.innerWidth, height: window.innerHeight }} />
      </div>
    )
  }
}
