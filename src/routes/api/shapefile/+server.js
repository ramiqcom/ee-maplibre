// @ts-nocheck
import shp from "shpjs";

/**
 * Function to parse geospatial data to geojson
 * @param {Event} event 
 * @returns {Response}
 */
export async function POST(event){
	try {
		const buffer = await event.request.arrayBuffer();
		const geojson = await shp(buffer);
		return new Response(JSON.stringify(geojson));
	} catch (error) {
		return new Response(error.message, { ok: false, status: 404 })
	}
}