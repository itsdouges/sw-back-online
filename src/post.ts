export const post = (url: string, body: any) => {
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    navigator.serviceWorker.ready
      .then(function(reg) {
        return reg.sync.register('tag-name');
      })
      .catch(function() {
        // system was unable to register for a sync,
        // this could be an OS-level restriction
        postDataFromThePage();
      });
  } else {
    // serviceworker/sync not supported
    postDataFromThePage();
  }
};
