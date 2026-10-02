export type AuthMode = 'register' | 'login'
export type Channel = 'email' | 'phone'
export type Step = 'details' | 'code' | 'help'
export type FieldErrors = { name?: string; contact?: string; code?: string }
export const CODE_LENGTH = 6

export const countries = [
  { id: 'RU', name: 'Россия', prefix: '+7', digits: 10 },
  { id: 'BY', name: 'Беларусь', prefix: '+375', digits: 9 },
  { id: 'KZ', name: 'Казахстан', prefix: '+7', digits: 10 },
  { id: 'KG', name: 'Кыргызстан', prefix: '+996', digits: 9 },
  { id: 'AM', name: 'Армения', prefix: '+374', digits: 8 },
  { id: 'AZ', name: 'Азербайджан', prefix: '+994', digits: 9 },
  { id: 'MD', name: 'Молдова', prefix: '+373', digits: 8 },
  { id: 'TJ', name: 'Таджикистан', prefix: '+992', digits: 9 },
  { id: 'UZ', name: 'Узбекистан', prefix: '+998', digits: 9 },
  { id: 'TM', name: 'Туркменистан', prefix: '+993', digits: 8 },
  { id: 'GE', name: 'Грузия', prefix: '+995', digits: 9 },
] as const

export function normalizePhone(contact: string, countryId: string): string {
  const country = countries.find((item) => item.id === countryId)
  const digits = contact.replace(/\D/g, '')
  if (!country) return digits
  const prefix = country.prefix.slice(1)
  if (digits.startsWith(prefix) && digits.length === prefix.length + country.digits) return digits.slice(prefix.length)
  return digits
}

export function maskContact(channel: Channel, contact: string): string {
  if (channel === 'email') {
    const [local, domain] = contact.trim().split('@')
    return `${local.slice(0, 1)}•••@${domain ?? ''}`
  }
  const [prefix] = contact.trim().split(' ')
  return `${prefix} ••• ••• •${contact.replace(/\D/g, '').slice(-2)}`
}

export function validateDetails(input: { mode: AuthMode; channel: Channel; name: string; contact: string; country: string }): FieldErrors {
  const errors: FieldErrors = {}
  if (input.mode === 'register' && !input.name.trim()) errors.name = 'Подскажите, как к вам обращаться.'
  else if (input.mode === 'register' && (input.name.trim().length < 2 || input.name.trim().length > 200)) errors.name = 'Имя должно быть от 2 до 200 символов.'
  const contact = input.contact.trim()
  if (!contact) errors.contact = input.channel === 'email' ? 'Введите электронную почту.' : 'Введите номер телефона.'
  else if (input.channel === 'email' && (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@.<>]{2,}$/.test(contact) || contact.includes('..') || contact.length > 254)) errors.contact = 'Проверьте адрес. Например, anna@example.com.'
  else if (input.channel === 'phone') {
    const country = countries.find((item) => item.id === input.country)
    const internationalMismatch = contact.startsWith('+') && !contact.replace(/[\s()\-]/g, '').startsWith(country?.prefix ?? 'unknown')
    if (!country || !/^\+?[\d\s()\-]+$/.test(contact) || internationalMismatch || normalizePhone(contact, input.country).length !== country.digits) errors.contact = `Проверьте код страны и ${country?.digits ?? 10} цифр номера.`
  }
  return errors
}

export function validateCode(code: string): string {
  return new RegExp(`^\\d{${CODE_LENGTH}}$`).test(code.replace(/\s/g, '')) ? '' : `Введите все ${CODE_LENGTH} цифр из сообщения.`
}

export function secondsLeft(deadline: number, now: number): number {
  return Math.max(0, Math.ceil((deadline - now) / 1000))
}
