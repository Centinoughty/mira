"use client";

import { createContext, useContext, useEffect, ReactNode } from "react";
import { Socket } from "socket.io-client";
import { connectSocket, disconnectSocket } from "@/lib/socket";
import { useQueryClient } from "@tanstack/react-query";
import useUser from "@/hooks/useUser";

interface SocketContextValue {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextValue>({ socket: null });

let socketInstance: Socket | null = null;

export function SocketProvider({ children }: { children: ReactNode }) {
  const { user, isLoading } = useUser();
  const qc = useQueryClient();

  useEffect(() => {
    if (isLoading || !user) return;

    const s = connectSocket();
    socketInstance = s;

    function onConnect() {
      console.log("Socket connected:", s.id);
    }

    function onConnectError(err: Error) {
      console.error("Socket connection error:", err.message);
    }

    function onDisconnect(reason: string) {
      console.log("Socket disconnected:", reason);
    }

    function onTaskAssigned(data: {
      task: { title: string };
      assignedBy: { email: string };
    }) {
      showToast(
        `📋 New task assigned: "${data.task.title}" by ${data.assignedBy.email}`,
      );
      qc.invalidateQueries({ queryKey: ["tasks"] });
    }

    s.on("connect", onConnect);
    s.on("connect_error", onConnectError);
    s.on("disconnect", onDisconnect);
    s.on("task:assigned", onTaskAssigned);

    return () => {
      s.off("connect", onConnect);
      s.off("connect_error", onConnectError);
      s.off("disconnect", onDisconnect);
      s.off("task:assigned", onTaskAssigned);
      disconnectSocket();
      socketInstance = null;
    };
  }, [user, isLoading, qc]);

  return (
    <SocketContext.Provider value={{ socket: socketInstance }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}

function showToast(message: string) {
  if (typeof window === "undefined") return;

  const toast = document.createElement("div");
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: #1e1e2e;
    color: #fff;
    padding: 12px 18px;
    border-radius: 12px;
    font-size: 14px;
    font-family: sans-serif;
    box-shadow: 0 4px 24px rgba(0,0,0,0.18);
    z-index: 9999;
    max-width: 360px;
    line-height: 1.5;
    opacity: 0;
    transform: translateY(12px);
    transition: opacity 0.25s ease, transform 0.25s ease;
  `;

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";
  });

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(12px)";
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
