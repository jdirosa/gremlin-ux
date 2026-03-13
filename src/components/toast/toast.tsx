import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useId,
  useMemo,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cx } from "@styled-system/css";
import {
  toastRecipe,
  containerStyles,
  toastInnerStyles,
  accentStripeStyles,
  toastIconStyles,
  toastIconColorStyles,
  toastTextStyles,
  toastTitleStyles,
  toastDescriptionStyles,
  toastCloseStyles,
  toastProgressContainerStyles,
  toastProgressStyles,
} from "./toast.recipe";

// ── Types ────────────────────────────────────────────────────────────

export type ToastVariant = "info" | "success" | "warning" | "error";

export type ToastPosition =
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left"
  | "top-center"
  | "bottom-center";

export interface ToastOptions {
  /** Visual variant determines icon, accent color, and live region politeness */
  variant: ToastVariant;
  /** Bold title text */
  title: string;
  /** Optional description text below the title */
  description?: string;
  /** Auto-dismiss duration in ms. Default: 5000 (error: 8000). Use Infinity for persistent. */
  duration?: number;
}

export interface ToastProviderProps {
  /** Toast container position on screen */
  position?: ToastPosition;
  /** Maximum number of visible toasts */
  max?: number;
  children: ReactNode;
}

interface ToastItem {
  id: string;
  variant: ToastVariant;
  title: string;
  description?: string;
  duration: number;
  state: "entering" | "idle" | "exiting";
  createdAt: number;
}

// ── Default Durations ───────────────────────────────────────────────

const DEFAULT_DURATION: Record<ToastVariant, number> = {
  info: 5000,
  success: 5000,
  warning: 5000,
  error: 8000,
};

const EXIT_DURATION = 200; // ms — matches the exit animation duration

// ── Reducer ─────────────────────────────────────────────────────────

type ToastAction =
  | { type: "ADD"; toast: ToastItem }
  | { type: "UPDATE_STATE"; id: string; state: ToastItem["state"] }
  | { type: "REMOVE"; id: string }
  | { type: "DISMISS_ALL" };

function toastReducer(state: ToastItem[], action: ToastAction): ToastItem[] {
  switch (action.type) {
    case "ADD":
      return [...state, action.toast];
    case "UPDATE_STATE":
      return state.map((t) =>
        t.id === action.id ? { ...t, state: action.state } : t,
      );
    case "REMOVE":
      return state.filter((t) => t.id !== action.id);
    case "DISMISS_ALL":
      return state.map((t) =>
        t.state !== "exiting" ? { ...t, state: "exiting" as const } : t,
      );
    default:
      return state;
  }
}

// ── Context ─────────────────────────────────────────────────────────

interface ToastContextValue {
  toast: ToastFunction;
}

type ToastFunction = ((options: ToastOptions) => string) & {
  dismiss: (id: string) => void;
  dismissAll: () => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);
ToastContext.displayName = "ToastContext";

// ── Icons ───────────────────────────────────────────────────────────

function InfoIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function SuccessIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" width="14" height="14">
      <path
        fillRule="evenodd"
        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  );
}

const VARIANT_ICONS: Record<ToastVariant, () => ReactNode> = {
  info: InfoIcon,
  success: SuccessIcon,
  warning: WarningIcon,
  error: ErrorIcon,
};

// ── Keyframe name mapping ────────────────────────────────────────────
// Keyframes are defined in panda.config.ts and extracted at build time.
// These maps resolve the correct Panda keyframe name based on position.

function getAnimationName(position: ToastPosition, state: "entering" | "exiting"): string {
  const isEnter = state === "entering";

  if (position.includes("right")) {
    return isEnter ? "toastSlideInRight" : "toastSlideOutRight";
  }
  if (position.includes("left")) {
    return isEnter ? "toastSlideInLeft" : "toastSlideOutLeft";
  }
  if (position.startsWith("top")) {
    return isEnter ? "toastSlideInTop" : "toastSlideOutTop";
  }
  // bottom-center
  return isEnter ? "toastSlideInBottom" : "toastSlideOutBottom";
}

function getReducedMotionAnimation(state: "entering" | "exiting"): string {
  return state === "entering" ? "fadeIn" : "fadeOut";
}

// ── Toast Card ──────────────────────────────────────────────────────

interface ToastCardProps {
  toast: ToastItem;
  position: ToastPosition;
  onDismiss: (id: string) => void;
  onRemove: (id: string) => void;
}

function ToastCard({ toast, position, onDismiss, onRemove }: ToastCardProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const remainingRef = useRef(toast.duration);
  const startTimeRef = useRef(Date.now());
  const pausedRef = useRef(false);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useRef(false);

  // Check reduced motion preference
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    prefersReducedMotion.current = mq.matches;
    const handler = (e: MediaQueryListEvent) => {
      prefersReducedMotion.current = e.matches;
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Transition entering -> idle after entrance animation
  useEffect(() => {
    if (toast.state !== "entering") return;
    const timer = setTimeout(() => {
      onRemove; // no-op reference to keep linter happy
      // We set state via parent reducer
    }, 300);
    return () => clearTimeout(timer);
  }, [toast.state, onRemove]);

  // Auto-dismiss timer
  useEffect(() => {
    if (toast.state === "exiting" || toast.duration === Infinity) return;

    startTimeRef.current = Date.now();
    remainingRef.current = toast.duration;

    const startTimer = () => {
      timerRef.current = setTimeout(() => {
        onDismiss(toast.id);
      }, remainingRef.current);
    };

    startTimer();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [toast.id, toast.duration, toast.state, onDismiss]);

  // Pause/resume handlers
  const pause = useCallback(() => {
    if (pausedRef.current || toast.duration === Infinity) return;
    pausedRef.current = true;

    const elapsed = Date.now() - startTimeRef.current;
    remainingRef.current = Math.max(0, remainingRef.current - elapsed);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // Pause progress bar animation
    if (progressRef.current) {
      progressRef.current.style.animationPlayState = "paused";
    }
  }, [toast.duration]);

  const resume = useCallback(() => {
    if (!pausedRef.current || toast.duration === Infinity) return;
    pausedRef.current = false;

    startTimeRef.current = Date.now();

    timerRef.current = setTimeout(() => {
      onDismiss(toast.id);
    }, remainingRef.current);

    // Resume progress bar animation
    if (progressRef.current) {
      progressRef.current.style.animationPlayState = "running";
    }
  }, [toast.id, toast.duration, onDismiss]);

  // Handle exit animation end — remove from DOM
  const handleAnimationEnd = useCallback(() => {
    if (toast.state === "exiting") {
      onRemove(toast.id);
    }
  }, [toast.id, toast.state, onRemove]);

  const handleClose = useCallback(() => {
    onDismiss(toast.id);
  }, [toast.id, onDismiss]);

  // Build animation style
  const animationStyle = useMemo(() => {
    if (toast.state === "idle") return {};

    const animName = prefersReducedMotion.current
      ? getReducedMotionAnimation(toast.state)
      : getAnimationName(position, toast.state);

    const duration = toast.state === "entering" ? "300ms" : `${EXIT_DURATION}ms`;
    const easing =
      toast.state === "entering"
        ? "cubic-bezier(0.34, 1.56, 0.64, 1)" // rubber easing
        : "cubic-bezier(0.4, 0, 1, 1)"; // accelerate out
    const fillMode = "forwards";

    return {
      animation: `${animName} ${duration} ${easing} ${fillMode}`,
    };
  }, [toast.state, position]);

  // Progress bar animation style
  const progressStyle = useMemo(() => {
    if (toast.duration === Infinity) return { display: "none" as const };
    return {
      transformOrigin: "center" as const,
      animation: `toastProgress ${toast.duration}ms linear forwards`,
    };
  }, [toast.duration]);

  const Icon = VARIANT_ICONS[toast.variant];
  const recipeClass = toastRecipe({ variant: toast.variant });

  return (
    <div
      ref={cardRef}
      className={recipeClass}
      role="group"
      aria-label={`${toast.variant}: ${toast.title}`}
      data-state={toast.state}
      style={animationStyle}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
      onBlur={resume}
      onAnimationEnd={handleAnimationEnd}
    >
      {/* Left accent stripe */}
      <div className={accentStripeStyles[toast.variant]} aria-hidden="true" />

      {/* Content */}
      <div className={toastInnerStyles}>
        {/* Icon */}
        <div className={cx(toastIconStyles, toastIconColorStyles[toast.variant])}>
          <Icon />
        </div>

        {/* Text */}
        <div className={toastTextStyles}>
          <div className={toastTitleStyles}>{toast.title}</div>
          {toast.description && (
            <div className={toastDescriptionStyles}>{toast.description}</div>
          )}
        </div>

        {/* Close button */}
        <button
          type="button"
          className={toastCloseStyles}
          onClick={handleClose}
          aria-label="Dismiss"
        >
          <CloseIcon />
        </button>
      </div>

      {/* Progress bar */}
      {toast.duration !== Infinity && (
        <div className={toastProgressContainerStyles} aria-hidden="true">
          <div
            ref={progressRef}
            className={toastProgressStyles[toast.variant]}
            style={progressStyle}
          />
        </div>
      )}
    </div>
  );
}

// ── ToastProvider ───────────────────────────────────────────────────

export function ToastProvider({
  position = "bottom-right",
  max = 5,
  children,
}: ToastProviderProps) {
  const [toasts, dispatch] = useReducer(toastReducer, []);
  const toastCounterRef = useRef(0);
  const regionId = useId();

  const dismiss = useCallback(
    (id: string) => {
      dispatch({ type: "UPDATE_STATE", id, state: "exiting" });
    },
    [],
  );

  const remove = useCallback(
    (id: string) => {
      dispatch({ type: "REMOVE", id });
    },
    [],
  );

  const dismissAll = useCallback(() => {
    dispatch({ type: "DISMISS_ALL" });
  }, []);

  const addToast = useCallback(
    (options: ToastOptions): string => {
      const id = `toast-${++toastCounterRef.current}`;
      const duration = options.duration ?? DEFAULT_DURATION[options.variant];

      const newToast: ToastItem = {
        id,
        variant: options.variant,
        title: options.title,
        description: options.description,
        duration,
        state: "entering",
        createdAt: Date.now(),
      };

      dispatch({ type: "ADD", toast: newToast });

      // Transition to idle after entrance animation
      setTimeout(() => {
        dispatch({ type: "UPDATE_STATE", id, state: "idle" });
      }, 300);

      return id;
    },
    [],
  );

  // Create the toast function with dismiss/dismissAll methods
  const toastFn = useMemo(() => {
    const fn = addToast as ToastFunction;
    fn.dismiss = dismiss;
    fn.dismissAll = dismissAll;
    return fn;
  }, [addToast, dismiss, dismissAll]);

  const contextValue = useMemo<ToastContextValue>(
    () => ({ toast: toastFn }),
    [toastFn],
  );

  // Limit visible toasts
  const visibleToasts = toasts.slice(-max);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {typeof document !== "undefined" &&
        createPortal(
          <>
            {/* Hidden live regions for screen reader announcements */}
            <div
              aria-live="polite"
              aria-relevant="additions"
              role="status"
              id={`${regionId}-polite`}
              style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)" }}
            >
              {visibleToasts
                .filter((t) => t.variant !== "error")
                .map((t) => (
                  <div key={t.id}>{t.title}{t.description ? `. ${t.description}` : ""}</div>
                ))}
            </div>
            <div
              aria-live="assertive"
              aria-relevant="additions"
              role="alert"
              id={`${regionId}-assertive`}
              style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)" }}
            >
              {visibleToasts
                .filter((t) => t.variant === "error")
                .map((t) => (
                  <div key={t.id}>{t.title}{t.description ? `. ${t.description}` : ""}</div>
                ))}
            </div>

            {/* Visual toast container — all toasts in one stack */}
            <div
              className={containerStyles[position]}
            >
              {visibleToasts.map((t) => (
                <ToastCard
                  key={t.id}
                  toast={t}
                  position={position}
                  onDismiss={dismiss}
                  onRemove={remove}
                />
              ))}
            </div>
          </>,
          document.body,
        )}
    </ToastContext.Provider>
  );
}

// ── useToast Hook ───────────────────────────────────────────────────

/**
 * Returns a `toast` function for creating toast notifications.
 *
 * Must be used within a `<ToastProvider>`.
 *
 * @example
 * ```tsx
 * const toast = useToast();
 *
 * toast({ variant: "success", title: "Saved!" });
 * toast({ variant: "error", title: "Failed", description: "Check your connection." });
 *
 * const id = toast({ variant: "info", title: "Uploading...", duration: Infinity });
 * toast.dismiss(id);
 * ```
 */
export function useToast(): ToastFunction {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error(
      "useToast must be used within a <ToastProvider>. " +
        "Wrap your app or layout in <ToastProvider> to enable toast notifications.",
    );
  }
  return ctx.toast;
}
