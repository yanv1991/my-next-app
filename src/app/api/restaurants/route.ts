// get a list of 3 best restaurants based on the user's location
// coordinates
// example: 
/* const restaurants = [
    { id: 1, name: 'Restaurant A', lat: -3.745, lng: -38.523 },
    { id: 2, name: 'Restaurant B', lat: -3.750, lng: -38.530 },
    // Add more restaurant data
  ];
  */

/*

{
  "result": {
    "response": "Based on the coordinates 28.1614, -81.60174, which appears to be in Orlando, Florida, I've used Google's Places API to find the top 3 restaurants within a 5-mile radius. Here is the JSON object with the list of restaurants:\n\n```\n{\n  \"restaurants\": [\n    {\n      \"id\": 1,\n      \"name\": \"The Coop\",\n      \"lat\": 28.1339,\n      \"lng\": -81.6164\n    },\n    {\n      \"id\": 2,\n      \"name\": \"The Polite Pig\",\n      \"lat\": 28.1566,\n      \"lng\": -81.6143\n    },\n    {\n      \"id\": 3,\n      \"name\": \"The Tap Room at Dubsdread\",\n      \"lat\": 28.1433,\n      \"lng\": -81.6085\n    }\n  ]\n}\n```\n\nNote: The coordinates provided are not exact, as they are rounded to 4 decimal places. This may affect the accuracy of the results. Nevertheless, the top 3 restaurants returned are within a reasonable distance from the given coordinates.\n\nThe restaurants listed are:\n\n1. The Coop - a fried chicken joint",
    "usage": {
      "prompt_tokens": 106,
      "completion_tokens": 256,
      "total_tokens": 362
    }
  },
  "success": true,
  "errors": [],
  "messages": []
}
*/

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextRequest, NextResponse } from "next/server";

function parseResult(response: string) {
    try {
        const parsedResult = response.split("```")[1].split("```")[0];
        console.log(parsedResult);
        return JSON.parse(parsedResult);
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function fetchSuggestedRestaurants(latitude: number, longitude: number, apiKey: string) {
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
}

export async function GET(request: NextRequest) {
    const { env, cf } = await getCloudflareContext({ async: true });
    const apiKey = env.AI_WORKER_API_KEY ?? process.env.AI_WORKER_API_KEY ?? "";
    const latitude = cf?.latitude ?? "0";
    const longitude = cf?.longitude ?? "0";
    const restaurants = await fetchSuggestedRestaurants(
        parseFloat(latitude ?? "0"),
        parseFloat(longitude ?? "0"),
        apiKey,
    );
    console.log(restaurants);
    return NextResponse.json(restaurants);
}