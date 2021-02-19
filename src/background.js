// browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   console.log('Hello from the background')
// })
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    // 给 sender 发送响应消息
    // sendResponse(responseMessage);
    return true;
});