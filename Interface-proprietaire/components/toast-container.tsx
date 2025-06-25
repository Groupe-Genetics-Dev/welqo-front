"use client"

import { X, CheckCircle, XCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useCallback, useEffect } from "react"

// Define the Toast type if not already imported
type Toast = {
  id: string | number
  type: "success" | "error" | "info"
  message: string
}

export function ToastContainer() {
  const { toasts, removeToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast: Toast) => (
      <div
        key={toast.id}
        className={`flex items-center space-x-3 p-4 rounded-lg shadow-lg backdrop-blur-sm border max-w-md ${
        toast.type === "success"
          ? "bg-green-500/20 border-green-500 text-green-200"
          : toast.type === "error"
          ? "bg-red-500/20 border-red-500 text-red-200"
          : "bg-blue-500/20 border-blue-500 text-blue-200"
        }`}
      >
        {toast.type === "success" && <CheckCircle className="w-5 h-5" />}
        {toast.type === "error" && <XCircle className="w-5 h-5" />}
        {toast.type === "info" && <Info className="w-5 h-5" />}

        <p className="flex-1 text-sm">{toast.message}</p>

        <Button
        variant="ghost"
        size="sm"
        onClick={(): void => removeToast(toast.id)}
        className="p-1 h-auto text-current hover:bg-white/10"
        >
        <X className="w-4 h-4" />
        </Button>
      </div>
      ))}
    </div>
  )
}
type Toast = {
  id: string | number
  type: "success" | "error" | "info"
  message: string
}

const toastEventName = "__custom_toast_event__"

let listeners: ((toasts: Toast[]) => void)[] = []
let toasts: Toast[] = []

function emit() {
  listeners.forEach((listener) => listener(toasts))
}

export function addToast(toast: Omit<Toast, "id">) {
  const id = Date.now() + Math.random()
  toasts = [...toasts, { ...toast, id }]
  emit()
  return id
}

export function removeToast(id: string | number) {
  toasts = toasts.filter((t) => t.id !== id)
  emit()
}

export function useToast() {
  const [currentToasts, setToasts] = useState<Toast[]>(toasts)

  useEffect(() => {
    const listener = (newToasts: Toast[]) => setToasts(newToasts)
    listeners.push(listener)
    return () => {
      listeners = listeners.filter((l) => l !== listener)
    }
  }, [])

  return {
    toasts: currentToasts,
    removeToast,
  }
}

