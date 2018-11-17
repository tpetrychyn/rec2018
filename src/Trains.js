import React from 'react'
import Phaser from 'phaser'

const state = {
  MOTION: 0,
  IDLING: 1,
  OOS: 2
}

const rectangle = (scene, x, y, width, height, color = 'red') => {
  var rect = new Phaser.Geom.Rectangle(x, y, width, height)

  var graphics = scene.add.graphics({ fillStyle: { color } })

  graphics.fillRectShape(rect)

  return graphics
}

let zoom = 0.25

const scrollListener = (e) => {
  zoom -= e.deltaY * 0.001
  if (zoom < 0.05) {
    zoom = 0.05
  }
  if (zoom > 10) { zoom = 10 }
}

// let trains = []
let tracks = []
const checkCollisionZones = (train) => {
  const safeSpeed = 5
  if (train.track === 0 || train.track === 2) {
    // collision zone 1EW
    if (train.pos > 28 && train.pos < 40) {
      train.speed = safeSpeed
      train.state = 3
    } else {
      train.speed = train.maxSpeed
      train.state = 0
    }
  } else if (train.track === 1) {
    // collision track 2NS
    if (train.pos > 2 && train.pos < 10) {
      train.speed = safeSpeed
      train.state = 3
    } else if (train.pos > 26 && train.pos < 32) {
      train.speed = safeSpeed
      train.state = 3
    } else {
      train.speed = train.maxSpeed
      train.state = 0
    }
  }
}
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
    const width = 30000
    const height = 30000

    var cam = scene.cameras.main

    cam.setBounds(0, 0, width, height).setZoom(zoom)
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

    let track1 = {
      trains: [],
      tiles: [],
      collisionZones: [

      ]
    }
    for (let n = 0; n <= 1; n++) {
      for (let i = 0; i < 200; i++) {
        track1.tiles[i] = rectangle(scene, i * 75, 400 + (200 * n), 75, 25)
      }
    }
    tracks.push(track1)

    let track2 = {
      trains: [],
      tiles: []
    }
    for (let n = 0; n <= 1; n++) {
      for (let i = 0; i < 200; i++) {
        track2.tiles[i] = rectangle(scene, 2400 + (200 * n), i * 75, 25, 75)
      }
    }
    tracks.push(track2)

    let track3 = {
      trains: [],
      tiles: []
    }
    for (let n = 0; n <= 1; n++) {
      for (let i = 0; i < 200; i++) {
        track3.tiles[i] = rectangle(scene, i * 75, 2200 + (200 * n), 75, 25)
      }
    }
    tracks.push(track3)

    let train1 = {
      tracking: 44444,
      track: 0,
      pos: 0,
      maxSpeed: 35,
      speed: 25,
      dir: 1,
      flipDir: function () { this.dir === 1 ? this.dir = -1 : this.dir = 1 },
      state: state.MOTION,
      obj: rectangle(scene, 0, 400, 150, 25, 0xff0000)
    }

    let train2 = {
      tracking: 33433,
      track: 1,
      pos: 0,
      maxSpeed: 55,
      speed: 25,
      dir: 1,
      flipDir: function () { this.dir === 1 ? this.dir = -1 : this.dir = 1 },
      state: state.MOTION,
      obj: rectangle(scene, 2400, 0, 25, 150, 0xff0000)
    }

    let train3 = {
      tracking: 45552,
      track: 1,
      pos: 200,
      maxSpeed: 55,
      speed: 25,
      dir: -1,
      flipDir: function () { this.dir === 1 ? this.dir = -1 : this.dir = 1 },
      state: state.MOTION,
      obj: rectangle(scene, 2600, 0, 25, 150, 0xff0000)
    }

    let train4 = {
      tracking: 52332,
      track: 2,
      pos: 0,
      maxSpeed: 45,
      speed: 25,
      dir: 1,
      flipDir: function () { this.dir === 1 ? this.dir = -1 : this.dir = 1 },
      state: state.MOTION,
      obj: rectangle(scene, 0, 2200, 150, 25, 0xff0000)
    }

    let train5 = {
      tracking: 52336,
      track: 2,
      pos: 200,
      maxSpeed: 45,
      speed: 25,
      dir: -1,
      flipDir: function () { this.dir === 1 ? this.dir = -1 : this.dir = 1 },
      state: state.MOTION,
      obj: rectangle(scene, 0, 2400, 150, 25, 0xff0000)
    }

    let train6 = {
      tracking: 41234,
      track: 0,
      pos: 200,
      maxSpeed: 15,
      speed: 15,
      dir: -1,
      flipDir: function () { this.dir === 1 ? this.dir = -1 : this.dir = 1 },
      state: state.MOTION,
      obj: rectangle(scene, 0, 600, 150, 25, 0xff0000)
    }

    window.trains.push(train1)
    window.trains.push(train2)
    window.trains.push(train3)
    window.trains.push(train4)
    window.trains.push(train5)
    window.trains.push(train6)

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

    const deltaA = 0.1 * delta
    for (let train of window.trains) {
      if (train.state === state.IDLING) {
        continue
      }
      checkCollisionZones(train)
      switch (train.track) {
        case 0:
        case 2: {
          train.pos += train.speed / 75 * train.dir / deltaA
          if (train.dir === 1 && train.pos >= 200) {
            train.obj.y += 200
            train.flipDir()
          } else if (train.dir === -1 && train.pos <= 0) {
            train.obj.y -= 200
            train.flipDir()
          }
          train.obj.x = train.pos * 75
          break
        }

        case 1: {
          train.pos += train.speed / 75 * train.dir / deltaA
          if (train.dir === 1 && train.pos >= 200) {
            train.obj.x += 200
            train.flipDir()
          } else if (train.dir === -1 && train.pos <= 0) {
            train.obj.x -= 200
            train.flipDir()
          }
          train.obj.y = train.pos * 75
          break
        }

        default:
          break
      }
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
      backgroundColor: 'rgba(255,255,255,1)'
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
