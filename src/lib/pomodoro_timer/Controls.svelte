<script>
  let { startTimer, stopTimer, resetTimer } = $props()
</script>

<div class="buttons">
  <button onclick={startTimer}>
  Start
  </button>
  
  <button onclick={stopTimer}>
  Stop
  </button>
  
  <button onclick={resetTimer}>
  Reset
  </button>
</div>