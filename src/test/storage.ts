import type { StorageLike } from '@/features/rfps'

export function createMemoryStorage(initial: Record<string, string> = {}): StorageLike & {
  dump: () => Record<string, string>
} {
  const values = new Map(Object.entries(initial))
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => void values.set(key, value),
    removeItem: (key) => void values.delete(key),
    dump: () => Object.fromEntries(values),
  }
}

/** Simulates a browser that blocks storage (e.g. privacy settings) on every call. */
export function createThrowingStorage(): StorageLike {
  const fail = () => {
    throw new DOMException('Storage is disabled', 'SecurityError')
  }
  return { getItem: fail, setItem: fail, removeItem: fail }
}

/** Reads fine but refuses writes, like a full quota. */
export function createReadOnlyStorage(): StorageLike {
  return {
    getItem: () => null,
    setItem: () => {
      throw new DOMException('Quota exceeded', 'QuotaExceededError')
    },
    removeItem: () => undefined,
  }
}
