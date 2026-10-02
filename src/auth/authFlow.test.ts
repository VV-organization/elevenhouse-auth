import { describe, expect, it } from 'vitest'
import { validateDetails, validateCode, secondsLeft, countries, normalizePhone, maskContact } from './authFlow'

describe('contact validation', () => {
  const details = { mode: 'register' as const, channel: 'email' as const, name: 'Анна', contact: 'anna@example.com', country: 'RU' }
  it('accepts a trimmed valid email and a Unicode name', () => {
    expect(validateDetails({ ...details, name: '  李安  ', contact: ' anna@example.com ' })).toEqual({})
  })
  it('requires a name only when registering', () => {
    expect(validateDetails({ ...details, name: '  ' })).toHaveProperty('name')
    expect(validateDetails({ ...details, name: '', mode: 'login' })).toEqual({})
  })
  it('preserves the original name limits: 2–200 characters', () => {
    expect(validateDetails({ ...details, name: 'А' })).toHaveProperty('name')
    expect(validateDetails({ ...details, name: 'Ан' })).toEqual({})
    expect(validateDetails({ ...details, name: 'А'.repeat(200) })).toEqual({})
    expect(validateDetails({ ...details, name: 'А'.repeat(201) })).toHaveProperty('name')
  })
  it('masks the delivery contact without losing its recognizable suffix', () => {
    expect(maskContact('email', 'anna@example.com')).toBe('a•••@example.com')
    expect(maskContact('phone', '+375 291234567')).toBe('+375 ••• ••• •67')
  })
  it.each(['', 'anna', 'anna@', 'anna@example', 'an na@example.com', 'anna@example..com', '<anna>@example.com'])('rejects malformed email %s', (contact) => {
    expect(validateDetails({ ...details, contact })).toHaveProperty('contact')
  })
  it('accepts formatted local phone digits for the selected country', () => {
    expect(validateDetails({ ...details, channel: 'phone', contact: '(999) 123-45-67' })).toEqual({})
    expect(validateDetails({ ...details, channel: 'phone', country: 'BY', contact: '29 123 45 67' })).toEqual({})
  })
  it('accepts a pasted international number without duplicating its prefix', () => {
    expect(validateDetails({ ...details, channel: 'phone', contact: '+7 (999) 123-45-67' })).toEqual({})
    expect(normalizePhone('+7 (999) 123-45-67', 'RU')).toBe('9991234567')
    expect(normalizePhone('+375 29 123 45 67', 'BY')).toBe('291234567')
    expect(validateDetails({ ...details, channel: 'phone', country: 'BY', contact: '+7 999 123 45 67' })).toHaveProperty('contact')
  })
  it('rejects incomplete numbers, letters and an unknown country', () => {
    for (const contact of ['999', 'abcdefghij', '9991234567890']) {
      expect(validateDetails({ ...details, channel: 'phone', contact })).toHaveProperty('contact')
    }
    expect(validateDetails({ ...details, channel: 'phone', country: 'XX', contact: '9991234567' })).toHaveProperty('contact')
  })
  it('keeps all eleven existing phone countries available', () => expect(countries).toHaveLength(11))
})

describe('verification lifecycle', () => {
  it('requires all six digits, allowing paste with spaces', () => {
    expect(validateCode('123 456')).toBe('')
    expect(validateCode('1234')).not.toBe('')
    expect(validateCode('abcdef')).not.toBe('')
  })
  it('never returns negative cooldown and respects the exact deadline', () => {
    expect(secondsLeft(31000, 1000)).toBe(30)
    expect(secondsLeft(31000, 30500)).toBe(1)
    expect(secondsLeft(31000, 31000)).toBe(0)
    expect(secondsLeft(31000, 99000)).toBe(0)
  })
})
