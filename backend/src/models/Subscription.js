import mongoose from 'mongoose';

const SubscriptionSchema = new mongoose.Schema({
  endpoint: String,
  keys: {
    p256dh: String,
    auth: String
  }
});

export default mongoose.model('Subscription', SubscriptionSchema);
