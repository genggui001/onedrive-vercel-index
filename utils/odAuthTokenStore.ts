import Redis from 'ioredis'
import siteConfig from '../config/site.config'

// Persistent key-value store is provided by Redis, hosted on Upstash
// https://vercel.com/integrations/upstash
const kv = new Redis(process.env.REDIS_URL)
const kv_prefix = process.env.NEXT_PUBLIC_KV_PREFIX || 'TTT_'

export async function getOdAuthTokens(): Promise<{ accessToken: unknown; refreshToken: unknown }> {
  const accessToken = await kv.get(kv_prefix + 'access_token')
  const refreshToken = await kv.get(kv_prefix + 'refresh_token')

  return {
    accessToken,
    refreshToken,
  }
}

export async function storeOdAuthTokens({
  accessToken,
  accessTokenExpiry,
  refreshToken,
}: {
  accessToken: string
  accessTokenExpiry: number
  refreshToken: string
}): Promise<void> {
  await kv.set(kv_prefix + 'access_token', accessToken, 'ex', accessTokenExpiry)
  await kv.set(kv_prefix + 'refresh_token', refreshToken)
}
