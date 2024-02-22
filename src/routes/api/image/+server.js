// @ts-nocheck
import ee from '@google/earthengine';
import { EE_KEY } from '$env/static/private';
import collection from '$lib/data/collection.json';
import cloud from '$lib/data/cloud.json';

/**
 * Function to get image url to show to map using earth engine
 * @param {Event} event 
 * @returns {Response}
 */
export async function POST(event){
	try {
		// Get object body
		const { satellite, bounds, date, bands, visualization, method  } = await event.request.json();

		// Authenticate
		await authenticate();
		
		// Date
		const [ start, end ] = date;

		// Geometry object
		const geometry = ee.Geometry(bounds);

		// Call and filter the collection
		const col = ee.ImageCollection(ee.FeatureCollection(collection[satellite].map(id => ee.ImageCollection(id).filterBounds(geometry).filterDate(start, end))).flatten());

		// Empty image
		let image;

		// Get image based on method
		switch (method) {
			case 'composite':
				image = col.median();
				break;
			default:
				image = col.sort(method == 'cloudless' ? cloud[satellite] : 'system:time_start').first();
				break;
		}

		// Set image as ee.image
		image = ee.Image(image);

		// Clip the image
		image = image.clip(geometry.buffer(1e4));


	} catch (error) {
		console.log(error);
	}
}

/**
 * Function to authenticate EE
 * @returns {Promise.<Void>}
 */
function authenticate() {
	const key = JSON.parse(EE_KEY);
	return new Promise((resolve, reject) => {
		ee.data.authenticateViaPrivateKey(
			key,
			() => ee.initialize(null, null, () => resolve(), error => reject(error)),
			error => reject(error)
		);
	});
}

/**
 * Function to evaluate ee object
 * @param {ee.Element} element
 * @returns {Promise.<any>}
 */
function evaluate(element) {
	return new Promise((resolve, reject) => {
		element.evaluate((data, error) => error ? reject(error) : resolve(data));
	});
}

/**
 * Function to generate image url
 * @param {ee.Image | ee.FeatureCollection} data
 * @param {Object | ee.Dictionary} vis
 * @returns {Promise.<Object>}
 */
function getMapId(data, vis) {
	return new Promise((resolve, reject) => {
		data.getMapId(vis, (object, error) => error ? reject(error) : resolve(object));
	});
}