browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log('Hello from the background')
})

chrome.storage.sync.get({
  q_note_data: []
}, function (items) {
  console.log(items)
});