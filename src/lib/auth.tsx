"use client"

import * as React from "react"

export interface AuthUser {
  name: string
  email: string
  avatarUrl?: string
}

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (
    name: string,
    email: string,
    password: string,
    photoUrl?: string
  ) => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = React.createContext<AuthContextValue | null>(null)

async function postJSON<T>(url: string, body?: unknown): Promise<T> {
  const response = await fetch(url, {
    method: body === undefined ? "GET" : "POST",
    headers: body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  const data = (await response.json().catch(() => null)) as T & {
    error?: string
  }
  if (!response.ok) {
    throw new Error(data?.error ?? "Request failed")
  }
  return data
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(null)

  React.useEffect(() => {
    let cancelled = false
    postJSON<{ user: AuthUser }>("/api/auth/me")
      .then((data) => {
        if (!cancelled) setUser(data.user)
      })
      .catch(() => {
        if (!cancelled) setUser(null)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const login = React.useCallback(
    async (email: string, password: string) => {
      const data = await postJSON<{ user: AuthUser }>("/api/auth/login", {
        email,
        password,
      })
      setUser(data.user)
    },
    []
  )

  const register = React.useCallback(
    async (
      name: string,
      email: string,
      password: string,
      photoUrl?: string
    ) => {
      await postJSON("/api/auth/register", { name, email, password, photoUrl })
    },
    []
  )

  const loginWithGoogle = React.useCallback(async () => {
    const data = await postJSON<{ user: AuthUser }>("/api/auth/google", {})
    setUser(data.user)
  }, [])

  const logout = React.useCallback(async () => {
    await postJSON("/api/auth/logout", {})
    setUser(null)
  }, [])

  const value = React.useMemo(
    () => ({
      user,
      isAuthenticated: user !== null,
      login,
      register,
      loginWithGoogle,
      logout,
    }),
    [user, login, register, loginWithGoogle, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
