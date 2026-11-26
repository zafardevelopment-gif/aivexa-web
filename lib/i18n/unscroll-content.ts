import { unscroll } from "@/lib/unscroll-app";
import type { LandingContent, LangCode } from "@/lib/landing-i18n";

/** Unscroll landing content per language — same facts as lib/unscroll-app.ts. */

const ICONS = unscroll.features.map((f) => f.icon);
const withIcons = (items: [string, string][]) => items.map(([title, text], i) => ({ icon: ICONS[i], title, text }));

const en: LandingContent = {
  title: "Unscroll — Screen Time & Parental Control App for Android",
  desc: "Set app-wise time limits, block YouTube and Instagram in apps and browsers, lock settings with PIN or fingerprint, and control your child's phone from yours. Free to start.",
  keywords: [
    "Unscroll", "screen time app", "parental control app", "screen time app India", "app time limit Android", "block YouTube for kids",
    "block Instagram Reels", "child phone control from parent phone", "app lock with fingerprint", "digital detox app",
    "focus app for students", "stop doomscrolling", "uninstall protection parental control", "prayer time app blocker",
  ],
  h1Rest: "Screen Time & Parental Control for the Whole Family",
  sub: "App-wise limits, study and bedtime schedules, website blocking in every browser and a family mode where you set the rules for your child's phone — without daily fights.",
  trust: ["✅ Free to start", "👨‍👩‍👧 Parent + child", "🔒 No ads, no data selling"],
  what: [
    unscroll.oneLiner,
    "Most screen-time apps are easy to get around: open the website instead, play the video in a small window, or just uninstall the app. Unscroll was built to close those doors — while keeping calls, maps and study apps always working.",
  ],
  featuresTitle: "Everything you need to take back phone time",
  features: unscroll.features.map((f) => ({ ...f })),
  steps: unscroll.steps.map((s) => ({ ...s })),
  audience: [...unscroll.audience],
  price: unscroll.price,
  faqs: unscroll.faqs.map((f) => ({ ...f })),
  heroCard: { greet: "Today · Family mode", next: "YouTube limit", prayer: "18 min left", remaining: "Study time starts at 6:00 PM" },
  ctaTitle: "Get Unscroll for your family",
  ctaText: "Your phone, your rules. Set the first limit in under two minutes.",
};

const hi: LandingContent = {
  title: "Unscroll — बच्चों के फ़ोन का कंट्रोल और स्क्रीन टाइम ऐप (Android)",
  desc: "हर ऐप का अलग टाइम, YouTube और Instagram ऐप व ब्राउज़र दोनों में ब्लॉक, PIN या फ़िंगरप्रिंट लॉक, और अपने फ़ोन से बच्चे के फ़ोन का कंट्रोल। मुफ़्त शुरुआत।",
  keywords: [
    "बच्चों का फ़ोन कंट्रोल", "पैरेंटल कंट्रोल ऐप", "स्क्रीन टाइम ऐप", "YouTube ब्लॉक कैसे करें", "रील्स की आदत",
    "मोबाइल की लत", "ऐप लॉक", "Unscroll", "parental control hindi", "screen time hindi",
  ],
  h1Rest: "पूरे परिवार के लिए स्क्रीन टाइम और पैरेंटल कंट्रोल",
  sub: "हर ऐप का अलग टाइम, पढ़ाई और सोने का शेड्यूल, हर ब्राउज़र में वेबसाइट ब्लॉक, और फ़ैमिली मोड जिसमें बच्चे के फ़ोन के नियम आप अपने फ़ोन से तय करते हैं — बिना रोज़ की लड़ाई।",
  trust: ["✅ मुफ़्त शुरुआत", "👨‍👩‍👧 माता-पिता + बच्चे", "🔒 कोई विज्ञापन नहीं, डेटा बिक्री नहीं"],
  what: [
    "Unscroll, AIVEXA LLP का Android ऐप है जो आपको और आपके बच्चों को फ़ोन कम इस्तेमाल करने में मदद करता है — हर ऐप का टाइम लिमिट, फ़ोकस और बेडटाइम शेड्यूल, बिना बायपास वाला स्ट्रिक्ट मोड, हर ब्राउज़र में वेबसाइट ब्लॉक, PIN या फ़िंगरप्रिंट से ऐप लॉक, और फ़ैमिली मोड।",
    "ज़्यादातर स्क्रीन टाइम ऐप आसानी से तोड़े जा सकते हैं — ब्राउज़र में वेबसाइट खोल लो, वीडियो छोटी विंडो में चला लो, या ऐप ही हटा दो। Unscroll इन सब रास्तों को बंद करता है, और कॉल, मैप व पढ़ाई वाले ऐप हमेशा चलते रहते हैं।",
  ],
  featuresTitle: "फ़ोन का समय वापस पाने के लिए सब कुछ",
  features: withIcons([
    ["हर ऐप का अलग टाइम", "YouTube को 1 घंटा, Instagram को 30 मिनट, गेम को 20 मिनट दें। टाइम ख़त्म होते ही ऐप अपने आप रुक जाता है।"],
    ["माता-पिता के लिए फ़ैमिली मोड", "कोड से बच्चे का फ़ोन जोड़ें और अपने फ़ोन से लिमिट, शेड्यूल और ब्लॉक ऐप तय करें।"],
    ["एक्स्ट्रा टाइम की रिक्वेस्ट", "बच्चा वजह के साथ 15 मिनट और माँग सकता है। आप कहीं भी हों, एक टैप में हाँ या ना कहें।"],
    ["वेबसाइट भी ब्लॉक", "जब YouTube या Instagram बंद हो, तो Chrome और हर ब्राउज़र में भी उनकी वेबसाइट नहीं खुलती।"],
    ["स्ट्रिक्ट मोड और ऐप लॉक", "सेशन के बीच नियम ढीले नहीं होते। Unscroll ख़ुद PIN या फ़िंगरप्रिंट से लॉक रहता है।"],
    ["अनइंस्टॉल से सुरक्षा", "बच्चे के फ़ोन पर Unscroll माता-पिता के बिना हटाया या बंद नहीं किया जा सकता; छोटी विंडो वाला वीडियो भी रुकता है।"],
    ["फ़ोकस और सोने का शेड्यूल", "पढ़ाई, ऑफ़िस और सोने के समय ध्यान भटकाने वाले ऐप बंद — कॉल और पढ़ाई वाले ऐप चालू।"],
    ["रोज़ का सारांश", "शाम को छोटा सारांश: समय कहाँ गया, कौन सा ऐप सबसे ज़्यादा चला, और कल से कितना फ़र्क़।"],
    ["नमाज़/पूजा मोड (वैकल्पिक)", "नमाज़, पूजा या अपनी प्रार्थना के समय ऐप रोकें। डिफ़ॉल्ट रूप से बंद — चाहें तो ही चालू करें।"],
    ["फ़्लोटिंग टाइमर", "स्क्रीन पर छोटा टाइमर बताता है कि ऐप में कितना समय बचा है।"],
  ]),
  steps: [
    { title: "इंस्टॉल करें और मोड चुनें", text: "Unscroll इंस्टॉल करें और 'अपने लिए' या 'फ़ैमिली' चुनें। परमिशन दें — हर परमिशन के साथ उसकी वजह लिखी है।" },
    { title: "लिमिट सेट करें", text: "किसी भी ऐप पर टैप करके रोज़ की लिमिट लगाएँ, या पढ़ाई और सोने का शेड्यूल बनाएँ।" },
    { title: "बच्चे का फ़ोन जोड़ें", text: "फ़ैमिली मोड में आपको एक कोड मिलता है। उसे बच्चे के फ़ोन में डालें — अब उसके नियम आपके हाथ में।" },
    { title: "बदलाव देखें", text: "रोज़ का सारांश देखें, एक्स्ट्रा टाइम की रिक्वेस्ट मंज़ूर करें और आदत सुधरने पर लिमिट बदलें।" },
  ],
  audience: [
    "माता-पिता जो बिना रोज़ की लड़ाई के बच्चे का फ़ोन टाइम कंट्रोल करना चाहते हैं",
    "परीक्षा की तैयारी करने वाले छात्र जो Reels और Shorts में खो जाते हैं",
    "ऑफ़िस में फ़ोकस से काम करना चाहने वाले",
    "जो रात में Shorts और Reels में घंटों खो देते हैं",
    "परिवार जो खाने और नमाज़/पूजा का समय फ़ोन-फ़्री चाहते हैं",
    "माता-पिता जिनका बच्चा Chrome में YouTube खोल लेता है",
  ],
  price: "डाउनलोड मुफ़्त। Pro और Family प्लान (महीने या साल के) वैकल्पिक हैं — Family में 5 बच्चों के फ़ोन तक। क़ीमत ऐप में दिखती है।",
  faqs: [
    { q: "Unscroll क्या है?", a: "AIVEXA LLP का Android ऐप जो हर ऐप का टाइम लिमिट, शेड्यूल और वेबसाइट ब्लॉक करता है — अपने फ़ोन के लिए या फ़ैमिली मोड में अपने फ़ोन से बच्चे के फ़ोन के लिए।" },
    { q: "क्या बच्चा ब्राउज़र में YouTube खोल लेगा?", a: "नहीं। 'वेबसाइट भी ब्लॉक करें' चालू होने पर रुके हुए ऐप की वेबसाइट (जैसे youtube.com) हर ब्राउज़र में बंद रहती है।" },
    { q: "क्या बच्चा Unscroll हटा सकता है?", a: "माता-पिता से जुड़े बच्चे के फ़ोन पर अनइंस्टॉल सुरक्षा चालू रहती है और सेटिंग्स PIN या फ़िंगरप्रिंट से लॉक रहती हैं।" },
    { q: "क्या Unscroll मुफ़्त है?", a: "हाँ, बेसिक ऐप मुफ़्त है। Pro और Family प्लान महीने या साल के लिए वैकल्पिक हैं; क़ीमत भुगतान से पहले ऐप में दिखती है।" },
    { q: "क्या यह बच्चे के मैसेज या फ़ोटो पढ़ता है?", a: "नहीं। Unscroll सिर्फ़ यह देखता है कि कौन सा ऐप कितनी देर चला, ताकि नियम लागू हों। मैसेज, फ़ोटो या कॉल नहीं पढ़ता।" },
    { q: "क्या नमाज़/पूजा मोड ज़रूरी है?", a: "नहीं, यह वैकल्पिक है और डिफ़ॉल्ट रूप से बंद रहता है।" },
    { q: "Unscroll किसने बनाया?", a: "AIVEXA LLP (भारत)। सपोर्ट: support@aivexallp.com" },
  ],
  heroCard: { greet: "आज · फ़ैमिली मोड", next: "YouTube लिमिट", prayer: "18 मिनट बाक़ी", remaining: "पढ़ाई का समय शाम 6:00 बजे से" },
  ctaTitle: "अपने परिवार के लिए Unscroll लें",
  ctaText: "आपका फ़ोन, आपके नियम। पहली लिमिट दो मिनट से कम में सेट करें।",
};

export const UNSCROLL_LANGS: LangCode[] = ["en", "hi"];
export const UNSCROLL_CONTENT: Record<string, LandingContent> = { en, hi };
