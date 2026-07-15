export type ToolEntry = {
  slug: string;
  name: string;
  description: string;
  status: "live" | "soon";
};

export type ToolCategoryDef = {
  slug: string;
  name: string;
  description: string;
  tools: ToolEntry[];
};

export const toolCategories: ToolCategoryDef[] = [
  {
    slug: "daily",
    name: "Daily Use Tools",
    description: "Calculators and everyday utilities for quick tasks.",
    tools: [
      { slug: "age-calculator", name: "Age Calculator", description: "Find your exact age in years, months and days.", status: "live" },
      { slug: "percentage-calculator", name: "Percentage Calculator", description: "X% of Y, percentage increase/decrease and more.", status: "live" },
      { slug: "bmi-calculator", name: "BMI Calculator", description: "Check your Body Mass Index and category.", status: "live" },
      { slug: "tip-calculator", name: "Tip Calculator", description: "Split a bill with tip across any number of people.", status: "live" },
      { slug: "date-difference-calculator", name: "Date Difference Calculator", description: "Days, weeks, months and years between two dates.", status: "live" },
      { slug: "text-case-converter", name: "Text Case Converter", description: "UPPER, lower, Title, Sentence, camelCase & snake_case.", status: "live" },
      { slug: "password-generator", name: "Password Generator", description: "Strong random passwords with strength meter.", status: "live" },
      { slug: "unit-converter", name: "Unit Converter", description: "Length, weight, temperature and volume conversions.", status: "live" },
      { slug: "simple-compound-interest", name: "Simple & Compound Interest", description: "Compare simple vs compound interest growth.", status: "live" },
      { slug: "salary-hourly-converter", name: "Salary/Hourly Converter", description: "Convert annual or monthly salary to hourly rate.", status: "live" },
      { slug: "time-zone-converter", name: "Time Zone Converter", description: "Convert a time between two time zones.", status: "live" },
      { slug: "random-name-picker", name: "Random Name/Winner Picker", description: "Paste a list and spin to pick a random winner.", status: "live" },
      { slug: "lorem-ipsum-generator", name: "Lorem Ipsum Generator", description: "Generate placeholder text for design and dev.", status: "live" },
      { slug: "json-formatter", name: "JSON Formatter/Validator", description: "Pretty-print and validate JSON with error highlighting.", status: "live" },
      { slug: "color-palette-generator", name: "Color Palette Generator", description: "Generate complementary, analogous & triadic palettes.", status: "live" },
      { slug: "word-counter", name: "Word/Character Counter", description: "Live word, character, sentence count and reading time.", status: "live" },
      { slug: "emi-calculator", name: "EMI Calculator", description: "Monthly EMI, total interest and amortization table.", status: "live" },
      { slug: "gst-calculator", name: "GST Calculator", description: "Add/remove GST with CGST+SGST split.", status: "live" },
      { slug: "sip-calculator", name: "SIP Calculator", description: "Mutual fund SIP maturity value with growth chart.", status: "live" },
      { slug: "loan-comparison", name: "Loan Comparison Tool", description: "Compare 2-3 loan offers side by side.", status: "live" },
      { slug: "currency-converter", name: "Currency Converter", description: "Convert currency using manually entered rates.", status: "live" },
      { slug: "countdown-timer", name: "Countdown Timer", description: "Live countdown to any target date, shareable link.", status: "live" },
      { slug: "qr-generator", name: "QR Code Generator", description: "Generate a downloadable QR code from text or URL.", status: "live" },
      { slug: "barcode-generator", name: "Barcode Generator", description: "Generate CODE128/EAN-13 barcodes.", status: "live" },
    ],
  },
  {
    slug: "islamic",
    name: "Islamic Tools",
    description: "Zakat, prayer times, Hijri calendar, inheritance & more.",
    tools: [
      { slug: "hijri-converter", name: "Hijri-Gregorian Converter", description: "Two-way Islamic and Gregorian date converter.", status: "live" },
      { slug: "zakat-calculator", name: "Zakat Calculator", description: "Calculate Zakat payable on cash, gold, silver & assets.", status: "live" },
      { slug: "99-names", name: "99 Names of Allah", description: "Asma-ul-Husna with Arabic, transliteration & meaning.", status: "live" },
      { slug: "tasbih-counter", name: "Tasbih Counter", description: "Digital dhikr counter with target and reset.", status: "live" },
      { slug: "inheritance-calculator", name: "Inheritance (Mirath) Calculator", description: "Estate shares per standard Faraid rules.", status: "live" },
      { slug: "property-land-distribution", name: "Property/Land Distribution", description: "Divide land or property value among heirs per Faraid.", status: "live" },
      { slug: "prayer-times", name: "Prayer Times", description: "Today's 5 daily prayer times for your city.", status: "soon" },
      { slug: "qibla-direction", name: "Qibla Direction", description: "Find the Qibla direction from your location.", status: "soon" },
      { slug: "ramadan-calendar", name: "Ramadan Calendar", description: "Sehri/Iftar timings for the Hijri Ramadan month.", status: "soon" },
      { slug: "salah-time-reminder", name: "Salah Time Reminder", description: "Browser notifications for upcoming prayer times.", status: "soon" },
    ],
  },
  {
    slug: "misc",
    name: "Misc & Educational",
    description: "Fun, educational and everyday utility tools.",
    tools: [
      { slug: "numerology-calculator", name: "Numerology Calculator", description: "Life path & destiny number from name and DOB.", status: "live" },
      { slug: "fuel-cost-calculator", name: "Fuel Cost Calculator", description: "Trip fuel cost from distance, mileage and price.", status: "live" },
      { slug: "typing-speed-test", name: "Typing Speed Test", description: "Measure your WPM and accuracy.", status: "live" },
      { slug: "distance-calculator", name: "Distance Calculator", description: "Approximate distance between two Indian cities.", status: "live" },
      { slug: "solar-panel-savings-calculator", name: "Solar Panel Savings Calculator", description: "Estimate panel size, cost and payback period.", status: "live" },
      { slug: "baby-name-generator", name: "Baby Name Generator", description: "Religion-wise names with meaning and gender filter.", status: "soon" },
      { slug: "solar-system-explorer", name: "Solar System Explorer", description: "Interactive planets diagram with quick facts.", status: "soon" },
      { slug: "aadhaar-masking-tool", name: "Aadhaar Masking Tool", description: "Mask the first 8 digits on an Aadhaar image.", status: "soon" },
    ],
  },
  {
    slug: "pdf",
    name: "PDF Tools",
    description: "Merge, split, compress, convert and edit PDFs — free.",
    tools: [
      { slug: "merge", name: "Merge PDF", description: "Combine multiple PDFs into one file.", status: "live" },
      { slug: "split", name: "Split PDF", description: "Split a PDF by page range or every N pages.", status: "live" },
      { slug: "compress", name: "Compress PDF", description: "Reduce PDF file size.", status: "live" },
      { slug: "pdf-to-image", name: "PDF to Image", description: "Convert PDF pages to JPG/PNG.", status: "live" },
      { slug: "image-to-pdf", name: "Image to PDF", description: "Combine images into a single PDF.", status: "live" },
      { slug: "protect", name: "Protect PDF", description: "Add a password to a PDF.", status: "live" },
      { slug: "unlock", name: "Unlock PDF", description: "Remove a known password from a PDF.", status: "live" },
      { slug: "rotate", name: "Rotate PDF", description: "Rotate all or selected pages.", status: "live" },
      { slug: "delete-pages", name: "Delete Pages", description: "Remove specific pages from a PDF.", status: "live" },
      { slug: "reorder-pages", name: "Reorder Pages", description: "Drag and drop to rearrange PDF pages.", status: "live" },
      { slug: "extract-pages", name: "Extract Pages", description: "Pull a page range into a new PDF.", status: "live" },
      { slug: "extract-text", name: "Extract Text", description: "Extract all text content from a PDF.", status: "live" },
      { slug: "pdf-to-word", name: "PDF to Word", description: "Convert PDF text content to an editable .docx.", status: "live" },
      { slug: "page-numbers-add", name: "Add Page Numbers", description: "Insert page numbers with position options.", status: "live" },
      { slug: "watermark-add", name: "Add Watermark", description: "Overlay text watermark across all pages.", status: "live" },
      { slug: "compare", name: "Compare PDFs", description: "Text diff between two PDF versions.", status: "live" },
    ],
  },
  {
    slug: "image",
    name: "Image Tools",
    description: "Compress, resize, crop, convert and edit images.",
    tools: [
      { slug: "compress", name: "Compress Image", description: "Reduce image file size with a quality slider.", status: "live" },
      { slug: "resize", name: "Resize Image", description: "Resize by dimensions or percentage.", status: "live" },
      { slug: "convert", name: "Convert Format", description: "JPG, PNG, WebP and GIF conversion.", status: "live" },
      { slug: "crop", name: "Crop Image", description: "Interactive crop with aspect ratio presets.", status: "live" },
      { slug: "watermark", name: "Watermark Image", description: "Add text or logo watermark.", status: "live" },
      { slug: "to-base64", name: "Image to Base64", description: "Convert an image to a base64 string.", status: "live" },
      { slug: "rotate-flip", name: "Rotate/Flip", description: "Rotate and flip images.", status: "live" },
      { slug: "background-color-change", name: "Background Color Change", description: "Fill a solid background behind a transparent PNG.", status: "live" },
      { slug: "collage-maker", name: "Collage Maker", description: "Combine images into a grid collage.", status: "live" },
      { slug: "meme-generator", name: "Meme Generator", description: "Add top/bottom text to an image.", status: "live" },
      { slug: "color-picker", name: "Color Picker from Image", description: "Click a pixel to get its hex/RGB value.", status: "live" },
      { slug: "favicon-generator", name: "Favicon Generator", description: "Generate a full favicon set as a zip.", status: "live" },
      { slug: "image-to-pdf", name: "Image to PDF", description: "Combine images into a single PDF.", status: "live" },
      { slug: "exif-viewer-remover", name: "EXIF Viewer/Remover", description: "View and strip image metadata for privacy.", status: "live" },
      { slug: "grayscale-filter", name: "Grayscale/B&W Filter", description: "One-click grayscale, sepia and filters.", status: "live" },
      { slug: "svg-to-png", name: "SVG to PNG", description: "Rasterize an SVG to PNG at chosen resolution.", status: "live" },
    ],
  },
  {
    slug: "generators",
    name: "Generators & Documents",
    description: "CV, invoices, biodata, certificates and more — as PDF.",
    tools: [
      { slug: "cv-resume-builder", name: "CV/Resume Builder", description: "Form-based resume builder with ATS-friendly template.", status: "soon" },
      { slug: "marriage-biodata-maker", name: "Marriage Biodata Maker", description: "Indian-style matrimonial biodata PDF.", status: "soon" },
      { slug: "cover-letter-generator", name: "Cover Letter Generator", description: "Structured cover letter draft generator.", status: "soon" },
      { slug: "invoice-generator", name: "Invoice Generator", description: "Business invoice with auto-calculated totals.", status: "soon" },
      { slug: "salary-slip-generator", name: "Salary Slip Generator", description: "Payslip with earnings/deductions breakdown.", status: "soon" },
      { slug: "rent-receipt-generator", name: "Rent Receipt Generator", description: "Monthly rent receipts for HRA proof.", status: "soon" },
      { slug: "offer-letter-generator", name: "Offer Letter Generator", description: "Employee offer letter template.", status: "soon" },
      { slug: "noc-letter-generator", name: "NOC Letter Generator", description: "No-objection certificate templates.", status: "soon" },
      { slug: "certificate-maker", name: "Certificate Maker", description: "Completion/participation certificate templates.", status: "soon" },
      { slug: "id-card-maker", name: "ID Card Maker", description: "Employee/student ID card template.", status: "soon" },
      { slug: "visiting-card-maker", name: "Visiting Card Maker", description: "Business card designer, print-ready PDF.", status: "soon" },
      { slug: "letterhead-maker", name: "Letterhead Maker", description: "Company letterhead generator.", status: "soon" },
      { slug: "signature-generator", name: "Signature Generator", description: "Typed or drawn signature as a transparent PNG.", status: "soon" },
      { slug: "invitation-card-maker", name: "Invitation Card Maker", description: "Wedding/birthday/event invitation templates.", status: "soon" },
      { slug: "passport-photo-maker", name: "Passport Photo Maker", description: "Crop to passport/visa specs, printable sheet.", status: "soon" },
    ],
  },
];

export function getCategory(slug: string) {
  return toolCategories.find((c) => c.slug === slug);
}
