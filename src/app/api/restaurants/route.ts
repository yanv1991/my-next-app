// get a list of 3 best restaurants based on the user's location
// coordinates
// example: 
/* const restaurants = [
    { id: 1, name: 'Restaurant A', lat: -3.745, lng: -38.523 },
    { id: 2, name: 'Restaurant B', lat: -3.750, lng: -38.530 },
    // Add more restaurant data
  ];
  */


import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextRequest, NextResponse } from "next/server";

/* async function fetchSuggestedRestaurants(latitude: number, longitude: number, apiKey: string) {
    const model = "@cf/meta/llama-3-8b-instruct";
    const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/1028298b7c7cc842686244ed03ce2d7a/ai/run/${model}?format=json_object`,
        {
          headers: { Authorization: apiKey },
          method: "POST",
          body: JSON.stringify({
            messages: [
                {
                  role: "system",
                  content: "You are an expert in finding the best restaurants based on the user's location",
                },
                {
                  role: "user",
                  content:
                        `Given the following coordinates: ${latitude}, ${longitude} Return JSON object with a list of 3 best restaurants based on the user's location not more than 5 miles away. The restaurants should be in the following format: { id: 1, name: 'Restaurant A', lat: -3.745, lng: -38.523 }`,
                },
              ],
          }),
        }
      );
      const result = await response.json() as { result: { response: string } };

      const parsedResult = parseResult(result?.result?.response as string ?? "");
      return parsedResult;
} */

export async function GET(request: NextRequest) {
    const { env, cf } = await getCloudflareContext({ async: true });
    // const apiKey = env.AI_WORKER_API_KEY ?? process.env.AI_WORKER_API_KEY ?? "";
    const latitude = cf?.latitude ?? "0";
    const longitude = cf?.longitude ?? "0";
    /* const restaurants = await fetchSuggestedRestaurants(
        parseFloat(latitude ?? "0"),
        parseFloat(longitude ?? "0"),
        apiKey,
    ); */
    const cacheKey = `restaurants-${latitude}-${longitude}`;
    const cached = await env.CACHE.get(cacheKey);
    if (cached) {
      return new Response(cached, {
        headers: { "X-Cache": "HIT", "content-type": "application/json" },
      });
    }
    const answer = await env.AI.run("@cf/meta/llama-3-8b-instruct", {
        messages: [
            {
                role: "system",
                content: "You are an expert in finding the best restaurants based on the user's location",
            },
            {
                role: "user",
                content: `Given the following coordinates: ${latitude}, ${longitude} Return a plain JSON object with a list of 3 best restaurants based on the user's location not more than 5 miles away. The restaurants should be in the following format: { id: 1, name: 'Restaurant A', lat: -3.745, lng: -38.523 }`,
            },
        ],
        response_format: {
            type: "json_object",
        },
    });
    await env.CACHE.put(cacheKey, JSON.stringify(answer), {
        expirationTtl: 3600,
    });
    return NextResponse.json(answer, {
        headers: { "X-Cache": "MISS", "content-type": "application/json" },
    });
}