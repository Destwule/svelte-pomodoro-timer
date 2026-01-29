<script>
    import { preventDefault } from "svelte/legacy";


	let {
		toggle_isVisible, isVisible, updateSettings,
		currentWork, currentBreak, default_minutes
	} = $props()

	let default_work = default_minutes.work
	let default_break = default_minutes.break
	let default_long_break = default_minutes.longBreak

	let temp_work = $state(currentWork)
	let temp_break = $state(currentBreak)
	let temp_long_break = $state(default_long_break)
	let form;
	// console.log(default_minutes)
	// console.log(default_work, default_break)

	function hidePopup(e) {
		if (e.target === e.currentTarget) {
			toggle_isVisible()
		}
	}

	function handleKeyDown(e) {
		if (e.key === 'Enter' || e.Key === ' ') {
			e.preventDefault();
			hidePopup()
		}
	}

	function resetSettings(e) {
		e.preventDefault()
		temp_work = default_work
		temp_break = default_break
	}

	function saveSettings(e) {
		e.preventDefault()
		let formData = new FormData(form)
		const isEmpty = [...formData.values()].some(value => value.trim() === "");
		let newBreak = formData.get('breakMinutes')
		let newWork = formData.get('workMinutes')
		let newLongBreak = formData.get('longBreakMinutes')

		updateSettings(newBreak, newWork, newLongBreak)

		if (!isEmpty) {
			toggle_isVisible()
		}
	}
</script>

<div
	role="button"
	tabindex="0"
  class="popup container-center-col"
  class:show={isVisible}
  onclick={hidePopup}
  onkeydown={handleKeyDown}
  >

	<form action="" bind:this={form}>
		<div class="settings-dialog container-center-col">
			<h1>Settings</h1>

			
			<label>
				Work Minutes:
				<input type="number" min="0.1" step="0.1" name="workMinutes" bind:value={temp_work}>
			</label>

			<label for="">
				Break Minutes:
				<input type="number" min="0.1" step="0.1" name="breakMinutes" bind:value={temp_break}>
			</label>

			<label for="">
				Long Break Minutes:
				<input type="number" min="0.1" step="0.1" name="longBreakMinutes" bind:value={temp_long_break}>
			</label>

			<div class="buttons">
				<button onclick={saveSettings}>Save</button>
				<button onclick={resetSettings}>Reset</button>
				<button onclick={(e) => {
						e.preventDefault()
						toggle_isVisible()
					}}
					>Cancel</button>
			</div>

		</div>
	</form>

</div>


<style>
	.popup {
		width: 100vw;
		height: 100vh;
		background: rgba(0, 0, 0, 70%);
		position: fixed;
		top: 0;
		left: 0;
		z-index: 999;
		backdrop-filter: blur(10px);
		cursor: pointer;
		transform: translateY(-110%);
		transition: transform 0.2s linear;
	}

	.settings-dialog {
		background: #222;
		border-radius: 0.5rem;
		padding: 1rem;
		gap: 1rem;
		min-width: 250px;

		cursor: default;
	}

	label {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}

	button {
		width: 100%;
		flex-grow: 1;
	}

	.show {
		transform: translateY(0);
	}
</style>