/**
 * Per-tool SEO content overrides. Keyed by "category/slug".
 * When present, ToolSeoContent renders these unique intro paragraphs and
 * tool-specific FAQs (merged before the generic ones) instead of only the
 * auto-generated copy — giving each page unique, keyword-rich indexable text.
 */

export type ToolSeoOverride = {
  intro: string[]; // plain-text paragraphs
  faqs: { q: string; a: string }[];
};

export const toolSeoOverrides: Record<string, ToolSeoOverride> = {
  "misc/youtube-tag-generator": {
    intro: [
      "The YouTube Tag Generator helps creators find SEO-optimized tags for their videos in seconds. Instead of guessing keywords, it pulls suggestions from real YouTube search data — the same phrases people actually type into the YouTube search bar — so your tags reflect genuine search demand in your region.",
      "Enter your video topic, pick a country (India, US, UK and more), and get up to 45 relevant tags. Click any tag to include or exclude it, watch the live 500-character counter (YouTube's tag limit), and copy everything in one click — ready to paste into YouTube Studio.",
    ],
    faqs: [
      {
        q: "How many tags should a YouTube video have?",
        a: "YouTube allows up to 500 characters of tags. Most SEO experts recommend 15–30 focused tags: your main keyword first, followed by close variations and related phrases. Quality and relevance matter more than quantity.",
      },
      {
        q: "Do YouTube tags still matter for ranking in 2026?",
        a: "Tags are a minor ranking factor compared to title, description and watch time, but they still help YouTube understand your content, correct for common misspellings, and surface your video in Suggested. They cost nothing to add, so it's worth filling them properly.",
      },
      {
        q: "Where do the generated tags come from?",
        a: "Tags are built from live YouTube search autocomplete suggestions for your keyword and its variations (how-to, best, tutorial, beginner etc.), so they reflect what viewers are actually searching for right now.",
      },
    ],
  },

  "daily/hra-calculator": {
    intro: [
      "The HRA Calculator computes your House Rent Allowance exemption under Section 10(13A) of the Income Tax Act. HRA exemption is the least of three amounts: actual HRA received, rent paid minus 10% of basic salary (plus DA), and 50% of basic for metro cities or 40% for non-metro cities.",
      "Enter your basic salary, HRA received and monthly rent to instantly see how much of your HRA is tax-exempt and how much is taxable. Salaried employees claiming HRA also need rent receipts as proof — you can generate those free with our Rent Receipt Generator.",
    ],
    faqs: [
      {
        q: "Can I claim HRA in the new tax regime?",
        a: "No. HRA exemption under Section 10(13A) is available only in the old tax regime. If you opt for the new regime, HRA received is fully taxable — compare both regimes before choosing.",
      },
      {
        q: "Which cities count as metro for HRA?",
        a: "Only Delhi, Mumbai, Kolkata and Chennai are treated as metro cities (50% of basic). All other cities, including Bengaluru, Hyderabad and Pune, use the 40% limit.",
      },
      {
        q: "Do I need my landlord's PAN to claim HRA?",
        a: "Yes, if your annual rent exceeds ₹1,00,000 you must provide your landlord's PAN to your employer. Rent receipts are typically required as proof for any HRA claim.",
      },
    ],
  },

  "daily/salary-structure-optimizer": {
    intro: [
      "The Salary Structure Optimizer converts your annual CTC into a complete salary breakup — Basic, HRA, special allowance, employer PF contribution and gratuity provision — and then estimates your income tax under both the old and new regimes for FY 2025-26, so you can see which regime leaves more money in hand.",
      "Adjust the Basic-salary percentage to see how it affects HRA (and therefore tax under the old regime), and get an approximate monthly in-hand figure after tax and PF. Useful when evaluating a job offer, negotiating CTC or planning your tax declaration.",
    ],
    faqs: [
      {
        q: "Old vs new tax regime — which is better?",
        a: "It depends on your deductions. The new regime has lower slab rates and a ₹75,000 standard deduction with rebate up to ₹12 lakh income, but no HRA/80C benefits. If your combined deductions (HRA, 80C, 80D, home-loan interest) are large, the old regime can still win. This tool compares both instantly.",
      },
      {
        q: "What percentage of CTC should Basic salary be?",
        a: "Most Indian companies keep Basic at 40–50% of CTC. A higher Basic increases HRA, PF and gratuity but reduces flexible allowances; a lower Basic does the opposite. You can adjust the percentage in this tool to see the effect.",
      },
      {
        q: "Why is my in-hand salary less than CTC ÷ 12?",
        a: "CTC includes employer-side costs (employer PF, gratuity provision, sometimes insurance) that never reach your bank account, plus income tax and employee PF are deducted from gross pay. This tool shows the approximate real monthly in-hand.",
      },
    ],
  },

  "misc/rental-roi-calculator": {
    intro: [
      "The Rental ROI Calculator tells you whether a property is a good rental investment. It computes gross rental yield (annual rent ÷ total cost), net yield after maintenance, property tax and vacancy periods, total ROI including expected appreciation, and the payback period from rent alone.",
      "In India, residential properties typically earn a net yield of 2–4%, while commercial properties earn 6–9%. Comparing a property's net yield against these benchmarks — and against FD or index-fund returns — helps you make an informed buy/skip decision.",
    ],
    faqs: [
      {
        q: "What is a good rental yield in India?",
        a: "Residential yields of 3%+ (net) are considered decent in most Indian cities; commercial yields of 6–9% are typical. Yields vary widely by city and locality — Bengaluru and Hyderabad often out-yield Mumbai and Delhi on residential.",
      },
      {
        q: "What is the difference between gross and net rental yield?",
        a: "Gross yield is annual rent divided by property cost. Net yield subtracts real costs first — maintenance, property tax, vacancy months, repairs — giving a much more honest picture of your return.",
      },
      {
        q: "Should I include registration and interior costs?",
        a: "Yes. Stamp duty, registration, brokerage and interiors can add 8–15% to the purchase price. Ignoring them overstates your yield, which is why this calculator has a separate field for them.",
      },
    ],
  },

  "misc/society-maintenance-calculator": {
    intro: [
      "The Society Maintenance Split Calculator divides a housing society's monthly expenses across all flats using the two methods Indian societies commonly follow: equal division per flat, or per-square-foot division based on carpet/built-up area (larger flats pay proportionally more).",
      "Enter the total monthly expense, choose the split method, and — for area-based splits — add your flat types (1 BHK, 2 BHK, 3 BHK with their areas and counts). You get the per-sq.ft rate and each flat type's monthly share, with a copyable summary for your society WhatsApp group or notice board.",
    ],
    faqs: [
      {
        q: "Should society maintenance be split equally or by area?",
        a: "Model bye-laws in most states suggest service charges (security, housekeeping, common electricity) be split equally, while sinking fund and repair charges be levied per square foot. Many societies simplify to one method — your general body can decide, and this tool supports both.",
      },
      {
        q: "Is GST applicable on society maintenance?",
        a: "GST at 18% applies only if maintenance exceeds ₹7,500 per member per month AND the society's annual turnover exceeds ₹20 lakh. Below either threshold, no GST is charged.",
      },
    ],
  },

  "misc/pan-aadhaar-name-matcher": {
    intro: [
      "The PAN-Aadhaar Name Matcher checks whether the name printed on your PAN card matches the name on your Aadhaar (or any two documents). It gives a similarity score and detects common mismatch patterns — spelling variations, transliteration differences (Md/Mohd/Mohammed), swapped first/last names and initials versus full names — along with advice on which document to correct.",
      "Name mismatches are the most common reason PAN-Aadhaar linking, e-KYC, bank account opening and income-tax e-filing fail. Everything runs entirely in your browser: the names you type are never sent to any server.",
    ],
    faqs: [
      {
        q: "PAN-Aadhaar name mismatch — which document should I correct?",
        a: "Usually correct the document with the error. Aadhaar name/details can be updated online via the UIDAI SSUP portal or at an Aadhaar Seva Kendra; PAN corrections are filed through Protean (NSDL) or UTIITSL with a small fee.",
      },
      {
        q: "Will a small spelling difference block PAN-Aadhaar linking?",
        a: "Minor mismatches are often accepted after OTP-based Aadhaar authentication, but larger differences (different surname, reordered names) typically fail. A score above ~80% on this tool usually indicates a minor variation.",
      },
      {
        q: "Is it safe to enter my name here?",
        a: "Yes. The comparison runs completely in your browser using JavaScript — no name, document number or personal data is uploaded or stored anywhere.",
      },
    ],
  },

  "misc/certificate-qr-generator": {
    intro: [
      "The Certificate Verification QR Generator creates a QR code you can print on certificates so anyone can verify them instantly with a phone camera. Encode either the certificate details directly (institute, recipient, course, certificate number, issue date) or a verification URL that points to your institute's records page.",
      "Coaching institutes, training academies, colleges and event organisers use verification QRs to prevent certificate forgery and make credential checks effortless for employers. Download the QR as a PNG and place it on your certificate design — pairs perfectly with our free Certificate Maker.",
    ],
    faqs: [
      {
        q: "How does a QR code prevent fake certificates?",
        a: "If the QR encodes a verification URL on your institute's own domain, a forger can't fake the page it points to. Scanning instantly shows whether the certificate number exists in your records — far harder to forge than a printed seal.",
      },
      {
        q: "Should I encode details or a URL in the QR?",
        a: "A verification URL is stronger (it can be checked against your live records), but encoding the details directly works offline and needs no website. Many institutes print both the details QR and a certificate number.",
      },
    ],
  },
  "daily/age-calculator": {
    intro: [
      "The Age Calculator works out your exact age in years, months and days from your date of birth, and can also calculate the age gap between any two dates — useful for eligibility checks on government exams, job applications, marriage registration or school admissions where an exact age (not just birth year) is asked for.",
      "It also shows your next birthday countdown and the total number of days you have been alive, calculated using standard calendar rules that account for leap years and varying month lengths, so there is no manual counting on fingers or calendar flipping required.",
    ],
    faqs: [
      { q: "Why does my age in years differ from a simple year subtraction?", a: "Subtracting birth year from the current year ignores whether your birthday has occurred yet this year. This calculator checks the exact day and month, so if your birthday hasn't arrived yet this year, your age is one year less than the simple subtraction." },
      { q: "Can this calculator find the age difference between two people?", a: "Yes, enter both dates of birth and it computes the exact years, months and days between them — handy for checking age gaps for marriage eligibility or sibling age differences." },
      { q: "Does it account for leap years?", a: "Yes, the calculation uses actual calendar dates including February 29 in leap years, so the day/month/year breakdown is always accurate regardless of how many leap years fall within the period." },
    ],
  },
  "daily/percentage-calculator": {
    intro: [
      "The Percentage Calculator handles the four most common percentage problems in one place: finding what X% of Y is, finding what percentage one number is of another, and calculating percentage increase or decrease between two values — the kind of maths that shows up constantly in shopping discounts, exam marks, salary hikes and business margins.",
      "Percentage increase is calculated as (new value − old value) ÷ old value × 100, while percentage decrease uses the same formula with a negative result; getting the base value right is the most common source of error, which is why each mode is presented separately here to avoid mixing up what is being compared against what.",
    ],
    faqs: [
      { q: "How is percentage increase different from percentage points?", a: "Percentage increase is relative (e.g., interest rate rising from 5% to 6% is a 20% increase), while percentage points measure the raw difference (a 1 percentage point rise). Confusing the two is a common mistake in finance and exam reporting." },
      { q: "How do I calculate reverse percentage, like finding the original price before a discount?", a: "Divide the discounted price by (1 − discount%). For example, if a price of ₹800 is after a 20% discount, the original price is 800 ÷ 0.8 = ₹1,000. Use the 'percentage of a number' mode in reverse to check this." },
    ],
  },
  "daily/bmi-calculator": {
    intro: [
      "The BMI Calculator computes Body Mass Index from your height and weight using the standard formula weight(kg) ÷ height(m)², then classifies the result into underweight, normal, overweight or obese categories based on WHO reference ranges, giving a quick screening indicator of whether your weight is in a healthy range for your height.",
      "BMI is a population-level screening tool, not a diagnosis — it does not distinguish muscle mass from fat, so athletes and very muscular individuals often show a higher BMI despite low body fat. Doctors in India frequently pair BMI with waist circumference for a fuller picture, since South Asians tend to develop metabolic risk at lower BMI thresholds than Western populations.",
    ],
    faqs: [
      { q: "What BMI range is considered healthy for Indians?", a: "The WHO Asian cut-offs commonly used in India classify 18.5–22.9 as normal, 23–24.9 as overweight, and 25+ as obese — stricter than the standard Western thresholds of 25 and 30, because South Asians face higher diabetes and heart-disease risk at lower BMI." },
      { q: "Is BMI accurate for children or pregnant women?", a: "No. BMI charts here are designed for adults; children need age- and sex-specific growth charts, and pregnant women should not use standard BMI categories since healthy weight gain during pregnancy is expected." },
    ],
  },
  "daily/tip-calculator": {
    intro: [
      "The Tip Calculator splits a restaurant, cab or salon bill among any number of people and adds a tip percentage of your choice, showing the tip amount, the total bill, and the exact amount each person owes — useful for group dinners where nobody wants to do the maths at the table.",
      "Tipping culture in India is more relaxed than in the US: 5–10% is typical at restaurants where a service charge isn't already included, while it's polite but not obligatory for cabs and salons. Always check your bill for an existing 'service charge' line before adding an extra tip, since some restaurants already include one.",
    ],
    faqs: [
      { q: "Is tipping mandatory in Indian restaurants?", a: "No, tipping is discretionary in India, unlike some countries. Restaurants cannot legally force a service charge as compulsory (per Consumer Affairs Ministry guidelines) — you can ask for it to be removed and tip separately if you wish." },
      { q: "How do I split a bill unevenly, like if one person ordered more?", a: "This calculator assumes an equal split, which works for most casual outings. For itemized splitting where individual orders differ, note each person's item total separately and only apply the shared tip proportionally afterward." },
    ],
  },
  "daily/date-difference-calculator": {
    intro: [
      "The Date Difference Calculator finds the exact gap between two dates in days, weeks, months and years — commonly needed for calculating notice periods, loan tenures, visa validity countdowns, pregnancy due dates, or how long a project or relationship has lasted.",
      "Unlike a rough 'divide days by 30' estimate, this tool accounts for actual calendar month lengths and leap years, so a gap spanning February will correctly reflect 28 or 29 days rather than assuming every month has 30.",
    ],
    faqs: [
      { q: "How many working days are between two dates?", a: "This tool gives the total calendar-day difference; if you need working-day counts excluding weekends and holidays, you'll need to subtract weekends manually or use a dedicated working-days calculator, since public holidays vary by state in India." },
      { q: "Can I calculate the difference between a past date and today?", a: "Yes — leave the second date as today's date to instantly see how many days, months or years have passed since any past event, contract signing or last service date." },
    ],
  },
  "daily/text-case-converter": {
    intro: [
      "The Text Case Converter instantly switches any pasted text between UPPERCASE, lowercase, Title Case, Sentence case, camelCase and snake_case — formats developers, writers and students each need for different purposes, from variable naming conventions in code to formatting headlines or fixing accidentally-capslocked messages.",
      "camelCase and snake_case in particular are naming conventions used in programming: camelCase (firstName) is common in JavaScript and Java, while snake_case (first_name) is the convention in Python and SQL — this tool converts freely between all six formats without needing to retype anything.",
    ],
    faqs: [
      { q: "What's the difference between Title Case and Sentence case?", a: "Title Case capitalizes the first letter of every major word (This Is A Title), while Sentence case only capitalizes the first letter of the sentence (This is a sentence) — Title Case is typical for headings, Sentence case for body text." },
      { q: "Can I convert a whole paragraph, not just a single word?", a: "Yes, paste any length of text — a sentence, paragraph or full document — and the conversion applies to the entire block instantly." },
    ],
  },
  "daily/password-generator": {
    intro: [
      "The Password Generator creates strong, random passwords using a mix of uppercase, lowercase, numbers and symbols, with adjustable length and a live strength meter — far more secure than the predictable passwords (birthdays, names, '123456') that are the leading cause of account takeovers.",
      "A truly random 12+ character password with mixed character types can take centuries to brute-force with current computing power, whereas a dictionary word or personal detail can be cracked in seconds. Generated passwords never leave your browser, so nothing is logged or transmitted anywhere.",
    ],
    faqs: [
      { q: "How long should a strong password be?", a: "Security experts generally recommend at least 12–16 characters with a mix of character types. Longer passwords are exponentially harder to brute-force than shorter ones, even with the same character variety." },
      { q: "Should I reuse the same strong password across sites?", a: "No. If one site is breached, reused passwords let attackers access your other accounts too (called credential stuffing). Generate a unique password per site and store them in a password manager rather than memorizing or reusing them." },
    ],
  },
  "daily/unit-converter": {
    intro: [
      "The Unit Converter handles everyday conversions across length (metres, feet, km, miles), weight (kg, pounds, grams), temperature (Celsius, Fahrenheit, Kelvin) and volume (litres, gallons, millilitres) — the conversions that come up constantly in cooking, travel, fitness tracking, shopping abroad and school homework.",
      "Temperature conversion is the one people most often get wrong by hand, since it isn't a simple multiplication: Celsius to Fahrenheit is (°C × 9/5) + 32, not a direct ratio like the other categories, which is exactly the kind of formula this tool applies instantly so you don't have to remember it.",
    ],
    faqs: [
      { q: "Why isn't temperature conversion a simple multiply-by-a-factor like length or weight?", a: "Length and weight scales share a common zero point, so converting is pure multiplication. Temperature scales (Celsius, Fahrenheit) have different zero points, so conversion requires both a multiplication and an offset — that's why a formula, not a ratio, is needed." },
      { q: "Which unit system does India officially use?", a: "India uses the metric system (metres, kilograms, litres, Celsius) for all official and commercial purposes, though feet/inches are still commonly used informally for room and plot dimensions in real estate." },
    ],
  },
  "daily/simple-compound-interest": {
    intro: [
      "This tool compares Simple Interest (SI = P × R × T / 100) against Compound Interest (A = P(1 + R/100)^T) side by side for the same principal, rate and tenure, showing exactly how much more compounding earns you over time — the core concept behind comparing fixed deposits, recurring deposits and most loan products.",
      "The gap between simple and compound interest grows with both the interest rate and the time period: over 1–2 years the difference is small, but over 10–20 years compound interest can produce a noticeably larger corpus because each year's interest itself starts earning interest, unlike simple interest which is always calculated only on the original principal.",
    ],
    faqs: [
      { q: "Do Indian banks pay simple or compound interest on savings accounts?", a: "Most Indian savings accounts and fixed deposits pay compound interest, typically compounded quarterly. Simple interest is more common in short-term personal loans or certain post-office schemes — always check the compounding frequency stated in your account terms." },
      { q: "Does compounding frequency (yearly vs quarterly) matter?", a: "Yes. The same annual rate compounded quarterly yields slightly more than compounded yearly, because interest is added to the principal more often. This tool assumes annual compounding by default for a clean comparison." },
    ],
  },
  "daily/salary-hourly-converter": {
    intro: [
      "The Salary/Hourly Converter switches between annual CTC, monthly salary, daily rate and hourly rate, based on your working days and hours per week — useful for comparing a full-time offer against freelance or contract rates quoted per hour, or figuring out what an hourly consulting rate translates to annually.",
      "Freelancers and consultants in India increasingly quote hourly or per-project rates, while full-time roles are quoted as annual CTC — converting both to the same basis (like effective hourly rate) is the only fair way to compare a freelance gig against a salaried job once you account for actual billable hours.",
    ],
    faqs: [
      { q: "How many working days should I use for an accurate conversion?", a: "A typical Indian corporate year has about 250–260 working days after weekends and public holidays. Using 22 working days per month is a common approximation; adjust it if your organization has a 5-day or 6-day work week." },
      { q: "Should freelance hourly rates be higher than a salaried employee's equivalent rate?", a: "Generally yes — freelance rates need to cover the taxes, benefits (PF, gratuity, insurance) and non-billable time that an employer would otherwise provide, so a fair freelance rate is usually 1.3–1.5x the equivalent salaried hourly rate." },
    ],
  },
  "daily/time-zone-converter": {
    intro: [
      "The Time Zone Converter shows what time it is in another city or country when it's a given time in yours — essential for scheduling calls with international clients, coordinating with remote teams, or figuring out when a live stream or flight lands in your local time.",
      "India uses a single time zone, IST (UTC+5:30), with the unusual half-hour offset — unlike most countries which sit on whole-hour offsets. This half-hour difference is a frequent source of scheduling mistakes when converting to US, UK or Middle East time zones, which is exactly what this tool eliminates.",
    ],
    faqs: [
      { q: "Why is India's time zone UTC+5:30 and not a whole number?", a: "IST was fixed in 1947 based on the longitude of 82.5°E, roughly midway across the country, which works out to a 5-hour-30-minute offset from UTC — a deliberate compromise since India spans nearly two hours of longitude east to west." },
      { q: "Does IST observe daylight saving time?", a: "No, India does not observe daylight saving time and keeps IST fixed year-round, so the offset to other countries changes seasonally only when those other countries shift their own clocks for DST." },
    ],
  },
  "daily/random-name-picker": {
    intro: [
      "The Random Name/Winner Picker takes a pasted list of names (one per line) and spins through them to land on a random winner — built for giveaways, raffle draws, classroom call-outs, deciding who goes first in a game, or fairly assigning tasks among a group without any bias.",
      "The selection uses your browser's random number generator to pick uniformly from the list, so every name has an equal chance regardless of the order it was entered in — useful for keeping contest or lucky-draw selections demonstrably fair and disputable-free.",
    ],
    faqs: [
      { q: "Can I remove the winner and pick again for multiple prizes?", a: "Yes, after a name is picked you can remove it from the list and spin again, letting you draw multiple distinct winners for different prize tiers without repeats." },
      { q: "Is the randomization fair, or biased toward names entered first or last?", a: "Every name has an equal probability of being selected regardless of its position in the list — the tool doesn't favor names based on entry order." },
    ],
  },
  "daily/lorem-ipsum-generator": {
    intro: [
      "The Lorem Ipsum Generator produces placeholder text in the traditional pseudo-Latin filler format used by designers and developers to mock up layouts before real content is ready, letting you preview how paragraphs, headlines and typography will look without waiting on copywriting.",
      "Lorem Ipsum has been the design industry's default placeholder text since the 1500s (derived from scrambled Cicero) precisely because its word lengths and letter distribution resemble real language without being distractingly readable — this generator lets you choose the number of paragraphs, sentences or words you need for any mockup.",
    ],
    faqs: [
      { q: "Why use Lorem Ipsum instead of just typing random words?", a: "Lorem Ipsum has a natural distribution of letter frequency and word length that closely mimics real text, so it renders realistically in a layout preview, whereas random word strings often look and behave differently (very short or very long words) than actual content." },
      { q: "Can I generate a specific number of words or paragraphs?", a: "Yes, specify how much placeholder text you need — a headline-length phrase, a few sentences, or several full paragraphs — and the generator produces exactly that amount." },
    ],
  },
  "daily/json-formatter": {
    intro: [
      "The JSON Formatter/Validator takes raw or minified JSON and pretty-prints it with proper indentation, making nested objects and arrays readable at a glance, while also validating the syntax and pointing out exactly where a missing comma, bracket or quote is breaking the structure.",
      "JSON (JavaScript Object Notation) is the standard data format for APIs, config files and app-to-app data exchange, and even a single misplaced comma will make an entire payload fail to parse — this tool catches those syntax errors instantly instead of you having to debug them inside your code editor or terminal.",
    ],
    faqs: [
      { q: "What's the most common JSON syntax error this catches?", a: "Trailing commas after the last item in an array or object, unescaped quotes inside strings, and missing closing brackets are the most frequent JSON errors — all of which this validator flags immediately with a clear error location." },
      { q: "Is my JSON data uploaded to a server when I format it here?", a: "No, formatting and validation run entirely in your browser using JavaScript's built-in JSON parser — your data, including any sensitive API responses or config values, is never transmitted anywhere." },
    ],
  },
  "daily/color-palette-generator": {
    intro: [
      "The Color Palette Generator builds complementary, analogous and triadic color schemes from a single base color using standard color-theory relationships on the color wheel, giving designers and developers a ready-made, harmonious palette for websites, branding or presentation slides in seconds.",
      "Complementary colors sit directly opposite each other on the color wheel for high contrast, analogous colors sit next to each other for a calm cohesive look, and triadic colors are spaced evenly around the wheel for a vibrant balanced feel — picking the right scheme depends on whether the goal is contrast, harmony, or energy.",
    ],
    faqs: [
      { q: "What's the difference between complementary and analogous color schemes?", a: "Complementary colors are opposite each other on the color wheel (like blue and orange) and create strong visual contrast, ideal for call-to-action buttons. Analogous colors sit next to each other (like blue, teal, green) and create a calmer, more cohesive look, better for backgrounds and branding." },
      { q: "Can I export the palette as hex codes for CSS?", a: "Yes, each generated color is shown with its hex code, which you can copy directly into CSS, design tools like Figma, or brand style guides." },
    ],
  },
  "daily/word-counter": {
    intro: [
      "The Word/Character Counter gives a live count of words, characters (with and without spaces), sentences and paragraphs as you type or paste text, along with an estimated reading time — built for writers hitting assignment word limits, students checking essay length, and social media users watching character caps like Twitter/X's 280-character limit.",
      "Reading time is estimated using an average adult reading speed of around 200–230 words per minute, giving bloggers and content writers a realistic sense of how long their article will take readers to finish, which is useful for structuring long-form content or trimming it down.",
    ],
    faqs: [
      { q: "Does the character count include spaces?", a: "The tool shows both figures separately — character count with spaces and without — since platforms like Twitter/X count spaces toward the limit while some academic word-count rules do not." },
      { q: "How accurate is the estimated reading time?", a: "It's based on an average reading speed of roughly 200–230 words per minute for adult readers of general content; technical or dense writing will typically take longer to read than the estimate shown." },
    ],
  },
  "daily/emi-calculator": {
    intro: [
      "The EMI Calculator computes your Equated Monthly Installment for any home, car or personal loan using the standard formula EMI = P × R × (1+R)^N / ((1+R)^N − 1), where P is principal, R is the monthly interest rate and N is the number of monthly instalments, then breaks the total repayment into principal and interest.",
      "It also generates a month-by-month amortization view showing how the interest component is highest in the early instalments and gradually shrinks as principal reduces — understanding this front-loaded interest structure helps you decide whether prepaying a loan early is worth it, since early prepayments save disproportionately more interest.",
    ],
    faqs: [
      { q: "Why is more interest paid in the early EMIs of a loan?", a: "Interest is calculated on the outstanding principal each month. Since the outstanding balance is highest at the start of the loan, the interest portion of each EMI is highest early on and shrinks progressively as the principal reduces — this is normal amortization, not an error." },
      { q: "Does prepaying a loan actually save money?", a: "Yes, prepaying reduces the outstanding principal, which lowers the interest charged in every subsequent EMI. Prepaying early in the loan tenure saves significantly more interest than prepaying the same amount near the end, because more interest-bearing months remain." },
    ],
  },
  "daily/gst-calculator": {
    intro: [
      "The GST Calculator adds or removes Goods and Services Tax from a price and splits it into CGST and SGST (for intra-state sales) at rates of 5%, 12%, 18% or 28% as applicable — the standard slabs used across most goods and services in India under the GST regime.",
      "For intra-state transactions, GST is split equally between CGST (Central GST) and SGST (State GST) — an 18% GST bill means 9% CGST + 9% SGST, both going to different government treasuries — while inter-state sales instead charge IGST at the full rate to a single authority; this calculator shows the intra-state split businesses need for invoicing.",
    ],
    faqs: [
      { q: "What is the difference between CGST, SGST and IGST?", a: "CGST and SGST apply together on sales within the same state, split equally between central and state governments. IGST applies as a single tax on inter-state sales, collected by the central government and later apportioned to the destination state." },
      { q: "How do I calculate the pre-GST price from a GST-inclusive price?", a: "Divide the GST-inclusive price by (1 + GST rate/100). For an ₹1,180 price inclusive of 18% GST, the base price is 1180 ÷ 1.18 = ₹1,000. This calculator's 'remove GST' mode does this automatically." },
    ],
  },
  "daily/sip-calculator": {
    intro: [
      "The SIP Calculator projects the maturity value of a monthly Systematic Investment Plan in mutual funds, using the compound growth formula for regular instalments, and plots a year-by-year growth chart so you can see how your invested amount and the returns generated on it diverge over the tenure.",
      "SIPs benefit from rupee-cost averaging — investing a fixed amount regularly buys more units when the market is low and fewer when it's high, smoothing out volatility over time — and the power of compounding means a SIP continued for 15-20 years typically grows far more from returns-on-returns than from the raw invested amount alone.",
    ],
    faqs: [
      { q: "What return rate should I assume for a SIP calculation?", a: "Equity mutual funds in India have historically returned roughly 10–14% annually over long periods, though actual returns vary by fund and market cycle and are never guaranteed. Debt funds typically project more conservative rates of 6–8%." },
      { q: "Is SIP maturity value guaranteed like a fixed deposit?", a: "No, unlike a fixed deposit, SIP returns depend on market performance and are not guaranteed — the projected maturity value shown is an estimate based on an assumed average annual return, not a promised outcome." },
    ],
  },
  "daily/loan-comparison": {
    intro: [
      "The Loan Comparison Tool lets you enter two or three loan offers side by side — principal, interest rate and tenure for each — and instantly compares their EMI, total interest paid and total repayment, making it easy to see which lender's offer actually costs less over the full loan life, not just which has the lower advertised rate.",
      "A lower interest rate doesn't always mean a cheaper loan once tenure and processing fees are factored in: a longer tenure at a lower rate can sometimes cost more in total interest than a shorter tenure at a slightly higher rate, which is exactly the kind of trade-off this side-by-side view makes visible.",
    ],
    faqs: [
      { q: "Should I choose the loan with the lowest EMI or the lowest total interest?", a: "It depends on your priority: the lowest EMI (usually from a longer tenure) eases monthly cash flow but costs more in total interest over the loan's life, while a shorter tenure has a higher EMI but a lower total repayment. Compare both figures, not just the EMI." },
      { q: "Does this tool account for processing fees when comparing loans?", a: "This tool compares principal, interest rate and tenure to calculate EMI and interest cost; processing fees, prepayment charges and insurance add-ons vary by lender and should be added manually to the total cost for a complete comparison." },
    ],
  },
  "daily/currency-converter": {
    intro: [
      "The Currency Converter converts amounts between major world currencies using rates you enter manually, useful for quick estimates when planning international travel, comparing prices on foreign shopping sites, or converting freelance payments received in USD, EUR or GBP into INR.",
      "Because exchange rates move constantly, this tool uses a manually-entered rate rather than a live feed — always check the current rate from your bank or a reliable financial source before finalizing an actual money transfer or international payment, since banks and payment gateways typically apply their own margin over the market rate.",
    ],
    faqs: [
      { q: "Why does my bank give a different rate than the market rate I entered?", a: "Banks and payment gateways add a margin (spread) over the interbank market rate, often 1–4%, plus fixed transaction fees. The market mid-rate is a reference point, not what you'll actually receive or pay through a bank." },
      { q: "Can I use this for tracking freelance income received in foreign currency?", a: "Yes, it's useful for quick estimates of INR value, but for tax filing and official records use the actual conversion rate applied by your bank or payment processor (like RBI reference rate) on the transaction date, since that's what Indian tax authorities expect." },
    ],
  },
  "daily/countdown-timer": {
    intro: [
      "The Countdown Timer counts down live to any future date and time you set — a wedding, exam, product launch, festival or deadline — displaying days, hours, minutes and seconds remaining, and generates a shareable link so others can view the same live countdown.",
      "Unlike a static date reminder, this timer updates in real time directly in the browser tab, making it useful for embedding on event pages, sharing in group chats before a big day, or simply keeping visible focus on an approaching personal deadline.",
    ],
    faqs: [
      { q: "Does the countdown keep running if I close the browser tab?", a: "The countdown recalculates from the target date and time whenever the page is reopened, so it will show the correct remaining time even after closing and reopening the tab — it doesn't need to run continuously in the background." },
      { q: "Can I share the countdown with someone else?", a: "Yes, the generated shareable link encodes your target date and time, so anyone who opens it sees the same live countdown without needing to re-enter the date themselves." },
    ],
  },
  "daily/qr-generator": {
    intro: [
      "The QR Code Generator creates a downloadable QR code from any text, URL, WiFi credentials or contact detail — scan it with any smartphone camera to open a link, connect to WiFi, or save a contact instantly, without typing anything manually.",
      "QR codes are widely used across India today for UPI payments, restaurant menus, marketing posters, event check-ins and product packaging, because they compress a fair amount of data into a scannable pattern that works even from a printed page or a screen photo, and this generator produces one as a downloadable image in seconds.",
    ],
    faqs: [
      { q: "How much text can a QR code hold?", a: "Standard QR codes can encode up to roughly 4,000 alphanumeric characters, though shorter content (like a URL) scans faster and more reliably — very long text produces a denser, harder-to-scan code." },
      { q: "Will the QR code expire or stop working?", a: "No, a QR code generated from static text or a URL doesn't expire on its own — it will keep working indefinitely as long as the underlying link or content it points to remains valid." },
    ],
  },
  "daily/barcode-generator": {
    intro: [
      "The Barcode Generator creates standard CODE128 and EAN-13 barcodes from any product code or number, downloadable as an image for printing on price tags, inventory labels or product packaging — the same barcode formats used by retail billing systems and supermarket scanners.",
      "EAN-13 is the standard 13-digit format used globally for retail product barcodes (the ones on packaged goods), while CODE128 is a flexible alphanumeric format often used for internal inventory tracking, shipping labels and asset tags where the code isn't a registered retail product number.",
    ],
    faqs: [
      { q: "What's the difference between EAN-13 and CODE128 barcodes?", a: "EAN-13 is a fixed 13-digit numeric format used for globally registered retail products (requires a GS1 registered prefix for real commercial use). CODE128 supports letters, numbers and symbols and is commonly used for internal warehouse, inventory or asset labels that don't need global registration." },
      { q: "Can I use a randomly generated EAN-13 barcode to sell products in stores?", a: "For genuine retail sale through supermarkets, you need a GS1-registered barcode number tied to your business. A barcode generated here is fine for internal testing, mock-ups or non-retail internal tracking, but not for real retail distribution." },
    ],
  },
  "islamic/hijri-converter": {
    intro: [
      "The Hijri-Gregorian Converter switches dates both ways between the Islamic lunar calendar and the standard Gregorian calendar — needed for finding the Hijri date of a birth, marriage or death, planning around Islamic months like Ramadan and Dhul Hijjah, or converting an official document date printed in one calendar to the other.",
      "The Hijri calendar is purely lunar, with each month starting at the sighting (or astronomical calculation) of the new crescent moon, making it about 10-12 days shorter than the Gregorian solar year — this is why Islamic dates like Ramadan shift roughly 10 days earlier each Gregorian year, and why a simple year-offset conversion doesn't work accurately.",
    ],
    faqs: [
      { q: "Why do Islamic dates fall about 11 days earlier each year on the Gregorian calendar?", a: "The Hijri year has 354 or 355 days (12 lunar months) versus the Gregorian year's 365 days, a gap of roughly 10-11 days. Over 33 Gregorian years, an Islamic date cycles through the entire solar calendar once." },
      { q: "Does this converter use moon sighting or astronomical calculation?", a: "This tool uses standard astronomical calculation for the Hijri calendar. Actual local moon-sighting announcements by religious authorities can vary by a day from calculated dates, so always confirm exact religious observance dates with your local mosque or authority." },
    ],
  },
  "islamic/zakat-calculator": {
    intro: [
      "The Zakat Calculator computes the Zakat due on cash, bank balances, gold, silver, shares and business assets at the standard rate of 2.5% of total zakatable wealth held above the Nisab threshold for one full lunar year — one of the five pillars of Islam and an obligatory annual charity for eligible Muslims.",
      "Nisab is the minimum wealth threshold below which Zakat isn't due, traditionally set at the value of 87.48 grams of gold or 612.36 grams of silver, whichever a scholar's school of thought specifies — since gold and silver prices fluctuate, this calculator lets you enter current rates so your Nisab and Zakat figures stay accurate.",
    ],
    faqs: [
      { q: "What is Nisab and how is it determined?", a: "Nisab is the minimum threshold of wealth a Muslim must possess before Zakat becomes obligatory, traditionally equivalent to 87.48g of gold or 612.36g of silver. Many scholars recommend using the silver standard since it results in a lower threshold, meaning more people fulfil their Zakat obligation." },
      { q: "Is Zakat calculated on gross assets or after deducting debts?", a: "Zakat is generally calculated on net zakatable assets — outstanding debts and immediate liabilities are typically deducted from your total wealth before applying the 2.5% rate, though practices vary slightly between schools of thought." },
      { q: "Do I pay Zakat on jewellery I wear regularly?", a: "This is a point of scholarly difference: some schools exempt jewellery in regular personal use, while others (notably the Hanafi school) hold that Zakat is due on gold and silver jewellery regardless of use. Consult your local scholar for the ruling you follow." },
    ],
  },
  "islamic/99-names": {
    intro: [
      "This page lists the 99 Names of Allah (Asma-ul-Husna) mentioned in the Quran and Hadith, each shown with its Arabic script, English transliteration and meaning — a reference for daily recitation, dhikr, memorization or simply understanding the attributes of Allah described across Islamic scripture.",
      "The Prophet Muhammad (peace be upon him) said that whoever memorizes and understands these 99 names will enter Paradise, which is why they are widely taught to children and recited by adults as a form of worship and reflection on divine attributes like Ar-Rahman (The Most Merciful) and Al-Khaliq (The Creator).",
    ],
    faqs: [
      { q: "Are there exactly 99 names of Allah in the Quran?", a: "The Quran and authentic Hadith together reference many attributes of Allah, and the well-known Hadith compilation of 99 specific names became the standard list taught and recited across the Muslim world, though scholars note Allah's attributes are not limited to exactly 99." },
      { q: "What is the benefit of reciting the 99 Names?", a: "Reciting and reflecting on the Asma-ul-Husna is considered a form of dhikr (remembrance of Allah) that deepens understanding of His attributes and is recommended as part of daily worship; a well-known Hadith links memorizing them with a great reward." },
    ],
  },
  "islamic/tasbih-counter": {
    intro: [
      "The Tasbih Counter is a digital dhikr counter that replaces a physical prayer bead string (misbaha) for counting recitations like SubhanAllah, Alhamdulillah and Allahu Akbar — tap to count, set a target (commonly 33, 99 or 100), and reset when you're done, all directly in your browser.",
      "Dhikr after each of the five daily prayers traditionally follows a count of 33 repetitions each of three phrases, totalling 99 — this tool lets you set that exact target so you get a gentle confirmation once you've reached it, useful when reciting silently and losing count is easy.",
    ],
    faqs: [
      { q: "What is the traditional count for post-prayer dhikr?", a: "A well-known Hadith describes reciting SubhanAllah, Alhamdulillah and Allahu Akbar 33 times each after the five daily prayers, totalling 99 — some traditions round up to 100 with an additional declaration of faith." },
      { q: "Does the counter save my progress if I close the browser?", a: "The counter resets when you start a fresh session; it's designed for tracking a single dhikr session at a time (like right after a prayer) rather than accumulating a running total across days." },
    ],
  },
  "islamic/inheritance-calculator": {
    intro: [
      "The Inheritance (Mirath) Calculator distributes an estate among heirs according to the Quranic shares defined by Islamic inheritance law (Faraid) — a fixed, rule-based system where shares for spouses, children, parents and other relatives are set by scripture rather than left to a will, except for the discretionary one-third that can be willed elsewhere.",
      "Islamic inheritance law assigns specific fractional shares (like a son typically receiving double a daughter's share, or a widow receiving one-eighth if there are children) based on the exact combination of surviving heirs, which is why the calculation changes significantly depending on who is alive at the time of death — this tool asks for your specific family situation to apply the correct Quranic shares.",
    ],
    faqs: [
      { q: "Can a Muslim will away their entire estate as they choose?", a: "No — under Islamic law, a person can will at most one-third of their estate freely (and generally not to an heir who already has a fixed Quranic share); the remaining two-thirds must be distributed according to the fixed Faraid shares among legal heirs." },
      { q: "Why does a son typically inherit double what a daughter inherits?", a: "The Quranic principle (Surah An-Nisa 4:11) generally assigns male heirs double the share of equivalent female heirs, reasoned historically by the differing financial obligations placed on men (like mahr and full family maintenance) versus women under Islamic law." },
      { q: "Does this calculator account for different schools of Islamic jurisprudence?", a: "This tool applies the widely-followed Quranic share rules common across major schools of thought for standard cases; edge cases and rare heir combinations can have differing scholarly opinions, so consult a qualified Islamic scholar for legally binding estate division." },
    ],
  },
  "islamic/property-land-distribution": {
    intro: [
      "The Property/Land Distribution tool applies the same Faraid inheritance shares used for cash estates to a specific property or land value, converting each heir's fractional Quranic share into a rupee amount or proportional land area — useful when a family needs to divide an actual house, plot or agricultural land rather than liquid cash.",
      "Physical property often can't be split as cleanly as cash, since a house or small plot may not divide evenly among all heirs' fractional shares — families frequently use a tool like this to first establish the correct proportional value each heir is owed, then decide together whether to sell and split cash, or compensate some heirs while others keep the physical property.",
    ],
    faqs: [
      { q: "How do families divide a house that can't be physically split among heirs?", a: "A common approach is for one or more heirs to buy out the others' shares at fair market value, or for the property to be sold and the proceeds distributed according to each heir's Faraid share — this tool helps calculate exactly what each share is worth first." },
      { q: "Is agricultural land treated differently from residential property in Islamic inheritance?", a: "No, Islamic inheritance law doesn't distinguish property type — the same Faraid share rules apply to cash, gold, residential property, agricultural land or any other estate asset based on its fair value." },
    ],
  },
  "islamic/prayer-times": {
    intro: [
      "The Prayer Times tool shows today's five daily Salah timings — Fajr, Dhuhr, Asr, Maghrib and Isha — calculated for your city based on sun position, so you always know the correct prayer window without checking a separate app or calendar.",
      "Prayer times shift daily because they're tied to the sun's position (Fajr at dawn, Dhuhr at midday sun, Asr in mid-afternoon, Maghrib at sunset, Isha after twilight fades), not fixed clock hours, which means they gradually shift throughout the year and vary significantly by latitude — cities further north or south of the equator see much larger seasonal swings than cities closer to it.",
    ],
    faqs: [
      { q: "Why do prayer times change every day instead of staying fixed?", a: "Prayer times are determined by the sun's position relative to your location, not a fixed clock time. As sunrise and sunset shift through the year, each of the five prayer windows shifts along with them, sometimes by several minutes a day." },
      { q: "Which calculation method does this tool use for Fajr and Isha angles?", a: "Different Islamic authorities (like ISNA, Muslim World League, or regional bodies) use slightly different sun-angle conventions for Fajr and Isha, which can shift times by a few minutes. This tool uses a standard widely-accepted calculation method; if your local mosque's timing differs slightly, follow your mosque's announced schedule." },
    ],
  },
  "islamic/qibla-direction": {
    intro: [
      "The Qibla Direction tool finds the compass bearing from your current location toward the Kaaba in Makkah, which Muslims face during Salah — using your device's location (or a manually entered city) to calculate the great-circle bearing toward the Kaaba's coordinates.",
      "Because the Qibla direction is a great-circle bearing rather than a straight line on a flat map, it can look counter-intuitive on a standard map projection — for example, from much of North America the shortest path to Makkah runs across the North Atlantic and Europe rather than due east, which is why a proper bearing calculation (not just 'look at a map') is needed.",
    ],
    faqs: [
      { q: "Why does the Qibla direction from some countries point through unexpected regions on a map?", a: "The Qibla is calculated as the shortest great-circle path over the curved surface of the Earth, which often looks diagonal or counter-intuitive when drawn on a flat map projection — the calculation is geometrically correct even when it doesn't match visual intuition from a 2D map." },
      { q: "Does this tool need my exact GPS location to work?", a: "It works best with location access for precision, but you can also manually select or search for your city if you prefer not to share your device's exact GPS coordinates." },
    ],
  },
  "islamic/ramadan-calendar": {
    intro: [
      "The Ramadan Calendar shows Sehri (pre-dawn meal cutoff, tied to Fajr) and Iftar (fast-breaking time, tied to Maghrib) timings for every day of the Hijri month of Ramadan for your city, so you can plan meals and prayers throughout the fasting month without checking a new source each day.",
      "Sehri and Iftar times shift gradually day by day as sunrise and sunset times change through the month, and since Ramadan itself moves about 10-11 days earlier on the Gregorian calendar each year, the season it falls in (and therefore fasting duration, which is longer in summer) changes year to year too.",
    ],
    faqs: [
      { q: "Why does fasting duration change year to year even in the same city?", a: "Because the Hijri calendar is lunar, Ramadan shifts roughly 10-11 days earlier on the Gregorian calendar annually. When Ramadan falls in summer (longer daylight hours), the fasting window from Sehri to Iftar is longer than when it falls in winter." },
      { q: "How is the exact start of Ramadan determined?", a: "Traditionally by the sighting of the new crescent moon, though many countries and organizations today rely on astronomical calculation announced by religious authorities. This calendar uses calculated dates; always confirm the locally announced start date with your community's moon-sighting committee." },
    ],
  },
  "islamic/salah-time-reminder": {
    intro: [
      "The Salah Time Reminder sends a browser notification shortly before each of the five daily prayer times, so you get a gentle heads-up to prepare for prayer even while working, browsing or studying, without needing to install a separate mobile app.",
      "Because it relies on browser push notifications, the reminder works as long as the tab or browser has notification permission granted and is running in the background — it's a convenient supplement to, not a replacement for, your local mosque's Adhan or a dedicated prayer app for reliability when your device is off or the browser is fully closed.",
    ],
    faqs: [
      { q: "Will I get a reminder if I close the browser completely?", a: "No, browser-based notifications require the browser to be running (even in the background) with notification permission granted. If the browser is fully closed, no reminder will fire — for guaranteed offline reminders, use a dedicated mobile prayer app." },
      { q: "Can I customize how many minutes before each prayer I get notified?", a: "Yes, you can set your preferred lead time before each Salah so you have enough time to complete wudu and reach the prayer area before the time enters." },
    ],
  },
  "misc/numerology-calculator": {
    intro: [
      "The Numerology Calculator derives your Life Path number from your date of birth and your Destiny (Expression) number from the letters of your full name, using the traditional Pythagorean numerology system that reduces numbers and letters down to a single digit (or master numbers 11, 22, 33) believed to reveal personality traits and life themes.",
      "Life Path number is calculated by reducing the digits of your birth date to a single digit through repeated addition, while Destiny number assigns each letter of your name a numeric value (A=1, B=2 and so on) and reduces the total the same way — this tool automates both calculations, which are traditionally done by hand.",
    ],
    faqs: [
      { q: "What is a master number in numerology and why isn't it reduced further?", a: "Numbers 11, 22 and 33 are considered 'master numbers' in Pythagorean numerology and are traditionally kept unreduced (not simplified to a single digit like other totals) because they're believed to carry amplified spiritual significance." },
      { q: "Does a name change affect my Destiny number?", a: "Yes, since the Destiny number is calculated from the letters of your full name, using a different name (such as after marriage) or including/excluding a middle name will change the resulting number in traditional numerology practice." },
    ],
  },
  "misc/fuel-cost-calculator": {
    intro: [
      "The Fuel Cost Calculator estimates how much a trip will cost in fuel based on the distance, your vehicle's mileage (km per litre) and the current fuel price — useful for budgeting a road trip, splitting fuel costs fairly among carpoolers, or comparing running costs between two vehicles before buying.",
      "The core formula is simple — trip cost = (distance ÷ mileage) × fuel price per litre — but real-world mileage often differs from the manufacturer-claimed figure due to traffic, AC use, load and driving style, so entering your vehicle's actual observed mileage gives a far more realistic cost estimate than the certified ARAI figure.",
    ],
    faqs: [
      { q: "Why is my car's real mileage lower than the ARAI-certified figure?", a: "ARAI test-cycle mileage is measured under controlled lab conditions without traffic, AC or full passenger load. Real-world city driving with traffic and AC typically delivers 15-30% lower mileage than the certified figure — always use your own observed average for accurate cost estimates." },
      { q: "How can I use this to split fuel costs for a group road trip?", a: "Calculate the total trip fuel cost first, then divide it by the number of people sharing the trip for an equal split, or weight it by who's actually travelling each leg if some passengers join or leave partway." },
    ],
  },
  "misc/typing-speed-test": {
    intro: [
      "The Typing Speed Test measures your typing speed in Words Per Minute (WPM) and accuracy percentage by having you type a passage of text against the clock, then scoring how many correct words you typed per minute and how many errors you made along the way.",
      "WPM is conventionally calculated by dividing the total characters typed by 5 (the average word length) and dividing by the time taken in minutes; a beginner typist usually types 20-30 WPM, an average office worker around 40 WPM, and professional typists can exceed 80-100 WPM with high accuracy.",
    ],
    faqs: [
      { q: "What is considered a good typing speed?", a: "Roughly 40 WPM is considered average for office work, 60-70 WPM is good, and above 80 WPM with high accuracy is considered fast — professional data-entry and transcription roles often require 50-60+ WPM as a baseline." },
      { q: "Does accuracy matter more than raw speed?", a: "Yes, most scoring systems (including this one) factor in accuracy alongside speed since typing fast with many errors is less useful than typing slightly slower with near-perfect accuracy — correcting mistakes afterward often costs more time than typing carefully in the first place." },
    ],
  },
  "misc/distance-calculator": {
    intro: [
      "The Distance Calculator gives the approximate straight-line and road distance between Indian cities, useful for planning trips, estimating travel time, or roughly calculating fuel and toll costs before a journey without opening a separate maps application.",
      "Straight-line (aerial) distance is always shorter than actual road distance because roads curve around terrain, rivers and towns rather than cutting a direct path — the gap between the two can be substantial in hilly states, while it's much smaller across flat terrain like most of the Gangetic plains.",
    ],
    faqs: [
      { q: "Why is the road distance shown longer than the straight-line distance?", a: "Roads follow the actual terrain, connecting towns and avoiding obstacles like rivers, hills and protected land, so the driving route is almost always longer than the direct 'as the crow flies' distance between two points." },
      { q: "Can I use this to estimate travel time?", a: "Roughly — divide the road distance by an assumed average speed (say 50-60 km/h for highways, less for hilly or congested routes) to get a rough travel time estimate, though actual time depends heavily on traffic, road quality and stops." },
    ],
  },
  "misc/solar-panel-savings-calculator": {
    intro: [
      "The Solar Panel Savings Calculator estimates the rooftop solar system size (in kW) you'd need based on your average monthly electricity bill, along with the approximate installation cost, expected monthly savings, and payback period before the system starts saving you money outright.",
      "Under India's PM Surya Ghar scheme and various state subsidies, residential rooftop solar can qualify for a central subsidy that significantly cuts the upfront installation cost — combined with net metering (where excess power exported to the grid is credited), most residential systems pay back their cost within 4-7 years and then generate essentially free electricity for the remaining 15-20+ year panel lifespan.",
    ],
    faqs: [
      { q: "How is the required solar system size (in kW) estimated from my electricity bill?", a: "Your average monthly units consumed (from your bill) are divided by the average monthly generation per kW of installed capacity in your region (which varies by sunlight hours), giving an approximate kW capacity needed to offset most of your usage." },
      { q: "What is net metering and why does it matter for savings?", a: "Net metering lets you export excess solar power your panels generate back to the grid in exchange for bill credits, and draw grid power when your panels underproduce (like at night) — it's what makes solar economically viable for most homes rather than needing expensive battery storage." },
      { q: "Does the calculator account for government subsidies?", a: "It gives a base cost estimate before subsidy; actual eligible subsidy amounts under central and state schemes vary by system size and state, so check current PM Surya Ghar and state DISCOM subsidy rates to adjust the final cost and payback period." },
    ],
  },
  "misc/baby-name-generator": {
    intro: [
      "The Baby Name Generator suggests baby names filtered by religion, gender and starting letter, along with each name's meaning — helpful for expecting parents browsing options that carry the cultural or religious significance they want, whether that's a Hindu, Muslim, Sikh, Christian or secular modern name.",
      "Many Indian families also choose a name based on Rashi (moon sign) or Nakshatra (birth star) starting letter as per traditional astrology, or a name whose meaning reflects a specific virtue or aspiration for the child — filtering by first letter in this tool supports that naming convention alongside straightforward religion and gender filters.",
    ],
    faqs: [
      { q: "Can I filter names by starting letter for Rashi-based naming?", a: "Yes, many Indian families choose a baby's name to start with a specific letter determined by their Nakshatra or Rashi as per Vedic astrology — this tool's starting-letter filter supports that practice alongside religion and gender filters." },
      { q: "Are name meanings verified or just approximate?", a: "Meanings shown are commonly accepted traditional meanings for each name; etymology can vary slightly across regional and linguistic traditions, so treat them as a helpful guide rather than a single definitive authority." },
    ],
  },
  "misc/solar-system-explorer": {
    intro: [
      "The Solar System Explorer is an interactive diagram of the eight planets orbiting the Sun, letting you click each planet to see key facts — size, distance from the Sun, orbital period, number of moons and notable characteristics — presented visually rather than as a plain text list.",
      "It's built as a learning aid for students and curious readers: seeing the planets' relative sizes and orbital distances laid out interactively makes scale differences (like Jupiter's mass dwarfing Earth's, or Neptune's vastly longer orbital period) far more intuitive than reading numbers in a textbook table.",
    ],
    faqs: [
      { q: "Is Pluto included as a planet in this explorer?", a: "No, following the International Astronomical Union's 2006 reclassification, Pluto is categorized as a dwarf planet, so this explorer covers the eight recognized planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus and Neptune." },
      { q: "Are the planet sizes and distances shown to true scale?", a: "The diagram is illustrative rather than perfectly to-scale, since the real distances between planets are so vast that an accurately-scaled diagram would make inner planets invisibly small — actual figures for size and distance are given in the fact panel for each planet." },
    ],
  },
  "misc/aadhaar-masking-tool": {
    intro: [
      "The Aadhaar Masking Tool blacks out the first 8 digits of the 12-digit Aadhaar number on an uploaded image, leaving only the last 4 digits visible — the masking format UIDAI itself permits for sharing a 'Masked Aadhaar' as valid ID proof for many purposes without exposing the full number.",
      "UIDAI allows masked Aadhaar (showing only the last 4 digits) to be used as valid proof of identity for most private and non-KYC purposes, reducing the risk of your full Aadhaar number being copied, misused for fraud, or aggregated in unauthorized databases when you share a physical or scanned copy. All masking happens locally in your browser — the image is never uploaded to a server.",
    ],
    faqs: [
      { q: "Is a masked Aadhaar legally valid as ID proof?", a: "UIDAI permits masked Aadhaar (last 4 digits visible) as valid proof of identity for most purposes, though full KYC processes for banking, telecom or government schemes that require Aadhaar-based authentication may still need the complete number or e-KYC verification." },
      { q: "Is it safe to upload my Aadhaar image to this tool?", a: "Yes — the masking is performed entirely in your browser using client-side image processing; your Aadhaar image is never uploaded to any server, so there's no risk of it being stored or intercepted." },
    ],
  },
  "pdf/merge": {
    intro: [
      "Merge PDF combines multiple PDF files into a single document in the order you arrange them — useful for compiling scanned documents, combining chapters of a report, or assembling a set of certificates and forms into one file before emailing or printing.",
      "The merge happens entirely inside your browser using client-side PDF processing, so your files are never uploaded to a server — this matters for sensitive documents like contracts, mark sheets or ID proofs that you'd rather not send to a third-party server just to combine them.",
    ],
    faqs: [
      { q: "Can I reorder the PDFs before merging them?", a: "Yes, after uploading your files you can drag them into the order you want the final combined document to follow before merging." },
      { q: "Is there a limit to how many PDFs I can merge at once?", a: "You can merge multiple files in one go; very large files or a very high page count may take longer to process since everything runs in your browser rather than on a server." },
    ],
  },
  "pdf/split": {
    intro: [
      "Split PDF breaks one PDF into multiple smaller files, either by specifying a page range for each output file or by splitting automatically every N pages — useful for separating a large scanned document into individual chapters, extracting a single form from a bundled packet, or breaking up a large file for easier emailing.",
      "Splitting runs entirely client-side in your browser, so large or sensitive PDFs (like scanned legal documents) never leave your device during processing, and you can preview the page count before deciding your split points.",
    ],
    faqs: [
      { q: "Can I split a PDF into equal chunks automatically?", a: "Yes, choose the 'every N pages' option to automatically split a long document into equal-sized files without manually specifying each page range." },
      { q: "Will splitting reduce the quality of the pages?", a: "No, splitting simply separates existing pages into new files without re-rendering or compressing them, so page quality remains identical to the original document." },
    ],
  },
  "pdf/compress": {
    intro: [
      "Compress PDF reduces a PDF's file size with an adjustable quality slider, letting you shrink large scanned documents or image-heavy PDFs down to a size that's easier to email, upload to a portal with a file-size limit, or store without eating up storage space.",
      "Most PDF bloat comes from uncompressed embedded images and fonts; this tool re-compresses embedded images at your chosen quality level while keeping the actual text and layout intact, so you can balance smaller file size against visual quality depending on whether the PDF is for archival, printing or quick sharing.",
    ],
    faqs: [
      { q: "Will compressing a PDF make the text blurry?", a: "No, text in a PDF is typically stored as vector data, not images, so compression (which mainly targets embedded images) doesn't blur or degrade actual text content — only image-based content and scanned pages are affected by the quality slider." },
      { q: "How much smaller can a compressed PDF get?", a: "It depends heavily on the original content — image-heavy scanned PDFs can shrink significantly (often 50-80%), while text-only PDFs with few images may see comparatively small size reductions since there's less to compress." },
    ],
  },
  "pdf/pdf-to-image": {
    intro: [
      "PDF to Image converts each page of a PDF into a separate JPG or PNG image file, useful for pulling a single page out to share on WhatsApp or social media, embedding a document page into a presentation, or extracting a diagram/chart that's easier to view as an image than scrolling a PDF.",
      "PNG is the better choice when a page contains text or line art where sharp edges matter (like a scanned form or diagram), while JPG produces smaller file sizes and works well for photo-heavy pages — this tool lets you pick the format per your use case.",
    ],
    faqs: [
      { q: "Which image format should I choose, JPG or PNG?", a: "Choose PNG for crisp text, diagrams or scanned documents where sharp edges matter; choose JPG for photo-heavy pages where a smaller file size matters more than pixel-perfect sharpness." },
      { q: "Does converting to image reduce the resolution of the original PDF?", a: "The output resolution depends on the rendering settings; pages are rendered at a resolution suitable for screen viewing and most printing needs, though extremely fine print may look slightly softer as a rasterized image than in the original vector PDF." },
    ],
  },
  "pdf/image-to-pdf": {
    intro: [
      "Image to PDF combines one or more JPG, PNG or other image files into a single PDF document, in the order you arrange them — commonly used to turn a set of scanned pages, photographed documents, or receipts captured on a phone camera into one shareable PDF file.",
      "Each image becomes one page in the resulting PDF, sized to fit the page automatically, which makes this the fastest way to package multiple photos of a physical document (like ID proofs, mark sheets, or a multi-page handwritten application) into the single-file format that most online forms and email attachments expect.",
    ],
    faqs: [
      { q: "Can I combine images of different sizes into one PDF?", a: "Yes, each image is placed on its own page and automatically fitted to the page, so you can mix portrait and landscape photos of different original dimensions in a single output PDF." },
      { q: "Can I reorder the images before creating the PDF?", a: "Yes, arrange the uploaded images into your preferred page order before generating the final combined PDF." },
    ],
  },
  "pdf/protect": {
    intro: [
      "Protect PDF adds a password to an existing PDF file, so it can only be opened by someone who knows the password — useful for sending sensitive documents like salary slips, contracts or ID copies over email where you don't want the content readable if it reaches the wrong inbox.",
      "This adds an 'open password' (user password) that Adobe Acrobat and most PDF readers respect, encrypting the document's contents; keep in mind that PDF password protection, while a useful basic safeguard, isn't unbreakable against determined attackers with specialized recovery tools, so treat it as a deterrent for casual access rather than military-grade security.",
    ],
    faqs: [
      { q: "What happens if I forget the password I set?", a: "There is no way to recover a lost password from a protected PDF through this tool — store the password somewhere safe, since a forgotten password means the document becomes permanently inaccessible without third-party password-recovery software." },
      { q: "Is PDF password protection strong enough for highly confidential documents?", a: "It's a reasonable basic safeguard against casual unauthorized access (like an email being read by the wrong person), but determined attackers with dedicated cracking tools can sometimes break weaker passwords — use a long, unique password and consider additional safeguards for extremely sensitive files." },
    ],
  },
  "pdf/unlock": {
    intro: [
      "Unlock PDF removes a known password from a protected PDF, producing a copy that opens without needing to re-enter the password each time — useful when you've set a password yourself and want to remove it later, or when you have legitimate access to a password-protected document you receive regularly (like a monthly bank statement) and want to skip re-typing the password every time.",
      "You must know the existing password to unlock the file — this tool removes protection from documents you're authorized to access, it doesn't crack or bypass passwords on files you don't have the password for, since that would raise obvious legal and ethical issues around unauthorized access to protected documents.",
    ],
    faqs: [
      { q: "Can this tool remove a password I don't know?", a: "No, you need to enter the correct existing password to unlock the file. This tool removes protection from documents you're authorized to open, not bypass security on files you don't have permission to access." },
      { q: "Is it legal to remove the password from a bank statement PDF I receive monthly?", a: "Since you're the account holder with legitimate access and the correct password, removing it for your own convenience is generally fine — just be mindful of where you store the resulting unprotected file, since it no longer has that access barrier." },
    ],
  },
  "pdf/rotate": {
    intro: [
      "Rotate PDF fixes pages that were scanned or saved sideways or upside-down, letting you rotate all pages at once or select specific pages individually — a common fix needed after scanning documents on a machine that doesn't auto-detect page orientation.",
      "Incorrect page orientation is one of the most frequent annoyances with scanned PDFs, especially multi-page documents where some pages were fed into the scanner in a different orientation than others — this tool lets you correct each page independently rather than forcing the same rotation across the whole file.",
    ],
    faqs: [
      { q: "Can I rotate just one page in a multi-page PDF, leaving the rest unchanged?", a: "Yes, you can select individual pages to rotate rather than applying the same rotation to the entire document, which is useful when only some pages in a scanned batch came out sideways." },
      { q: "Does rotating a PDF page affect its content quality?", a: "No, rotation simply changes the page's orientation metadata and view angle without re-rendering or compressing the underlying content, so text and image quality remain unchanged." },
    ],
  },
  "pdf/delete-pages": {
    intro: [
      "Delete Pages removes specific pages from a PDF — a blank scanned page, a duplicate, an irrelevant cover sheet, or an outdated page in a contract — producing a clean document without those pages, without needing to rebuild the file from scratch.",
      "This is especially useful for scanned document batches where a flatbed scanner occasionally picks up a stray blank page, or when submitting a large PDF to a portal that has a strict page-count or file-size limit and you need to trim it down to only the relevant pages.",
    ],
    faqs: [
      { q: "Can I preview pages before deciding which to delete?", a: "Yes, thumbnails of each page are shown so you can visually confirm which pages to remove before finalizing, avoiding the risk of deleting the wrong page from a long document." },
      { q: "Does deleting pages change the page numbers of the remaining content?", a: "The remaining pages keep their original content but are renumbered sequentially in the new file's page order; any printed page numbers within the document's own content (like a footer) are not automatically updated." },
    ],
  },
  "pdf/reorder-pages": {
    intro: [
      "Reorder Pages lets you drag and drop pages of a PDF into a new sequence — useful when scanned pages came out of order, when combining sections that need to be read in a different sequence than they were originally assembled, or when rearranging a presentation-style PDF for a different audience.",
      "A visual thumbnail grid of every page is shown so you can drag pages into place while seeing exactly what each page contains, which is far more reliable than reordering blind based on page numbers alone, especially for documents without clear page labels.",
    ],
    faqs: [
      { q: "Can I reorder pages across a very long document easily?", a: "Yes, the thumbnail-based drag-and-drop interface works for documents of any length, though very long documents naturally require more scrolling to move pages across large distances in the sequence." },
      { q: "Does reordering pages affect any bookmarks or links inside the PDF?", a: "Reordering changes the physical page sequence in the output file; internal navigation elements like bookmarks or hyperlinks that reference specific page numbers may need to be checked afterward since their target page positions have shifted." },
    ],
  },
  "pdf/extract-pages": {
    intro: [
      "Extract Pages pulls a specific range of pages out of a larger PDF and saves them as a new, separate document — useful for sharing just one chapter of a report, submitting only the relevant pages of a contract, or isolating a single form from a bundled scanned packet.",
      "Unlike deleting pages (which keeps everything except what you remove), extracting pages keeps only the range you specify and discards the rest — the better choice when you know exactly which few pages you need and don't want to manually delete everything else one by one.",
    ],
    faqs: [
      { q: "What's the difference between Extract Pages and Delete Pages?", a: "Extract Pages keeps only the pages you select (discarding everything else), while Delete Pages removes only the pages you select (keeping everything else). Use Extract when you need a small subset, and Delete when you're removing just a few unwanted pages." },
      { q: "Can I extract a non-continuous set of pages, like pages 2, 5 and 9?", a: "Yes, you can specify multiple ranges or individual page numbers, and they'll be combined into a single new PDF in the order you specify." },
    ],
  },
  "pdf/extract-text": {
    intro: [
      "Extract Text pulls all readable text content out of a PDF into plain text, which you can then copy, search, or paste into a Word document, spreadsheet or text editor — useful for repurposing content from a report, quoting a contract clause, or getting text out of a PDF that doesn't allow direct copy-paste.",
      "This works reliably on PDFs that contain actual selectable text (most digitally created PDFs); for scanned image-based PDFs where the 'text' is really just a picture of text, this tool cannot extract it directly since there's no underlying text layer to read — those need OCR (optical character recognition) instead.",
    ],
    faqs: [
      { q: "Why does extraction return nothing for a scanned PDF?", a: "A scanned PDF stores each page as an image, not as actual text characters — there's no text layer for this tool to read. You'd need an OCR (optical character recognition) tool to first convert the scanned image into recognized text before extraction works." },
      { q: "Does the extracted text preserve the original formatting like tables and columns?", a: "Extracted text is plain text without the original layout, fonts or table structure — complex layouts like multi-column pages or tables may come out in a different reading order than the visual original, so some manual cleanup may be needed." },
    ],
  },
  "pdf/pdf-to-word": {
    intro: [
      "PDF to Word converts a PDF's text content into an editable .docx file that opens in Microsoft Word or Google Docs, letting you edit content that was previously locked in a fixed PDF format — useful for updating an old resume, editing a contract template, or repurposing a report's text without retyping it.",
      "Conversion quality depends heavily on the source PDF: text-based PDFs with simple layouts convert cleanly, while PDFs with complex multi-column layouts, tables or heavy design elements may need manual formatting adjustments afterward in Word, since converting fixed-layout PDF positioning back into flowing editable Word paragraphs is inherently an imperfect process.",
    ],
    faqs: [
      { q: "Will the converted Word document look identical to the original PDF?", a: "Basic formatting like paragraphs and headings usually carries over, but complex layouts (multi-column text, precise design elements, unusual fonts) often need manual adjustment after conversion since PDF and Word handle layout very differently." },
      { q: "Can I convert a scanned (image-based) PDF to Word?", a: "This tool converts the text layer of a PDF; a scanned PDF without an underlying text layer would need OCR processing first to recognize the text before it can be converted into editable Word content." },
    ],
  },
  "pdf/page-numbers-add": {
    intro: [
      "Add Page Numbers inserts sequential page numbers into every page of a PDF, with options for position (top or bottom, left, center or right) and starting number — useful for finalizing reports, theses, legal documents or booklets before printing or submission, where page numbering is often a formatting requirement.",
      "Many academic and legal submission guidelines specify exact page-number placement and starting conventions (like starting the count from the first content page rather than the cover), and this tool's position and start-number options let you match those specific formatting requirements without needing the original source document or design software.",
    ],
    faqs: [
      { q: "Can I start numbering from a page other than 1, like skipping the cover page?", a: "Yes, you can set a custom starting number, which is useful when the cover page or table of contents shouldn't count as page 1 of the main content." },
      { q: "Can I choose where on the page the number appears?", a: "Yes, choose from common positions like bottom-center, bottom-right, top-center or top-right to match the formatting convention required by your document, institution or publisher." },
    ],
  },
  "pdf/watermark-add": {
    intro: [
      "Add Watermark overlays custom text (like 'CONFIDENTIAL', 'DRAFT', or your company name) diagonally or in a chosen position across every page of a PDF — used to mark draft documents before final approval, brand shared reports, or discourage unauthorized redistribution of sensitive files.",
      "A visible text watermark is a lightweight deterrent rather than an unbreakable protection — it clearly signals a document's status (draft, confidential, sample) or ownership without requiring recipients to install any special software to view it, unlike more complex DRM protections.",
    ],
    faqs: [
      { q: "Can I control the watermark's opacity so it doesn't obscure the text underneath?", a: "Yes, opacity is adjustable so the watermark stays visible without making the underlying document content unreadable." },
      { q: "Does the watermark appear on every page automatically?", a: "Yes, once applied the watermark text is stamped consistently across all pages of the document in the position and style you choose." },
    ],
  },
  "pdf/compare": {
    intro: [
      "Compare PDFs runs a text-level diff between two versions of a document, highlighting what was added, removed or changed — useful for reviewing contract redlines, checking whether a revised agreement matches the previously agreed terms, or spotting edits between draft versions of a report.",
      "Rather than manually scanning two long documents side by side looking for subtle wording changes (a slow and error-prone process, especially in legal or financial documents where a single changed number or clause matters), this tool surfaces every textual difference automatically so nothing gets missed.",
    ],
    faqs: [
      { q: "Does this compare the visual layout of the PDFs or just the text?", a: "The comparison is text-based, focused on identifying added, removed or changed wording between the two documents — visual-only differences like font or color changes that don't affect the underlying text won't be flagged." },
      { q: "Can I use this to check if a contract's final version matches the draft I approved?", a: "Yes, this is one of the most common uses — upload the draft you approved and the final version you received to instantly see whether any clauses were altered before signing." },
    ],
  },
  "image/compress": {
    intro: [
      "Compress Image reduces a photo or graphic's file size using an adjustable quality slider, letting you shrink images for faster website loading, smaller email attachments, or fitting under a strict upload size limit on a job application portal or government form.",
      "Compression works by reducing the fine detail encoded in the image (particularly at lower quality settings) while keeping the visible resolution the same, so you can find the sweet spot between file size and visual quality — a 20-30% quality reduction is often visually unnoticeable but cuts file size dramatically for photo-heavy JPGs.",
    ],
    faqs: [
      { q: "How much can I compress an image before quality loss becomes visible?", a: "It varies by image, but most JPGs can be compressed to 60-80% quality with little to no visible difference to the eye, while pushing much below 50% often introduces noticeable blockiness, especially in images with fine detail or gradients." },
      { q: "Does compressing an image reduce its pixel dimensions?", a: "No, compression here reduces file size by adjusting encoding quality, not the image's width and height — if you also need smaller dimensions, use the Resize Image tool alongside this one." },
    ],
  },
  "image/resize": {
    intro: [
      "Resize Image changes an image's pixel dimensions either by entering exact width and height or by a percentage scale, useful for fitting a photo to a website's required banner size, shrinking a large camera photo before uploading, or preparing images for a specific print or social media format.",
      "Resizing by percentage keeps the original aspect ratio consistent automatically, avoiding the stretched or squashed look that happens when width and height are changed independently without maintaining proportion — this tool supports both modes depending on whether you need an exact pixel size or a proportional scale-down.",
    ],
    faqs: [
      { q: "Will resizing an image make it blurry?", a: "Reducing an image's dimensions (downscaling) generally keeps it sharp; enlarging a small image beyond its original resolution (upscaling) can make it look soft or blurry since new pixel detail has to be artificially generated rather than genuinely captured." },
      { q: "Should I lock the aspect ratio when resizing?", a: "Yes, unless you specifically want to stretch or squash the image — locking the aspect ratio ensures the resized image looks proportionally identical to the original rather than distorted." },
    ],
  },
  "image/convert": {
    intro: [
      "Convert Format switches an image between JPG, PNG, WebP and GIF formats — needed when a website, app or print service only accepts a specific format, or when you want to switch from PNG (larger, supports transparency) to JPG (smaller, no transparency) or the modern WebP format for faster web loading.",
      "Each format trades off differently: JPG suits photos with smooth gradients at small file sizes but doesn't support transparency, PNG preserves sharp edges and transparency but produces larger files, WebP offers a strong balance of small size and quality for modern websites, and GIF supports simple animation but limited colors.",
    ],
    faqs: [
      { q: "Which format should I use for a logo with a transparent background?", a: "Use PNG or WebP — both support transparency, unlike JPG which always fills transparent areas with a solid background color (usually white) when converted." },
      { q: "Why are WebP images smaller than JPG at similar quality?", a: "WebP uses more modern, efficient compression algorithms than the older JPEG standard, typically achieving 25-35% smaller file sizes at comparable visual quality — which is why most modern websites prefer WebP for faster page loads." },
    ],
  },
  "image/crop": {
    intro: [
      "Crop Image lets you interactively select and cut out a specific region of a photo, with aspect-ratio presets for common needs like square (1:1) for social media, 4:3 for standard photos, or 16:9 for widescreen banners, so the cropped result fits exactly where you need it.",
      "Cropping is often the fastest fix for a photo that has too much unwanted background, isn't centered on the subject, or needs to fit a specific platform's required aspect ratio (like a square Instagram post or a widescreen YouTube thumbnail) without needing full photo-editing software.",
    ],
    faqs: [
      { q: "Can I crop to a free-form shape instead of a fixed aspect ratio?", a: "Yes, alongside the fixed aspect-ratio presets you can drag the crop selection freely to any custom rectangle if you don't need to match a specific standard ratio." },
      { q: "Does cropping reduce the image's resolution?", a: "Cropping keeps the original pixel density of the retained region — since you're keeping a smaller area of the original image, the cropped output will have fewer total pixels than the full original, but the same sharpness per pixel." },
    ],
  },
  "image/watermark": {
    intro: [
      "Watermark Image overlays custom text or a logo image onto your photos, with adjustable position and opacity — used by photographers, content creators and businesses to mark ownership on images shared online and discourage unauthorized reuse without permission or credit.",
      "A watermark placed across a meaningful part of the image (rather than just a corner) is much harder to crop out, which is why many photographers choose semi-transparent, larger watermarks over small corner logos when protecting portfolio images meant for public preview before a paid purchase.",
    ],
    faqs: [
      { q: "Should I use a text watermark or a logo image watermark?", a: "A logo watermark reinforces brand recognition and looks more professional for business use, while a text watermark (like a photographer's name or website) is quicker to set up and easily customizable per image without needing a pre-made logo file." },
      { q: "Where should I place a watermark to prevent easy cropping?", a: "Centering the watermark or spreading it diagonally across a large portion of the image makes it much harder for someone to crop it out compared to placing it only in a small corner, which can simply be cut off." },
    ],
  },
  "image/to-base64": {
    intro: [
      "Image to Base64 converts an image file into a Base64-encoded text string that can be embedded directly inside HTML, CSS or JSON — useful for developers who want to inline a small icon or image into code without hosting it as a separate file, avoiding an extra network request.",
      "Base64 encoding increases the data size by roughly 33% compared to the original binary file, so it's best suited for small images like icons or logos rather than large photos — embedding oversized images as Base64 can bloat your HTML/CSS file size and slow down page rendering rather than speeding it up.",
    ],
    faqs: [
      { q: "Why would a developer embed an image as Base64 instead of linking to a file?", a: "Inlining a small image as Base64 avoids a separate HTTP request to fetch that file, which can slightly speed up rendering for tiny assets like icons — though for larger images, the ~33% size overhead usually makes a linked file more efficient." },
      { q: "Is Base64 encoding a form of image compression?", a: "No, Base64 is just a way of representing binary data as text — it doesn't reduce file size and actually increases it slightly; if you need a smaller file, compress the image first, then convert to Base64." },
    ],
  },
  "image/rotate-flip": {
    intro: [
      "Rotate/Flip lets you rotate an image in 90-degree increments and flip it horizontally or vertically — the standard fix for photos taken sideways or upside-down, or for mirroring an image (useful for correcting a selfie-camera mirror effect or preparing a design element that needs to face the opposite direction).",
      "Phone cameras sometimes save orientation as metadata rather than physically rotating pixels, which is why a photo can look upright on your phone but sideways when opened elsewhere — this tool physically rotates the pixel data itself, so the corrected orientation is preserved consistently across every app and device.",
    ],
    faqs: [
      { q: "Why does a photo appear correctly oriented on my phone but sideways elsewhere?", a: "Some cameras store orientation as EXIF metadata rather than rotating the actual pixel grid, and not every app or website reads that metadata correctly. Physically rotating the image (as this tool does) fixes the orientation permanently regardless of how the viewing app handles metadata." },
      { q: "What's the difference between flipping and rotating an image?", a: "Rotating turns the image around a center point (like 90° clockwise), while flipping creates a mirror image along a horizontal or vertical axis — flipping reverses left-right or top-bottom, rotating changes the overall orientation angle." },
    ],
  },
  "image/background-color-change": {
    intro: [
      "Background Color Change fills a solid color behind a transparent PNG image — useful when you have a logo or product cutout with a transparent background and need it placed on a specific colored background for a presentation slide, ID photo, product listing or social media template.",
      "This works specifically with images that already have transparency (like a PNG with the background removed); for a photo with an existing solid background you'd first need to remove that background before a new color can be filled in behind the subject.",
    ],
    faqs: [
      { q: "Does this tool remove the existing background of a photo first?", a: "No, this tool fills a chosen color behind existing transparent areas of a PNG — it requires the image to already have transparency; it doesn't detect and remove a solid background from a regular photo." },
      { q: "What background color is commonly required for passport or ID photos?", a: "Indian passport photos typically require a plain white background, while some visa applications specify light grey or off-white — always check the specific requirement of the document you're applying for before choosing a color." },
    ],
  },
  "image/collage-maker": {
    intro: [
      "Collage Maker combines multiple photos into a single grid layout, letting you pick a layout template and arrange your images into one shareable file — handy for creating a photo memory grid, a before/after comparison, or a multi-image post for social media in one image instead of several.",
      "Some social platforms and messaging apps handle a single combined image more reliably than a multi-image carousel post, and a collage also makes it easy to share several related photos as one file over email or print, rather than sending each photo separately.",
    ],
    faqs: [
      { q: "Can I mix photos of different sizes and orientations in one collage?", a: "Yes, the layout templates automatically crop and fit each photo into its grid cell regardless of the original image's dimensions or orientation." },
      { q: "How many photos can I combine into one collage?", a: "The number depends on the layout template chosen — grid layouts range from a couple of photos up to a dozen or more cells, letting you pick based on how many images you want to include." },
    ],
  },
  "image/meme-generator": {
    intro: [
      "Meme Generator adds classic top and bottom bold text captions to any image — the standard meme format popularized by image macros — letting you create shareable memes for social media or group chats directly in the browser without needing design software.",
      "The tool automatically applies the recognizable bold, outlined meme font and text positioning, so all you need to do is upload an image and type your caption text — no manual font selection or text-box positioning required to get the classic meme look.",
    ],
    faqs: [
      { q: "Can I use my own photo instead of a template image?", a: "Yes, you can upload any personal photo or image file and add top/bottom meme text to it, not just pre-made meme templates." },
      { q: "Is the meme font customizable?", a: "The tool uses the classic bold, white-with-black-outline meme font style by default, which is the recognizable format most meme templates use for maximum readability over any background image." },
    ],
  },
  "image/color-picker": {
    intro: [
      "Color Picker from Image lets you click any pixel in an uploaded photo to instantly get its exact hex and RGB color values — useful for designers matching a brand color from a reference photo, developers pulling exact colors for CSS, or anyone trying to identify a precise shade seen in an image.",
      "Manually guessing a color's hex code by eye is unreliable since screens and lighting vary, but sampling the actual pixel value gives you the exact color data embedded in the image file, ensuring your matched color in a design tool or code is pixel-accurate rather than an approximation.",
    ],
    faqs: [
      { q: "What's the difference between the hex code and RGB values shown?", a: "Both represent the same color in different formats — hex (like #3B82F6) is a compact code used widely in CSS and design tools, while RGB (like rgb(59, 130, 246)) shows the individual red, green and blue channel intensities that make up that color." },
      { q: "Can I pick a color from a screenshot I just took?", a: "Yes, upload any image file including a screenshot, and click anywhere on it to sample the exact color at that pixel." },
    ],
  },
  "image/favicon-generator": {
    intro: [
      "Favicon Generator creates a complete set of favicon files (the small icon shown in browser tabs, bookmarks and mobile home-screen shortcuts) from a single source image, packaged as a downloadable zip with all the standard sizes websites need for cross-browser and cross-device compatibility.",
      "Different browsers, devices and operating systems expect different favicon sizes (like 16x16, 32x32, 180x180 for Apple touch icons, and more), and manually resizing and exporting each one is tedious — this tool generates the full standard set from one upload, ready to drop into a website's root folder.",
    ],
    faqs: [
      { q: "Why do I need multiple favicon sizes instead of just one image?", a: "Different contexts (browser tab, bookmark bar, mobile home screen icon, Windows tile) each expect a specific resolution for crisp display — providing only one size can result in a blurry or oddly-scaled icon in some of these contexts." },
      { q: "What source image works best for generating a favicon?", a: "A square, simple image with clear detail works best, since favicons are viewed very small — a source image with excessive detail or a busy design tends to look muddy once scaled down to 16x16 or 32x32 pixels." },
    ],
  },
  "image/image-to-pdf": {
    intro: [
      "Image to PDF combines one or more images into a single PDF document — the same conversion available under the PDF tools collection, included here in the Image tools section for convenience when you're already working with images and want to package them into a PDF without navigating elsewhere.",
      "This is especially handy right after editing images (cropping, rotating, watermarking) in the other Image tools — once your images are ready, converting them straight to a combined PDF keeps your workflow in one place instead of jumping between tool categories.",
    ],
    faqs: [
      { q: "Does image quality get reduced when converting to PDF?", a: "The images are embedded into the PDF at their existing resolution and quality; no additional compression is forced during the conversion, though very high-resolution images will result in a proportionally larger PDF file." },
      { q: "Can I arrange the order of images before creating the PDF?", a: "Yes, you can reorder the uploaded images before generating the PDF so pages appear in your intended sequence." },
    ],
  },
  "image/exif-viewer-remover": {
    intro: [
      "EXIF Viewer/Remover reads and displays the hidden metadata embedded in a photo — camera model, date/time taken, and often precise GPS coordinates of where the photo was shot — and lets you strip that metadata out before sharing the image publicly.",
      "Smartphone photos frequently embed exact GPS location by default, meaning a photo posted online without stripping EXIF data can reveal your home address, workplace or precise location history to anyone who checks the file's metadata — removing EXIF data before posting sensitive photos online is a basic but important privacy step, and it happens entirely in your browser here without uploading the photo anywhere.",
    ],
    faqs: [
      { q: "Can someone find my home address from a photo I post online?", a: "Yes, if the photo retains its original GPS EXIF data and the platform doesn't strip it automatically, anyone who downloads the original file and checks its metadata can see the exact coordinates where it was taken — stripping EXIF data before sharing prevents this." },
      { q: "Do social media platforms automatically remove EXIF data?", a: "Most major platforms (Instagram, Facebook, WhatsApp) strip EXIF data from photos during upload, but not all platforms, messaging apps, or direct file shares do — it's safer to remove sensitive metadata yourself before sharing rather than assuming a platform will do it for you." },
    ],
  },
  "image/grayscale-filter": {
    intro: [
      "Grayscale/B&W Filter applies a one-click black-and-white or sepia tone conversion to any photo, useful for creating a classic monochrome look for portraits, preparing images for black-and-white printing to save color ink, or giving a photo a vintage aesthetic for design projects.",
      "Grayscale conversion removes all color information while preserving brightness and contrast detail, while sepia applies a warm brownish tone reminiscent of old photographs — both are common stylistic choices in photography and design that also happen to reduce printing costs when color ink isn't needed.",
    ],
    faqs: [
      { q: "What's the difference between grayscale and sepia filters?", a: "Grayscale removes all color, leaving only shades of black, white and grey based on brightness. Sepia applies a warm brown-toned filter that mimics the look of old photographs, rather than a neutral black-and-white conversion." },
      { q: "Does converting to grayscale reduce the file size?", a: "It can, since grayscale images require less color data per pixel than a full-color image, though the exact size reduction depends on the image format and its original color complexity." },
    ],
  },
  "image/svg-to-png": {
    intro: [
      "SVG to PNG rasterizes a scalable vector graphic (SVG) into a fixed-resolution PNG image at whatever output size you choose — needed because SVGs, while great for scaling in browsers and design tools, aren't accepted by every platform, and some tools only support raster formats like PNG.",
      "Because SVG is vector-based (defined by mathematical paths rather than a fixed pixel grid), you can rasterize it at any target resolution — a small 64x64 icon or a large 2000px banner — without the quality loss you'd get from upscaling an already-rasterized PNG or JPG image.",
    ],
    faqs: [
      { q: "Why would I convert a scalable SVG into a fixed-size PNG?", a: "Some platforms, older software, or email clients don't support SVG rendering and require a raster format like PNG. Converting also 'locks in' a specific size when you need a predictable, fixed-dimension image file rather than an infinitely scalable one." },
      { q: "What resolution should I choose when converting SVG to PNG?", a: "Choose a resolution based on where the image will be used — for a website icon, match the display size (accounting for retina/high-DPI screens by using 2x the display size); for print, use a much higher resolution appropriate for the print DPI." },
    ],
  },
  "generators/cv-resume-builder": {
    intro: [
      "The CV/Resume Builder generates a clean, ATS-friendly resume from a simple form — enter your work experience, education, skills and contact details, and get a formatted, downloadable resume without wrestling with Word formatting or paying for a template subscription.",
      "ATS (Applicant Tracking System) software is used by most mid-size and large companies to automatically scan resumes for keywords and structure before a human ever reads them — resumes with complex tables, graphics or unusual fonts often get misread or rejected by these systems, which is why this builder sticks to a clean, standard layout that parses reliably.",
    ],
    faqs: [
      { q: "What does 'ATS-friendly' actually mean for a resume?", a: "It means the resume avoids elements that automated tracking systems commonly misread — like multi-column layouts, text inside images, tables, or unusual fonts — so your work experience, skills and education are extracted correctly by the software recruiters use to filter applicants before human review." },
      { q: "Should I use the same resume for every job application?", a: "It's better to tailor your resume's skills and summary section to match keywords from each specific job description, since many ATS systems rank resumes partly by keyword match against the posting — a generic one-size-fits-all resume often scores lower." },
    ],
  },
  "generators/marriage-biodata-maker": {
    intro: [
      "The Marriage Biodata Maker creates an Indian-style matrimonial biodata PDF — covering personal details, family background, education, profession and horoscope information in the structured format traditionally shared for arranged marriage proposals through family networks or matrimonial sites.",
      "Indian matrimonial biodata conventionally follows a specific order (personal info, family details, education/career, then partner preferences) that relatives and matchmakers expect to scan quickly — following this familiar structure, rather than a generic resume format, makes the biodata feel appropriately formal and complete for the purpose.",
    ],
    faqs: [
      { q: "What sections should a marriage biodata typically include?", a: "A standard Indian marriage biodata usually includes personal details (name, DOB, height, complexion), family background (parents' occupation, siblings), education and profession, horoscope/rashi details if relevant, and sometimes partner preference — this tool's form is structured around these conventional sections." },
      { q: "Should I include a photo in the biodata?", a: "Yes, it's conventional practice to include a recent, clear photograph in a matrimonial biodata, since it's typically one of the first things relatives or prospective matches look at when reviewing a proposal." },
    ],
  },
  "generators/cover-letter-generator": {
    intro: [
      "The Cover Letter Generator produces a structured draft cover letter based on the job role, company and your key skills — giving you a solid starting structure (opening hook, relevant experience, closing call-to-action) that you can personalize rather than staring at a blank page.",
      "A cover letter's job isn't to repeat your resume — it should explain specifically why you want this role at this company and connect one or two of your strongest achievements directly to what the job posting asks for, which is the structure this generator's draft follows so you can fill in the specific, personal detail that makes it convincing.",
    ],
    faqs: [
      { q: "How long should a cover letter be?", a: "Generally three to four short paragraphs fitting on a single page — recruiters typically spend under a minute on a cover letter, so concise, specific content beats a long generic letter." },
      { q: "Should I use the same cover letter for every application?", a: "No, always customize the company name, role-specific details and which of your achievements you highlight — a cover letter that's clearly generic or has the wrong company name is one of the fastest ways to get an application dismissed." },
    ],
  },
  "generators/invoice-generator": {
    intro: [
      "The Invoice Generator creates a professional business invoice with your details, client details, itemized line items and automatic total calculation (including tax if applicable) — ready to download as a PDF and send to a client for payment, without needing accounting software for simple one-off invoicing.",
      "A proper invoice for Indian businesses typically needs invoice number, date, GSTIN (if registered), itemized description with quantity and rate, and the tax breakup — this generator's form is structured to capture exactly these fields so freelancers and small businesses can issue compliant, professional-looking invoices in minutes.",
    ],
    faqs: [
      { q: "Do I need to include GST on every invoice I raise?", a: "Only if you're GST-registered — businesses below the GST registration threshold (currently ₹20 lakh turnover for most services, ₹40 lakh for goods, varying by state) aren't required to charge GST. If you are registered, your GSTIN and correct tax rate must appear on every invoice." },
      { q: "What's the difference between an invoice and a receipt?", a: "An invoice is a request for payment issued before or at the time of a sale, stating what's owed. A receipt is proof that payment has already been received. This tool generates invoices; for post-payment receipts, see the Rent Receipt Generator or a dedicated receipt template." },
    ],
  },
  "generators/salary-slip-generator": {
    intro: [
      "The Salary Slip Generator creates a formatted monthly payslip showing earnings (basic, HRA, allowances) and deductions (PF, professional tax, TDS) with a net pay calculation — used by small businesses and startups that need to issue payslips without a full payroll software subscription.",
      "A proper Indian salary slip typically itemizes each earning and deduction component separately rather than showing just a lump-sum net figure, since employees often need this breakdown for HRA tax exemption claims, loan applications, or visa processing — this generator's structure follows that standard itemized format.",
    ],
    faqs: [
      { q: "Why do employees need a detailed salary slip instead of just the net amount?", a: "A detailed slip is required as proof for HRA tax exemption claims, home/personal loan applications, visa applications, and rental agreements — most of these require seeing the basic salary and HRA components separately, not just the total net pay." },
      { q: "What deductions are commonly shown on an Indian salary slip?", a: "Common deductions include employee Provident Fund (usually 12% of basic), Professional Tax (a small state-level tax, varies by state), and TDS (income tax deducted at source) if the employee's income crosses the taxable threshold." },
    ],
  },
  "generators/rent-receipt-generator": {
    intro: [
      "The Rent Receipt Generator creates monthly rent receipts for salaried employees who need to submit proof of rent paid to claim HRA (House Rent Allowance) tax exemption — each receipt includes tenant and landlord details, rent amount, period, and a space for the landlord's signature.",
      "For claiming HRA exemption, most employers require rent receipts for each month being claimed, and if annual rent exceeds ₹1,00,000 the landlord's PAN must also be furnished — pair this generator with the HRA Calculator to first work out your exact eligible exemption before submitting receipts to your employer.",
    ],
    faqs: [
      { q: "Do I need a rent receipt for every month I want to claim HRA?", a: "Most employers require a receipt for each month within the financial year you're claiming HRA exemption for, so if you're claiming for 12 months, you typically need 12 monthly receipts (or receipts for whichever months rent was actually paid)." },
      { q: "Is the landlord's PAN mandatory on the rent receipt?", a: "It's mandatory to provide the landlord's PAN to your employer (not necessarily printed on the receipt itself) if your total annual rent exceeds ₹1,00,000 — without it, your HRA claim can be rejected during tax assessment." },
    ],
  },
  "generators/offer-letter-generator": {
    intro: [
      "The Offer Letter Generator creates a formal employee offer letter template covering role, compensation, joining date and standard terms — useful for small businesses and startups extending a job offer without a dedicated HR department or legal template on hand.",
      "A well-structured offer letter typically states the designation, CTC breakup, joining date, reporting manager, and probation terms clearly upfront, since ambiguity in any of these at the offer stage is a common source of disputes later — this generator's fields are designed to capture each of these standard components.",
    ],
    faqs: [
      { q: "Is an offer letter legally binding like an employment contract?", a: "An offer letter is generally considered a preliminary commitment outlining terms, while a formal employment contract or appointment letter (often issued after joining) is the fully binding legal document — many companies treat the offer letter's core terms as binding once accepted, so clarity in it still matters." },
      { q: "What key details should never be missing from an offer letter?", a: "Designation, CTC (with a clear breakup or reference to an attached annexure), joining date, and work location are the essentials — omitting these often leads to confusion or disputes if expectations weren't clearly documented upfront." },
    ],
  },
  "generators/noc-letter-generator": {
    intro: [
      "The NOC Letter Generator creates No-Objection Certificate templates for common situations — like an employer's NOC for an employee's visa application, a housing society's NOC for a resale or rental, or a bank's NOC after loan closure — each following the standard format the receiving authority typically expects.",
      "An NOC's core purpose is simple: a formal written statement that the issuing party has no objection to a specific action (an employee travelling abroad, a flat owner renting out their unit, a vehicle transfer), and getting the wording, addressee and formal tone right matters since these letters are usually submitted to a strict institutional process like passport/visa offices, housing societies or banks.",
    ],
    faqs: [
      { q: "What is an NOC letter used for during visa applications?", a: "Many countries require employed visa applicants to submit an NOC from their employer confirming they're on approved leave and will return to their job — it reassures the visa authority that the applicant has ties compelling them to return home." },
      { q: "Who typically needs to sign an NOC for a housing society transaction?", a: "For renting or reselling a flat, the housing society secretary or authorized office bearer typically signs the NOC, confirming there are no pending dues or objections to the transaction from the society's side." },
    ],
  },
  "generators/certificate-maker": {
    intro: [
      "The Certificate Maker creates completion and participation certificate templates for courses, workshops, webinars and events — enter recipient name, course/event title, date and issuer details to generate a polished, printable certificate without design software.",
      "A well-designed certificate genuinely matters to recipients as a tangible record of achievement they may add to a resume or LinkedIn profile — pairing this maker with the Certificate Verification QR Generator lets institutes also add a scannable verification code, making the certificate both good-looking and harder to forge.",
    ],
    faqs: [
      { q: "What's the difference between a completion and a participation certificate?", a: "A completion certificate typically implies the recipient met specific requirements (passed an assessment, finished all modules), while a participation certificate simply acknowledges attendance without implying a performance benchmark was met — choose the wording that accurately reflects what was actually achieved." },
      { q: "Can I add a unique certificate number for verification purposes?", a: "Yes, include a unique certificate/reference number on each certificate, and pair it with the Certificate Verification QR Generator so recipients or employers can verify authenticity by scanning a QR code linked to your records." },
    ],
  },
  "generators/id-card-maker": {
    intro: [
      "The ID Card Maker creates employee or student ID card templates with photo, name, ID number, designation/class and organization details — sized to standard ID card dimensions, ready to print and laminate for office or campus use.",
      "Standard ID cards typically follow the CR80 card size (85.6mm x 54mm, the same size as a credit card) so they fit standard lanyard holders and card printers — this tool's template is designed around that familiar size so your printed card fits existing ID holders and badge equipment without needing custom cutting.",
    ],
    faqs: [
      { q: "What standard size should an ID card be for printing?", a: "The common standard is CR80 size (85.6mm x 54mm), the same dimensions as a credit card — this fits standard lanyard clips, card printers and plastic ID holders used by most offices and institutions." },
      { q: "Can I include a QR code on the ID card for verification?", a: "While this tool focuses on the standard ID layout, you can generate a verification QR separately using the Certificate Verification QR Generator or QR Code Generator and incorporate it into your design before printing." },
    ],
  },
  "generators/visiting-card-maker": {
    intro: [
      "The Visiting Card Maker designs a business card with your name, title, company, contact details and logo, exporting a print-ready PDF sized to standard business card dimensions — useful for small business owners, freelancers and consultants who need a professional card without hiring a designer.",
      "Standard business cards in India are typically printed at 3.5 x 2 inches (89mm x 51mm) with a small bleed margin for the printer to trim to size — this tool's export is formatted to that standard so your file goes straight to any local or online print shop without needing resizing.",
    ],
    faqs: [
      { q: "What size should I design a business card for printing in India?", a: "The standard size is 3.5 x 2 inches (89mm x 51mm), the same as most credit cards — this tool exports at that standard dimension so it's ready for any print shop without adjustment." },
      { q: "Should I include a QR code on my visiting card?", a: "Many modern business cards include a QR code linking to a website, portfolio, or a save-contact vCard — it's an increasingly common addition that lets recipients save your details instantly instead of manually typing them into their phone." },
    ],
  },
  "generators/letterhead-maker": {
    intro: [
      "The Letterhead Maker generates a company letterhead template with your logo, business name, address and contact details positioned in the header (and optionally footer), ready to use as a background for official letters, quotations and formal correspondence.",
      "A consistent letterhead signals professionalism and helps recipients quickly identify the sender on physical or PDF correspondence — small businesses often skip this step and send plain-text letters, which can look less credible than a properly branded one especially for formal communication like legal notices, quotations or client proposals.",
    ],
    faqs: [
      { q: "What information should a business letterhead include?", a: "Typically the company name/logo, registered address, contact number, email, and website — some businesses also include GSTIN or CIN registration numbers for formal legal or financial correspondence." },
      { q: "Can I reuse the same letterhead file for every letter I write?", a: "Yes, the letterhead is designed as a reusable header/footer template — save the generated file and use it as your base document each time you draft an official letter, rather than recreating it from scratch." },
    ],
  },
  "generators/signature-generator": {
    intro: [
      "The Signature Generator creates a signature as a transparent PNG image, either by typing your name in a stylized script font or by drawing it directly with your mouse or touchscreen — useful for signing PDFs digitally, adding a personal touch to emails, or inserting a consistent signature into documents without printing and rescanning.",
      "A transparent-background PNG signature can be dropped onto any document, contract or form in a PDF editor or Word file without a white box showing around it — this is different from a legally binding digital signature certificate (DSC) used for statutory filings, which requires a government-issued cryptographic certificate rather than an image of your handwriting.",
    ],
    faqs: [
      { q: "Is a signature image the same as a legally valid digital signature (DSC)?", a: "No — an image of your signature is useful for informal documents and quick approvals, but it does not carry the legal weight of a Digital Signature Certificate (DSC) issued by a licensed certifying authority, which is required for statutory filings like income tax returns, MCA filings or e-tenders." },
      { q: "Should I draw my signature or use the typed script font option?", a: "Drawing gives a more personal, authentic-looking signature closer to your actual handwriting, while the typed script font option is faster and looks clean and consistent — choose based on whether authenticity or speed matters more for your use case." },
    ],
  },
  "generators/invitation-card-maker": {
    intro: [
      "The Invitation Card Maker provides ready-to-customize templates for weddings, birthdays and general events — add names, date, venue and a short message to generate a shareable digital invitation card without hiring a designer or buying printed cards.",
      "Digital invitations sent over WhatsApp or email have become the norm for many Indian events alongside or instead of printed cards, since they're instant, free to distribute to large guest lists, and easy to update if event details change — this tool covers the common template categories these events typically need.",
    ],
    faqs: [
      { q: "Can I use a digital invitation instead of printing physical cards?", a: "Yes, digital invitations shared via WhatsApp, email or social media are now widely accepted for most events, and are far cheaper and faster to distribute than printed cards, especially for large guest lists spread across different cities." },
      { q: "What key details should never be missing from an invitation?", a: "Date, time, venue (with a map link if digital), and RSVP contact details are the essentials — many invitations that look great but omit a clear venue address or RSVP method cause unnecessary confusion for guests." },
    ],
  },
  "generators/passport-photo-maker": {
    intro: [
      "The Passport Photo Maker crops an uploaded photo to standard passport and visa photo specifications — Indian passport photos require a 2x2 inch (51x51mm) size with a plain white background and specific face-size proportions — and can arrange multiple copies onto a single printable sheet to save on photo studio costs.",
      "Different countries specify slightly different photo requirements (size, background color, head-size proportion), and a photo that doesn't meet the exact specification can cause an application to be rejected or delayed — this tool's presets help match the common Indian passport and popular visa photo formats before you print or upload.",
    ],
    faqs: [
      { q: "What is the standard size for an Indian passport photo?", a: "Indian passport photos must be 2x2 inches (51mm x 51mm) with a plain white or light-colored background, taken within the last 6 months, with a neutral expression and both ears visible." },
      { q: "Can I print multiple passport photos on one sheet to save money?", a: "Yes, this tool can arrange multiple copies of your cropped photo onto a single 4x6 inch or similar print sheet, which is the standard approach photo studios use to print several copies economically on one piece of photo paper." },
    ],
  },
};

export function getToolSeoOverride(category: string, slug: string) {
  return toolSeoOverrides[`${category}/${slug}`];
}
