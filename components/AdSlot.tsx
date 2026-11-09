'use client'

import {useEffect} from 'react'
import {integrations} from '@/integrations'

// Renders nothing until adsenseClient (integrations.ts) and a slot id are set.
// The wrapper has a fixed minimum height so the page never jumps when the ad loads.
export function AdSlot({slot, height = 250}: {slot?: string; height?: number}) {
  const client = integrations.adsenseClient
  useEffect(() => {
    if (!client || !slot) return
    try {
      ;((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
    } catch {
      /* ad blocked or script not loaded */
    }
  }, [client, slot])

  if (!client || !slot) return null
  return (
    <div className="ad" style={{minHeight: height}} aria-label="Advertisement">
      <ins
        className="adsbygoogle"
        style={{display: 'block'}}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
