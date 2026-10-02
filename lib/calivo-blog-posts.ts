import type { BlogPost } from "./blog-posts";

/**
 * Health & nutrition cluster supporting the CALIVO AI app page (/calivo-ai).
 * Every post: answers one high-intent Indian search query, gives honest
 * approximate numbers (labelled as such), links back to /calivo-ai, and ends
 * with the CALIVO AI download CTA (cta: "calivo").
 * Nutrition values are typical home-style estimates; they are NOT medical advice.
 */
export const calivoPosts: BlogPost[] = [
  {
    slug: "calories-in-indian-food-chart",
    title: "Calories in Indian Food: Chart for Roti, Rice, Dal, Sabzi & 40+ Everyday Dishes",
    description:
      "A simple calorie chart for common Indian foods — roti, paratha, rice, dal, sabzi, idli, dosa, poha, biryani, snacks and sweets — with home-style portion sizes.",
    date: "2026-10-02",
    category: "Health & Nutrition",
    readTime: "8 min read",
    cta: "calivo",
    content: `
Counting calories in Indian food is harder than in packaged food. The same katori of dal can be 120 kcal or 250 kcal depending on how much ghee went into the tadka. This chart gives you **typical home-style estimates** so you can understand where your calories come from.

All numbers below are approximate. Restaurant food usually has 30–60% more calories than home food because of extra oil, butter and cream.

## Rotis, Rice & Breads

| Food | Portion | Approx. calories |
|---|---|---|
| Plain roti / chapati (no ghee) | 1 medium (about 40 g atta) | 100–120 kcal |
| Roti with ghee | 1 medium + ½ tsp ghee | 140–150 kcal |
| Plain paratha | 1 medium | 200–230 kcal |
| Aloo paratha | 1 medium | 280–320 kcal |
| Puri | 1 piece | 100–130 kcal |
| Naan (restaurant) | 1 piece | 260–320 kcal |
| Steamed rice | 1 katori cooked (about 150 g) | 180–200 kcal |
| Jeera rice | 1 katori | 220–250 kcal |
| Brown rice | 1 katori cooked | 170–190 kcal |

## Dal, Curries & Sabzi

| Food | Portion | Approx. calories |
|---|---|---|
| Dal tadka (home) | 1 katori (about 150 ml) | 140–180 kcal |
| Dal makhani (restaurant) | 1 katori | 280–350 kcal |
| Rajma | 1 katori | 190–230 kcal |
| Chole | 1 katori | 210–260 kcal |
| Sambar | 1 katori | 100–130 kcal |
| Mixed veg sabzi (dry) | 1 katori | 110–150 kcal |
| Aloo gobi | 1 katori | 140–180 kcal |
| Bhindi masala | 1 katori | 120–160 kcal |
| Palak paneer | 1 katori | 230–280 kcal |
| Paneer butter masala | 1 katori | 330–400 kcal |
| Chicken curry (home) | 1 katori with 2–3 pieces | 230–300 kcal |
| Egg curry | 2 eggs with gravy | 250–300 kcal |

## Breakfast Foods

| Food | Portion | Approx. calories |
|---|---|---|
| Poha | 1 plate (about 200 g) | 250–300 kcal |
| Upma | 1 plate | 230–280 kcal |
| Idli | 1 piece | 40–60 kcal |
| Plain dosa | 1 medium | 120–170 kcal |
| Masala dosa | 1 piece | 350–420 kcal |
| Besan chilla | 1 medium | 120–150 kcal |
| Moong dal chilla | 1 medium | 110–140 kcal |
| Boiled egg | 1 | 70–78 kcal |
| Oats with milk | 1 bowl | 220–280 kcal |

## Snacks, Drinks & Sweets

| Food | Portion | Approx. calories |
|---|---|---|
| Samosa | 1 piece | 230–280 kcal |
| Pakora | 5 pieces | 220–280 kcal |
| Vada pav | 1 | 280–320 kcal |
| Masala chai with sugar | 1 cup | 80–110 kcal |
| Sweet lassi | 1 glass | 220–280 kcal |
| Buttermilk (chaas) | 1 glass | 40–60 kcal |
| Gulab jamun | 1 piece | 140–160 kcal |
| Rasgulla | 1 piece | 100–120 kcal |
| Jalebi | 2 pieces (about 50 g) | 180–220 kcal |
| Chicken biryani | 1 plate (restaurant) | 500–700 kcal |

## The 3 Hidden Sources of Calories in Indian Food

- **Oil and ghee:** 1 teaspoon is about 40–45 kcal. A sabzi cooked with 3 teaspoons of oil adds ~130 kcal before you count the vegetables.
- **Portion creep:** A "katori" at home can be 100 ml or 250 ml. Use the same katori every day so your estimate stays consistent.
- **Drinks and add-ons:** Two cups of sugary chai, a spoon of pickle in oil and a papad can quietly add 250–300 kcal a day.

## How to Count Calories Without Weighing Everything

You do not need a kitchen scale for every meal. A practical method is to learn your **regular portions** once — your roti size, your katori, your rice serving — and then estimate from there.

The faster way is to let AI do it. With [CALIVO AI](/calivo-ai), you click a photo of your plate and it lists each item — roti, dal, sabzi, rice — with calories, protein, carbs and an oil/ghee estimate. You can adjust the quantity (for example 2 rotis instead of 1) before saving. It is still an estimate, but it is far faster than searching every item manually.

## Key Takeaways

- A typical home meal of 2 roti + 1 katori dal + 1 katori sabzi is roughly 450–550 kcal.
- Cooking fat is the biggest variable — measure oil with a spoon, not by pouring.
- Restaurant versions of the same dish often have 1.5x the calories.
- Consistent estimation beats perfect measurement.
    `.trim(),
  },
  {
    slug: "indian-diet-plan-for-weight-loss-vegetarian",
    title: "Indian Diet Plan for Weight Loss: 7-Day Vegetarian Chart (About 1,500 kcal)",
    description:
      "A practical 7-day vegetarian Indian diet plan for weight loss with meal timings, portions and protein tips — using normal home food like dal, roti, poha and paneer.",
    date: "2026-10-01",
    category: "Health & Nutrition",
    readTime: "9 min read",
    cta: "calivo",
    content: `
Losing weight on Indian food does not mean eating boiled vegetables. It means **eating your normal food in the right portions, with more protein and fibre and less hidden oil and sugar**.

This sample plan is about 1,400–1,600 kcal a day, which suits many adults who want to lose weight slowly. Your own number depends on your age, height, weight and activity — a 1,500 kcal plan may be too little for a tall, active man and too much for a short, inactive woman.

## The 5 Rules Behind This Plan

- **Protein in every meal:** dal, chana, paneer, curd, sprouts, soya or tofu. Protein keeps you full and protects muscle while you lose fat.
- **Half the plate vegetables** at lunch and dinner.
- **Rotis and rice in fixed portions:** 2 rotis or 1 katori rice per meal, not both in large amounts.
- **Oil measured with a spoon:** about 3–4 teaspoons for the whole day.
- **No liquid sugar:** chai with little or no sugar, no packaged juices or cold drinks.

## Sample Day Structure

| Time | Meal | Example |
|---|---|---|
| 7:00 AM | Early morning | Warm water + 5 soaked almonds |
| 8:30 AM | Breakfast | 1 plate vegetable poha with peanuts + 1 cup curd |
| 11:00 AM | Mid-morning | 1 fruit (apple, guava or papaya) |
| 1:30 PM | Lunch | 2 roti + 1 katori dal + 1 katori sabzi + salad |
| 5:00 PM | Evening | Masala chai (less sugar) + 1 katori roasted chana |
| 8:00 PM | Dinner | 2 moong dal chilla + 1 katori paneer bhurji or curd + salad |

## 7-Day Vegetarian Plan

### Day 1
- **Breakfast:** Vegetable poha (1 plate) + 1 cup curd
- **Lunch:** 2 roti, moong dal, lauki sabzi, cucumber salad
- **Evening:** Roasted chana (1 small katori) + green tea
- **Dinner:** 2 besan chilla with mint chutney + 1 katori curd

### Day 2
- **Breakfast:** 3 idli + 1 katori sambar
- **Lunch:** 1 katori rice, rajma (1 katori), salad
- **Evening:** 1 fruit + buttermilk
- **Dinner:** 2 roti, palak paneer (1 katori, less cream)

### Day 3
- **Breakfast:** Oats upma or vegetable daliya (1 bowl)
- **Lunch:** 2 roti, chole (1 katori), onion-tomato salad
- **Evening:** Sprouts chaat (1 katori)
- **Dinner:** Vegetable khichdi (1.5 katori) + curd

### Day 4
- **Breakfast:** 2 moong dal chilla + green chutney
- **Lunch:** 2 roti, dal tadka, bhindi sabzi (less oil)
- **Evening:** Makhana roasted (1 cup) + chai
- **Dinner:** Paneer tikka (100 g) + sautéed vegetables + 1 roti

### Day 5
- **Breakfast:** 1 plain dosa + sambar
- **Lunch:** 1 katori rice + sambar + beans poriyal + curd
- **Evening:** 1 fruit + 5 almonds
- **Dinner:** 2 roti + soya chunk curry (1 katori)

### Day 6
- **Breakfast:** Besan chilla stuffed with paneer (2 small)
- **Lunch:** 2 roti, kadhi (less oil), aloo-matar (small katori), salad
- **Evening:** Buttermilk + roasted chana
- **Dinner:** Moong dal soup + 1 roti + mixed vegetable sabzi

### Day 7
- **Breakfast:** Vegetable sandwich on brown bread with hung curd spread
- **Lunch:** Small portion of your favourite meal — enjoy it mindfully
- **Evening:** Fruit chaat
- **Dinner:** Dal + 1 roti + big salad

## How Much Weight Can You Lose?

A deficit of about 400–500 kcal a day usually leads to roughly 0.5 kg loss per week for many people. Faster is not better — very low calorie diets make you tired, increase cravings and are hard to continue.

## Make the Plan Fit YOUR Body

A fixed chart cannot know your height, weight, activity, health conditions or the foods you like. That is exactly what the AI dietitian in [CALIVO AI](/calivo-ai) does: you enter your details once, and it creates a full-day or 7-day Indian plan with your calorie and protein target, timings, katori/roti portions and a swap option for every meal. It also respects vegetarian, Jain, Halal and other diets.

## Important

This is general wellness information, not medical advice. If you have diabetes, PCOS, thyroid, kidney problems, are pregnant or breastfeeding, please follow a plan from your doctor or a registered dietitian.
    `.trim(),
  },
  {
    slug: "high-protein-indian-vegetarian-foods",
    title: "High-Protein Indian Vegetarian Foods: 20 Sources With Protein Per Serving",
    description:
      "Struggling to eat enough protein on a vegetarian Indian diet? Here are 20 everyday foods — paneer, dal, soya, curd, chana and more — with approximate protein per serving.",
    date: "2026-09-30",
    category: "Health & Nutrition",
    readTime: "7 min read",
    cta: "calivo",
    content: `
Many Indian vegetarians eat far less protein than they need, because a typical meal of roti, rice and sabzi is mostly carbohydrate. The good news: you do not need supplements for most goals — you need to **add one good protein source to every meal**.

## How Much Protein Do You Need?

A common guideline for healthy adults is about **0.8 g of protein per kg of body weight** per day. People who exercise or are trying to lose fat while keeping muscle often aim for **1.2–1.6 g per kg**. For a 65 kg person, that is roughly 52 g on the low end and 80–100 g on the higher end.

If you have kidney disease or another medical condition, ask your doctor before increasing protein.

## 20 High-Protein Vegetarian Foods (Approximate)

| Food | Serving | Protein (approx.) |
|---|---|---|
| Soya chunks (dry) | 50 g | 25–26 g |
| Paneer | 100 g | 18–20 g |
| Tofu (firm) | 100 g | 12–15 g |
| Hung curd / Greek yogurt | 100 g | 9–10 g |
| Moong dal chilla | 2 medium | 10–12 g |
| Besan chilla | 2 medium | 10–12 g |
| Rajma (cooked) | 1 katori | 8–9 g |
| Chole / kabuli chana (cooked) | 1 katori | 8–10 g |
| Sprouts (moong) | 1 katori | 7–8 g |
| Toor / moong dal (cooked) | 1 katori | 6–9 g |
| Milk | 1 glass (250 ml) | 8 g |
| Curd | 1 katori (200 g) | 6–8 g |
| Peanuts | 30 g | 7–8 g |
| Roasted chana | 30 g | 6–7 g |
| Sattu | 2 tbsp (30 g) | 6–7 g |
| Almonds | 20 pieces (~25 g) | 5 g |
| Pumpkin seeds | 2 tbsp | 5 g |
| Quinoa (cooked) | 1 katori | 6 g |
| Eggs (for eggetarians) | 1 large | 6 g |
| Whey/paneer smoothie | 1 glass | depends on recipe |

## A Simple 80 g Protein Vegetarian Day

- **Breakfast:** 2 besan chilla with paneer stuffing (~18 g)
- **Mid-morning:** 1 glass milk or buttermilk (~6–8 g)
- **Lunch:** 2 roti + 1 katori rajma + 1 katori curd (~20 g)
- **Evening:** Roasted chana 30 g (~7 g)
- **Dinner:** Soya chunk curry (25 g dry) + dal + 1 roti (~22 g)

That is roughly 75–80 g of protein from normal Indian food.

## Common Mistakes

- **Counting dal as a big protein source:** one katori of thin dal gives only about 6–7 g. It helps, but it is not enough alone.
- **Protein only at dinner:** spread it across meals so you stay full all day.
- **Ignoring curd and milk:** these are easy, cheap protein boosters.

## Track Your Protein Automatically

Knowing the numbers is easy; remembering to add them up every day is hard. [CALIVO AI](/calivo-ai) sets a daily protein target from your weight and goal, counts protein from every meal you log or scan, and its AI coach tells you exactly what to eat next to close the gap — for example "1 katori moong sprouts for 8 g protein".
    `.trim(),
  },
  {
    slug: "pcos-diet-plan-indian",
    title: "PCOS Diet Plan (Indian): What to Eat, What to Limit & a Sample Day",
    description:
      "A practical Indian diet guide for PCOS — low-GI foods, protein, fibre, portion tips and a sample day of meals — written in simple language.",
    date: "2026-09-29",
    category: "Health & Nutrition",
    readTime: "8 min read",
    cta: "calivo",
    content: `
PCOS (polycystic ovary syndrome) is very common among Indian women. Many women with PCOS have some degree of insulin resistance, which is why food choices that keep blood sugar steady are often recommended alongside medical treatment.

**Important:** PCOS needs diagnosis and treatment from a gynaecologist or endocrinologist. This article is general information to help you understand food choices — it is not a treatment plan.

## The Core Idea: Steady Blood Sugar

Meals that cause big blood-sugar spikes (lots of refined carbs and sugar, little protein or fibre) can make insulin resistance worse. The aim is to build meals that digest slowly:

- **Protein in every meal:** dal, paneer, curd, eggs, sprouts, chicken or fish if you eat them.
- **High-fibre carbs instead of refined carbs:** millets (jowar, bajra, ragi), whole wheat, brown rice, oats, whole dals.
- **Plenty of vegetables:** half the plate at lunch and dinner.
- **Healthy fats in small amounts:** nuts, seeds, a measured spoon of oil or ghee.

## Foods Often Recommended

| Group | Better choices |
|---|---|
| Grains | Jowar, bajra, ragi roti, whole-wheat roti, brown rice, oats, daliya |
| Protein | Moong dal, masoor, chana, rajma, paneer, curd, tofu, eggs, fish, chicken |
| Vegetables | Leafy greens, lauki, tori, broccoli, cauliflower, beans, bhindi, capsicum |
| Fruits | Guava, apple, pear, berries, orange, papaya (in portions) |
| Fats | Almonds, walnuts, flaxseeds, pumpkin seeds |

## Foods to Limit

- Sugar, mithai, sugary chai and packaged juices
- Maida items: white bread, biscuits, bakery products, noodles
- Deep-fried snacks: samosa, pakora, namkeen
- Large portions of white rice at one time
- Sweetened breakfast cereals and flavoured yogurts

## Sample PCOS-Friendly Indian Day

| Time | Meal |
|---|---|
| 7:00 AM | Warm water + 1 tsp soaked flaxseeds or 5 almonds |
| 8:30 AM | 2 moong dal chilla with paneer + mint chutney |
| 11:00 AM | 1 guava or apple |
| 1:30 PM | 2 jowar/whole-wheat roti + dal + vegetable sabzi + salad + curd |
| 5:00 PM | Roasted chana or makhana + green tea |
| 8:00 PM | Vegetable daliya or quinoa khichdi + paneer/tofu bhurji |

## Lifestyle Matters as Much as Food

- Regular activity — even 30 minutes of brisk walking most days — improves insulin sensitivity.
- Strength training 2–3 times a week helps.
- Sleep and stress affect hormones; aim for 7–8 hours of sleep.
- Even a modest weight loss (around 5%) can improve symptoms for many women who are overweight — but always discuss goals with your doctor.

## Get a PCOS-Aware Plan in Your Language

In [CALIVO AI](/calivo-ai), you can mark PCOS in your profile. The AI dietitian then builds lower-sugar, high-fibre, protein-forward Indian meal plans with portions and timings — in English, Hindi, Urdu or Arabic — and the food scanner shows how much sugar and fibre is in what you eat. Use it alongside your doctor's advice, not instead of it.
    `.trim(),
  },
  {
    slug: "diabetes-diet-chart-indian",
    title: "Diabetes Diet Chart (Indian): Foods, Portions & a Sample Day for Type 2 Diabetes",
    description:
      "An easy Indian diet guide for type 2 diabetes — plate method, low-GI grains, portion sizes, foods to limit and a sample day of meals. General information, not medical advice.",
    date: "2026-09-28",
    category: "Health & Nutrition",
    readTime: "8 min read",
    cta: "calivo",
    content: `
India has one of the largest numbers of people living with diabetes in the world. Food is one of the most important parts of managing type 2 diabetes — but it should always work **together with the medicines and plan your doctor gives you**.

**Please note:** If you take insulin or medicines that lower blood sugar, changing your diet suddenly can cause low sugar. Discuss changes with your doctor.

## The Indian Diabetes Plate Method

A simple way to plan lunch and dinner without counting every calorie:

- **Half the plate:** non-starchy vegetables — sabzi, salad, leafy greens.
- **One quarter:** protein — dal, chana, rajma, paneer, curd, eggs, fish or chicken.
- **One quarter:** carbs — 1–2 rotis (preferably mixed-grain/jowar/bajra) or a small katori of rice.

## Better Carb Choices

| Instead of | Try |
|---|---|
| White rice, large portions | Small portion of brown rice, or rice mixed with dal and vegetables |
| Maida roti / naan | Whole-wheat, jowar, bajra or ragi roti |
| Sugary cereals | Oats, daliya, vegetable upma |
| Fruit juice | Whole fruit (guava, apple, orange) |
| Sweetened chai | Chai without sugar, or with less sugar gradually |

## Foods to Limit

- Sugar, jaggery, honey in large amounts, mithai
- Sweet drinks: cold drinks, packaged juices, sweet lassi
- Fried snacks and bakery items made with maida
- Potato-heavy dishes in large portions
- Very large meals — smaller, regular meals are easier on blood sugar

## Sample Day (Type 2 Diabetes, General Example)

| Time | Meal |
|---|---|
| 7:00 AM | Tea without sugar + 5 almonds |
| 8:30 AM | Vegetable oats upma or 2 besan chilla + curd |
| 11:00 AM | 1 small fruit (guava / apple) |
| 1:30 PM | 2 mixed-grain roti + dal + sabzi + salad |
| 5:00 PM | Roasted chana + buttermilk |
| 8:00 PM | 1–2 roti or small rice + vegetable curry + paneer/egg/fish |

## Tips That Make a Big Difference

- **Eat carbs with protein and fibre** — never a plate of only rice or only roti.
- **Keep meal timings regular** — especially if you take medicines.
- **Walk 10–15 minutes after meals** — it helps lower post-meal sugar for many people.
- **Watch portions of "healthy" foods too** — fruits, millets and dry fruits still contain carbs.
- **Check your sugar as advised by your doctor** and note which meals cause spikes.

## Use Technology to Stay Consistent

[CALIVO AI](/calivo-ai) lets you mark diabetes in your profile so its AI meal plans use low-GI Indian foods, smaller carb portions and no added sugar. The photo scanner shows the carbs and sugar in each meal you eat, which makes it easier to talk to your doctor about patterns. It is a wellness tool, not a medical device — your doctor's plan always comes first.
    `.trim(),
  },
  {
    slug: "intermittent-fasting-indian-diet-guide",
    title: "Intermittent Fasting for Indians: 16:8 Guide With Indian Meal Ideas",
    description:
      "How intermittent fasting (16:8, 18:6, 14:10) works, who should avoid it, and what to eat in your eating window using normal Indian food.",
    date: "2026-09-27",
    category: "Health & Nutrition",
    readTime: "7 min read",
    cta: "calivo",
    content: `
Intermittent fasting (IF) simply means eating within a fixed time window and not eating outside it. The most popular schedule is **16:8** — 16 hours without food, 8 hours of eating.

It is not magic. People lose weight with IF mainly because a shorter eating window often means fewer total calories. But for many people it is an easy structure to follow.

## Popular Schedules

| Schedule | Fasting | Eating window example |
|---|---|---|
| 14:10 | 14 hours | 9:00 AM – 7:00 PM |
| 16:8 | 16 hours | 12:00 PM – 8:00 PM |
| 18:6 | 18 hours | 1:00 PM – 7:00 PM |

Start with 12:12 or 14:10 and move to 16:8 only if you feel comfortable.

## Who Should NOT Do Intermittent Fasting Without Medical Advice

- Pregnant or breastfeeding women
- People with diabetes on insulin or sugar-lowering medicines
- Anyone with a history of eating disorders
- Teenagers and people who are underweight
- People with low blood pressure or other medical conditions

## What You Can Have During the Fast

Water, black coffee, plain green tea and black tea without sugar or milk. Adding milk and sugar to chai breaks the fast.

## Sample 16:8 Day With Indian Food (12 PM – 8 PM)

| Time | Meal |
|---|---|
| 12:00 PM | First meal: 2 moong dal chilla + curd + fruit |
| 4:00 PM | Snack: sprouts chaat or roasted chana + chai |
| 7:30 PM | Last meal: 2 roti + dal + sabzi + paneer or chicken + salad |

## Make Your Eating Window Count

- **Break the fast with protein, not sugar or fried food.** A samosa as your first meal will leave you hungry again soon.
- **Do not overeat in the window.** If you eat 2,500 kcal in 8 hours, IF will not help you lose weight.
- **Drink enough water** through the fasting hours.
- **Ramadan and other religious fasts** follow their own rules — plan suhoor/sehri and iftar meals with protein, fibre and fluids.

## Track Your Fast and Your Meals Together

[CALIVO AI](/calivo-ai) has a built-in fasting timer with 14:10, 16:8 and 18:6 options that keeps running even if you close the app, plus calorie and protein tracking for your eating window — so you can see whether fasting is actually helping your daily totals.
    `.trim(),
  },
  {
    slug: "best-ai-calorie-counter-app-indian-food",
    title: "AI Calorie Counter App for Indian Food: How CALIVO AI Works (Photo to Calories)",
    description:
      "How AI calorie counting from food photos works for Indian meals, what it can and cannot do, and how to get the most accurate results with CALIVO AI.",
    date: "2026-09-26",
    category: "Health & Nutrition",
    readTime: "6 min read",
    cta: "calivo",
    content: `
Most popular calorie-counting apps were built for Western food. Search for "aloo paratha" or "dal tadka" and you get either nothing or a dozen conflicting entries. Typing every meal also takes so long that most people stop after a week.

AI photo-based calorie counting solves both problems — if it is built for Indian food.

## How Photo-to-Calorie AI Works

- **You click a photo** of your plate or thali.
- **The AI identifies each item** — for example roti, dal, rice, sabzi, salad, pickle.
- **It estimates the portion** from what it sees and typical Indian serving sizes.
- **It calculates nutrition** — calories, protein, carbs, fat, fibre, sugar and sodium — and estimates how much oil or ghee was used.
- **You confirm or adjust** the quantity (2 roti instead of 1) before saving to your food journal.

## What AI Calorie Counting Can and Cannot Do

It is honest to say that a photo cannot weigh food. Two katoris of dal can look the same and still differ by 100 kcal because of ghee. So treat photo scanning as a **fast, consistent estimate**, not a lab result.

Where it shines:

- Logging a full thali in seconds instead of 5 minutes
- Spotting high-calorie items you underestimate (fried snacks, sweets, restaurant gravies)
- Building the habit of tracking, which matters more than perfect numbers

## Tips for Better Accuracy

- Take the photo **from above**, in good light, with the whole plate visible.
- Keep **one katori and one plate size** at home so portions are consistent.
- After scanning, **adjust quantities** — the app shows every item separately.
- For packaged food, **scan the barcode** instead of a photo.
- For home recipes you cook often, use the **recipe calculator** once and reuse it.

## What Else CALIVO AI Does

[CALIVO AI](/calivo-ai) is more than a scanner:

- **AI dietitian:** full-day and 7-day Indian meal plans with timings, portions, protein targets and swaps
- **Health and faith aware:** adapts to Diabetes, PCOS, thyroid and BP; respects vegetarian, Jain, Halal and other diets
- **AI coach chat:** ask "dinner under 500 kcal?" and get answers based on what you ate today
- **Menu scanner** for restaurants and **barcode lookup** for packaged food
- **Trackers:** water, weight, workouts, fasting timer, habits, streaks and badges
- **Four languages:** English, Hindi, Urdu and Arabic

It is free to download on Google Play, with 3 free AI photo scans a month and a Premium plan for heavier use.
    `.trim(),
  },
];
