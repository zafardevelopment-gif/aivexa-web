// Coordinates + standard UTC offsets for major Indian cities and a few
// international ones. Offsets are standard time (no daylight-saving applied
// for international cities).

export type GeoCity = {
  name: string;
  country: string;
  lat: number;
  lng: number;
  /** Standard UTC offset in hours. */
  tz: number;
};

export const GEO_CITIES: GeoCity[] = [
  { name: "Delhi", country: "India", lat: 28.7041, lng: 77.1025, tz: 5.5 },
  { name: "Mumbai", country: "India", lat: 19.076, lng: 72.8777, tz: 5.5 },
  { name: "Bengaluru", country: "India", lat: 12.9716, lng: 77.5946, tz: 5.5 },
  { name: "Chennai", country: "India", lat: 13.0827, lng: 80.2707, tz: 5.5 },
  { name: "Kolkata", country: "India", lat: 22.5726, lng: 88.3639, tz: 5.5 },
  { name: "Hyderabad", country: "India", lat: 17.385, lng: 78.4867, tz: 5.5 },
  { name: "Pune", country: "India", lat: 18.5204, lng: 73.8567, tz: 5.5 },
  { name: "Ahmedabad", country: "India", lat: 23.0225, lng: 72.5714, tz: 5.5 },
  { name: "Jaipur", country: "India", lat: 26.9124, lng: 75.7873, tz: 5.5 },
  { name: "Lucknow", country: "India", lat: 26.8467, lng: 80.9462, tz: 5.5 },
  { name: "Patna", country: "India", lat: 25.5941, lng: 85.1376, tz: 5.5 },
  { name: "Bhopal", country: "India", lat: 23.2599, lng: 77.4126, tz: 5.5 },
  { name: "Chandigarh", country: "India", lat: 30.7333, lng: 76.7794, tz: 5.5 },
  { name: "Surat", country: "India", lat: 21.1702, lng: 72.8311, tz: 5.5 },
  { name: "Kanpur", country: "India", lat: 26.4499, lng: 80.3319, tz: 5.5 },
  { name: "Nagpur", country: "India", lat: 21.1458, lng: 79.0882, tz: 5.5 },
  { name: "Indore", country: "India", lat: 22.7196, lng: 75.8577, tz: 5.5 },
  { name: "Varanasi", country: "India", lat: 25.3176, lng: 82.9739, tz: 5.5 },
  { name: "Amritsar", country: "India", lat: 31.634, lng: 74.8723, tz: 5.5 },
  { name: "Ranchi", country: "India", lat: 23.3441, lng: 85.3096, tz: 5.5 },
  { name: "Guwahati", country: "India", lat: 26.1445, lng: 91.7362, tz: 5.5 },
  { name: "Bhubaneswar", country: "India", lat: 20.2961, lng: 85.8245, tz: 5.5 },
  { name: "Thiruvananthapuram", country: "India", lat: 8.5241, lng: 76.9366, tz: 5.5 },
  { name: "Kochi", country: "India", lat: 9.9312, lng: 76.2673, tz: 5.5 },
  { name: "Coimbatore", country: "India", lat: 11.0168, lng: 76.9558, tz: 5.5 },
  { name: "Madurai", country: "India", lat: 9.9252, lng: 78.1198, tz: 5.5 },
  { name: "Visakhapatnam", country: "India", lat: 17.6868, lng: 83.2185, tz: 5.5 },
  { name: "Vijayawada", country: "India", lat: 16.5062, lng: 80.648, tz: 5.5 },
  { name: "Nashik", country: "India", lat: 19.9975, lng: 73.7898, tz: 5.5 },
  { name: "Rajkot", country: "India", lat: 22.3039, lng: 70.8022, tz: 5.5 },
  { name: "Vadodara", country: "India", lat: 22.3072, lng: 73.1812, tz: 5.5 },
  { name: "Agra", country: "India", lat: 27.1767, lng: 78.0081, tz: 5.5 },
  { name: "Meerut", country: "India", lat: 28.9845, lng: 77.7064, tz: 5.5 },
  { name: "Gurugram", country: "India", lat: 28.4595, lng: 77.0266, tz: 5.5 },
  { name: "Ludhiana", country: "India", lat: 30.901, lng: 75.8573, tz: 5.5 },
  { name: "Jodhpur", country: "India", lat: 26.2389, lng: 73.0243, tz: 5.5 },
  { name: "Raipur", country: "India", lat: 21.2514, lng: 81.6296, tz: 5.5 },
  { name: "Dehradun", country: "India", lat: 30.3165, lng: 78.0322, tz: 5.5 },
  { name: "Srinagar", country: "India", lat: 34.0837, lng: 74.7973, tz: 5.5 },
  { name: "Jammu", country: "India", lat: 32.7266, lng: 74.857, tz: 5.5 },
  { name: "Aligarh", country: "India", lat: 27.8974, lng: 78.088, tz: 5.5 },
  { name: "Hyderabad (Old City)", country: "India", lat: 17.3616, lng: 78.4747, tz: 5.5 },
  { name: "Malappuram", country: "India", lat: 11.041, lng: 76.0819, tz: 5.5 },
  { name: "Mecca (Makkah)", country: "Saudi Arabia", lat: 21.4225, lng: 39.8262, tz: 3 },
  { name: "Medina (Madinah)", country: "Saudi Arabia", lat: 24.4672, lng: 39.6111, tz: 3 },
  { name: "Dubai", country: "UAE", lat: 25.2048, lng: 55.2708, tz: 4 },
  { name: "London", country: "UK", lat: 51.5074, lng: -0.1278, tz: 0 },
  { name: "New York", country: "USA", lat: 40.7128, lng: -74.006, tz: -5 },
  { name: "Karachi", country: "Pakistan", lat: 24.8607, lng: 67.0011, tz: 5 },
  { name: "Dhaka", country: "Bangladesh", lat: 23.8103, lng: 90.4125, tz: 6 },
];

export function findGeoCity(name: string): GeoCity | undefined {
  return GEO_CITIES.find((c) => c.name === name);
}

/** The device's current UTC offset in hours (e.g. 5.5 for IST). */
export function deviceTzHours(): number {
  return -new Date().getTimezoneOffset() / 60;
}
