const destinationWelcomeMessages: Record<string, string> = {
  bangkok: "Welcome to Bangkok",
  "cape town": "Welcome to Cape Town",
  nairobi: "Welcome to Nairobi",
  london: "Welcome to London",
  "new york": "Welcome to New York",
  dubai: "Welcome to Dubai",
};

export function getDestinationWelcomeMessage(city?: string | null): string {
  if (!city) {
    return "Welcome to your destination";
  }

  return destinationWelcomeMessages[city.trim().toLowerCase()] || `Welcome to ${city}`;
}
