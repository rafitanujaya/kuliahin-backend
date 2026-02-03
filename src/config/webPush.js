import webPush from 'web-push';
import { config } from './index.js';

webPush.setVapidDetails(
    config.VAPID_SUBJECT,
    config.VAPID_PUBLIC_KEY, 
    config.VAPID_PRIVATE_KEY
);

export default webPush;
