import { NextResponse } from "next/server";
import { redis } from "../../../../lib/redis/client";

const COINGECKO_API_URL = "https://api.coingecko.com/api/v3";
const CACHE_TTL = 60; // 60 seconds

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ids = searchParams.get("ids");
  const currency = searchParams.get("vs_currency") || "usd";
  const page = searchParams.get("page") || "1";
  const per_page = searchParams.get("per_page") || "50";

  // Cache key incluant la pagination
  const cacheKey = ids
    ? `crypto:market:${ids}:${currency}`
    : `crypto:market:top:${currency}:${page}:${per_page}`;

  try {
    // 1. Check Cache
    if (redis) {
      const cachedData = await redis.get(cacheKey);
      if (cachedData) {
        return NextResponse.json(cachedData);
      }
    }

    // 2. Fetch from CoinGecko
    let url = `${COINGECKO_API_URL}/coins/markets?vs_currency=${currency}&order=market_cap_desc&sparkline=true&price_change_percentage=24h`;

    if (ids) {
      url += `&ids=${ids}`;
    } else {
      url += `&per_page=${per_page}&page=${page}`;
    }

    const response = await fetch(url, {
      headers: {
        // 'x-cg-demo-api-key': process.env.COINGECKO_API_KEY
      },
    });

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
    console.error("Error fetching market data:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch market data" },
      { status: 500 }
    );
  }
}
