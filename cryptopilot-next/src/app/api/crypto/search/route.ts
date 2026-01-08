import { NextResponse } from "next/server";
import { redis } from "../../../../lib/redis/client";

const COINGECKO_API_URL = "https://api.coingecko.com/api/v3";
// Cache search results a bit longer (5 min) as they don't change often
const CACHE_TTL = 300;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json(
      { error: "Missing query parameter" },
      { status: 400 }
    );
  }

  const cacheKey = `crypto:search:${query.toLowerCase()}`;

  try {
    if (redis) {
      const cachedData = await redis.get(cacheKey);
      if (cachedData) return NextResponse.json(cachedData);
    }

    const response = await fetch(
      `${COINGECKO_API_URL}/search?query=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      if (response.status === 429) {
        return NextResponse.json({ error: "Rate Limit" }, { status: 429 });
      }
      throw new Error(`CoinGecko error: ${response.statusText}`);
    }

    const data = await response.json();

    if (redis) {
      await redis.set(cacheKey, data, { ex: CACHE_TTL });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
