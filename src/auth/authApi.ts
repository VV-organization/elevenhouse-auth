import type { Channel } from './authFlow'

export type AuthChallenge = {
  challengeId: string
  channel: Channel
  maskedIdentifier: string
  expiresAt: string
  resendAvailableAt: string
}

export type AuthIdentity = { channel: Channel; identifier: string }

export class AuthApiError extends Error {
  constructor(readonly status: number, readonly code: string) {
    super(code || `Authentication request failed (${status})`)
    this.name = 'AuthApiError'
  }
}

async function post<T>(path: string, body: unknown, signal: AbortSignal): Promise<T> {
  let response: Response
  try {
    response = await fetch(path, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
      signal,
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error
    throw new AuthApiError(0, 'NETWORK_ERROR')
  }

  const payload = await response.json().catch(() => ({})) as Record<string, unknown>
  if (!response.ok) {
    const detail = payload.error && typeof payload.error === 'object' ? payload.error as Record<string, unknown> : undefined
    const code = typeof payload.code === 'string' ? payload.code
      : typeof payload.errorCode === 'string' ? payload.errorCode
        : typeof detail?.code === 'string' ? detail.code
          : typeof payload.error === 'string' ? payload.error : ''
    throw new AuthApiError(response.status, code)
  }
  return payload as T
}

function parseChallenge(payload: AuthChallenge): AuthChallenge {
  if (!payload?.challengeId || !payload.maskedIdentifier || !Number.isFinite(Date.parse(payload.expiresAt)) || !Number.isFinite(Date.parse(payload.resendAvailableAt))) {
    throw new AuthApiError(502, 'INVALID_CHALLENGE_RESPONSE')
  }
  return payload
}

export const authApi = {
  async requestCode(identity: AuthIdentity, signal: AbortSignal): Promise<AuthChallenge> {
    const challenge = await post<AuthChallenge>('/identity/astrologer/passwordless/request-code', identity, signal)
    return parseChallenge(challenge)
  },

  async verifyCode(input: { challengeId: string; code: string; displayName?: string }, signal: AbortSignal): Promise<void> {
    const { displayName, ...credentials } = input
    const path = displayName
      ? '/identity/astrologer/registration/passwordless/verify-code'
      : '/identity/astrologer/passwordless/verify-code'
    const result = await post<{ account?: { id?: string; status?: string; roles?: unknown[] } }>(path, displayName ? { ...credentials, displayName } : credentials, signal)
    if (!result.account?.id || result.account.status !== 'active' || !result.account.roles?.length) {
      throw new AuthApiError(502, 'INVALID_AUTH_RESPONSE')
    }
  },
}
