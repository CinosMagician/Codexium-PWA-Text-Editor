import { Workbox } from 'workbox-window';
import Editor from './editor';
import { getDb, putDb } from './database'; // Import getDb and putDb from database.js
import '../css/style.css'; // Import CSS styles

const main = document.querySelector('#main');
main.innerHTML = '';

const loadSpinner = () => {
  const spinner = document.createElement('div');
  spinner.classList.add('spinner');
  spinner.innerHTML = `
    <div class="loading-container">
      <div class="loading-spinner"></div>
    </div>
  `;
  main.appendChild(spinner);
};

// Display spinner while editor is loading
loadSpinner();

// Initialize editor after DOM is fully loaded
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const editor = new Editor(); // Initialize the editor

    // Get data from IndexedDB and initialize editor with the retrieved data
    const data = await getDb();

    // Remove the loading spinner    
    main.querySelector('.loading-container').remove(); 
    
    if (data) {
      // Set editor content from IndexedDB
      editor.editor.setValue(data); 
    }

    // Save editor content to IndexedDB when it loses focus
    editor.editor.on('blur', () => {
      const content = editor.editor.getValue();
      putDb(content);
    });

    // Check if service workers are supported
    if ('serviceWorker' in navigator) {
      try {
        const workboxSW = new Workbox('/service-worker.js'); // Adjust path to your service worker file
        await workboxSW.register(); // Register the service worker
        console.log('Service worker registered successfully');
      } catch (error) {
        console.error('Error registering service worker:', error);
      }
    } else {
      console.error('Service workers are not supported in this browser.');
    }
  } catch (error) {
    console.error('Error initializing Editor:', error);
  }
});