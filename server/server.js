var express = require('express');
var app = express();
const path = require('path');


app
    .use(express.static('dist'))
    .use('/dynamic', express.static(path.join('_src','/hbs','/data', '/dynamic')))
    .listen(23485);





/* failed attempt at getting Push notifications to work! :D
const webpush = require('web-push');
const fs = require('fs');
const push_public = "BG4NptWWSZLzgnloeo0_rGtUocuvSg0LeYxi0h2NWwe_QjRPatQmmsGbvuKv2NHY0Affg3I2Ze8wwyw46y8DI9w";
const push_private = "W7SQIGKlk8UbCSbdDLtf7RKEF6nCNKUVJD30n84KvG0";
var vapidKeys;
fs.readFileSync('vapid-keys.json', (error, data) => {
    if (error) {
        console.log("OH SHIT");
    } else {
        // do things with this shiet
        vapidKeys = JSON.parse(data);
    }
});
console.log(vapidKeys);






// webpush.setGCMAPIKey('<Your GCM API Key Here>');
webpush.setVapidDetails(
  'mailto:silas@level2d.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

// This is the same output of calling JSON.stringify on a PushSubscription
const pushSubscription = {
  endpoint: '.....',
  keys: {
    auth: '.....',
    p256dh: '.....'
  }
};

webpush.sendNotification(pushSubscription, 'Your Push Payload Text');
*/