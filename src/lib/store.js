import { writable } from "svelte/store";
import basemaps from '$lib/data/basemap.json';
export const basemap = writable(basemaps[0]);
export const map = writable();
export const vectorVisibled = writable(true);
export const vectorDisabled = writable(true);
export const geojson = writable(undefined);
export const vectorId = writable(undefined);