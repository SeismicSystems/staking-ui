export {};

declare global {
  interface Window {
    APP_CONFIG?: {
      domain: string;
      rpcUrl: string;
      wsUrl: string;
    };
  }
}
