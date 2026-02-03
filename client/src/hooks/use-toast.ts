import * as React from "react"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = any // Simplified for brevity

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

// Using a simplified version of the shadcn/ui hook logic
import { useState, useEffect } from 'react';

type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
}

const listeners: Array<(state: any) => void> = [];
let memoryState = { toasts: [] as any[] };

function dispatch(action: any) {
  switch (action.type) {
    case "ADD_TOAST":
      memoryState = { ...memoryState, toasts: [action.toast, ...memoryState.toasts].slice(0, TOAST_LIMIT) };
      break;
    case "REMOVE_TOAST":
      memoryState = { ...memoryState, toasts: memoryState.toasts.filter((t) => t.id !== action.toastId) };
      break;
  }
  listeners.forEach((listener) => listener(memoryState));
}

export function useToast() {
  const [state, setState] = useState(memoryState);

  useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    toast: (props: ToastProps) => {
      const id = genId();
      dispatch({
        type: "ADD_TOAST",
        toast: {
          ...props,
          id,
          open: true,
          onOpenChange: (open: boolean) => {
            if (!open) dispatch({ type: "REMOVE_TOAST", toastId: id });
          },
        },
      });
      return {
        id,
        dismiss: () => dispatch({ type: "REMOVE_TOAST", toastId: id }),
        update: (props: ToastProps) => dispatch({ type: "UPDATE_TOAST", toast: { ...props, id } }),
      };
    },
    dismiss: (toastId?: string) => dispatch({ type: "REMOVE_TOAST", toastId }),
  };
}