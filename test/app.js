// Scope important to limit it to a particular sub-directory.
navigator.serviceWorker.register('./sw.js', { scope: '/test/' });

document.getElementById('form').addEventListener('submit', async (event) => {
  event.preventDefault();

  try {
    await fetch('https://postman-echo.com/post', {
      method: 'POST',
      body: JSON.stringify({ test: 'data' }),
      mode: 'no-cors',
    });
    console.log('success posting.');
  } catch (e) {
    console.log('network failure, setting up bg sync');
    const swRegistration = await navigator.serviceWorker.ready;
    // send form data, yo.
    // navigator.serviceWorker.controller.postMessage({
    //  form: 'data',
    // });
    if ('sync' in swRegistration) {
      await swRegistration.sync.register('fetchPost');
    } else {
      console.log(
        'sync not supported, fall back to ghetto online/offline toggling',
      );
      window.addEventListener('online', function() {
        navigator.serviceWorker.controller.postMessage({
          sync: true,
        });
      });
    }
  }
});

// https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification
document.getElementById('subscribe').addEventListener('click', async () => {
  const permission = await Notification.requestPermission();
  console.log(permission);
});

async function showNotification(title, options) {
  const registration = await navigator.serviceWorker.ready;
  if ('showNotification' in registration) {
    registration.showNotification(title, options);
  } else {
    new Notification(title, options);
  }
}

document
  .getElementById('test-notification')
  .addEventListener('click', async () => {
    if (Notification.permission === 'denied') {
      alert('Yo gimmie access dawg');
    } else {
      showNotification('Request successfully submitted', {
        body: 'Click here to view your request.',
        // Action only on android, probably.
        // https://developer.mozilla.org/en-US/docs/Web/API/NotificationEvent/action
      });
    }
  });

navigator.serviceWorker.addEventListener('message', async function(event) {
  console.log('sw talk to me', event);

  if (event.data.showNotification) {
    if (Notification.permission === 'denied') {
      alert('Yo gimmie access dawg');
    } else {
      showNotification(
        event.data.showNotification.name,
        event.data.showNotification.options,
      );
    }
  }
});

// window.addEventListener('offline', function() {
//   alert('You have lost internet access!');
// });

// window.addEventListener('online', function() {
//   alert('You are back online');
// });
