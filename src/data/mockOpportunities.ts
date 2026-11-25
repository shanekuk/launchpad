import type { Opportunity } from "../types";

export const mockOpportunities: Opportunity[] = [
  {
    id: "1",
    organization: "Los Angeles Regional Food Bank",
    description: "Sort, pack, and prepare food",
    link: "https://www.lafoodbank.org",
    areas_of_interest: "Food Security, Hunger Relief",
    lat: 34.0094,
    lng: -118.237,
  },
  {
    id: "2",
    organization: "Heal the Bay",
    description: "Collect litter",
    link: "https://healthebay.org",
    areas_of_interest: "Environment, Outdoors",
    lat: 34.0092,
    lng: -118.4976,
  },
  {
    id: "3",
    organization: "826LA",
    description: "Help kids with writing and homework",
    link: "https://www.826la.org",
    areas_of_interest: "Education, Youth",
    lat: 34.0779,
    lng: -118.2606,
  },
];
