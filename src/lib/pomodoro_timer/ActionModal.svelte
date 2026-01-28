<script>
    let { prompt, action_func, btn_title } = $props()
</script>

<div class="work-done">
    <p>{prompt}</p>
    <button onclick={action_func}>{btn_title}</button>
</div>

<style>
    .work-done {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 2rem;
    }
</style>