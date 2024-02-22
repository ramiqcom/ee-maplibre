<script>
	// @ts-nocheck
	import { writable } from 'svelte/store';
	import { geojson } from '$lib/store';
	import { bbox, bboxPolygon } from '@turf/turf';
	import Button from "$lib/components/button.svelte";
	import DateRange from "$lib/components/date.svelte";
	import Select from "$lib/components/option.svelte";
	import bands from "$lib/data/bands.json";
	import visualizations from "$lib/data/visualization.json";
	import satellites from "$lib/data/satellite.json";
	import methods from "$lib/data/method.json";
	import indices from "$lib/data/indices.json";

	// Change date into string
	const stringDate = date => date.toISOString().split('T')[0];
	const end = new Date();
	const endMili = end.getTime();
	const startMili = endMili - 7_889_400_000;
	const start = new Date(startMili);

	// States
	const band = writable(bands['landsat']);
	const startDate = writable(stringDate(start));
	const endDate = writable(stringDate(end));
	const method = writable(methods[0]);
	const visualization = writable(visualizations[0]);
	const satellite = writable(satellites[0]);
	const red = writable($band[3]);
	const green = writable($band[2]);
	const blue = writable($band[1]);
	const singleBand = writable($band[3]);
	const indice = writable(indices[0]);
	const multiDisplay = writable("flex");
	const singleDisplay = writable("none");
	const indicesDisplay = writable("none");

	// Visualization props
	const visProps = {
		multi: { display: multiDisplay, bands: [ $red.value, $green.value, $blue.value ] },
		single: { display: singleDisplay, bands: [ $singleBand.value ] },
		indices: { display: indicesDisplay, bands: [ $indice.value ] } 
	};

	// Change band when satellite change
	satellite.subscribe(value => {
		$band = bands[value.value];
		$red = $band[3];
		$green = $band[2];
		$blue = $band[1];
		$singleBand = $band[3];
	});

	// Change options when visualization options change
	visualization.subscribe(value => {
		Object.keys(visProps).map(key => {
			const props = visProps[key];
			props.display.set(value.value == key ? 'flex' : 'none');
		})
	});

</script>

<div id='image' class="flexible vertical small-gap panel">
	<div class="title center-text">
		Image visualization
	</div>

	<div>
		Satellite
		<Select 
			options={satellites}
			value={$satellite}
			onChange={value => $satellite = value}
		/>
	</div>

	<div>
		Date range
		<div class="flexible small-gap">
			<DateRange 
				value={$startDate}
				onChange={value => {
					if (value >= $endDate){
						value = stringDate(new Date(new Date($endDate).getTime() - 86_400_000));;
					}
					$startDate = value 
				}}
			/>
			-
			<DateRange 
				value={$endDate}
				onChange={value => {
					if (value <= $startDate){
						value = stringDate(new Date(new Date($startDate).getTime() + 86_400_000));
					}
					$endDate = value 
				}}
			/>
		</div>
	</div>

	<div>
		Method
		<Select
			options={methods}
			value={$method}
			onChange={value => $method = value}
		/>
	</div>

	<div>
		Visualization
		<Select
			options={visualizations}
			value={$visualization}
			onChange={value => $visualization = value}
		/>
	</div>

	<div class="flexible small-gap wide" style="display:{$multiDisplay}">
		<div class="flexible vertical center3">
			R
			<Select
				options={$band}
				value={$red}
				onChange={value => $red = value}
			/>
		</div>
		<div class="flexible vertical center3">
			G
			<Select
				options={$band}
				value={$green}
				onChange={value => $green = value}
			/>
		</div>
		<div class="flexible vertical center3">
			B
			<Select
				options={$band}
				value={$blue}
				onChange={value => $blue = value}
			/>
		</div>
	</div>

	<div class="flexible vertical" style="display: {$singleDisplay};">
		Single band
		<Select
			options={$band}
			value={$singleBand}
			onChange={value => $singleBand = value}
		/>
	</div>

	<div class="flexible vertical" style="display: {$indicesDisplay};">
		Spectral indices
		<Select
			options={indices}
			value={$indice}
			onChange={value => $indice = value}
		/>
	</div>

	<Button 
		label='Generate Image'
		onClick={async () => {
			const bounds = bboxPolygon(bbox($geojson)).geometry;
			const body = {
				satellite: $satellite.value,
				bands: visProps[$visualization.value].bands,
				visualization: $visualization.value,
				date: [ $startDate, $endDate ],
				bounds,
				method: $method.value
			};
			const req = await fetch('/api/image', {
				body: JSON.stringify(body),
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				}
			});
		}}
	/>
	
</div>

<style>
	
</style>