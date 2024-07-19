const butInstall = document.getElementById('buttonInstall');

// Logic for installing the PWA
let deferredPrompt;

// Add an event handler to the `beforeinstallprompt` event
window.addEventListener('beforeinstallprompt', (event) => {
  // Prevent the mini-infobar from appearing on mobile
  event.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = event;
  // Update UI notify the user they can install the PWA
  butInstall.style.display = 'block';
});

// Implement a click event handler on the `butInstall` element
butInstall.addEventListener('click', async () => {
  if (!deferredPrompt) {
    return;
  }
  // Show the install prompt
  deferredPrompt.prompt();
  // Wait for the user to respond to the prompt
  const { outcome } = await deferredPrompt.userChoice;
  console.log(`User response to the install prompt: ${outcome}`);
  // We've used the prompt, and it can't be used again, so clear it
  deferredPrompt = null;
  // Hide the install button
  butInstall.style.display = 'none';
});

// Add a handler for the `appinstalled` event
window.addEventListener('appinstalled', (event) => {
  // Log install to analytics
  console.log('PWA was installed.', event);
  // Hide the install button
  butInstall.style.display = 'none';
});