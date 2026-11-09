import {integrations} from '@/integrations'

export const dynamic = 'force-static'

// /ads.txt is generated from the AdSense publisher ID in integrations.ts
export function GET() {
  const pub = integrations.adsenseClient.replace(/^ca-/, '')
  const body = pub ? `google.com, ${pub}, DIRECT, f08c47fec0942fa0\n` : '# Set adsenseClient in integrations.ts\n'
  return new Response(body, {headers: {'content-type': 'text/plain; charset=utf-8'}})
}
