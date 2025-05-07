/**
 * Calculator module for Virtual User Price Calculator
 * Handles the calculation of load profiles and pricing
 */

// Pricing tiers (in USD)
const BASE_PRICE = 0.15; // Base price per VUh
const DISCOUNT = [
    { name: 'Tier 1 (0-100 VUh)', min: 0, max: 100, rate: 1 },
    { name: 'Tier 2 (101-500 VUh)', min: 100, max: 500, rate: 0.8 },
    { name: 'Tier 3 (501-1,000 VUh)', min: 500, max: 1000, rate: 0.5333 },
    { name: 'Tier 4 (1,001-5,000 VUh)', min: 1000, max: 5000, rate: 0.3333 },
    { name: 'Tier 5 (5,001-10,000 VUh)', min: 5000, max: 10000, rate: 0.2667 },
    { name: 'Tier 6 (10,001+ VUh)', min: 10000, max: Number.MAX_VALUE, rate: 0.2 }
];

/**
 * Calculate the complete load profile based on the steps
 * @param {number} initialUsers - The initial number of users
 * @param {Array} steps - Array of step objects with duration and target
 * @returns {Object} - Array of minute-by-minute user counts, max VUs, and total duration
 */
function calculateLoadProfile(initialUsers, steps) {
    const profile = [];
    let currentUsers = initialUsers;
    let maxUsers = initialUsers;

    // Add initial users at minute 0
    profile.push({ minute: 0, users: currentUsers });

    let currentMinute = 0;

    // Process each step
    steps.forEach(step => {
        const { duration, target } = step;
        if (target > maxUsers) {
            maxUsers = target; // Update max users if target is higher
        }

        // Calculate user change per minute for ramp steps
        const userChangePerMinute = (target - currentUsers) / duration;
        const startingUsers = currentUsers;

        // Add each minute in this step to the profile
        for (let i = 1; i <= duration; i++) {
            currentMinute++;

            // For ramp steps, calculate the new user count
            if (target !== currentUsers) {
                // For last minute use the exact target value
                if (i === duration) {
                    currentUsers = target; // No rounding error here
                } else {
                    // For other minutes, use the per-minute change
                    currentUsers = Math.round(startingUsers + (userChangePerMinute * i));
                }
            }

            profile.push({ minute: currentMinute, users: currentUsers });
        }

        // Update current users for the next step
        currentUsers = target;
    });

    let totalDuration = 0;
    steps.forEach(step => {
        totalDuration += step.duration;
    });

    return{
        profile,
        maxUsers,
        totalDuration
    };
}

/**
 * Calculate price based on Virtual User Hours and tiered pricing
 * @param {number} vu - Virtual User
 * @param {number} duration - Duration in minutes
 * @returns {Object} - Breakdown of costs by tier, total VUh, total billed VUh & total cost
 */
function calculatePrice(vu, duration) {
    const breakdown = [];
    let totalBilledVUh = 0;

    vuh = Math.max(1, (vu * duration) / 60); // Convert to VUh (Virtual User Hours) with a minimum of 1 VUh
    
    DISCOUNT.forEach(tier => {
        if (vuh > tier.max) {
            const tierHours = tier.max - tier.min;
            const tierBilled = tierHours * tier.rate;
            breakdown.push({
                tier: `${tier.name}`,
                hours: tierHours.toFixed(0),
                rebate: `${((1 - tier.rate)*100).toFixed(2)}%`,
                billed: tierBilled.toFixed(2)
            });
            totalBilledVUh += tierBilled;
        }
        else if (vuh > tier.min) {
            const tierHours = vuh - tier.min;
            const tierBilled = tierHours * tier.rate;
            breakdown.push({
                tier: `${tier.name}`,
                hours: tierHours.toFixed(2),
                rebate: `${((1 - tier.rate)*100).toFixed(2)}%`,
                billed: tierBilled.toFixed(2)
            });
            totalBilledVUh += tierBilled;
        }
    });
    
    let totalCost = totalBilledVUh * BASE_PRICE;
    
    return {
        breakdown,
        vuh,
        totalBilledVUh,
        totalCost
    };
}
