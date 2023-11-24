// app/providers.tsx
'use client'

import { NextUIProvider } from '@nextui-org/react'
import { ToastContainer } from "react-toastify";

export function NextUIProviders({ children }) {
  return (
    <NextUIProvider>
      {children}
    </NextUIProvider>
  )
}
export function ToastProvider({ children }) {
  return (
    <ToastContainer>
      {children}
    </ToastContainer>
  )
}