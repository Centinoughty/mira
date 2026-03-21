"use client";

import { createContext, useContext, useEffect, useRef, ReactNode } from "react";
import { Socket } from "socket.io-client";
import { connectSocket, disconnectSocket } from "@/lib/socket";
import { useQueryClient } from "@tanstack/react-query";
import useUser from "@/hooks/useUser";

interface SocketContextValue {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextValue>({ socket: null });

export function SocketProvider({ children }: { children: ReactNode }) {
  const { user, isLoading } = useUser();
  const qc = useQueryClient();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (isLoading || !user) return;

    const socket = connectSocket("");
    socketRef.current = socket;

    socket.on(
      "task:assigned",
      (data: { task: { title: string }; assignedBy: { email: string } }) => {
        showToast(
          `📋 New task assigned: "${data.task.title}" by ${data.assignedBy.email}`,
        );
        qc.invalidateQueries({ queryKey: ["tasks"] });
      },
    );

    return () => {
      disconnectSocket();
    };
  }, [qc, user, isLoading]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current }}>
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
