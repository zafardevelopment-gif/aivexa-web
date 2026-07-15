# AIVEXA — SEO + Google AdSense Setup (Summary)

Domain: **https://www.aivexallp.com**

## Ek zaroori clarification

Aapne "Google Ads chalana hai jisse income ho" bola tha — is se income tabhi hoti hai jab yeh **Google AdSense** ho (site par ads dikhte hain, aapko click/impression ka paisa milta hai, approval lagta hai). **Google Ads** alag cheez hai — usme aap khud paise kharch karke apni site ka promotion karte hain, koi approval nahi lagta. Neeche sab kuch AdSense ke hisaab se setup kiya gaya hai.

---

## 1. Jo maine site mein already kar diya hai

**Technical SEO**
- `app/sitemap.ts` — auto-generated sitemap, sabhi 89 tools + 6 categories + 6 products + legal pages cover karta hai. Live hone ke baad `https://www.aivexallp.com/sitemap.xml` par milega.
- `app/robots.ts` — crawlers ko allow karta hai, `/admin` block karta hai, sitemap ka link deta hai.
- Root layout mein `metadataBase`, Organization + WebSite JSON-LD (structured data) add kiya.
- Har ek free tool page (89 tools) par ab hai:
  - Keywords, canonical URL, Open Graph + Twitter card
  - **WebApplication + FAQPage JSON-LD** (Google search mein rich snippet/FAQ dikhne ka chance badhata hai)
  - Ek "About this tool" + FAQ content block — pehle tool sirf ek calculator/UI tha, koi text nahi tha jise Google padh sake. Ab har page par unique padhने-laayak content hai.
- `/tools` hub page aur `/tools/[category]` pages ka metadata bhi improve kiya.

**AdSense-readiness**
- Privacy Policy mein naya section add kiya: cookies, Google AdSense/third-party ads disclosure, Google Ads Settings opt-out link — AdSense review isko check karta hai.
- `public/ads.txt` placeholder file bana di (abhi dummy hai, approval milne ke baad update karni hogi — neeche step 4 dekhein).
- Root layout mein AdSense ka script tag already wire kar diya hai — bas `.env.local` mein apna Publisher ID daalne se activate ho jayega (ID milne se pehle kuch nahi dikhega, safe hai).

> Note: Privacy/Terms content Supabase table `aivexa_pages` se bhi serve ho sakta hai (agar wahan rows already hain to woh fallback se override kar denge). Agar Supabase mein already privacy page hai, us table row mein bhi yehi cookies/ads wala paragraph add karwa lena — warna live site par purana wala hi dikhega.

---

## 2. Aapko khud Google par jaake karna hoga (login required, main yeh nahi kar sakta)

1. **AdSense account banayen** — https://www.google.com/adsense par apne Google account se sign up karein, site URL `https://www.aivexallp.com` daalein.
2. Google aapko ek verification snippet/code dega — usse `.env.local` mein `NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX` daal dena (already wired, bas ID chahiye).
3. **Publisher ID milte hi `public/ads.txt` update karein** — file already bani hai, bas is line ko replace karna:
   `google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0`
   apne real Publisher ID se.
4. Site deploy karke Google ko "Request Review" karein.

### Approval milne ke chances badhane ke liye (Google ke known requirements)
- Site kam se kam 3-6 mahine purani ho aur regular organic traffic ho (naya domain turant reject hone ka risk hota hai)
- Original, useful content ho (89 tools + FAQ blocks isme help karenge)
- Privacy Policy, Terms — dono already maujood hain ✓
- Easy navigation, mobile-friendly — Next.js site already responsive hai
- Koi copyrighted/adult/violent content na ho

---

## 3. Google Search Console (zaroor karein, free hai)

1. https://search.google.com/search-console par domain `aivexallp.com` add karein (DNS verification ya HTML tag se)
2. Sitemap submit karein: `https://www.aivexallp.com/sitemap.xml`
3. Yeh Google ko bataata hai ki nayi 89 tool pages exist karti hain — organic clicks yahi se badhna shuru hoga.

---

## 4. Deploy se pehle ek baar zaroor check karein

Is sandbox mein Next.js ka full production build run nahi ho paaya (environment/OS binary issue — `SWC` native binary crash, code ki wajah se nahi). Maine `tsc --noEmit` se **poora TypeScript type-check clean pass** karwaya hai (koi error nahi, sabhi 89 tool pages + naye files), lekin deploy se pehle apne Windows machine par ek baar yeh zaroor chalayein:

```
npm run build
```

Agar koi error aaye to mujhe bata dena, main fix kar dunga.

---

## 5. Ads kahan dikhayen (jab approval mil jaye)

Recommend: tool pages par jo naya "About this tool / FAQ" section maine add kiya hai, uske upar-neeche ek in-article ad unit lagayen — genuine content ke paas ad dikhna Google ke policy ke hisaab se best hai (bare calculator ke upar/beech mein ad lagana avoid karein, "accidental clicks" ki wajah se account suspend ho sakta hai).
