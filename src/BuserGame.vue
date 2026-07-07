<script setup lang="ts">
import { onBeforeUnmount, onMounted, useTemplateRef } from 'vue'
import paper from 'paper'
import { createGame, type Game } from './game'

const emit = defineEmits<{
    ready: []
    score: [total: number]
    damage: [remaining: number]
    gameOver: []
}>()

const rootRef = useTemplateRef<HTMLDivElement>('root')
const canvasRef = useTemplateRef<HTMLCanvasElement>('canvas')

let scope: paper.PaperScope | null = null
let game: Game | null = null
let observer: ResizeObserver | null = null

const syncSize = () => {
    if (!rootRef.value || !canvasRef.value || !scope) return
    const { clientWidth, clientHeight } = rootRef.value
    if (clientWidth === 0 || clientHeight === 0) return
    canvasRef.value.width = clientWidth
    canvasRef.value.height = clientHeight
    scope.view.viewSize = new scope.Size(clientWidth, clientHeight)
}

onMounted(() => {
    if (!canvasRef.value || !rootRef.value) return

    const { clientWidth, clientHeight } = rootRef.value
    canvasRef.value.width = clientWidth || 1
    canvasRef.value.height = clientHeight || 1

    scope = new paper.PaperScope()
    scope.setup(canvasRef.value)

    game = createGame(scope)
    game.on('ready', () => emit('ready'))
    game.on('score', total => emit('score', total))
    game.on('damage', remaining => emit('damage', remaining))
    game.on('gameOver', () => emit('gameOver'))

    observer = new ResizeObserver(syncSize)
    observer.observe(rootRef.value)
})

onBeforeUnmount(() => {
    observer?.disconnect()
    observer = null
    game?.destroy()
    game = null
    scope?.project.remove()
    scope = null
})
</script>

<template>
    <div ref="root" class="buser-game">
        <canvas ref="canvas" />
    </div>
</template>

<style scoped>
.buser-game {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
}
.buser-game canvas {
    display: block;
    width: 100%;
    height: 100%;
}
</style>
