<script>
	// @ts-nocheck
	import 'maplibre-gl/dist/maplibre-gl.css'
	import maplibre from 'maplibre-gl';
	import { onMount } from 'svelte';
	import { basemap, map, geojson, vectorDisabled, vectorVisibled, vectorId } from '$lib/store.js';
	import parseGeo from '$lib/utils/parseGeo';
	import { bbox } from '@turf/turf';

	// When the browser is loaded, load map
	onMount(() => {
		window.ondragover = e => e.preventDefault();
		window.ondrop = e => {
			e.preventDefault();
			const file = e.dataTransfer.files[0];
			const name = file.name;
			const format = name.split('.').at(-1);
			setGeojson(file, format)		
		}

		$map = new maplibre.Map({
			container: 'map',
			style: $basemap.value,  // Style URL; see our documentation for more options
			center: [ 117, 0 ],  // Initial focus coordinate
			zoom: 4
		});

		// Change map style when the value change
		basemap.subscribe(value => {
			$map.setStyle(value.value);
		});

		// When geojson change do something
		geojson.subscribe(value => {
			$vectorId = 'vector';

			if (value) {
				if ($map.getSource($vectorId)) {
					$map.getSource($vectorId).setData(value);
				} else {
					$map.addSource($vectorId, {
						type: 'geojson',
						data: value
					});

					$map.addLayer({
						id: $vectorId,
						type: 'fill',
						source: $vectorId,
						paint: {
							'fill-color': 'lightskyblue',
							'fill-opacity': 0.1,
						}
					});
				}

				// Zoom to feature
				const bounds = bbox(value);
				$map.fitBounds(bounds);

				// Allow the vector check and make it checked
				$vectorDisabled = false;
				$vectorVisibled = true;
			}			
		});

		/**
		 * Function to set geojson
		 * @param {Blob} file
		 * @param {String} format
		 * @returns {Void}
		 */
		 async function setGeojson(file, format) {
			$geojson = await parseGeo(file, format);
		}
	});
</script>

<div id='map' />

<style>
	#map {
		height: 100%;
		width: 100%;
	}
</style>