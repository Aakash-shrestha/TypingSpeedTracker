console.log("popup.js is running!");
let speedArr = [];


function requestData() {
    chrome.runtime.sendMessage({ type: 'requestData' }, (response) => {
        // Update typing speed when updated data is received
        if (response && response.data) {
            document.getElementById('typingSpeed').innerHTML = response.data.currentSpeed;
            speedArr = [...(response.data.SpeedArray)];
            createChart();

        }
    }
    );
}
// Send requests to background for updated data
requestData();

// handle clear button press
document.getElementById("clear-btn").addEventListener("click", () => {
    
    clearSpeed();   
})

function clearSpeed(){
    chrome.runtime.sendMessage({ type: 'clearData' }, (response) => {

    });
    document.getElementById('typingSpeed').innerHTML = "0";
    
    // clear chart when user presses clear button
    speedArr = [];
    createChart();
}

// handle theme change press
let circle = document.getElementsByClassName("circle");
let toggle_btn = document.querySelector(".toggle-btn");
let body = document.querySelector(".main");

// check local storage for dark mode status
chrome.storage.local.get(["darkMode"], (result) => {
    // If darkMode is true OR not set (undefined), default to dark mode
    if (result.darkMode === undefined || result.darkMode === true) {
        document.body.classList.add("darkmode");
        circle[0].classList.add('dark-circle');
        // Save default setting to storage so it persists
        chrome.storage.local.set({ darkMode: true });
    }
});


toggle_btn.addEventListener("click", () => {
    const isDarkMode = body.classList.toggle("darkmode");
    circle[0].classList.toggle("dark-circle");

    // set the darkmode status to local storage
    chrome.storage.local.set({ darkMode: isDarkMode });
})


//Create a chart of wpm overtime
function createChart() {

    const ctx = document.getElementById('SpeedLineChart').getContext('2d');
    const count = speedArr.length;
    // clear data if array is too large
    if (count > 17) {
        speedArr = [];
        clearSpeed();
    }
    console.log("Count of speed array: ", count);
    let xlabel = [];
    for (let i = 1; i <= count; i++) {
        xlabel.push(i * 0.5);
    }


    new Chart(ctx, {
        type: 'line',
        data: {
            labels: xlabel,
            datasets: [{
                label: 'Typing Speed (WPM)',
                data: speedArr,
                fill: false,
                borderColor: 'rgb(134, 190, 190)',
                tension: 0.3,
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    
                    title: {
                        display: true,
                        text: 'Time (s)'
                    },
                },
                y: {
                    
                    beginAtZero: true,
                    min: 0,

                }
            },
            plugins: {
                legend: {
                    display: false,
                    position: 'top',
                    labels: {
                        color: '#ffffff'
                    }
                },
                tooltip: {
                    enabled: true
                }
            }
        }

    });
}

