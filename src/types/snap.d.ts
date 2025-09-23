declare global {
  interface Window {
    snap?: {
      pay: (token: string, opts?: {
        onSuccess?: (r: any) => void;
        onPending?: (r: any) => void;
        onError?: (r: any) => void;
        onClose?: () => void;
      }) => void;
    };
  }
}
export {};
