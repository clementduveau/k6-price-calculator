/**
 * Main application module for Virtual User Price Calculator
 * Handles UI interactions and coordinates calculations
 */

// DOM elements
const stepsContainer = document.getElementById('steps-container');
const addStepButton = document.getElementById('add-step');
const calculateButton = document.getElementById('calculate');
const resultsSection = document.getElementById('results');
const breakdownBody = document.getElementById('breakdown-body');
const totalVUhElement = document.getElementById('total-vuh');
const totalCostElement = document.getElementById('total-cost');
const totalBilledVUhElement = document.getElementById('total-billed-vuh');


// Step counter
let stepCounter = 0;

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Add event listeners
    addStepButton.addEventListener('click', addStep);
    calculateButton.addEventListener('click', calculateAndDisplay);
    
    // Initialize with one step already added
    stepCounter = 0;
});

/**
 * Add a new step to the form
 */
function addStep() {
    stepCounter++;
    
    // Set default target users and duration based on step number to create interesting scenarios
    let defaultTarget = 50;
    let defaultDuration = 10;
    
    // Create a new row for the step
    const tr = document.createElement('tr');
    tr.dataset.step = stepCounter;
    
    // Create the cells for the row
    const stepCell = document.createElement('td');
    stepCell.textContent = stepCounter;
    
    const durationCell = document.createElement('td');
    const durationInput = document.createElement('input');
    durationInput.type = 'number';
    durationInput.id = `duration-${stepCounter}`;
    durationInput.name = `duration-${stepCounter}`;
    durationInput.min = '1';
    durationInput.value = defaultDuration;
    durationInput.required = true;
    durationCell.appendChild(durationInput);
    
    const targetCell = document.createElement('td');
    const targetInput = document.createElement('input');
    targetInput.type = 'number';
    targetInput.id = `target-${stepCounter}`;
    targetInput.name = `target-${stepCounter}`;
    targetInput.min = '0';
    targetInput.value = defaultTarget;
    targetInput.required = true;
    targetCell.appendChild(targetInput);
    
    const actionsCell = document.createElement('td');
    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className = 'remove-step outline secondary';
    removeButton.dataset.step = stepCounter;
    removeButton.textContent = 'Remove';
    actionsCell.appendChild(removeButton);
    
    // Add the cells to the row
    tr.appendChild(stepCell);
    tr.appendChild(durationCell);
    tr.appendChild(targetCell);
    tr.appendChild(actionsCell);
    
    // Use this row as the step element
    const stepElement = tr;
    
    stepsContainer.appendChild(stepElement);
    
    // Add event listener to the remove button
    stepElement.querySelector('.remove-step').addEventListener('click', function() {
        removeStep(this.dataset.step);
    });
}

/**
 * Remove a step from the form
 * @param {string} stepId - The ID of the step to remove
 */
function removeStep(stepId) {
    const stepElement = document.querySelector(`tr[data-step="${stepId}"]`);
    if (stepElement) {
        stepElement.remove();
    }
}

/**
 * Collect step data from the form
 * @returns {Object} - Object containing initialUsers and steps array
 */
function collectStepData() {
    const initialUsers = parseInt(document.getElementById('initial-users').value, 10) || 10;
    const steps = [];
    
    // Get all step elements except the initial step
    const stepElements = document.querySelectorAll('tr[data-step]');
    
    stepElements.forEach(stepElement => {
        const stepId = stepElement.dataset.step;
        const duration = parseInt(document.getElementById(`duration-${stepId}`).value, 10);
        const target = parseInt(document.getElementById(`target-${stepId}`).value, 10);
        
        steps.push({ duration, target });
    });
    
    return { initialUsers, steps };
}

/**
 * Calculate and display the results
 */
function calculateAndDisplay() {
    // Collect data from the form
    const { initialUsers, steps } = collectStepData();
    
    // Calculate the load profile
    const load = calculateLoadProfile(initialUsers, steps);
    
    // Calculate price
    const priceResult = calculatePrice(Math.max(load.maxUsers, load.maxUsers * (load.profile.length / 60)));
    
    // Update the chart
    updateChart(load.profile);
    
    // Update the price breakdown
    updatePriceBreakdown(priceResult);
    
    // Show the results section
    resultsSection.classList.remove('hidden');
    
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Update the price breakdown table
 * @param {Object} priceResult - The price calculation result
 */
function updatePriceBreakdown(priceResult) {
    // Clear the table
    breakdownBody.innerHTML = '';
    
    // Add rows for each tier
    priceResult.breakdown.forEach((tier, index) => {
        const row = document.createElement('tr');
        row.className = `tier-${index + 1}`;
        
        row.innerHTML = `
            <td>${tier.tier}</td>
            <td>${tier.hours}</td>
            <td>${tier.rebate}</td>
            <td>${tier.billed}</td>
        `;
        
        breakdownBody.appendChild(row);
    });
    
    // Update total cost
    totalVUhElement.textContent = `${priceResult.vuh}`;
    totalBilledVUhElement.textContent = `${priceResult.totalBilledVUh.toFixed(2)}`;
    totalCostElement.textContent = `$${priceResult.totalCost.toFixed(2)}`;
}

/**
 * Validate the form
 * @returns {boolean} - Whether the form is valid
 */
function validateForm() {
    // Get all input elements
    const inputs = document.querySelectorAll('input[required]');
    
    // Check each input
    for (const input of inputs) {
        if (!input.value || input.value <= 0) {
            // Show error message
            input.setCustomValidity('Please enter a positive number');
            input.reportValidity();
            return false;
        } else {
            input.setCustomValidity('');
        }
    }
    
    return true;
}
