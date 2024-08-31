// Saves options to storage
const saveOptions = () => {
  // Enabled Option Checkbox value
  const enabled = document.querySelector('#enable-extension').checked;
  // Set Storage value for option
  chrome.storage.sync.set(
    { enabled: enabled },
    () => {
      // Status div that indicates the options are saved
      const status = document.querySelector('#status');
      // Update status text, adds a refresh reminder if enabled is true
      status.textContent = !enabled ? 'Options saved' : 'Please Refresh Tab to View With NoLogin';
      // Hide the status update after 1-2 seconds
      setTimeout(() => {
        status.textContent = '';
      }, !enabled ? 1000 : 2000);
    }
  );
};

// Restores options from storage
const restoreOptions = async () => {
  // Gets options from storage, defaults to true
  return chrome.storage.sync.get(
    { enabled: true },
    (options) => {
      // Update options checkbox indicating if the extension is enabled
      document.querySelector('#enable-extension').checked = options.enabled;
    }
  );
};

document.addEventListener('DOMContentLoaded', () => {
  // On page load restore options
  restoreOptions()
    // Add an event listener to update options to the checkbox
    .then(() => document.querySelector('#enable-extension').addEventListener('change', (event) => {
      saveOptions();
    }));
  // Add event listener to display the options page
  document.querySelector('#show-options').addEventListener('click', (event) => {
    chrome.runtime.openOptionsPage();
  });
});
