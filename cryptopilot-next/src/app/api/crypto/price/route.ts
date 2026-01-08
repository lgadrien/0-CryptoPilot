import { NextResponse } from "next/server";
import { redis } from "../../../../lib/redis/client";

const COINGECKO_API_URL = "https://api.coingecko.com/api/v3";
const CACHE_TTL = 60; // 60 seconds

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ids = searchParams.get("ids");
  const currency = searchParams.get("vs_currencies") || "usd";

  if (!ids) {
    return NextResponse.json(
      { error: "Missing ids parameter" },
      { status: 400 }
    );
  }

  const cacheKey = `crypto:price:${ids}:${currency}`;

  try {
    // 1. Check Cache
    if (redis) {
      const cachedData = await redis.get(cacheKey);
      if (cachedData) {
        return NextResponse.json(cachedData);
      }
    }

    // 2. Fetch from CoinGecko
    const response = await fetch(
      `${COINGECKO_API_URL}/simple/price?ids=${ids}&vs_currencies=${currency}&include_24hr_change=true`,
      {
        headers: {
          // Add API key here if you have one later
          // 'x-cg-demo-api-key': process.env.COINGECKO_API_KEY
        },
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return NextResponse.json(
          { error: "CoinGecko Rate Limit exceeded" },
          { status: 429 }
        );
      }
      throw new Error(`CoinGecko API error: ${response.statusText}`);
    }

    const data = await response.json();

    // 3. Set Cache
    if (redis) {
      await redis.set(cacheKey, data, { ex: CACHE_TTL });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error fetching price data:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch price data" },
      { status: 500 }
    );
  }
}
