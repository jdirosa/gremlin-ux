import {
  forwardRef,
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
  useId,
  type ReactNode,
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
} from "react";
import { cx } from "@styled-system/css";
import { useControllableState } from "../../hooks/use-controllable-state";
import {
  tabListRecipe,
  tabRecipe,
  tabIndicatorStyles,
  tabPanelStyles,
  type TabsVariantProps,
} from "./tabs.recipe";

// ── Context ──────────────────────────────────────────────────────────

interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
  size: TabsVariantProps["size"];
  baseId: string;
  registerTab: (value: string, element: HTMLButtonElement) => void;
  unregisterTab: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

function useTabsContext() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("Tabs compound components must be inside <Tabs>");
  return ctx;
}

// ── Tabs Root ────────────────────────────────────────────────────────

export interface TabsProps extends Omit<ComponentPropsWithoutRef<"div">, "defaultValue" | "onChange"> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  size?: TabsVariantProps["size"];
  children: ReactNode;
  className?: string;
}

function TabsRoot({
  value: valueProp,
  defaultValue = "",
  onValueChange,
  size = "md",
  children,
  className,
  ...rest
}: TabsProps) {
  const [value, setValue] = useControllableState({
    value: valueProp,
    defaultValue,
    onChange: onValueChange,
  });

  const baseId = `tabs-${useId()}`;
  const tabsMapRef = useRef(new Map<string, HTMLButtonElement>());

  const registerTab = useCallback((tabValue: string, element: HTMLButtonElement) => {
    tabsMapRef.current.set(tabValue, element);
  }, []);

  const unregisterTab = useCallback((tabValue: string) => {
    tabsMapRef.current.delete(tabValue);
  }, []);

  const contextValue: TabsContextValue = {
    value,
    onValueChange: setValue,
    size,
    baseId,
    registerTab,
    unregisterTab,
  };

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={className} {...rest}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

// ── Tabs.List ────────────────────────────────────────────────────────

export interface TabListProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  className?: string;
}

const TabList = forwardRef<HTMLDivElement, TabListProps>(
  function TabList({ children, className, ...rest }, ref) {
    const { size, value } = useTabsContext();
    const listRef = useRef<HTMLDivElement | null>(null);
    const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number } | null>(null);

    const mergedRef = useCallback(
      (node: HTMLDivElement | null) => {
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        listRef.current = node;
      },
      [ref],
    );

    // Update indicator position when value changes
    useEffect(() => {
      if (!listRef.current) return;
      const selectedTab = listRef.current.querySelector<HTMLButtonElement>("[data-selected]");
      if (selectedTab) {
        const listRect = listRef.current.getBoundingClientRect();
        const tabRect = selectedTab.getBoundingClientRect();
        setIndicatorStyle({
          left: tabRect.left - listRect.left,
          width: tabRect.width,
        });
      }
    }, [value]);

    // Keyboard navigation
    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLDivElement>) => {
        const list = listRef.current;
        if (!list) return;

        const tabs = Array.from(
          list.querySelectorAll<HTMLButtonElement>("[role=tab]:not([aria-disabled=true])"),
        );
        const currentIndex = tabs.findIndex((t) => t === document.activeElement);
        if (currentIndex === -1) return;

        let nextIndex: number | undefined;
        if (e.key === "ArrowRight") nextIndex = (currentIndex + 1) % tabs.length;
        else if (e.key === "ArrowLeft") nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        else if (e.key === "Home") nextIndex = 0;
        else if (e.key === "End") nextIndex = tabs.length - 1;

        if (nextIndex != null) {
          e.preventDefault();
          tabs[nextIndex]!.focus();
          tabs[nextIndex]!.click();
        }
      },
      [],
    );

    return (
      <div
        ref={mergedRef}
        role="tablist"
        className={cx(tabListRecipe({ size }), className)}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {children}
        {indicatorStyle && (
          <span
            className={tabIndicatorStyles}
            style={{ left: indicatorStyle.left, width: indicatorStyle.width }}
          />
        )}
      </div>
    );
  },
);

// ── Tabs.Tab ─────────────────────────────────────────────────────────

export interface TabProps extends Omit<ComponentPropsWithoutRef<"button">, "value"> {
  value: string;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
}

const Tab = forwardRef<HTMLButtonElement, TabProps>(
  function Tab({ value: tabValue, disabled = false, children, className, ...rest }, ref) {
    const { value, onValueChange, size, baseId, registerTab, unregisterTab } = useTabsContext();
    const isSelected = value === tabValue;
    const btnRef = useRef<HTMLButtonElement | null>(null);

    const mergedRef = useCallback(
      (node: HTMLButtonElement | null) => {
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
        btnRef.current = node;
      },
      [ref],
    );

    useEffect(() => {
      if (btnRef.current) registerTab(tabValue, btnRef.current);
      return () => unregisterTab(tabValue);
    }, [tabValue, registerTab, unregisterTab]);

    return (
      <button
        ref={mergedRef}
        role="tab"
        type="button"
        id={`${baseId}-tab-${tabValue}`}
        aria-selected={isSelected}
        aria-controls={`${baseId}-panel-${tabValue}`}
        aria-disabled={disabled || undefined}
        tabIndex={isSelected ? 0 : -1}
        data-selected={isSelected ? "" : undefined}
        className={cx(tabRecipe({ size }), className)}
        onClick={disabled ? undefined : () => onValueChange(tabValue)}
        {...rest}
      >
        {children}
      </button>
    );
  },
);

// ── Tabs.Panel ───────────────────────────────────────────────────────

export interface TabPanelProps extends ComponentPropsWithoutRef<"div"> {
  value: string;
  children: ReactNode;
  className?: string;
}

const TabPanel = forwardRef<HTMLDivElement, TabPanelProps>(
  function TabPanel({ value: panelValue, children, className, ...rest }, ref) {
    const { value, baseId } = useTabsContext();
    const isActive = value === panelValue;

    if (!isActive) return null;

    return (
      <div
        ref={ref}
        role="tabpanel"
        id={`${baseId}-panel-${panelValue}`}
        aria-labelledby={`${baseId}-tab-${panelValue}`}
        tabIndex={0}
        className={cx(tabPanelStyles, className)}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

// ── Compound Assembly ────────────────────────────────────────────────

export const Tabs = Object.assign(TabsRoot, {
  List: TabList,
  Tab,
  Panel: TabPanel,
});
