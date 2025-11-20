import React from 'react';
import { getCloudflareContext } from "@opennextjs/cloudflare";
import MyMap from './Map';

interface ResponseData {
    response: string;
}

function parseRestaurants(data: ResponseData) {
    try {
        const restaurantsString = data.response.split("```")[1].split("```")[0];
        return JSON.parse(restaurantsString);
    } catch (error) {
        console.error(error);
        return [];
    }
}



async function fetchRestaurants() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/restaurants`);
    const data = await response.json();
    return parseRestaurants(data as ResponseData);
}

export default async function MyLocationContainer() {
    const { env, cf, ctx } = await getCloudflareContext({async: true});
    // Now you can access properties of the cf object, for example:
    const city = cf?.city;
    const country = cf?.country;
    const apiKey = process.env.GOOGLE_MAPS_API_KEY ?? env.GOOGLE_MAPS_API_KEY;
    console.log(apiKey);


    const restaurantsData = await fetchRestaurants();
    /* const restaurantsData = [
        { id: 1, name: "The Coop", lat: 28.1632, lng: -81.5972 },
        { id: 2, name: "La Taqueria", lat: 28.1614, lng: -81.60174 },
        { id: 3, name: "The Tap Room at Dubsdread", lat: 28.1433, lng: -81.6085 },
    ] */ // await restaurants.json();
    console.log('restaurantsData', restaurantsData);
    return (
        <div>
            <h1>{city}, {country ?? "Unknown"}</h1>
            <MyMap restaurants={restaurantsData} lat={parseFloat(cf?.latitude ?? "0")} lng={parseFloat(cf?.longitude ?? "0")} apiKey={apiKey ?? ""} />
        </div>
    )
}