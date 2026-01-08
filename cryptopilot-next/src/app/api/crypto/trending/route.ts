import { NextResponse } from "next/server";
import { redis } from "../../../../lib/redis/client"; // Adjust path if needed

const COINGECKO_API_URL = "https://api.coingecko.com/api/v3";
const TRENDING_CACHE_TTL = 3600 * 12; // Cache for 12 hours

export async function GET() {
  const cacheKey = "crypto:trending:top10";

  try {
    // 1. Check Redis Cache
    if (redis) {
      const cachedData = await redis.get(cacheKey);
      if (cachedData) {
        return NextResponse.json(cachedData);
      }
    }

    // 2. Fetch from CoinGecko
    const response = await fetch(`${COINGECKO_API_URL}/search/trending`);

    if (!response.ok) {
      if (response.status === 429) {
        return NextResponse.json({ error: "Rate Limit" }, { status: 429 });
      }
      throw new Error("Failed to fetch trending from CoinGecko");
    }

    const data = await response.json();

    // Extract top 10 coins and format them
    const trendingCoins = data.coins.slice(0, 10).map((item, index) => ({
      name: item.item.name,
      symbol: item.item.symbol,
      src: item.item.large, // Use large image
      size:
        index % 3 === 0
          ? "w-24 h-24"
          : index % 3 === 1
          ? "w-20 h-20"
          : "w-16 h-16", // Varied sizes based on index
      float: `animate-float-${(index % 5) + 1}`, // Varied float animation 1-5
      id: item.item.id,
    }));

    // 3. Set Cache
    if (redis) {
      await redis.set(cacheKey, trendingCoins, { ex: TRENDING_CACHE_TTL });
    }

    return NextResponse.json(trendingCoins);
  } catch (error: any) {
    console.error("Error fetching trending:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
