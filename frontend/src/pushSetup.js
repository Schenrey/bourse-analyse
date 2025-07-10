export async function subscribeToPush() {
    if (!('serviceWorker' in navigator)) return;
  
    const swReg = await navigator.serviceWorker.ready;
    const response = await fetch('https://bourse-analyse.onrender.com/vapidPublicKey');
    const vapidPublicKey = await response.text();
  
    const convertedKey = urlBase64ToUint8Array(vapidPublicKey);
  
    try {
      const subscription = await swReg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedKey
      });
  
      await fetch('https://bourse-analyse.onrender.com/subscribe', {
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: { 'Content-Type': 'application/json' }
      });
  
      console.log('✅ Abonnement Web Push envoyé');
    } catch (err) {
      console.error('❌ Échec de l’abonnement:', err);
    }
  }
  
  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const raw = window.atob(base64);
    return Uint8Array.from([...raw].map(char => char.charCodeAt(0)));
  }
  