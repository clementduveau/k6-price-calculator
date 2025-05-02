# Virtual User Price Calculator

A GitHub Pages application that calculates pricing based on virtual user hours (VUh) with tiered pricing. This calculator allows users to define multiple load steps and visualizes the load profile along with a detailed cost breakdown.

## Features

- Define multiple load steps with different durations and target user counts
- Support for both steady and ramp-up/down load patterns
- Visual representation of the load profile using Chart.js
- Detailed price breakdown with tiered pricing:
- Responsive design using PicoCSS

## Technical Details

The form is built using:
- PicoCSS framework
- JavaScript (vanilla)
- Chart.js for visualizations

### Calculation Method

1. The load profile is calculated minute-by-minute based on the defined steps. Number of users are rounded.
2. Virtual User Hours (VUh) are calculated by summing the user-minutes and dividing by 60, rounded up.
3. Tiered pricing is applied to the total VUh.

## Deployment to GitHub Pages

To deploy this calculator to GitHub Pages:

1. Push the code to a GitHub repository
2. Go to the repository settings
3. Navigate to the "Pages" section
4. Select the branch you want to deploy (usually `main` or `master`)
5. Save the settings

The site will be available at `https://[your-username].github.io/[repository-name]/`

## Local Development

To run this project locally, simply open the `index.html` file in a web browser. No build process or server is required.
