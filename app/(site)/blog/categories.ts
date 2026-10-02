/** Category → pill class (see blog.css). */
const MAP: Record<string, string> = {
  "Health & Nutrition": "bl-cat-health",
  Business: "bl-cat-business",
  "Free Tools": "bl-cat-tools",
  "Healthcare AI": "bl-cat-healthcare",
  "WhatsApp Automation": "bl-cat-whatsapp",
  "AI Products": "bl-cat-ai",
  "Islamic Tools": "bl-cat-islamic",
};

export const catClass = (category: string) => `bl-cat ${MAP[category] ?? ""}`.trim();
