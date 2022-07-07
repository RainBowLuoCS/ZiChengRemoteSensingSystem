import { makeAutoObservable } from 'mobx'

const body = document.body

class HeightState {
  bodyHeight = 0

  constructor() {
    makeAutoObservable(this)
    this.init()
  }

  init() {
    this.bodyHeight = body.offsetHeight
  }

  updateHeight(val: number) {
    this.bodyHeight = val
  }
}

export const HeightStore = new HeightState()
