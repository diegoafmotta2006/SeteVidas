/**
 * Registra o Service Worker (o "cache offline" do PWA).
 *
 * Só roda no build de produção: durante o `npm run dev` um cache
 * atrapalharia as atualizações em tempo real.
 */
export function registerServiceWorker(): void {
  if (!('serviceWorker' in navigator) || !import.meta.env.PROD) {
    return;
  }

  window.addEventListener('load', () => {
    const swUrl = `${import.meta.env.BASE_URL}sw.js`;

    navigator.serviceWorker.register(swUrl).catch((error: unknown) => {
      // Falhar aqui não quebra o app: ele continua funcionando online.
      console.warn('Service Worker não registrado:', error);
    });
  });
}
