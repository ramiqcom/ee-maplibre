<script>
	// @ts-nocheck
	import Option from "$lib/components/option.svelte";
	import Checkbox from "./checkbox.svelte";
	import basemaps from '$lib/data/basemap.json';
	import { basemap, vectorDisabled, vectorVisibled, vectorId, map } from '$lib/store.js';
</script>

<div id='image' class="flexible vertical panel">
	<div class="title center-text">
		Layers
	</div>
	
	<div class="flexible vertical small-gap">
		Basemap
		<Option
			options={basemaps}
			value={$basemap}
			onChange={value => $basemap = value}
		/>
	</div>

	<div class="flexible vertical small-gap">
		<Checkbox
			checked={$vectorVisibled}
			label={'Vector'}
			disabled={$vectorDisabled}
			onChange={checked => $map.setLayoutProperty($vectorId, 'visibility', checked ? 'visible' : 'none') }
		/>
	</div>

</div>

<style>
	
</style>