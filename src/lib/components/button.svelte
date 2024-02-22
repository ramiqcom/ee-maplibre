<script>
	export let label = 'Button';
	export let disabled = false;
	export let onClick = () => null;
</script>

<button on:click={onClick} disabled={disabled}>
	{label}
</button>

<style>
	button {
		width: 100%;
		color: white;
		height: 3vh;
		border: none;
	}

	button:enabled {
		background-color: gray;
	}

	button:enabled:hover {
		background-color: darkgray;
	}

	button:disabled {
		background-color: transparent;
		border: thin solid gray;
		color: gray;
	}
</style>