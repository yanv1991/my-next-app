// demonstrates how to use the kv namespace

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { env } = await getCloudflareContext({async: true});
    
    const url = new URL(request.url);
    const queryParams = url.searchParams;
    const myKey = queryParams.get("key");
    const cacheKey = url.pathname + "?key=" + myKey;

    const cached = await env.CACHE.get(cacheKey);
    if (cached) {
      return new Response(cached, {
        headers: { "X-Cache": "HIT", "content-type": "application/json" },
      });
    }

    const data = {
      message: "Hello, world!",
      time: new Date().toISOString(),
    };
    // Cache it for 1 hour
    await env.CACHE.put(cacheKey, JSON.stringify(data), {
      expirationTtl: 3600,
    });

    return new Response(JSON.stringify({
      message: "Hello, world!",
      time: new Date().toISOString(),
    }), {
        headers: { "X-Cache": "MISS", "content-type": "application/json" },
      });
}