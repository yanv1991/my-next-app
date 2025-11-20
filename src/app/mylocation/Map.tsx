'use client';

import {APIProvider, Map, Marker } from '@vis.gl/react-google-maps';

interface Restaurant {
    id: number;
    name: string;
    lat: number;
    lng: number;
}
export default function MyMap({lat, lng, apiKey, restaurants}: {lat: number, lng: number, apiKey: string, restaurants: Restaurant[]}) {
    const markers = restaurants && restaurants.length > 0 ? restaurants.map((restaurant) => (
        <Marker title={restaurant.name} key={restaurant.id} position={{lat: restaurant.lat, lng: restaurant.lng}} />
    )) : [];
    return (
        <div className='flex m-auto justify-center items-center w-[50rem] h-[50rem]'>
        <APIProvider apiKey={apiKey}>
            <Map
                className='w-[50rem] h-[50rem]'
                defaultCenter={{lat: lat, lng: lng}}
                defaultZoom={11}
                gestureHandling='greedy'
                disableDefaultUI
            >
                {markers}
            </Map>
        </APIProvider>
        </div>
    )
}