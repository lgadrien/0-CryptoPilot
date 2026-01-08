import { NextResponse } from "next/server";
import { redis } from "../../../../lib/redis/client";

const COINGECKO_API_URL = "https://api.coingecko.com/api/v3";
// Cache history for 10 minutes
const CACHE_TTL = 600;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const days = searchParams.get("days") || "7";

  if (!id) {
    return NextResponse.json(
      { error: "Missing id parameter" },
      { status: 400 }
    );
  }

  const cacheKey = `crypto:history:${id}:${days}`;

  try {
    if (redis) {
      const cachedData = await redis.get(cacheKey);
      if (cachedData) return NextResponse.json(cachedData);
    }

    const response = await fetch(
      `${COINGECKO_API_URL}/coins/${id}/market_chart?vs_currency=usd&days=${days}`
    );

    if (!response.ok) {
      if (response.status === 429) {
        return NextResponse.json({ error: "Rate Limit" }, { status: 429 });
      }
      throw new Error(`CoinGecko error: ${response.statusText}`);
    }

    const data = await response.json();

    // Simplifier les données pour réduire la taille (garder [timestamp, price])
    // CoinGecko renvoie deja prices: [[ts, price], ...]

    if (redis) {
      await redis.set(cacheKey, data, { ex: CACHE_TTL });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
