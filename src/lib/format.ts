import type { PayPeriod } from '@/data/types'

export function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat('en', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value)
}

export const payPeriodLabel: Record<PayPeriod, string> = {
  year: 'per year',
  month: 'per month',
  hour: 'per hour',
}

export function formatHours(hours: number) {
  return `≈${hours} hours`
}
