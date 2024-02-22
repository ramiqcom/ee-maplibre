<script>
	// @ts-nocheck
	export let value = {};
	export let options = [];
	export let onChange = () => null;
</script>

<select on:change={e => {
	const value = options[e.target.selectedIndex];
	onChange(value);
}}>
	{#each options as option, i}
		<option selected={option == value} value={option.value}>{option.label}</option>
	{/each}
</select>

<style>
	select {
		width: 100%;
		height: 3vh;
		background-color: gray;
		color: whitesmoke;
		border: none;
	}

	select:enabled:hover {
		background-color: darkgray;
	}

	select:disabled {
		background-color: transparent;
		border: thin solid gray;
		color: gray
	}

	option {
		width: 100%;
	}
</style>