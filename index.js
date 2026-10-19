// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="

// Your code here!


const stateInput = document.getElementById("state-input");
const fetchButton = document.getElementById("fetch-alerts");
const alertsDisplay = document.getElementById("alerts-display");
const errorMessage = document.getElementById("error-message");

async function fetchWeatherData(state) {
  const stateCode = state.trim().toUpperCase();

  if (!stateCode) {
    throw new Error("Please enter a state abbreviation.");
  }

  if (!/^[A-Z]{2}$/.test(stateCode)) {
    throw new Error("Enter a valid two-letter US state abbreviation.");
  }

  const response = await fetch(
    `https://api.weather.gov/alerts/active?area=${stateCode}`
  );

  if (!response.ok) {
    throw new Error("Unable to retrieve weather alerts. Please try again.");
  }

  return await response.json();
}

function displayWeather(data) {
  alertsDisplay.innerHTML = "";

  const alerts = data.features || [];

  const heading = document.createElement("h2");
  heading.textContent = `Weather Alerts: ${alerts.length}`;
  alertsDisplay.appendChild(heading);

  alerts.forEach((alert) => {
    const article = document.createElement("article");
    const alertHeading = document.createElement("h3");
    const description = document.createElement("p");

    alertHeading.textContent =
      alert.properties?.headline ||
      alert.properties?.event ||
      "Weather alert";

    description.textContent =
      alert.properties?.description ||
      "No additional details available.";

    article.appendChild(alertHeading);
    article.appendChild(description);
    alertsDisplay.appendChild(article);
  });

  if (alerts.length === 0) {
    const message = document.createElement("p");
    message.textContent = "No active weather alerts found for this state.";
    alertsDisplay.appendChild(message);
  }
}

function displayError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove("hidden");
}

function clearError() {
  errorMessage.textContent = "";
  errorMessage.classList.add("hidden");
}

fetchButton.addEventListener("click", async () => {
  clearError();
  alertsDisplay.innerHTML = "";

  const state = stateInput.value;
  stateInput.value = "";

  try {
    const data = await fetchWeatherData(state);
    displayWeather(data);
  } catch (error) {
    displayError(error.message || "Something went wrong. Please try again.");
  }
});
