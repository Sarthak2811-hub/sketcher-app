const isClient = typeof window !== "undefined";

export const HTTP_BACKEND = isClient 
    ? `http://${window.location.hostname}:3002` 
    : "http://127.0.0.1:3002";

export const WS_URL = isClient 
    ? `ws://${window.location.hostname}:8080` 
    : "ws://127.0.0.1:8080";