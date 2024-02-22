<script>
	// @ts-nocheck
	export let value;
	export let onChange = () => null;
</script>

<input 
	type="date"
	value={value}
	on:change={e => onChange(e.target.value)}
/>

<style>
	input[type=date] {
		width: 100%;
	}

	input[type=date]:enabled {
		background-color: gray;
		color: white;
	}

	input[type=date]:enabled:hover {
		background-color: darkgray;
	}

	input[type=date]:disabled {
		background-color: transparent;
		color: gray;
	}
</style>