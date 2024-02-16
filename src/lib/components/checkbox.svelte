<script>
	// @ts-nocheck
	export let label;
	export let checked;
	export let onChange;
	export let disabled;
</script>

<div class="flexible small-gap">
	<input id='check' type='checkbox' {checked} {disabled} on:change={e => {
		const value = e.target.checked;
		onChange(value);
	}}/>
	<label for='check'>{label}</label>
</div>
