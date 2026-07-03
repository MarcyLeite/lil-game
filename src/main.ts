import { createGame } from './game'
import './style.css'
import paper from 'paper'

const app = document.querySelector<HTMLDivElement>('#app')!
app.innerHTML = `<canvas class="game"></canvas>`

const canvas = app.querySelector<HTMLCanvasElement>('canvas.game')!
paper.setup(canvas)
createGame(paper)