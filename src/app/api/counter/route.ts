// Stateful counter using Durable Objects
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextRequest, NextResponse } from "next/server";

// Get or create a Durable Object instance
function getCounter(env: CloudflareEnv) {
    // Use a fixed ID so we always get the same counter instance
    const id = env.COUNTER.idFromName("default-counter");
    return env.COUNTER.get(id);
}

export async function GET(request: NextRequest) {
    const { env } = await getCloudflareContext({ async: true });
    const counter = getCounter(env);
    const url = new URL(request.url);
    const doUrl = new URL(url.origin + url.pathname + "/get");
    const response = await counter.fetch(new Request(doUrl.toString()));
    const data = await response.json();
    return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
    const { env } = await getCloudflareContext({ async: true });
    const counter = getCounter(env);
    
    const url = new URL(request.url);
    const action = url.searchParams.get("action") || "increment";
    
    let endpoint = "/increment";
    if (action === "decrement") {
        endpoint = "/decrement";
    } else if (action === "reset") {
        endpoint = "/reset";
    }
    
    const doUrl = new URL(url.origin + url.pathname + endpoint);
    const response = await counter.fetch(new Request(doUrl.toString()));
    const data = await response.json();
    return NextResponse.json(data);
}

