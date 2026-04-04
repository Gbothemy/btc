/**
 * Mining Earnings Engine — 150% per hour
 *
 * Formula:
 *   Hourly earning  = planPrice × (roiPercent / 100)
 *   Daily earning   = hourlyEarning × 24
 *   Total (3 days)  = hourlyEarning × 72
 *
 * Example — Starter ($200, 150%/hr):
 *   Hourly  = $200 × 1.50 = $300
 *   Daily   = $300 × 24   = $7,200
 *   Total   = $300 × 72   = $21,600
 */

export async function getBtcPrice(): Promise<number> {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd",
      { next: { revalidate: 60 } }
    );
    const data = await res.json();
    return data.bitcoin.usd;
  } catch {
    return 65000;
  }
}

/** Hourly earnings in USD */
export function calcHourlyEarnings(planPrice: number, roiPercent: number = 150): number {
  return planPrice * (roiPercent / 100);
}

/** Daily earnings in USD (24 hours) */
export function calcDailyEarnings(planPrice: number, roiPercent: number = 150): number {
  return calcHourlyEarnings(planPrice, roiPercent) * 24;
}

/** Total earnings over full contract (durationDays × 24 hours) */
export function calcTotalEarnings(planPrice: number, roiPercent: number = 150, durationDays: number = 3): number {
  return calcHourlyEarnings(planPrice, roiPercent) * 24 * durationDays;
}
