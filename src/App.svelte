<script>
// @ts-nocheck

  import { playBeep } from './lib/audio.js';

  import Counter from '$lib/pomodoro_timer/Controls.svelte';
  import ProgressBar from '$lib/pomodoro_timer/ProgressBar.svelte';
  import Timer from '$lib/pomodoro_timer/Timer.svelte';
  import ActionModal from '$lib/pomodoro_timer/ActionModal.svelte';

  let consecutiveBreaks = 4
  let consecutiveBreakMinutes = 0.4
  let storedBreaks = localStorage.getItem('breaks')
  let initialBreaks = (
    storedBreaks && !isNaN(parseInt(storedBreaks)) ? parseInt(storedBreaks) : 0
  )
  let currentBreaks = $state(initialBreaks)

  let break_minutes = 0.04
  let work_minutes = 0.05
  let onBreak = $state(false)
  let isRunning = $state(false)
  let initial_seconds = $state(getSeconds(work_minutes))
  let totalSeconds = $state(initial_seconds)
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
  }

  function updateBreaks() {
    currentBreaks += 1
  }

  function resetCurrentBreaks() {
    currentBreaks = 0
  }

  function takeBreak() {
    if (!onBreak) {
      onBreak = true
      updateBreaks()

      if (currentBreaks === 4) {
        initial_seconds = getSeconds(consecutiveBreakMinutes);
      }
      else {
        initial_seconds = getSeconds(break_minutes);
      }
    } else {
      onBreak = false
      initial_seconds = getSeconds(work_minutes);

      if (currentBreaks >= 4) {
        resetCurrentBreaks()
      }
    }

    totalSeconds = initial_seconds;
    startTimer()
  }

  $effect(() => {
    document.title = isRunning ? `${display} Pomodoro` : 'Pomodoro Timer'
  })

  $effect(() => {
    localStorage.setItem('breaks', currentBreaks.toString())
  })

  $effect(() => {
    if (!isRunning) return null

    const interval = setInterval(() => {
      if (totalSeconds <=  0) {
        playBeep(800, 0.5)
        stopTimer()
      }else {
        totalSeconds -= 1;
      }
    }, 1000)

    return () => clearInterval(interval)
  })

</script>

<main>
  <h1>{onBreak ? 'Break' : 'Work'} Time</h1>

  <div class="pomodoro-container">
    
    {#if totalSeconds <= 0}
      {#if onBreak}
        <ActionModal
          prompt='Break is over'
          action_func={takeBreak}
          btn_title='Work Time'
        />
        
      {:else }
        <ActionModal
          prompt='Work Done'
          action_func={takeBreak}
          btn_title='Take a Break'
        />
      {/if}
    {:else }
      <Timer {display} />
      <ProgressBar {progress} />
      <Counter {startTimer} {stopTimer} {resetTimer} />
    {/if}
  
  </div>
  <p>Consecutive Breaks {currentBreaks} / {consecutiveBreaks}</p>
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
    margin: 1em;
    background: #000;
    border-radius: 0.5rem;
    box-shadow: 2px 5px 9px #555;
  }
</style>
