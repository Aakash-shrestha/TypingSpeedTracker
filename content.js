let lastTime = 0;
let words = 0;

let finalSpeed = 0;
let iterations = 0;
let SpeedArray = [];
let temp = 0;

//please improve everything
let cleared = false;

console.log("Content script is running!");
console.log("✅ content.js is running on", window.location.href);


// listen and handle clear message from bg
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "clear") {
    cleared = true;
    sendResponse({ status: 'success', message: 'response from content' });
  }
});

let calculatedTypingSpeed = () => {
  iterations++;
  const speed = words / 0.00833;



  // Calculate average of current speed and new speed
  finalSpeed += speed;

  // reset if cleared
  if (cleared) {
    iterations = 1;
    finalSpeed = 0;
    cleared = false;
  }

  // send the typing speed to be handled by background
  chrome.runtime.sendMessage({
    type: "contentToPopup",
    data: {
      finSpeed: (finalSpeed / iterations).toFixed(0),
    },

  });
  // reset for next calculations
  words = 0;
};


//throttle function to execute every 500 milisecond
function throttle(func, delay) {
  let lastCall = 0;

  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
}
const throttleCalculate = throttle(calculatedTypingSpeed, 500);

// handle when user presses 'Enter' / page reloads
window.addEventListener("beforeunload", (event) => {
  chrome.runtime.sendMessage({ type: 'openPopup' });
});

document.addEventListener("input", (event) => {
  console.log("running on current input field");
  // run only on valid input fields
  if (event.target.matches("input[type='text'], textarea") || event.target.isContentEditable) {

    console.log("input event detected on a valid field");
    // logic to detect space pressed
    if (event.data && event.data.length) {
      // increment words typed if space encountered
      if (event.data === " ") {
        words++;
      }
    }

    throttleCalculate();
  }
});


// document.addEventListener("keydown", (event) => {
//   if (
//     (event.target.matches("input[type='text'], textarea") || event.target.isContentEditable) &&
//     event.key === "Enter"
//   ) {

//     chrome.runtime.sendMessage({ type: 'openPopup' });
//     words = 0;
//   }
// });
