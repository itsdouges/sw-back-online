self.addEventListener(
  'notificationclick',
  (event) => {
    event.notification.close();
    if (!event.action) {
      clients.openWindow('/test/#MAD-123');
    }
  },
  false,
);

// https://developers.google.com/web/updates/2015/12/background-sync
// If this doesn't work reopen chrome.
// If that still doesn't work unregister the sw.
self.addEventListener('sync', function(event) {
  console.log('hell? :(');

  if (event.tag === 'fetchPost') {
    console.log('hmm found sync', event);

    const promise = fetch('https://postman-echo.com/post', {
      method: 'POST',
      body: JSON.stringify({ test: 'data' }),
      mode: 'no-cors',
    })
      .then(() => {
        console.log('success!');

        return self.clients.matchAll();
      })
      .then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            showNotification: {
              name: 'Request successfully submitted',
              options: {
                body: 'Click here to view your request.',
              },
            },
          });
        });
      });

    event.waitUntil(promise);
  }
});

// https://www.twilio.com/blog/2017/02/send-messages-when-youre-back-online-with-service-workers-and-background-sync.html
// https://blog.formpl.us/how-to-handle-post-put-requests-in-offline-applications-using-service-workers-indexedb-and-da7d0798a9ab
// self.addEventListener('fetch', function(event) {
//   console.log('someone trying to fetch');
//   console.log(event);
// });
self.addEventListener('message', function(event) {
  // fallback
  if (event.data.sync) {
    return fetch('https://postman-echo.com/post', {
      method: 'POST',
      body: JSON.stringify({ test: 'data' }),
      mode: 'no-cors',
    })
      .then(() => {
        console.log('success!');
        return self.clients.matchAll();
      })
      .then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            showNotification: {
              name: 'Request successfully submitted',
              options: {
                body: 'Click here to view your request.',
              },
            },
          });
        });
      });
  }
});
// end

self.addEventListener('offline', function() {
  alert('You have lost internet access!');
});

self.addEventListener('online', function() {
  alert('You are back online');
});
