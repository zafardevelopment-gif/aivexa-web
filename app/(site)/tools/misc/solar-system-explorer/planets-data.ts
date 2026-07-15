export type Planet = {
  name: string;
  color: string;
  relSize: number; // relative visual size (log-scaled, arbitrary units)
  distanceFromSunKm: string;
  distanceAu: string;
  diameterKm: string;
  dayLength: string;
  yearLength: string;
  moons: number;
  facts: string[];
};

export const SUN = {
  name: "Sun",
  color: "linear-gradient(135deg,#fde68a,#f59e0b)",
  facts: [
    "The Sun contains 99.8% of the mass of the entire solar system.",
    "Light from the Sun takes about 8 minutes 20 seconds to reach Earth.",
    "The Sun's core temperature is around 15 million °C.",
  ],
};

export const PLANETS: Planet[] = [
  {
    name: "Mercury",
    color: "#9ca3af",
    relSize: 14,
    distanceFromSunKm: "57.9 million km",
    distanceAu: "0.39 AU",
    diameterKm: "4,879 km",
    dayLength: "59 Earth days",
    yearLength: "88 Earth days",
    moons: 0,
    facts: [
      "Smallest planet in the solar system.",
      "Has almost no atmosphere, so temperatures swing from -180°C to 430°C.",
      "A year on Mercury is shorter than a day on Venus.",
    ],
  },
  {
    name: "Venus",
    color: "#f5d0a9",
    relSize: 20,
    distanceFromSunKm: "108.2 million km",
    distanceAu: "0.72 AU",
    diameterKm: "12,104 km",
    dayLength: "243 Earth days",
    yearLength: "225 Earth days",
    moons: 0,
    facts: [
      "Hottest planet due to a thick CO2 atmosphere trapping heat.",
      "Rotates backwards compared to most planets.",
      "Its day is longer than its year.",
    ],
  },
  {
    name: "Earth",
    color: "#3b82f6",
    relSize: 21,
    distanceFromSunKm: "149.6 million km",
    distanceAu: "1 AU",
    diameterKm: "12,742 km",
    dayLength: "24 hours",
    yearLength: "365.25 days",
    moons: 1,
    facts: [
      "The only known planet with life.",
      "71% of Earth's surface is covered by water.",
      "Has one natural satellite: the Moon.",
    ],
  },
  {
    name: "Mars",
    color: "#dc6b4f",
    relSize: 16,
    distanceFromSunKm: "227.9 million km",
    distanceAu: "1.52 AU",
    diameterKm: "6,779 km",
    dayLength: "24h 37m",
    yearLength: "687 Earth days",
    moons: 2,
    facts: [
      "Known as the Red Planet due to iron oxide (rust) on its surface.",
      "Home to Olympus Mons, the largest volcano in the solar system.",
      "Has two small moons: Phobos and Deimos.",
    ],
  },
  {
    name: "Jupiter",
    color: "#d9a066",
    relSize: 42,
    distanceFromSunKm: "778.5 million km",
    distanceAu: "5.2 AU",
    diameterKm: "139,820 km",
    dayLength: "9h 56m",
    yearLength: "12 Earth years",
    moons: 95,
    facts: [
      "Largest planet in the solar system — a gas giant.",
      "The Great Red Spot is a giant storm larger than Earth.",
      "Has the most known moons of any planet.",
    ],
  },
  {
    name: "Saturn",
    color: "#e8d5a3",
    relSize: 38,
    distanceFromSunKm: "1.43 billion km",
    distanceAu: "9.58 AU",
    diameterKm: "116,460 km",
    dayLength: "10h 42m",
    yearLength: "29.5 Earth years",
    moons: 146,
    facts: [
      "Famous for its spectacular ring system made of ice and rock.",
      "Is the least dense planet — it would float in water.",
      "Titan, its largest moon, has lakes of liquid methane.",
    ],
  },
  {
    name: "Uranus",
    color: "#a7e0e0",
    relSize: 28,
    distanceFromSunKm: "2.87 billion km",
    distanceAu: "19.2 AU",
    diameterKm: "50,724 km",
    dayLength: "17h 14m",
    yearLength: "84 Earth years",
    moons: 27,
    facts: [
      "Rotates on its side, with an axial tilt of about 98°.",
      "An ice giant made mostly of water, ammonia and methane.",
      "Has faint rings, discovered in 1977.",
    ],
  },
  {
    name: "Neptune",
    color: "#5680e9",
    relSize: 27,
    distanceFromSunKm: "4.5 billion km",
    distanceAu: "30.1 AU",
    diameterKm: "49,244 km",
    dayLength: "16h 6m",
    yearLength: "165 Earth years",
    moons: 14,
    facts: [
      "Windiest planet, with storms reaching up to 2,100 km/h.",
      "Farthest known planet from the Sun.",
      "Was the first planet located through mathematical prediction rather than direct observation.",
    ],
  },
];
