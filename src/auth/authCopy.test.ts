import { describe, expect, it } from 'vitest'
import ts from 'typescript'
import pageSource from './AuthPage.tsx?raw'
import flowSource from './authFlow.ts?raw'
import { translateAuth, resolveLocale, englishCopy } from './authCopy'

describe('auth language parity', () => {
  it('honors an explicit language, then saved preference, then browser language', () => {
    expect(resolveLocale('ru', 'en', 'en-US')).toBe('ru')
    expect(resolveLocale(null, 'en', 'ru-RU')).toBe('en')
    expect(resolveLocale(null, null, 'en-GB')).toBe('en')
    expect(resolveLocale('fr', 'de', 'ru-RU')).toBe('ru')
  })
  it('translates stored errors at render time, allowing a language switch without resetting state', () => {
    const message = 'Проверьте адрес. Например, anna@example.com.'
    expect(translateAuth(message, 'en')).toBe('Check the address. For example, anna@example.com.')
    expect(translateAuth(message, 'ru')).toBe(message)
  })
  it('translates timer, attempts and validation messages with their numbers intact', () => {
    expect(translateAuth('Отправить повторно через 21 сек.', 'en')).toBe('Send again in 21 sec.')
    expect(translateAuth('Код действует 4:09', 'en')).toBe('Code expires in 4:09')
    expect(translateAuth('Код не подошёл. Проверьте цифры. Осталось попыток: 3.', 'en')).toBe('That code did not match. Check the digits. Attempts left: 3.')
    expect(translateAuth('Проверьте код страны и 9 цифр номера.', 'en')).toBe('Check the country code and the 9-digit phone number.')
  })
  it('preserves user-entered text and contact addresses', () => {
    expect(translateAuth('anna@example.com', 'en')).toBe('anna@example.com')
  })
  it('has non-empty English values without untranslated Cyrillic', () => {
    for (const value of Object.values(englishCopy)) {
      expect(value.trim()).not.toBe('')
      expect(value).not.toMatch(/[А-Яа-яЁё]/)
    }
  })
  it('covers every static UI message, including scenario labels, notices and validation', () => {
    for (const [file, contents] of [['AuthPage.tsx', pageSource], ['authFlow.ts', flowSource]]) {
      const source = ts.createSourceFile(file, contents, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
      const inspect = (node: ts.Node) => {
        if ((ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) && /[А-Яа-яЁё]/.test(node.text) && !['Анна', 'Русский'].includes(node.text)) {
          expect(translateAuth(node.text, 'en'), `Missing translation: ${node.text}`).not.toMatch(/[А-Яа-яЁё]/)
        }
        ts.forEachChild(node, inspect)
      }
      inspect(source)
    }
  })
})
