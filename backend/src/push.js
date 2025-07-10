import webpush from 'web-push';
import Subscription from './models/Subscription.js';

webpush.setVapidDetails(
  'mailto:test@example.com',
  process.env.VAPID_PUBLIC,
  process.env.VAPID_PRIVATE
);

export function setupPushRoutes(app) {
  app.get('/vapidPublicKey', (req, res) => {
    res.send(process.env.VAPID_PUBLIC);
  });

  app.post('/subscribe', async (req, res) => {
    const subscription = new Subscription(req.body);
    await subscription.save();
    res.status(201).send({ message: 'Abonné avec succès' });
  });

  // Exemple de notification en cas de tendance
  app.post('/trigger-notification', async (req, res) => {
    const subs = await Subscription.find();
    const payload = JSON.stringify({
      title: '📈 Tendance détectée',
      message: req.body.message || 'Nouvelle opportunité de trading !'
    });

    const results = await Promise.allSettled(
      subs.map(sub => webpush.sendNotification(sub, payload))
    );

    res.send({ status: 'Notifications envoyées', results });
  });
}
