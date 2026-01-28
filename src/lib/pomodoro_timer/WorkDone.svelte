<script>
    let { takeBreak } = $props()
</script>

<div class="work-done">
    <p>Work Done</p>
    <button onclick={takeBreak}>Take Break</button>
</div>

<style>
    .work-done {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
</style>