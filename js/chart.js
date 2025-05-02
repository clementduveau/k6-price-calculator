/**
 * Chart module for Virtual User Price Calculator
 * Handles the visualization of load profiles using Chart.js
 */

let loadChart = null;

/**
 * Initialize the load profile chart
 */
function initializeChart() {
    const ctx = document.getElementById('load-chart').getContext('2d');
    
    // Create the chart
    loadChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Virtual Users',
                data: [],
                borderColor: 'rgb(51, 102, 204)',
                backgroundColor: 'rgba(51, 102, 204, 0.1)',
                borderWidth: 2,
                tension: 0.1,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time (minutes)'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Virtual Users'
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.parsed.y} users at ${context.parsed.x} minutes`;
                        }
                    }
                }
            }
        }
    });
}

/**
 * Update the chart with new load profile data
 * @param {Array} profile - The load profile data
 */
function updateChart(profile) {
    if (!loadChart) {
        initializeChart();
    }
    
    // Extract minutes and user counts from the profile
    const minutes = profile.map(point => point.minute);
    const users = profile.map(point => point.users);
    
    // Update chart data
    loadChart.data.labels = minutes;
    loadChart.data.datasets[0].data = users;
    
    // Add step transition markers
    const stepTransitions = [];
    let prevUsers = profile[0].users;
    
    for (let i = 1; i < profile.length; i++) {
        if (profile[i].users !== prevUsers) {
            stepTransitions.push(i);
            prevUsers = profile[i].users;
        }
    }
    
    // Update chart
    loadChart.update();
}

/**
 * Clear the chart
 */
function clearChart() {
    if (loadChart) {
        loadChart.data.labels = [];
        loadChart.data.datasets[0].data = [];
        loadChart.update();
    }
}
