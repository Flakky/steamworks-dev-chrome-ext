importScripts('../data/defaultsettings.js');

chrome.runtime.onInstalled.addListener(async () => {
  chrome.storage.local.get(Object.keys(defaultSettings), (storedSettings) => {
    const settingsToStore = {};

    for (const key in defaultSettings) {
      if (storedSettings[key] === undefined) {
        settingsToStore[key] = defaultSettings[key];
      }
    }

    if (Object.keys(settingsToStore).length > 0) {
      chrome.storage.local.set(settingsToStore, () => {
        console.log('Steamworks extras: Default settings have been initialized.');
      });
    }
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(`Steamworks extras: Background message: ${message.request}`)
  switch (message.request) {
    case "showOptions": showOptions(); return true;
    case "makeRequest": (async () => {
      const response = await makeRequest(message.url, message.params)
      console.log('RESP')
      sendResponse(response);
    })(); return true;
  }

  return false;
});

const showOptions = () => {
  console.log('Steamworks extras: Show options')
  chrome.runtime.openOptionsPage();
}

const makeRequest = async (url, params) => {
  console.log(`Make request message`);

  const response = await fetch(url, params);
  if (!response.ok) throw new Error('Network response was not ok');

  console.log(response);

  const responseText = await response.text();

  console.log(responseText);

  return responseText;
}

console.log("Steamworks extras: Extension service initiated");
