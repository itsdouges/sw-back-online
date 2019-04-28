// Scope important to limit it to a particular sub-directory.
navigator.serviceWorker.register('./sw.js', { scope: '/test/' });

document.getElementById('form').addEventListener('submit', async (event) => {
  event.preventDefault();

  try {
    // send form data, yo.
    // navigator.serviceWorker.controller.postMessage({
    //   sync: true,
    // });
    await fetch('https://postman-echo.com/post', {
      method: 'POST',
      body: JSON.stringify({ test: 'data' }),
      mode: 'no-cors',
    });
    console.log('success posting.');
  } catch (e) {
    console.log('network failure, setting up bg sync');
    const swRegistration = await navigator.serviceWorker.ready;
    await swRegistration.sync.register('fetchPost');
  }
});

// https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification
document.getElementById('subscribe').addEventListener('click', async () => {
  const permission = await Notification.requestPermission();
  console.log(permission);
});

document
  .getElementById('test-notification')
  .addEventListener('click', async () => {
    const registration = await navigator.serviceWorker.ready;
    if (Notification.permission === 'denied') {
      alert('Yo gimmie access dawg');
    } else {
      registration.showNotification('Request successfully submitted', {
        body: 'Click here to view your request.',
        // Action only on android, probably.
        // https://developer.mozilla.org/en-US/docs/Web/API/NotificationEvent/action
      });
    }
  });

navigator.serviceWorker.addEventListener('message', async function(event) {
  console.log('sw talk to me', event);

  if (event.data.showNotification) {
    const registration = await navigator.serviceWorker.ready;
    if (Notification.permission === 'denied') {
      alert('Yo gimmie access dawg');
    } else {
      registration.showNotification(
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
