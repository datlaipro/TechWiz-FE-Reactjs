// EventContext.jsx
import { createContext, useContext, useMemo, useState } from "react";

const EventContext = createContext(null);

export function EventProvider({ children }) {
  const [eventsThisMonth, setEventsThisMonth] = useState([]);

  const value = useMemo(// DÙNG useMemo để tránh tạo object value mới mỗi render không cần thiết
    () => ({ eventsThisMonth, setEventsThisMonth }),
    [eventsThisMonth]
  );

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
}

export function useEventContext() {
  const ctx = useContext(EventContext);
  if (!ctx) throw new Error("useEventContext phải được dùng trong <EventProvider>.");
  return ctx;
}

