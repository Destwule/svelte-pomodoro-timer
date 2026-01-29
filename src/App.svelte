<script>
// @ts-nocheck

  import { playBeep } from './lib/audio.js';

  import Counter from '$lib/pomodoro_timer/Controls.svelte';
  import ProgressBar from '$lib/pomodoro_timer/ProgressBar.svelte';
  import Timer from '$lib/pomodoro_timer/Timer.svelte';
  import ActionModal from '$lib/pomodoro_timer/ActionModal.svelte';
  import Settings from '$lib/pomodoro_timer/Settings.svelte';
  import settingsIcon from './assets/setting.svg'

  let isVisible = $state(false);

  let storedLongBreak = localStorage.getItem('longBreakMinutes');
  let storedBreaks = localStorage.getItem('breaks')
  let initialBreaks = (storedBreaks && !isNaN(parseInt(storedBreaks)) ? parseInt(storedBreaks) : 0);
  let currentBreaks = $state(initialBreaks)
  let longBreakMinutes = $state(
  storedLongBreak && !isNaN(parseFloat(storedLongBreak)) ? parseFloat(storedLongBreak) : 15
  );

  let breaksBeforeMilestone = 4
  

  let breakTime = 5
  let workTime = 25
  let default_minutes = { break: breakTime, work: workTime, longBreak: longBreakMinutes }
  let breakTimeInMinutes = localStorage.getItem('breakMinutes')
  let workTimeInMinutes = localStorage.getItem('workMinutes')

  let break_minutes = $state(
      breakTimeInMinutes && !isNaN(parseFloat(breakTimeInMinutes)) ? parseFloat(breakTimeInMinutes) : breakTime
    )
  let work_minutes = $state(
      workTimeInMinutes && !isNaN(parseFloat(workTimeInMinutes)) ? parseFloat(workTimeInMinutes) : workTime
    )


  let savedOnBreak = localStorage.getItem('onBreak') === 'true';
  let savedTotalSeconds = localStorage.getItem('savedSeconds')
  
  let onBreak = $state(savedOnBreak)
  let isRunning = $state(false)

  let initial_seconds = $state(
    onBreak 
      ? (currentBreaks === 4 ? getSeconds(longBreakMinutes) : getSeconds(break_minutes))
      : getSeconds(work_minutes)
  );
  
  let totalSeconds = $state(
    savedTotalSeconds && !isNaN(parseInt(savedTotalSeconds)) 
    ? parseInt(savedTotalSeconds) 
    : initial_seconds
  );
  let progress = $derived((totalSeconds / initial_seconds) * 100)

  let display = $derived.by(() => {
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60

    return `${padStart(minutes)}:${padStart(seconds)}`
  })

  function updateSettings(newBreak, newWork, newLongBreak) {
    let parsedBreak = parseFloat(newBreak)
    if (!isNaN(parsedBreak) && parsedBreak > 0) {
      break_minutes = parsedBreak
    }

    let parsedWork = parseFloat(newWork)
    if (!isNaN(parsedWork) && parsedWork > 0) {
      work_minutes = parsedWork
    }

    let parsedLongBreak = parseFloat(newLongBreak)
    if (!isNaN(parsedLongBreak) && parsedLongBreak > 0) {
      longBreakMinutes = parsedLongBreak
    }

    // Update the current "Goal" and "Live" timer based on whichever mode you're in
    if (onBreak) {
      initial_seconds = (currentBreaks === 4) ? getSeconds(longBreakMinutes) : getSeconds(break_minutes);
    } else {
      initial_seconds = getSeconds(work_minutes);
    }
    
    totalSeconds = initial_seconds;
  }

  function toggle_isVisible() {
    isVisible = !isVisible
  }


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

      if (currentBreaks === 4) {
        initial_seconds = getSeconds(longBreakMinutes);
      }
      else {
        initial_seconds = getSeconds(break_minutes);
      }
    } else {
      onBreak = false
      initial_seconds = getSeconds(work_minutes);

      if (currentBreaks >= 4) {
        resetCurrentBreaks()
      } else {
        updateBreaks()
      }
    }

    totalSeconds = initial_seconds;
    startTimer()
  }

  $effect(() => {
    document.title = isRunning ? `${display} Pomodoro` : 'Pomodoro Timer'
  })

   $effect(() => {
    localStorage.setItem('workMinutes', work_minutes.toString());
    localStorage.setItem('breakMinutes', break_minutes.toString());
    localStorage.setItem('longBreakMinutes', longBreakMinutes.toString()); // Add this line!
  });

  $effect(() => {
    localStorage.setItem('breaks', currentBreaks.toString())
  })

  $effect(() => {
    localStorage.setItem('onBreak', onBreak.toString());
  });

  $effect(() => {
    // We only want to save seconds if the timer is actually running or paused
    // If it's 0, it might be better to let it reset on next reload
    localStorage.setItem('savedSeconds', totalSeconds.toString());
  });

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

  <button class="settings" onclick={toggle_isVisible}>
      <img src={settingsIcon} alt="Settings Icon">
  </button>
  
  <div class="pomodoro-container container-center-col">
    
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
  <p>Consecutive Breaks {currentBreaks} / {breaksBeforeMilestone}</p>
    

  <!-- SETTINGS SECTION -->
  <Settings
    {toggle_isVisible} {isVisible} {updateSettings}
    currentWork={work_minutes} currentBreak={break_minutes}
    {default_minutes}
  />
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

  .settings {
    position: fixed;
    top: 5%;
    right: 5%;

    border-radius: 100% !important;
    padding: unset;
    padding: 0.5em;
  }

  .pomodoro-container {
    gap: 1em;

    padding: 1rem;
    margin: 1em;
    background: #000;
    border-radius: 0.5rem;
    box-shadow: var(--BOX-SHADOW);
  }
</style>
