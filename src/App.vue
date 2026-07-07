<script setup lang="ts">
import { ref } from 'vue'
import BuserGame from './BuserGame.vue'

const score = ref(0)
const lives = ref(3)
const over = ref(false)
</script>

<template>
    <div class="demo">
        <div class="stage">
            <BuserGame
                @ready="() => console.log('game ready')"
                @score="total => (score = total)"
                @damage="remaining => (lives = remaining)"
                @game-over="over = true"
            />
        </div>
        <p class="status">
            score: {{ score }} · lives: {{ lives }}
            <span v-if="over"> · GAME OVER</span>
        </p>
    </div>
</template>

<style scoped>
.demo {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 12px;
    height: 100%;
    box-sizing: border-box;
}
.stage {
    width: 100%;
    max-width: 800px;
    aspect-ratio: 9 / 20;
}
.status {
    color: white;
    font-family: monospace;
    margin: 0;
}
</style>
