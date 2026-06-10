export function onlyDigits(value: string): string {
  return value.replace(/\D+/g, '')
}

export function clampDigits(value: string, maxLength?: number): string {
  const digits = onlyDigits(value)
  if (!maxLength) return digits
  return digits.slice(0, maxLength)
}

export function formatCardNumber(digits: string): string {
  const d = onlyDigits(digits)
  // Agrupamento simples 4-4-4-4 (ou 4-4-4-... dependendo do tamanho)
  const parts: string[] = []
  for (let i = 0; i < d.length; i += 4) parts.push(d.slice(i, i + 4))
  return parts.join(' ')
}

