// @ts-nocheck
import { kml } from '@tmcw/togeojson';

// Dictionary of format and the parser function
const parser = {
	zip: shapefileParser,
	kml: kmlParser,
	kmz: kmlParser,
	geojson: geojsonParser,
	json: geojsonParser
};

/**
 * Function to parse geospatial data to geojson
 * @param {Blob} file 
 * @param {String} format 
 * @returns {Promise.<FeatureCollection>}
 */
export default async function parseGeo(file, format){
	const geojson = await parser[format](file);
	return geojson;
}

/**
 * Function to parse shapefile
 * @param {Blob} file 
 * @returns {Promise.<FeatureCollection>}
 */
async function shapefileParser(file){
	const res = await fetch('/api/shapefile', {
		body: await file.arrayBuffer(),
		method: 'POST',
		headers: {
			'Content-Type': 'application/octet-stream'
		}
	});
	return await res.json();
}

/**
 * Function to parse geojson
 * @param {Blob} file 
 * @returns {Promise.<FeatureCollection>}
 */
async function geojsonParser(file){
	return await file.json();
}

/**
 * Function to parse kml
 * @param {Blob} file 
 * @returns {Promise.<FeatureCollection>}
 */
async function kmlParser(file){
	return kml(new DOMParser().parseFromString(await file.text(), 'text/xml'));
}