/**
 * Every visible string on the site lives here, carried over verbatim from the
 * approved wireframe. Sections import from this file rather than hard-coding
 * copy, so practice-approved changes happen in one place.
 *
 * House rule: no em or en dashes anywhere in user-facing copy.
 *
 * Headline arrays hold whole sentences, one per entry. A two-sentence
 * headline renders its second sentence in the soft italic; a one-sentence
 * headline is a single entry and wraps on its own. Never split a sentence
 * across entries to force a line break.
 */

export type TestSlug = "eeg" | "ncs" | "emg";
export const testSlugs: TestSlug[] = ["eeg", "ncs", "emg"];

export const site = {
  name: "Neurogenix",
  wordmark: "NEUROGENIX",
  descriptor: "NEUROPHYSIOLOGY",
  tagline: ["Understanding the signals.", "Caring for the person."],
  metaTitle: "Neurogenix | Neurophysiology",
  metaDescription:
    "Neurogenix neurophysiology. Understand EEG, EMG and nerve conduction testing, prepare for your visit, and explore our practice.",
  bookLabel: "Request an appointment",
};

export const previewBar = {
  home: ["Private website preview", "Appointment requests are not sent in this version."],
  test: ["Private website preview", "Clinical content awaiting practice approval."],
};

export const routes = {
  home: "/",
  services: "/#services",
  team: "/our-team",
  visit: "/your-visit",
  doctors: "/for-doctors",
  locations: "/locations",
};

export const nav = [
  { label: "Services", href: routes.services },
  { label: "Our team", href: routes.team },
  { label: "Your visit", href: routes.visit },
  { label: "For doctors", href: routes.doctors },
  { label: "Locations", href: routes.locations },
];

/**
 * Page intros for the inner pages. Titles and lede paragraphs are the
 * section headlines from the wireframe.
 */
export type PageKey = "visit" | "doctors" | "team" | "locations";
export const pages: Record<PageKey, { path: string; crumb: string; metaTitle: string; title: string[]; body: string; trace: "eeg" | "ncs" | "emg" | "calm" }> = {
  visit: {
    path: routes.visit,
    crumb: "Your visit",
    metaTitle: "Your visit | Neurogenix",
    title: ["A little preparation.", "A lot more peace of mind."],
    body: "Select your test for a simple guide to what happens and how to prepare. Always follow the specific instructions given by your care team.",
    trace: "eeg",
  },
  doctors: {
    path: routes.doctors,
    crumb: "For doctors",
    metaTitle: "For referring doctors | Neurogenix",
    title: ["A clear referral.", "A coordinated next step."],
    body: "Information for clinicians arranging EEG, nerve conduction studies or EMG. Final services, eligibility and referral arrangements require practice confirmation.",
    trace: "ncs",
  },
  team: {
    path: routes.team,
    crumb: "Our team",
    metaTitle: "Our team | Neurogenix",
    title: ["Know who is involved in your test."],
    body: "Practitioner profiles will identify each team member’s registered profession, qualifications, role in testing and relevant clinical experience.",
    trace: "eeg",
  },
  locations: {
    path: routes.locations,
    crumb: "Locations",
    metaTitle: "Locations | Neurogenix",
    title: ["Find the right practice.", "Plan your arrival."],
    body: "Confirm which location performs your test. Location details will be added once the practice supplies and verifies them.",
    trace: "calm",
  },
};

export const breadcrumbHome = "Home";

export const hero = {
  title: ["Understanding the signals.", "Caring for the person."],
  body: "Brain, nerve and muscle testing, explained simply. Discover what your test involves and take the next step with confidence.",
  secondary: { label: "Explore our services", href: routes.services },
  image: {
    src: "/images/waiting-room.jpg",
    width: 1280,
    height: 1024,
    alt: "Neurogenix waiting room with navy walls, warm lighting and comfortable chairs",
  },
};

export const focus = {
  label: "Clinical neurophysiology",
  statement: ["Understanding the connections between your", "brain, nerves and muscles."],
  link: { label: "New to neurophysiology?", href: routes.visit },
};

export const services = {
  title: ["Different tests.", "One clearer picture."],
  body: "Neurophysiology tests record electrical activity to help your referring clinician understand how your nervous system is working.",
  items: [
    {
      slug: "eeg" as TestSlug,
      number: "01",
      type: "Brain activity",
      name: "Electroencephalography",
      abbr: "EEG",
      body: "Records the brain’s electrical activity through small sensors placed on the scalp. Often used to investigate seizures and changes in brain activity.",
      link: "About your EEG",
    },
    {
      slug: "ncs" as TestSlug,
      number: "02",
      type: "Nerve function",
      name: "Nerve conduction studies",
      abbr: "NCS",
      body: "Measures how well electrical signals travel along peripheral nerves. Helps investigate symptoms such as tingling, numbness and weakness.",
      link: "About your NCS",
    },
    {
      slug: "emg" as TestSlug,
      number: "03",
      type: "Muscle activity",
      name: "Electromyography",
      abbr: "EMG",
      body: "Examines electrical activity in selected muscles using a fine recording needle. Often performed together with nerve conduction studies.",
      link: "About your EMG",
    },
  ],
  footnote:
    "Your referring clinician will recommend the appropriate test. The practice’s final service list is awaiting confirmation.",
};

export const referral = {
  steps: [
    {
      number: "01",
      title: "Specify the assessment",
      body: "Include the clinical question, test requested, relevant history and the referring clinician’s contact details. Ask the practice if the referral requires clarification.",
    },
    {
      number: "02",
      title: "Confirm the arrangements",
      body: "Reception will need to confirm test availability, the correct practice location and any authorisation requirements. The actual submission channel is awaiting confirmation.",
    },
    {
      number: "03",
      title: "Plan the follow-up",
      body: "Confirm how the report will reach the referring clinician and when it is expected. No report turnaround is promised in this review version.",
    },
  ],
  pack: {
    title: ["Start with the right information."],
    body: "Review the proposed one-page referral form. The practice must approve its fields and submission instructions before clinical use.",
    download: { label: "Download draft referral form", href: "/documents/neurogenix-referral-draft.pdf" },
    contact: { label: "Professional contact details", href: `${routes.locations}#locations` },
    note: "Draft for review only. Do not enter or send real patient information using this preview.",
  },
  facts: [
    { title: "Service scope", body: "Tests, age groups and exclusions to be confirmed." },
    { title: "Report delivery", body: "Secure reporting route and timing to be confirmed." },
    { title: "Referral enquiries", body: "Dedicated professional contact to be confirmed." },
  ],
};

export const team = {
  body: [
    "Practitioner profiles will identify each team member’s registered profession, qualifications, role in testing and relevant clinical experience.",
    "Clinical neurophysiology testing and a neurology consultation are different services. The practice’s precise scope will be stated here once confirmed.",
  ],
  profile: {
    status: "Profiles awaiting practice approval",
    title: "The people behind Neurogenix",
    body: "Real practitioner names and portraits will be added after the team details are supplied.",
    fields: [
      { term: "Practitioner name and role", value: "To be confirmed" },
      { term: "Qualifications and registration", value: "To be confirmed" },
      { term: "Clinical experience and scope", value: "To be confirmed" },
    ],
  },
};

export const practice = {
  title: ["Your referral.", "Your assessment."],
  body: [
    "Neurophysiology testing helps your referring clinician assess how your brain, nerves and muscles are working.",
    "Find information about your test before your visit. Your care team will give you the instructions appropriate to your referral and explain the procedure.",
  ],
  values: [
    { number: "01", title: "Testing guided by your referral", body: "The requested assessment determines the examination." },
    { number: "02", title: "Understand each step", body: "Explore how testing works before you arrive." },
    { number: "03", title: "Supporting your next step", body: "Test results help inform your clinician’s assessment." },
  ],
  link: { label: "Get to know your visit", href: routes.visit },
};

export type Guide = {
  slug: TestSlug;
  tab: string;
  title: string;
  meta: string;
  intro: string;
  before: string[];
  during: string[];
  bottom: string;
};

export const guides: Record<TestSlug, Guide> = {
  eeg: {
    slug: "eeg",
    tab: "EEG",
    title: "Your EEG, explained.",
    meta: "SCALP SENSORS · BRAIN ACTIVITY",
    intro: "Small sensors record your brain’s electrical activity while you rest. The sensors record signals; they don’t send electricity into your brain.",
    before: [
      "Wash your hair and leave it free of styling products and conditioner.",
      "Follow the care team’s instructions about sleep and medication.",
      "Bring your referral and a list of your medicines.",
    ],
    during: [
      "Sensors are attached to your scalp. You may be asked to open or close your eyes, breathe deeply or look at a flashing light.",
      "Let the team know if you have any concerns. They can explain each part as you go.",
    ],
    bottom: "Need a sleep EEG? Preparation can differ; ask for your specific instructions.",
  },
  ncs: {
    slug: "ncs",
    tab: "Nerve conduction",
    title: "Your nerve conduction study.",
    meta: "SURFACE SENSORS · NERVE FUNCTION",
    intro: "Sensors on your skin measure the speed and strength of electrical signals travelling along selected nerves.",
    before: [
      "Come with clean skin, without creams or lotions on the area being tested.",
      "Wear loose clothing so the team can reach the area easily.",
      "Tell the team about implanted electrical devices.",
    ],
    during: [
      "Small electrical pulses stimulate the nerves. These may feel like a brief tapping or shock and can make a muscle twitch.",
      "Several nerves may be tested. An EMG may also form part of the same visit.",
    ],
    bottom: "The nerves tested and the appointment length depend on your referral.",
  },
  emg: {
    slug: "emg",
    tab: "EMG",
    title: "Your EMG, explained.",
    meta: "FINE RECORDING NEEDLE · MUSCLE ACTIVITY",
    intro: "A fine needle electrode records activity in selected muscles while they rest and contract. The needle records signals rather than delivering electricity.",
    before: [
      "Wear loose clothing and avoid skin creams or lotions.",
      "Tell the team about blood thinners, bleeding conditions or implanted electrical devices.",
      "Do not stop any medicine unless your prescribing clinician tells you to.",
    ],
    during: [
      "A fine needle is placed into selected muscles. You will be asked to relax and gently contract them.",
      "You may feel discomfort. Mild tenderness or bruising can occur afterwards; ask your care team about aftercare.",
    ],
    bottom: "EMG and nerve conduction studies are often performed together.",
  },
};

export const patientGuide = {
  tabsLabel: "Test preparation",
  beforeHeading: "Before your visit",
  duringHeading: "During the test",
  visit: {
    title: ["Your appointment essentials."],
    items: ["Your referral letter", "A list of current medicines", "Relevant previous test results", "Any questions you’d like to ask"],
    body: "Ask the practice to confirm your appointment length and any additional documents needed.",
  },
};

export const lookInside = {
  title: ["Before you arrive.", "A look inside."],
  body: "View the reception and testing spaces before your appointment. Confirm the location of your test with reception before travelling.",
  cta: "Explore the practice photos",
  image: {
    src: "/images/testing-room.jpg",
    width: 1280,
    height: 960,
    alt: "A private Neurogenix testing room with a comfortable examination bed and neurophysiology equipment",
  },
};

export const gallery = {
  title: "Inside Neurogenix",
  photos: [
    {
      src: "/images/waiting-room.jpg",
      width: 1280,
      height: 1024,
      caption: "The waiting room · Navy accents, warm lighting and comfortable seating.",
      alt: "Neurogenix waiting room with a navy feature wall and comfortable chairs",
    },
    {
      src: "/images/reception.jpg",
      width: 1280,
      height: 960,
      caption: "Reception · Natural light and a welcoming space to arrive.",
      alt: "Neurogenix reception with a desk, armchairs and large windows",
    },
    {
      src: "/images/testing-room.jpg",
      width: 1280,
      height: 960,
      caption: "The testing room · A private space for neurophysiology testing.",
      alt: "Neurogenix testing room with an examination bed and testing equipment",
    },
    {
      src: "/images/testing-room-private.jpg",
      width: 1280,
      height: 960,
      caption: "The testing room · Curtains drawn for a quieter setting.",
      alt: "Neurogenix testing room with privacy curtains drawn",
    },
  ],
  previous: "Previous",
  next: "Next",
  previousLabel: "Previous photo",
  nextLabel: "Next photo",
  openPhoto: "Open photo",
  close: "Close photo gallery",
};

export const faq = {
  title: ["It’s okay to ask."],
  body: "Knowing what to expect makes a difference. Here are a few good places to start.",
  items: [
    {
      q: "How do I know which test I need?",
      a: "Your referring clinician recommends the test based on your symptoms and assessment. If your referral is unclear, ask the practice to check it before arranging your appointment.",
    },
    {
      q: "Will the test be uncomfortable?",
      a: "Scalp sensors used in an EEG usually cause little or no discomfort. Nerve conduction testing involves brief electrical pulses, and needle EMG can be uncomfortable. Tell your care team about any concerns before and during the test.",
    },
    {
      q: "How long should I allow for my visit?",
      a: "This depends on the type of test and the nerves or muscles being assessed. Confirm the time to allow when your appointment is arranged, especially if more than one test is planned.",
    },
    {
      q: "Should I stop taking my medication?",
      a: "Do not change or stop prescribed medication on your own. Ask your care team for test-specific instructions and let them know which medicines you take.",
    },
    {
      q: "How will I receive my results?",
      a: "Ask the practice how reports are shared and when to follow up. Your referring clinician considers the test findings alongside your history and other investigations to explain what they mean for you.",
    },
    {
      q: "Will my medical aid cover the test?",
      a: "Cover varies by scheme, plan, referral and authorisation requirements. Confirm fees with the practice and ask your medical aid about benefits, authorisation and any personal payment before your visit.",
    },
  ],
};

export const fees = {
  title: ["Understand the arrangements.", "Before your appointment."],
  body: "Fees and medical-aid benefits depend on your test and your cover. Ask the practice and your scheme to confirm the arrangements for your visit.",
  steps: [
    { number: "01", title: "Request an estimate", body: "Ask reception for the expected fee and payment requirements for the assessment on your referral." },
    { number: "02", title: "Check your benefits", body: "Confirm referral, authorisation and benefit requirements directly with your medical aid, including any personal payment." },
    { number: "03", title: "Keep your confirmation", body: "Have any authorisation details and documents requested by reception available before your appointment." },
  ],
  footnote: "Scheme participation, tariffs and payment terms are awaiting confirmation. Medical-aid cover is not guaranteed.",
};

/**
 * One practice on the /locations map. `label` is the short name on the map
 * chip and `labelSide` keeps neighbouring chips (Rosebank and Menlyn sit
 * close together at country zoom) from covering each other.
 */
export type Practice = {
  id: string;
  name: string;
  label: string;
  area: string;
  city: string;
  province: string;
  /** Latitude, longitude. */
  coords: [number, number];
  tests: TestSlug[];
  hours: string;
  labelSide: "left" | "right";
};

/**
 * SAMPLE DATA, NOT REAL PRACTICES. These four locations exist only so the
 * /locations map can be reviewed. Their positions are suburb centres, not
 * street addresses, and the hours are placeholders. Replace the whole list
 * with the practice's confirmed details before launch; the page says so in
 * `locations.sampleNote`.
 */
export const practices: Practice[] = [
  {
    id: "rosebank",
    name: "Neurogenix Rosebank",
    label: "Rosebank",
    area: "Rosebank",
    city: "Johannesburg",
    province: "Gauteng",
    coords: [-26.1459, 28.0432],
    tests: ["eeg", "ncs", "emg"],
    hours: "Mon to Fri, 08:00 to 17:00",
    labelSide: "left",
  },
  {
    id: "menlyn",
    name: "Neurogenix Menlyn",
    label: "Menlyn",
    area: "Menlyn",
    city: "Pretoria",
    province: "Gauteng",
    coords: [-25.784, 28.277],
    tests: ["eeg", "ncs"],
    hours: "Mon to Fri, 08:00 to 16:30",
    labelSide: "right",
  },
  {
    id: "claremont",
    name: "Neurogenix Claremont",
    label: "Claremont",
    area: "Claremont",
    city: "Cape Town",
    province: "Western Cape",
    coords: [-33.9806, 18.4653],
    tests: ["eeg", "ncs", "emg"],
    hours: "Mon to Fri, 07:30 to 16:30",
    labelSide: "right",
  },
  {
    id: "umhlanga",
    name: "Neurogenix Umhlanga",
    label: "Umhlanga",
    area: "Umhlanga",
    city: "Durban",
    province: "KwaZulu-Natal",
    coords: [-29.7266, 31.0845],
    tests: ["ncs", "emg"],
    hours: "Mon to Thu, 08:00 to 16:00",
    labelSide: "left",
  },
];

export const locations = {
  listHeading: "Practice locations",
  sampleNote: "Sample locations for this preview. Confirmed practice addresses will replace them.",
  mapLabel: "Map of sample Neurogenix practice locations in South Africa",
  showAll: "Show all locations",
  zoomIn: "Zoom in",
  zoomOut: "Zoom out",
  testsLabel: "Tests offered",
  hoursLabel: "Hours",
  closeDetails: "Close location details",
  status: "Locations awaiting confirmation",
  heading: "Your appointment location",
  fields: [
    { term: "Address & directions", value: "To be confirmed" },
    { term: "Reception telephone & email", value: "To be confirmed" },
    { term: "Opening hours", value: "To be confirmed" },
    { term: "Parking & accessibility", value: "To be confirmed" },
  ],
  check: {
    q: "What should I check before travelling?",
    a: "Check the practice address, building and room number, parking arrangements, access requirements and your confirmed arrival time with reception.",
  },
};

export const contact = {
  title: ["Let’s make your visit feel simpler."],
  body: "Already have a referral? Start with the test listed on it. The team will need to confirm the appropriate appointment and any preparation instructions.",
  info: {
    link: { label: "Read the patient guide", href: routes.visit },
  },
};

export const footer = {
  /** The same pages in the same order as the header, defined once. */
  links: nav,
  privacy: "Privacy information",
  rights: "Neurogenix. All rights reserved.",
  disclaimer: "General information · Individual care comes from your clinician.",
};

/** The 404 page. The headline is awaiting practice approval. */
export const notFound = {
  title: ["This page has no signal.", "Let’s get you back."],
  cta: { label: "Return to the practice website", href: routes.home },
};

export const privacy = {
  title: "Your information.",
  body: [
    "This is a private website review. The appointment form does not send details to the practice or save them in a database. Sample entries remain in the open page and are cleared when the appointment window closes.",
    "The site does not add advertising or analytics cookies. Hosting and sign-in services may process technical information under their own policies.",
    "Linked patient resources open on third-party websites and follow those websites’ privacy policies.",
    "A practice-specific privacy notice and contact for privacy enquiries will be added before patient requests are enabled.",
  ],
  close: "Close",
  closeLabel: "Close privacy information",
};

export const booking = {
  title: "Request an appointment",
  notice: "Preview only. Use sample details to try the flow. Nothing is sent or booked.",
  closeLabel: "Close appointment request",
  progressLabel: "Request progress",
  progress: ["Your test", "Your details", "Preview"],
  step1: {
    heading: "What test is on your referral?",
    process:
      "Request a suitable appointment; reception will confirm the date, location and preparation requirements. This preview does not send a request.",
    choices: [
      { value: "EEG", title: "EEG", sub: "Brain activity", slug: "eeg" as TestSlug | null },
      { value: "Nerve conduction studies", title: "Nerve conduction studies", sub: "Nerve function", slug: "ncs" as TestSlug | null },
      { value: "EMG / NCS", title: "EMG / NCS", sub: "Muscle and nerve testing", slug: "emg" as TestSlug | null },
      { value: "Not sure", title: "I’m not sure", sub: "Help with my referral", slug: null as TestSlug | null },
    ],
    referralLabel: "Do you have a referral?",
    referralPlaceholder: "Select an option",
    referralOptions: ["Yes", "Not yet", "I’m not sure"],
    continue: "Continue",
  },
  step2: {
    heading: "How would you like to be contacted?",
    name: { label: "Full name", placeholder: "e.g. Alex Sample" },
    phone: { label: "Phone number", placeholder: "e.g. 082 000 0000" },
    email: { label: "Email address", placeholder: "e.g. alex@example.com" },
    date: { label: "Preferred date", optional: "(optional)" },
    method: { label: "Contact preference", options: ["Phone", "Email"] },
    hint: "A preferred date is subject to staff confirmation. Please don’t enter medical details in this preview.",
    ack: "I understand this is a sample request and does not book an appointment.",
    back: "Back",
    submit: "Preview my request",
  },
  step3: {
    heading: "Your request preview",
    hint: "This has not been sent. No appointment has been booked.",
    note: "Your sample details stay in this page and are cleared when you close this window.",
    edit: "Edit details",
    done: "Done",
    flexible: "Flexible",
    rows: { test: "Test", referral: "Referral", name: "Name", phone: "Phone", email: "Email", date: "Preferred date", method: "Contact by" },
  },
  errors: {
    test: "Choose the test listed on your referral.",
    referral: "Let us know whether you have a referral.",
    name: "Please enter a name.",
    phone: "Enter a phone number using digits, spaces or brackets.",
    email: "Enter an email address, for example alex@example.com.",
    ack: "Please confirm that you understand this is a sample request.",
  },
};

export type TestPage = {
  slug: TestSlug;
  title: string;
  name: string;
  abbr: string;
  breadcrumb: string;
  intro: string;
  footnote: string;
  print: string;
  after: { title: string[]; body: string; cta: { label: string; href: string } };
  sources: { before: string; links: { label: string; href: string }[]; joiner: string; after: string };
  next: { title: string; body: string; links: { label: string; href: string }[] };
  otherTests: string;
  breadcrumbRoot: { label: string; href: string };
};

const testShared = {
  otherTests: "Other tests",
  breadcrumbRoot: { label: "Services", href: routes.services },
  footnote:
    "Your referring clinician determines whether this assessment is appropriate. Service availability and practice-specific instructions require confirmation.",
  print: "Print this page",
  after: {
    title: ["Understanding your results."],
    body: "The results are considered alongside your symptoms, history and other investigations. Confirm the report arrangements and discuss the findings with your referring clinician.",
    cta: { label: "Information for doctors", href: routes.doctors },
  },
  sources: {
    before: "General information: ",
    links: [
      { label: "Mayo Clinic EEG", href: "https://www.mayoclinic.org/tests-procedures/eeg/about/pac-20393875" },
      { label: "Cleveland Clinic EMG/NCS", href: "https://my.clevelandclinic.org/health/diagnostics/4825-emg-electromyography" },
    ],
    joiner: " and ",
    after: ". Your care team’s instructions take priority.",
  },
  next: {
    title: "Before your visit.",
    body: "Confirm the test location, preparation, fees and authorisation requirements with reception.",
    links: [
      { label: "Practice locations", href: routes.locations },
      { label: "Fees and medical aid", href: `${routes.visit}#fees` },
    ],
  },
};

export const testPages: Record<TestSlug, TestPage> = {
  eeg: {
    slug: "eeg",
    title: "EEG | Neurogenix",
    name: "Electroencephalography",
    abbr: "EEG",
    breadcrumb: "EEG",
    intro: "Brain activity recorded through scalp sensors. Find out what to expect and how to prepare for your visit.",
    ...testShared,
  },
  ncs: {
    slug: "ncs",
    title: "NCS | Neurogenix",
    name: "Nerve conduction studies",
    abbr: "NCS",
    breadcrumb: "NCS",
    intro: "How signals travel along peripheral nerves. Find out what to expect and how to prepare for your visit.",
    ...testShared,
  },
  emg: {
    slug: "emg",
    title: "EMG | Neurogenix",
    name: "Electromyography",
    abbr: "EMG",
    breadcrumb: "EMG",
    intro: "Electrical activity recorded in selected muscles. Find out what to expect and how to prepare for your visit.",
    ...testShared,
  },
};
