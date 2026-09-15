/**
 * Beula Audio - Bilingual Translation Dictionary (English & Tamil)
 * Professional, clear, simple language tailored for clients across Tamil Nadu.
 * Covers every section, card, modal, and booking step on the website.
 */

export type Language = "en" | "ta";

export interface TranslationDictionary {
  // Brand & Global
  brandName: string;
  brandTagline: string;
  brandSubtagline: string;
  langEn: string;
  langTa: string;

  // Navigation
  navServices: string;
  navSetups: string;
  navInstruments: string;
  navCustom: string;
  navExperience: string;
  navTrackPackage: string;
  navBookNow: string;

  // Hero Section
  heroChapter: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroExploreBtn: string;
  heroCustomBtn: string;
  heroAvailabilityNotice: string;

  // Category Showcase / Section 2 (What We Offer)
  servicesPre: string;
  servicesTitle: string;
  servicesSubtitle: string;
  category01Name: string;
  category01Desc: string;
  category01Tag: string;
  category01Detail: string;
  category01Price: string;
  category02Name: string;
  category02Desc: string;
  category02Tag: string;
  category02Detail: string;
  category02Price: string;
  category03Name: string;
  category03Desc: string;
  category03Tag: string;
  category03Detail: string;
  category03Price: string;
  exploreSectionBtn: string;

  // DJ Packages Section (Section 3)
  djSectionPre: string;
  djSectionTitle: string;
  djSectionSubtitle: string;
  logisticsNoticeTitle: string;
  logisticsNoticeText: string;
  calculateDispatchBtn: string;

  // Package Card Common
  stageSetupBadge: string;
  mostPopularBadge: string;
  flagshipBadge: string;
  baseInvestmentLabel: string;
  includedEquipmentLabel: string;
  viewDetailsBtn: string;
  reserveBtn: string;
  outOfOrderBadge: string;
  outOfOrderBtn: string;
  moreModulesText: string;
  transportDisclaimer: string;

  // DJ Packages Details
  pkg01Name: string;
  pkg01Desc: string;
  pkg02Name: string;
  pkg02Desc: string;
  pkg03Name: string;
  pkg03Desc: string;
  pkg04Name: string;
  pkg04Desc: string;
  pkg05Name: string;
  pkg05Desc: string;

  pkgEssentialTitle: string;
  pkgEssentialTagline: string;
  pkgEssentialDesc: string;

  pkgPremiumTitle: string;
  pkgPremiumTagline: string;
  pkgPremiumDesc: string;

  pkgHoneycombTitle: string;
  pkgHoneycombTagline: string;
  pkgHoneycombDesc: string;

  pkgHoneycombPlusTitle: string;
  pkgHoneycombPlusTagline: string;
  pkgHoneycombPlusDesc: string;

  pkgHoneycombProTitle: string;
  pkgHoneycombProTagline: string;
  pkgHoneycombProDesc: string;

  // Equipment Item Names
  itemTopSpeaker: string;
  itemBassSpeaker: string;
  itemVrxTop: string;
  itemParcan: string;
  itemSharpy: string;
  itemSmoke: string;
  itemTopSmoke: string;
  itemFrontBlackMask: string;
  itemEffectLights: string;
  itemDjPlayer: string;
  itemDjLedMask: string;
  itemHoneycomb: string;
  itemLightTruss: string;
  itemBoxTruss: string;
  itemBlinder: string;
  itemMoving: string;
  itemSpyder: string;
  itemDandiya: string;
  itemMonitor: string;
  itemMic: string;
  itemDanceFloor: string;

  // Live Instruments Section (Section 4)
  instrumentPre: string;
  instrumentTitle: string;
  instrumentSubtitle: string;
  instrumentBadge: string;
  instrumentPriceLabel: string;
  instrumentFeaturesTitle: string;
  instrumentBookBtn: string;
  instrumentFeature1Title: string;
  instrumentFeature1Desc: string;
  instrumentFeature2Title: string;
  instrumentFeature2Desc: string;
  instrumentFeature3Title: string;
  instrumentFeature3Desc: string;
  instrumentGuarantee: string;

  // Custom Audio Configurator (Section 5)
  customPre: string;
  customTitle: string;
  customSubtitle: string;
  customTotalInvestment: string;
  customRequestBookingBtn: string;
  customItemAdded: string;
  customAddItem: string;
  customVrxWarning: string;
  customStandardRigPreset: string;
  customFullStagePreset: string;
  customUnitsSelected: string;
  customResetBtn: string;

  // Admin Effect Lights Note
  adminEffectLightsTitle: string;
  adminEffectLightsDesc: string;

  // Experience & Credentials Section (Section 6)
  expPre: string;
  expTitle: string;
  expYears: string;
  expYearsLabel: string;
  expEvents: string;
  expEventsLabel: string;
  expDispatch: string;
  expDispatchLabel: string;
  expFailures: string;
  expFailuresLabel: string;
  statYears: string;
  statEvents: string;
  statReliability: string;

  pillar1Title: string;
  pillar1Desc: string;
  pillar2Title: string;
  pillar2Desc: string;
  pillar3Title: string;
  pillar3Desc: string;
  pillar4Title: string;
  pillar4Desc: string;

  // Final CTA
  ctaTitle: string;
  ctaSubtitle: string;
  ctaCheckBtn: string;
  ctaExploreBtn: string;
  finalCtaPre: string;
  finalCtaHeadline: string;
  finalCtaSub: string;
  finalCtaBtn: string;

  // Footer
  footerDirect: string;
  footerEmail: string;
  footerInstagram: string;
  footerRights: string;
  footerCopyright: string;

  // Booking Drawer
  drawerTitle: string;
  step01Title: string;
  step01Subtitle: string;
  step02Title: string;
  step02Subtitle: string;
  step03Title: string;
  step03Subtitle: string;
  step04Title: string;
  step04Subtitle: string;
  step05Success: string;

  // Drawer Form Labels & Options
  labelClientName: string;
  labelPhoneNumber: string;
  labelOccasionType: string;
  labelEventDate: string;
  labelTimingWindow: string;
  labelStartTime: string;
  labelEndTime: string;
  labelDistrict: string;
  labelVenueAddress: string;
  labelNotes: string;

  occasionMarriage: string;
  occasionBirthday: string;
  occasionEarPiercing: string;
  occasionCorporate: string;
  occasionOthers: string;
  specifyOccasion: string;

  slotMorning: string;
  slotEvening: string;
  slotNight: string;
  slotFullDay: string;
  slotCustom: string;

  btnNextDetails: string;
  btnNextDate: string;
  btnNextReview: string;
  btnSubmitBooking: string;
  btnBack: string;
  btnSubmitting: string;

  customPreTitle: string;
  customMainTitle: string;
  customSelectedTotal: string;
  customCheckAvailabilityBtn: string;
  instrumentPreTitle: string;
  instrumentMainTitle: string;
  experiencePreTitle: string;
  experienceTitle: string;

  // Modal Specific
  specSheetTitle: string;
  allEquipmentTitle: string;
  danceFloorTitle: string;
  danceFloorSubtitle: string;
  danceFloor12Label: string;
  danceFloor16Label: string;
  backToCatalogBtn: string;
  proceedToBookingBtn: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    brandName: "Beula Audio",
    brandTagline: "Professional Event Sound & Lighting",
    brandSubtagline: "Sound That Shapes The Room",
    langEn: "English",
    langTa: "தமிழ்",

    navServices: "Services",
    navSetups: "DJ Setups",
    navInstruments: "Live Band",
    navCustom: "Custom Setup",
    navExperience: "Experience",
    navTrackPackage: "Track Package",
    navBookNow: "Book Event",

    heroChapter: "PROFESSIONAL SOUND & LIGHTS // TAMIL NADU",
    heroHeadline: "Beula Audio",
    heroSubheadline:
      "Crystal-clear sound systems, stage lighting, and honeycomb setups for weddings, birthdays, live band concerts, and landmark celebrations.",
    heroExploreBtn: "View DJ Setups",
    heroCustomBtn: "Build Custom Setup",
    heroAvailabilityNotice: "Live inventory checked instantly for your event date",

    servicesPre: "// WHAT WE OFFER",
    servicesTitle: "OUR EVENT SERVICES",
    servicesSubtitle:
      "Choose from ready-to-play DJ packages, acoustic band setups, or build your own custom gear list.",
    category01Name: "01 // DJ Setups",
    category01Desc: "5 complete sound and light packages, from family parties to grand wedding stages.",
    category01Tag: "DJ PACKAGES",
    category01Detail: "High-power sound, heavy bass, moving lights, and fog machine ready to play.",
    category01Price: "From ₹8,000 to Flagship Pro",
    category02Name: "02 // Live Band Sound",
    category02Desc: "Dedicated stage audio for singers, acoustic bands, orchestras, and church/temple events.",
    category02Tag: "LIVE ACOUSTICS",
    category02Detail: "Digital mixer, 4 stage monitors, dynamic mics, and high-clarity VRX line-array speakers.",
    category02Price: "₹10,000 All-Inclusive Live Rig",
    category03Name: "03 // Custom Setup",
    category03Desc: "Handpick the exact speakers, subwoofers, lights, and microphones you need.",
    category03Tag: "BUILD YOUR OWN",
    category03Detail: "Select exact quantities for tops, 18\" bass, sharpies, parcans, and cordless microphones.",
    category03Price: "Pay only for what you pick",
    exploreSectionBtn: "Explore This Setup",

    djSectionPre: "// 5 POPULAR CONCERT SETUPS",
    djSectionTitle: "DJ Stage Packages",
    djSectionSubtitle:
      "From cozy birthday celebrations to massive wedding stages with moving lights, sharpies, and honeycomb truss.",
    logisticsNoticeTitle: "DELIVERY & LOGISTICS:",
    logisticsNoticeText:
      "Transportation charges depend on your event location and venue distance.",
    calculateDispatchBtn: "CHECK DATE AVAILABILITY",

    stageSetupBadge: "STAGE SETUP",
    mostPopularBadge: "MOST POPULAR",
    flagshipBadge: "FLAGSHIP",
    baseInvestmentLabel: "PACKAGE PRICE",
    includedEquipmentLabel: "INCLUDED GEAR",
    viewDetailsBtn: "VIEW DETAILS",
    reserveBtn: "RESERVE",
    outOfOrderBadge: "BOOKED OUT",
    outOfOrderBtn: "BOOKED OUT",
    moreModulesText: "more items included",
    transportDisclaimer: "* Transportation charges depend on event venue location",

    pkg01Name: "Essential Setup",
    pkg01Desc: "Great sound and lighting for intimate family parties and small halls.",
    pkg02Name: "Premium Setup",
    pkg02Desc: "Upgraded VRX clarity with dual moving sharpies, 8 parcans, and DJ LED mask.",
    pkg03Name: "Honey Comb Setup",
    pkg03Desc: "Stunning honeycomb stage backdrop, overhead light truss, and top smoke.",
    pkg04Name: "Honey Comb Plus(+)",
    pkg04Desc: "Grand 20F hydraulic stand with 4 moving sharpies, 12 parcans, and dual blinders.",
    pkg05Name: "Honey Comb Pro",
    pkg05Desc: "Flagship concert stage with illuminated LED dance floor and quad VRX audio.",

    pkgEssentialTitle: "Essential Setup",
    pkgEssentialTagline: "Clear sound & party lighting for small to medium halls",
    pkgEssentialDesc:
      "Includes 2 top speakers, 2 bass speakers, 6 parcan lights, smoke machine, and front black mask.",

    pkgPremiumTitle: "Premium Setup",
    pkgPremiumTagline: "VRX line-array clarity with dual sharpies and DJ LED mask",
    pkgPremiumDesc:
      "Includes VRX top speakers, 2 bass speakers, 8 parcan lights, 2 sharpies, smoke, and DJ LED mask.",

    pkgHoneycombTitle: "Honey Comb Setup",
    pkgHoneycombTagline: "Iconic honeycomb lighting rig and overhead truss",
    pkgHoneycombDesc:
      "Features our signature honeycomb lighting frame, structural truss, top smoke, and sharp lighting.",

    pkgHoneycombPlusTitle: "Honey Comb Plus(+)",
    pkgHoneycombPlusTagline: "20F hydraulic stand with 12 parcans and dual blinders",
    pkgHoneycombPlusDesc:
      "Massive concert stage with 20F hydraulic stand, 4 sharpies, 2 blinders, and 12 parcans.",

    pkgHoneycombProTitle: "Honey Comb Pro",
    pkgHoneycombProTagline: "Flagship stage with illuminated LED dance floor",
    pkgHoneycombProDesc:
      "The ultimate celebration stage with full LED dance floor, quad VRX line arrays, 4 subwoofers, and complete lights.",

    itemTopSpeaker: "Top speaker",
    itemBassSpeaker: "Bass speaker",
    itemVrxTop: "VRX Top speaker",
    itemParcan: "Parcan Lights",
    itemSharpy: "Sharpy Light",
    itemSmoke: "Smoke Machine",
    itemTopSmoke: "Top Smoke",
    itemFrontBlackMask: "Front Black Mask",
    itemEffectLights: "Effect Lights (Curated)",
    itemDjPlayer: "DJ Player Console",
    itemDjLedMask: "DJ LED Mask",
    itemHoneycomb: "Honey Comb Rig",
    itemLightTruss: "Light Truss",
    itemBoxTruss: "Box Truss",
    itemBlinder: "Stage Blinder Lights",
    itemMoving: "Moving Head Light",
    itemSpyder: "Spyder Light",
    itemDandiya: "Dandiya Light",
    itemMonitor: "Stage Monitor (QSC K12)",
    itemMic: "Microphone & Stand",
    itemDanceFloor: "Illuminated LED Dance Floor",

    instrumentPre: "// ACOUSTIC STAGE RIG",
    instrumentTitle: "Live Band Sound Setup",
    instrumentSubtitle:
      "Tuned for live musicians, acoustic singers, orchestras, and spiritual gatherings with zero audio feedback.",
    instrumentBadge: "COMPLETE LIVE SETUP",
    instrumentPriceLabel: "PACKAGE PRICE",
    instrumentFeaturesTitle: "WHAT'S INCLUDED",
    instrumentBookBtn: "RESERVE LIVE BAND SETUP",
    instrumentFeature1Title: "18\" High-Clarity VRX Line Arrays",
    instrumentFeature1Desc: "Balanced, crystal-clear vocals across the hall without harsh treble.",
    instrumentFeature2Title: "4 Independent QSC Stage Monitors",
    instrumentFeature2Desc: "Performers hear their own singing and instruments with zero echo.",
    instrumentFeature3Title: "Digital Mixer & Shielded Cables",
    instrumentFeature3Desc: "Clean audio lines, heavy-duty stands, and dynamic microphones.",
    instrumentGuarantee: "100% RELIABLE LIVE SOUND",

    customPre: "// BUILD YOUR OWN SETUP",
    customTitle: "Build Your Own Setup",
    customSubtitle:
      "Select only the equipment you need. Quantities and subtotal update instantly.",
    customTotalInvestment: "ESTIMATED TOTAL",
    customRequestBookingBtn: "RESERVE CUSTOM SETUP",
    customItemAdded: "Item added to list",
    customAddItem: "Add Gear",
    customVrxWarning: "Note: 18\" Bass is recommended when picking VRX Top speakers",
    customStandardRigPreset: "+ Standard Setup",
    customFullStagePreset: "+ Full Stage",
    customUnitsSelected: "items selected",
    customResetBtn: "RESET",

    adminEffectLightsTitle: "EFFECT LIGHTS: CURATED BY BEULA AUDIO",
    adminEffectLightsDesc:
      "Our lighting engineers select and program the best effect lights (Sharpy, Dandiya, Spyder, Moving Heads) to fit your stage and hall layout.",

    expPre: "// 9+ YEARS OF EXPERIENCE",
    expTitle: "TRUSTED FOR OVER 1,500+ EVENTS",
    expYears: "9+",
    expYearsLabel: "Years in Live Sound",
    expEvents: "1500+",
    expEventsLabel: "Successful Events",
    expDispatch: "100%",
    expDispatchLabel: "On-Time Setup",
    expFailures: "100%",
    expFailuresLabel: "Reliable Performance",
    statYears: "YEARS EXPERIENCE",
    statEvents: "EVENTS COMPLETED",
    statReliability: "ON-TIME SETUP",

    pillar1Title: "Pre-Tested Gear",
    pillar1Desc: "Every speaker, cable, and light fixture is tested before leaving our warehouse.",
    pillar2Title: "Top-Tier Brands",
    pillar2Desc: "Authentic JBL VRX line arrays, QSC monitors, and heavy 18\" bass subwoofers.",
    pillar3Title: "Custom Packages",
    pillar3Desc: "From compact party setups to grand hydraulic wedding stages with LED dance floors.",
    pillar4Title: "Expert Sound Team",
    pillar4Desc: "9+ years of professional on-site sound and lighting engineering.",

    ctaTitle: "READY FOR YOUR EVENT?",
    ctaSubtitle:
      "Check live date availability against our warehouse equipment with zero obligation.",
    ctaCheckBtn: "CHECK AVAILABILITY",
    ctaExploreBtn: "VIEW PACKAGES",
    finalCtaPre: "BOOKINGS OPEN FOR 2026 / 2027",
    finalCtaHeadline: "YOUR EVENT. YOUR SOUND.",
    finalCtaSub:
      "Whether it's a family wedding, birthday, church or temple festival, or live concert — we make it memorable.",
    finalCtaBtn: "CHECK DATE AVAILABILITY",

    footerDirect: "CALL US",
    footerEmail: "EMAIL",
    footerInstagram: "INSTAGRAM",
    footerRights: "ALL RIGHTS RESERVED. PROFESSIONAL EVENT SOUND & LIGHTING.",
    footerCopyright: "ALL RIGHTS RESERVED.",

    drawerTitle: "EVENT RESERVATION",
    step01Title: "01 // CHOOSE YOUR SETUP",
    step01Subtitle: "Select a DJ package, Live Band setup, or build your own gear list.",
    step02Title: "02 // YOUR DETAILS",
    step02Subtitle: "Enter your contact info so our team can coordinate with you.",
    step03Title: "03 // DATE & VENUE",
    step03Subtitle: "We check warehouse equipment availability for your exact slot.",
    step04Title: "04 // REVIEW & CONFIRM",
    step04Subtitle: "Review your selected items and event details before submitting.",
    step05Success: "RESERVATION RECEIVED",

    labelClientName: "YOUR NAME *",
    labelPhoneNumber: "PHONE NUMBER *",
    labelOccasionType: "EVENT OCCASION *",
    labelEventDate: "EVENT DATE *",
    labelTimingWindow: "EVENT TIMING *",
    labelStartTime: "START TIME",
    labelEndTime: "END TIME",
    labelDistrict: "DISTRICT / CITY *",
    labelVenueAddress: "VENUE / HALL ADDRESS *",
    labelNotes: "SPECIAL REQUESTS / NOTES",

    occasionMarriage: "Marriage / Reception",
    occasionBirthday: "Birthday Party",
    occasionEarPiercing: "Ear Piercing Function",
    occasionCorporate: "Corporate Event",
    occasionOthers: "Other Occasion",
    specifyOccasion: "Please specify your occasion (e.g. Sangeet, School Annual Day)",

    slotMorning: "Morning",
    slotEvening: "Evening",
    slotNight: "Night",
    slotFullDay: "Full Day",
    slotCustom: "Custom Time",

    btnNextDetails: "NEXT: YOUR DETAILS",
    btnNextDate: "NEXT: DATE & LOCATION",
    btnNextReview: "NEXT: REVIEW ORDER",
    btnSubmitBooking: "CONFIRM RESERVATION",
    btnBack: "BACK",
    btnSubmitting: "SENDING...",

    customPreTitle: "// CUSTOM GEAR BUILDER",
    customMainTitle: "Build Your Own Setup",
    customSelectedTotal: "TOTAL ITEMS SELECTED",
    customCheckAvailabilityBtn: "CHECK DATE AVAILABILITY",
    instrumentPreTitle: "// LIVE BAND & INSTRUMENTS",
    instrumentMainTitle: "Live Band Sound Setup",
    experiencePreTitle: "// WHY BEULA AUDIO?",
    experienceTitle: "TOP QUALITY SOUND. ZERO HASSLE.",

    specSheetTitle: "PACKAGE SPECIFICATIONS",
    allEquipmentTitle: "ALL INCLUDED EQUIPMENT",
    danceFloorTitle: "LED DANCE FLOOR OPTION",
    danceFloorSubtitle: "Add an illuminated tempered glass LED dance floor to your stage.",
    danceFloor12Label: "12 ft × 12 ft LED Floor",
    danceFloor16Label: "16 ft × 16 ft LED Floor",
    backToCatalogBtn: "BACK TO PACKAGES",
    proceedToBookingBtn: "PROCEED TO BOOKING",
  },

  ta: {
    brandName: "பியூலா ஆடியோ",
    brandTagline: "தொழில்முறை நிகழ்வு ஒலி & மேடை விளக்குகள்",
    brandSubtagline: "அரங்கையே அதிரவைக்கும் துல்லிய ஒலி",
    langEn: "English",
    langTa: "தமிழ்",

    navServices: "சேவைகள்",
    navSetups: "டிஜே அமைப்புகள்",
    navInstruments: "இசைக்கருவிகள்",
    navCustom: "தனிப்பயன் அமைப்பு",
    navExperience: "அனுபவம்",
    navTrackPackage: "தொகுப்பு கண்காணிப்பு",
    navBookNow: "முன்பதிவு",

    heroChapter: "தொழில்முறை ஒலி & ஒளி அமைப்புகள் // தமிழ்நாடு",
    heroHeadline: "பியூலா ஆடியோ",
    heroSubheadline:
      "திருமணங்கள், பிறந்தநாள் விழாக்கள், நேரலை இன்னிசைக்கச்சேரிகள் மற்றும் அனைத்து சுபநிகழ்ச்சிகளுக்கான அதிநவீன ஒலி மற்றும் மேடை விளக்குகள்.",
    heroExploreBtn: "டிஜே அமைப்புகளைப் பார்க்க",
    heroCustomBtn: "விருப்பப்படி தேர்வு செய்ய",
    heroAvailabilityNotice: "தேதி மற்றும் நேரத்திற்கு ஏற்ப இருப்பு உடனடியாக சரிபார்க்கப்படுகிறது",

    servicesPre: "// எங்களின் சேவைகள்",
    servicesTitle: "எங்களின் மேடை சேவைகள்",
    servicesSubtitle:
      "முழுமையான டிஜே பேக்கேஜ்கள், நேரலை இசைக்கருவி அமைப்புகள் அல்லது உங்களுக்கு தேவையான சாதனங்களை நீங்களே தேர்வு செய்யுங்கள்.",
    category01Name: "01 // டிஜே மேடை அமைப்புகள்",
    category01Desc: "சிறிய பார்ட்டிகள் முதல் பிரம்மாண்ட திருமண மேடைகள் வரை 5 முழுமையான தொகுப்புகள்.",
    category01Tag: "டிஜே தொகுப்புகள்",
    category01Detail: "சக்திவாய்ந்த டாப் ஸ்பீக்கர், பேஸ், மூவிங் ஷார்பி மற்றும் புகை இயந்திரம் உடனே தயார்.",
    category01Price: "₹8,000 முதல் பிரீமியம் வரை",
    category02Name: "02 // நேரலை இசை & பேண்ட்",
    category02Desc: "பாடர்கள், ஆர்கெஸ்ட்ரா, பக்திப் பாடல்கள் மற்றும் இசைக்கச்சேரிகளுக்கான சிறப்பு ஒலி அமைப்பு.",
    category02Tag: "நேரலை இசை",
    category02Detail: "டிஜிட்டல் மிக்சர், 4 மானிட்டர் ஸ்பீக்கர்கள், மைக்குகள் மற்றும் VRX லைன் அரே ஸ்பீக்கர்கள்.",
    category02Price: "₹10,000 முழு நேரலை அமைப்பு",
    category03Name: "03 // தனிப்பயன் அமைப்பு",
    category03Desc: "உங்களுக்கு தேவையான ஸ்பீக்கர்கள், விளக்குகள் மற்றும் மைக்குகளை நீங்களே தேர்வு செய்யலாம்.",
    category03Tag: "உங்கள் விருப்பப்படி",
    category03Detail: "டாப், 18\" பேஸ், ஷார்பி, பார்கான் மற்றும் மைக்குகளின் எண்ணிக்கையை நீங்களே முடிவு செய்யுங்கள்.",
    category03Price: "தேர்வு செய்த சாதனங்களுக்கு மட்டும் கட்டணம்",
    exploreSectionBtn: "இந்த அமைப்பைப் பார்க்க",

    djSectionPre: "// 5 கச்சேரி மேடை அமைப்புகள்",
    djSectionTitle: "டிஜே மேடை அமைப்புகள்",
    djSectionSubtitle:
      "சிறிய பிறந்தநாள் விழாக்கள் முதல் பிரம்மாண்ட திருமண வரவேற்பு வரை ஷார்பி மற்றும் தேன்கூடு மேடையுடன்.",
    logisticsNoticeTitle: "போக்குவரத்து விவரம்:",
    logisticsNoticeText:
      "போக்குவரத்து கட்டணம் உங்கள் நிகழ்வு நடைபெறும் இடத்தைப் பொறுத்து மாறுபடும்.",
    calculateDispatchBtn: "தேதி இருப்பைச் சரிபார்க்கவும்",

    stageSetupBadge: "மேடை அமைப்பு",
    mostPopularBadge: "அதிகம் விரும்பப்படுவது",
    flagshipBadge: "முதன்மை அமைப்பு",
    baseInvestmentLabel: "பேக்கேஜ் கட்டணம்",
    includedEquipmentLabel: "சேர்க்கப்பட்டுள்ளவை",
    viewDetailsBtn: "விவரங்களை பார்க்க",
    reserveBtn: "முன்பதிவு",
    outOfOrderBadge: "இருப்பில் இல்லை",
    outOfOrderBtn: "இருப்பில் இல்லை",
    moreModulesText: "கூடுதல் சாதனங்கள் சேர்க்கப்பட்டுள்ளன",
    transportDisclaimer: "* போக்குவரத்து கட்டணம் நிகழ்வு இடத்தை பொறுத்து மாறும்",

    pkg01Name: "அடிப்படை அமைப்பு (Essential)",
    pkg01Desc: "சிறிய பார்ட்டிகள் மற்றும் மண்டபங்களுக்கான சக்திவாய்ந்த ஒலி & ஒளி.",
    pkg02Name: "பிரீமியம் அமைப்பு (Premium)",
    pkg02Desc: "VRX லைன் அரே ஸ்பீக்கர்கள், 2 ஷார்பி லைட்கள், 8 பார்கான் மற்றும் டிஜே எல்இடி மாஸ்க்.",
    pkg03Name: "ஹனிகோம்ப் அமைப்பு (Honey Comb)",
    pkg03Desc: "தேன்கூடு வடிவ மேடை அமைப்பு, மேல்நிலை டிரைஸ் மற்றும் மேல் புகை வசதியுடன்.",
    pkg04Name: "ஹனிகோம்ப் பிளஸ் (Honey Comb Plus)",
    pkg04Desc: "20 அடி ஹைட்ராலிக் ஸ்டாண்ட், 4 ஷார்பி, 12 பார்கான் மற்றும் 2 மேடை பிளைண்டர்.",
    pkg05Name: "ஹனிகோம்ப் ப்ரோ (Honey Comb Pro)",
    pkg05Desc: "எல்இடி நடன தளம் மற்றும் 4 VRX லைன் அரே ஸ்பீக்கர்களுடன் கூடிய பிரம்மாண்ட மேடை.",

    pkgEssentialTitle: "அடிப்படை அமைப்பு (Essential)",
    pkgEssentialTagline: "சிறிய விழாக்களுக்கான சக்திவாய்ந்த ஒலி & வண்ண விளக்குகள்",
    pkgEssentialDesc:
      "2 டாப் ஸ்பீக்கர், 2 பேஸ் ஸ்பீக்கர், 6 பார்கான் விளக்குகள், புகை இயந்திரம் மற்றும் முகப்பு கருப்பு மாஸ்க்.",

    pkgPremiumTitle: "பிரீமியம் அமைப்பு (Premium)",
    pkgPremiumTagline: "VRX லைன் அரே & இரட்டை ஷார்பி லைட் அமைப்பு",
    pkgPremiumDesc:
      "VRX டாப் ஸ்பீக்கர்கள், 2 பேஸ் ஸ்பீக்கர்கள், 8 பார்கான், 2 ஷார்பி லைட், புகை மற்றும் டிஜே எல்இடி மாஸ்க்.",

    pkgHoneycombTitle: "ஹனிகோம்ப் அமைப்பு (Honey Comb)",
    pkgHoneycombTagline: "தேன்கூடு வடிவ மேடை விளக்கு & மேல்நிலை டிரைஸ்",
    pkgHoneycombDesc:
      "தேன்கூடு விளக்கு அமைப்பு, ஒளி டிரைஸ், மேல்நிலை புகை மற்றும் மேடை விளக்குகள்.",

    pkgHoneycombPlusTitle: "ஹனிகோம்ப் பிளஸ் (Honey Comb Plus)",
    pkgHoneycombPlusTagline: "20 அடி ஹைட்ராலிக் ஸ்டாண்ட், 12 பார்கான் & பிளைண்டர்",
    pkgHoneycombPlusDesc:
      "ஹைட்ராலிக் ஸ்டாண்டுகள், 4 ஷார்பி, 2 மேடை பிளைண்டர், 12 பார்கான் மற்றும் இரட்டை மேல்நிலை புகை.",

    pkgHoneycombProTitle: "ஹனிகோம்ப் ப்ரோ (Honey Comb Pro)",
    pkgHoneycombProTagline: "எல்இடி நடன தளத்துடன் கூடிய முதன்மையான மேடை",
    pkgHoneycombProDesc:
      "முழுமையான எல்இடி நடன தளம், 4 VRX லைன் அரே ஸ்பீக்கர்கள், 4 சப்வூபர்கள் மற்றும் முழு விளக்கு தொகுப்பு.",

    itemTopSpeaker: "டாப் ஸ்பீக்கர்",
    itemBassSpeaker: "பேஸ் ஸ்பீக்கர்",
    itemVrxTop: "VRX டாப் ஸ்பீக்கர்",
    itemParcan: "பார்கான் விளக்குகள்",
    itemSharpy: "ஷார்பி லைட்",
    itemSmoke: "புகை இயந்திரம்",
    itemTopSmoke: "மேல்நிலை புகை",
    itemFrontBlackMask: "முகப்பு கருப்பு மாஸ்க்",
    itemEffectLights: "எஃபெக்ட் விளக்குகள்",
    itemDjPlayer: "டிஜே பிளேயர்",
    itemDjLedMask: "டிஜே எல்இடி மாஸ்க்",
    itemHoneycomb: "ஹனிகோம்ப் விளக்கு",
    itemLightTruss: "ஒளி டிரைஸ்",
    itemBoxTruss: "பாக்ஸ் டிரைஸ்",
    itemBlinder: "பிளைண்டர் விளக்குகள்",
    itemMoving: "மூவிங் ஹெட் லைட்",
    itemSpyder: "ஸ்பைடர் லைட்",
    itemDandiya: "தாண்டியா லைட்",
    itemMonitor: "மானிட்டர் ஸ்பீக்கர் (QSC K12)",
    itemMic: "மைக்ரோஃபோன் & ஸ்டாண்ட்",
    itemDanceFloor: "எல்இடி நடன தளம்",

    instrumentPre: "// நேரலை இசை அமைப்பு",
    instrumentTitle: "நேரலை இசை மேடை அமைப்பு",
    instrumentSubtitle:
      "பாடர்கள், ஆர்கெஸ்ட்ரா மற்றும் பக்தி இன்னிசை நிகழ்வுகளுக்கு எந்தவித இரைச்சலும் இல்லாத துல்லிய ஒலி.",
    instrumentBadge: "முழு நேரலை அமைப்பு",
    instrumentPriceLabel: "கட்டணம்",
    instrumentFeaturesTitle: "சேர்க்கப்பட்டுள்ளவை",
    instrumentBookBtn: "இசைக்கருவி அமைப்பை முன்பதிவு செய்க",
    instrumentFeature1Title: "18\" VRX லைன் அரே ஸ்பீக்கர்",
    instrumentFeature1Desc: "அரங்கம் முழுவதும் துல்லியமாகவும் தெளிவாகவும் கேட்கும் குரல் ஒலி.",
    instrumentFeature2Title: "4 தனித்தனி QSC மானிட்டர் ஸ்பீக்கர்கள்",
    instrumentFeature2Desc: "பாடர்கள் மற்றும் இசைக்கலைஞர்கள் தங்கள் குரலை தாங்களே தெளிவாகக் கேட்கலாம்.",
    instrumentFeature3Title: "டிஜிட்டல் மிக்சர் & உயர்தர கேபிள்கள்",
    instrumentFeature3Desc: "இரைச்சல் இல்லாத ஆடியோ இணைப்புகள் மற்றும் உயர்தர மைக்குகள்.",
    instrumentGuarantee: "100% நம்பகமான ஒலி சேவை",

    customPre: "// உங்கள் விருப்பப்படி தேர்வு செய்க",
    customTitle: "விருப்பப்படி தேர்வு செய்ய",
    customSubtitle:
      "உங்களுக்கு தேவையான சாதனங்களை மட்டும் தேர்வு செய்யுங்கள். கட்டணம் உடனே கணக்கிடப்படும்.",
    customTotalInvestment: "மதிப்பிடப்பட்ட மொத்த கட்டணம்",
    customRequestBookingBtn: "சாதனங்களை முன்பதிவு செய்",
    customItemAdded: "உபகரணம் சேர்க்கப்பட்டது",
    customAddItem: "உபகரணத்தைச் சேர்க்கவும்",
    customVrxWarning: "குறிப்பு: VRX டாப் ஸ்பீக்கருடன் 18\" பேஸ் ஸ்பீக்கர் சேர்ப்பது சிறந்தது",
    customStandardRigPreset: "+ அடிப்படை தொகுப்பு",
    customFullStagePreset: "+ முழு மேடை",
    customUnitsSelected: "சாதனங்கள் தேர்வு செய்யப்பட்டுள்ளன",
    customResetBtn: "மீட்டமை",

    adminEffectLightsTitle: "எஃபெக்ட் விளக்குகள்: பியூலா ஆடியோவால் தேர்வு செய்யப்படும்",
    adminEffectLightsDesc:
      "உங்கள் நிகழ்வு மண்டபம் மற்றும் மேடை அளவுக்கு ஏற்ப சிறந்த எஃபெக்ட் விளக்குகளை எங்கள் தொழில்நுட்பக் குழுவே அமைத்து தரும்.",

    expPre: "// 9+ ஆண்டுகள் அனுபவம்",
    expTitle: "1,500+ க்கும் மேற்பட்ட வெற்றிகரமான நிகழ்வுகள்",
    expYears: "9+",
    expYearsLabel: "ஆண்டுகள் அனுபவம்",
    expEvents: "1500+",
    expEventsLabel: "நிகழ்வுகள் நடத்தப்பட்டன",
    expDispatch: "100%",
    expDispatchLabel: "சரியான நேர சேவை",
    expFailures: "100%",
    expFailuresLabel: "நம்பகமான ஒலி",
    statYears: "ஆண்டுகள் அனுபவம்",
    statEvents: "நிகழ்வுகள்",
    statReliability: "சரியான நேர சேவை",

    pillar1Title: "சோதிக்கப்பட்ட சாதனங்கள்",
    pillar1Desc: "ஒவ்வொரு ஸ்பீக்கரும் அனுப்புவதற்கு முன் சோதிக்கப்பட்டு துல்லியமாக அளவிடப்படுகிறது.",
    pillar2Title: "உயர்தர பிராண்டுகள்",
    pillar2Desc: "அசல் JBL VRX லைன் அரே, QSC மானிட்டர்கள் மற்றும் 18\" பேஸ் சப்வூபர்கள்.",
    pillar3Title: "நெகிழ்வான அமைப்புகள்",
    pillar3Desc: "சிறிய பார்ட்டி அமைப்புகள் முதல் எல்இடி நடன தளம் கொண்ட மேடைகள் வரை.",
    pillar4Title: "அனுபவம் வாய்ந்த குழு",
    pillar4Desc: "ஒன்பது ஆண்டுகளுக்கும் மேலான தொழில்முறை நேரடி ஒலி மற்றும் மேடை தயாரிப்பு அனுபவம்.",

    ctaTitle: "உங்கள் நிகழ்வை பிரம்மாண்டமாக்க தயாரா?",
    ctaSubtitle:
      "எங்கள் கிடங்கு உபகரண இருப்பை எந்தவித கட்டணமும் இன்றி உடனடியாக சரிபாருங்கள்.",
    ctaCheckBtn: "இருப்பைச் சரிபார்க்கவும்",
    ctaExploreBtn: "பேக்கேஜ்களைப் பார்க்க",
    finalCtaPre: "2026 / 2027 நிகழ்வுகளுக்கான முன்பதிவு",
    finalCtaHeadline: "உங்கள் நிகழ்வு. உங்கள் ஒலி.",
    finalCtaSub:
      "திருமணம், பிறந்தநாள், கோயில் மற்றும் சர்ச் திருவிழாக்களுக்கு பியூலா ஆடியோ சிறந்த தேர்வு.",
    finalCtaBtn: "தேதி கிடைப்பதை சரிபார்க்கவும்",

    footerDirect: "நேரடி அழைப்பு",
    footerEmail: "மின்னஞ்சல்",
    footerInstagram: "இன்ஸ்டாகிராம்",
    footerRights: "அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை. தொழில்முறை நிகழ்வு ஒலி & ஒளி.",
    footerCopyright: "அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.",

    drawerTitle: "நிகழ்வு முன்பதிவு",
    step01Title: "01 // மேடை அமைப்பைத் தேர்வு செய்க",
    step01Subtitle: "டிஜே பேக்கேஜ், இசைக்கருவி அல்லது விருப்ப அமைப்பைத் தேர்வு செய்யுங்கள்.",
    step02Title: "02 // உங்கள் விவரங்கள்",
    step02Subtitle: "உங்களைத் தொடர்பு கொள்ள உங்கள் விவரங்களைத் தரவும்.",
    step03Title: "03 // தேதி & இடம்",
    step03Subtitle: "உங்கள் நிகழ்வு தேதிக்கு உபகரணங்கள் உள்ளதா என சரிபார்க்கப்படுகிறது.",
    step04Title: "04 // முன்பதிவு சரிபார்ப்பு",
    step04Subtitle: "அனுப்பும் முன் உங்கள் நிகழ்வு விவரங்களை சரிபார்க்கவும்.",
    step05Success: "முன்பதிவு வெற்றிகரமாக பெறப்பட்டது",

    labelClientName: "உங்கள் பெயர் *",
    labelPhoneNumber: "கைபேசி எண் *",
    labelOccasionType: "நிகழ்வின் வகை *",
    labelEventDate: "நிகழ்வு நடைபெறும் தேதி *",
    labelTimingWindow: "நிகழ்வு நடைபெறும் நேரம் *",
    labelStartTime: "தொடக்க நேரம்",
    labelEndTime: "முடிவு நேரம்",
    labelDistrict: "மாவட்டம் / நகரம் *",
    labelVenueAddress: "நிகழ்வு மண்டபம் / முகவரி *",
    labelNotes: "கூடுதல் தேவைகள் / குறிப்புகள்",

    occasionMarriage: "திருமணம் / வரவேற்பு",
    occasionBirthday: "பிறந்தநாள் விழா",
    occasionEarPiercing: "காதுகுத்து விழா",
    occasionCorporate: "நிறுவன நிகழ்வு",
    occasionOthers: "மற்றவை",
    specifyOccasion: "நிகழ்வின் வகையைக் குறிப்பிடவும் (எ.கா. நிச்சயதார்த்தம், ஆண்டு விழா)",

    slotMorning: "காலை",
    slotEvening: "மாலை",
    slotNight: "இரவு",
    slotFullDay: "முழு நாள்",
    slotCustom: "விருப்ப நேரம்",

    btnNextDetails: "அடுத்து: உங்கள் விவரங்கள்",
    btnNextDate: "அடுத்து: தேதி & இடம்",
    btnNextReview: "அடுத்து: சரிபார்ப்பு",
    btnSubmitBooking: "முன்பதிவை உறுதிசெய்க",
    btnBack: "பின்செல்க",
    btnSubmitting: "அனுப்பப்படுகிறது...",

    customPreTitle: "// விருப்பப்படி தேர்வு செய்ய",
    customMainTitle: "விருப்பப்படி தேர்வு செய்ய",
    customSelectedTotal: "மொத்த உபகரணங்கள்",
    customCheckAvailabilityBtn: "கிடைக்கும் தேதியை சரிபார்க்கவும்",
    instrumentPreTitle: "// நேரலை இசை & பேண்ட்",
    instrumentMainTitle: "நேரலை இசை மேடை அமைப்பு",
    experiencePreTitle: "// ஏன் பியூலா ஆடியோ?",
    experienceTitle: "உயர்தர ஒலி. நம்பகமான சேவை.",

    specSheetTitle: "விவரக்குறிப்பு",
    allEquipmentTitle: "சேர்க்கப்பட்டுள்ள அனைத்து உபகரணங்கள்",
    danceFloorTitle: "எல்இடி நடன தளம்",
    danceFloorSubtitle: "ஒளிரும் எல்இடி நடன தளத்தை மேடையுடன் இணைக்கலாம்.",
    danceFloor12Label: "12 அடி × 12 அடி எல்இடி தளம்",
    danceFloor16Label: "16 அடி × 16 அடி எல்இடி தளம்",
    backToCatalogBtn: "பேக்கேஜ்களுக்கு செல்ல",
    proceedToBookingBtn: "முன்பதிவுக்கு செல்ல",
  },
};
