import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from 'react'

interface Toast {
  id: number
  message: string
  undoAction?: () => void
  undoLabel?: string
}

interface ToastContextValue {
  showToast: (message: string, undoAction?: () => void, undoLabel?: string) => void
}

const ToastContext = createContext<ToastContextValue>({ showToast: () => {} })

export function useToast() {
  return useContext(ToastContext)
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const nextId = useRef(0)

  const showToast = useCallback((message: string, undoAction?: () => void, undoLabel = 'Undo') => {
    const id = nextId.current++
    setToasts(prev => [...prev, { id, message, undoAction, undoLabel }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4000)
  }, [])

  const dismiss = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container" aria-live="polite" aria-atomic="false">
        {toasts.map(toast => (
          <div key={toast.id} className="toast" role="status">
            <span>{toast.message}</span>
            {toast.undoAction && (
              <button
                className="toast-undo"
                onClick={() => {
                  toast.undoAction!()
                  dismiss(toast.id)
                }}
                aria-label={toast.undoLabel}
              >
                {toast.undoLabel}
              </button>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

