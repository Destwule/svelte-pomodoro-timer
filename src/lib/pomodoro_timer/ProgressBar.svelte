<script>
  let { progress } = $props()
</script>


<div class="progress-container">
  <div
    class="progress-bar"
    style="width: {progress}%"
  ></div>
</div>


<style>
  .progress-container {
    width: 100%;
    height: 10px;
    background: #eee;
    border-radius: 5px;
    overflow: hidden;
  }

  .progress-bar {
    height: 100%;
    background: #ff3e00;
  }
</style>