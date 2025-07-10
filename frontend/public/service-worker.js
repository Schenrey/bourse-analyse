self.addEventListener('push', function (event) {
    const data = event.data ? event.data.json() : {};
    const title = data.title || '📈 Notification Bourse';
    const message = data.message || 'Nouvelle tendance détectée';
  
    event.waitUntil(
      self.registration.showNotification(title, {
        body: message,
        icon: '/icon.png'
      })
    );
  });
  