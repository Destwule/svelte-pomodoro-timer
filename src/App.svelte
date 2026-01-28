<script>
  import { playBeep } from './lib/audio.js';

  import Counter from '$lib/pomodoro_timer/Controls.svelte';
  import ProgressBar from '$lib/pomodoro_timer/ProgressBar.svelte';
  import Timer from '$lib/pomodoro_timer/Timer.svelte';
  import WorkDone from '$lib/pomodoro_timer/WorkDone.svelte';

  let interval
  let isRunning = $state(false);
  let initial_seconds = $state(getSeconds(0.2))
  let totalSeconds = $state(getSeconds(0.2))
  let progress = $derived((totalSeconds / initial_seconds) * 100)

  let display = $derived.by(() => {
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60

    return `${padStart(minutes)}:${padStart(seconds)}`
  })

  function getSeconds(minute) {
    return minute * 60
  }

  function padStart(value) {
    return value.toString().padStart(2, '0')
  }

  function resetTotalSeconds() {
    totalSeconds = initial_seconds
  }

  function startTimer() {
    isRunning = true
  }

  function stopTimer() {
    isRunning = false
  }

  function resetTimer() {
    stopTimer()
    resetTotalSeconds()
    totalSeconds = initial_seconds;
  }

  function takeBreak() {
    initial_seconds = getSeconds(5);
    totalSeconds = initial_seconds;
    startTimer()
  }

  $effect(() => {
    document.title = isRunning ? `${display} Pomodoro` : 'Pomodoro Timer'
  })

  $effect(() => {
    if (!isRunning) return null

    const interval = setInterval(() => {
      if (totalSeconds <=  0) {
        stopTimer()
        playBeep(800, 0.5)
      }else {
        totalSeconds -= 1;
      }
    }, 1000)

    return () => clearInterval(interval)
  })

</script>

<main>
  <div class="pomodoro-container">
    
    {#if totalSeconds <= 0}
      <WorkDone {takeBreak}/>
    {:else }
      <Timer {display} />
      <ProgressBar {progress} />
      <Counter {startTimer} {stopTimer} {resetTimer} />
    {/if}
  
  </div>
</main>


<style>
  main {
    width: 100%;
    height: 100vh;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .pomodoro-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;

    padding: 1rem;
    background: #000;
    border-radius: 0.5rem;
    box-shadow: 2px 5px 9px #555;
  }
</style>
