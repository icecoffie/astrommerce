export function loadSnap(clientKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any).snap) return resolve();
    const s = document.createElement('script');
    s.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
    s.setAttribute('data-client-key', clientKey);
    s.onload = () => resolve();
    s.onerror = reject;
    document.head.appendChild(s);
  });
}
