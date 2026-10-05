import { SliderSlide, AboutInfo, Notice, Club, AdmissionGuide, GalleryItem, LandingBundle, StaffMember } from './types';

export const FALLBACK_SLIDES: SliderSlide[] = [
  {
    id: 1,
    title: "Nurturing Excellence, Inspiring Leadership",
    subtitle: "A premier Holy Cross institution dedicated to intellectual rigor and holistic character building in Narinda.",
    badge: "Excellence in Education",
    image_url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1920&auto=format&fit=crop",
    cta_text: "Apply For 2026-27",
    cta_link: "/admission",
    secondary_cta_text: "Discover SJIS",
    secondary_cta_link: "/about",
    order: 1,
    is_active: true
  },
  {
    id: 2,
    title: "World-Class STEM & Cambridge Curriculum",
    subtitle: "State-of-the-art physics, chemistry, robotics and computer labs empowering the next generation of innovators.",
    badge: "Holistic Academics",
    image_url: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?q=80&w=1920&auto=format&fit=crop",
    cta_text: "Explore Curriculum",
    cta_link: "/about",
    secondary_cta_text: "View Science Clubs",
    secondary_cta_link: "/clubs",
    order: 2,
    is_active: true
  },
  {
    id: 3,
    title: "Championing Arts, Sports & Character Formation",
    subtitle: "Over 24 student-led clubs, championship athletic teams, and vibrant cultural societies fostering well-rounded leaders.",
    badge: "Vibrant Student Life",
    image_url: "https://images.unsplash.com/photo-1511629091441-ee46146481b6?q=80&w=1920&auto=format&fit=crop",
    cta_text: "Explore Clubs & Sports",
    cta_link: "/clubs",
    secondary_cta_text: "View Campus Life",
    secondary_cta_link: "/gallery",
    order: 3,
    is_active: true
  },
  {
    id: 4,
    title: "Admissions Open for Academic Session 2026-2027",
    subtitle: "Join a legacy of outstanding academic distinction. Limited seats available for Playgroup to Grade XI.",
    badge: "Now Enrolling",
    image_url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1920&auto=format&fit=crop",
    cta_text: "Apply Online Now",
    cta_link: "/admission",
    secondary_cta_text: "Admission Criteria",
    secondary_cta_link: "/admission",
    order: 4,
    is_active: true
  }
];

export const FALLBACK_ABOUT: AboutInfo = {
  id: 1,
  title: "St. Joseph International School, Narinda",
  tagline: "Fostering Academic Excellence & Moral Integrity",
  history: "St. Joseph International School, Narinda is an esteemed Holy Cross institution with decades of illustrious educational heritage in Old Dhaka. Founded by the Congregation of Holy Cross, the school has consistently stood as a beacon of academic rigor, moral rectitude, and community service. Over generations, Josephites have gone on to lead in science, diplomacy, arts, civil service, and corporate leadership worldwide.",
  mission: "To educate hearts and minds through rigorous intellectual training, strong moral compass, creative inquiry, and empathetic leadership, fostering global citizens grounded in discipline and compassion.",
  vision: "To be the preeminent educational institution recognized globally for academic supremacy, innovative learning ecosystems, and steadfast ethical stewardship.",
  principal_name: "Brother Leo Pereira, CSC",
  principal_title: "Administrator",
  head_role_badge: "Head of Institution",
  welcome_tag: "WELCOME TO ST. JOSEPH NARINDA",
  welcome_title: "Educating Hearts & Minds for Generations.",
  heritage_years: "70+",
  heritage_label: "Years of Heritage",
  pillars: [
    "Cambridge Assessment International Education (CAIE)",
    "Dedicated Congregation of Holy Cross Mentorship",
    "Comprehensive STEM & Robotics Laboratories",
    "Champion Debating & Co-Curricular Guilds",
  ],
  primary_button_text: "Read Full School History",
  primary_button_url: "/about",
  secondary_button_text: "Admission Information",
  secondary_button_url: "/admission",
  principal_message: "Welcome to St. Joseph International School, Narinda. Our sacred mission has been to awaken intellectual curiosity and sculpt human character. We believe that true education does not merely prepare a child for examinations, but prepares them for life. Here at SJIS Narinda, our students are encouraged to question fearlessly, serve selflessly, and strive relentlessly for excellence. We warmly invite you to become part of our inspiring Josephite fraternity.",
  principal_image_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
  stats: {
    students: "3,200+",
    faculty: "140+",
    clubs: "24+",
    pass_rate: "100%",
    campus_acres: "4.5 Acres",
    national_awards: "85+"
  },
  core_values: [
    {
      title: "Faith & Moral Integrity",
      desc: "Cultivating honesty, spiritual grounding, and conscientious decision-making in every sphere of life.",
      icon: "ShieldCheck"
    },
    {
      title: "Intellectual Rigor",
      desc: "Empowering independent critical inquiry, innovative problem-solving, and continuous academic mastery.",
      icon: "BookOpen"
    },
    {
      title: "Inclusive Community",
      desc: "Fostering mutual respect, cultural celebration, and genuine empathy across our diverse student body.",
      icon: "Users"
    },
    {
      title: "Service & Stewardship",
      desc: "Instilling an enduring commitment to social justice, environmental care, and uplifting humanity.",
      icon: "HeartHandshake"
    }
  ],
  facilities: [
    {
      name: "Advanced STEM & Robotics Complex",
      desc: "Equipped with 3D printers, IoT kits, and specialized physics, chemistry, and biology laboratories.",
      icon: "Cpu"
    },
    {
      name: "Central Digital Library & Research Hall",
      desc: "Over 25,000 catalogued volumes, international peer-reviewed journals, and high-speed research terminals.",
      icon: "BookMarked"
    },
    {
      name: "Grand Auditorium & Performing Arts Theater",
      desc: "Acoustically engineered 1,200-seat multi-purpose auditorium for debates, dramatics, and musical galas.",
      icon: "Music"
    },
    {
      name: "FIFA-Standard Sports Complex & Gymnasium",
      desc: "All-weather turf for football and cricket, basketball courts, badminton arena, and indoor table tennis halls.",
      icon: "Trophy"
    }
  ]
};

export const FALLBACK_NOTICES: Notice[] = [
  {
    id: 1,
    title: "Admissions for Academic Year 2026-2027: Online Application Window Open",
    slug: "admissions-for-academic-year-2026-2027-online-application-window-open",
    category: "admission",
    category_display: "Admission",
    content: "The online application portal for admission into Playgroup, Nursery, Grade I, and Grade VI for the academic session 2026-2027 is now officially open. Prospective parents and guardians are requested to review the eligibility criteria and submit applications before November 15, 2026.",
    attachment_url: "/circulars/sjis-official-circular.pdf",
    publish_date: "2026-10-04",
    is_pinned: true,
    is_active: true,
    views_count: 1420
  },
  {
    id: 2,
    title: "Schedule for Cambridge International IGCSE & O-Level Mock Examinations",
    slug: "schedule-for-cambridge-international-igcse-and-o-level-mock-examinations",
    category: "exams",
    category_display: "Examinations",
    content: "The timetable for the upcoming Cambridge IGCSE and GCE O-Level preparatory mock examinations has been published. Students are advised to collect their admit cards from the academic coordinator and review the examination hall protocols.",
    attachment_url: "/circulars/sjis-official-circular.pdf",
    publish_date: "2026-10-02",
    is_pinned: true,
    is_active: true,
    views_count: 980
  },
  {
    id: 3,
    title: "Annual Science & Technology Festival 'Scintilla 2026' Announced",
    slug: "annual-science-and-technology-festival-scintilla-2026-announced",
    category: "events",
    category_display: "Events & Celebrations",
    content: "St. Joseph Science & Robotics Club proudly announces the 18th National Science Carnival 'Scintilla 2026'. Participating institutions will compete in Project Display, Olympiads, Hackathons, and Robo-Soccer. Registration opens on October 10.",
    attachment_url: "/circulars/sjis-official-circular.pdf",
    publish_date: "2026-09-29",
    is_pinned: true,
    is_active: true,
    views_count: 2150
  },
  {
    id: 4,
    title: "Autumn Recess & School Resumption Guidelines",
    slug: "autumn-recess-and-school-resumption-guidelines",
    category: "holidays",
    category_display: "Holidays & Closures",
    content: "The school campus will remain closed for the Autumn Vacation from October 18 to October 25, 2026. Regular academic classes for all shifts will resume on Monday, October 26 at 7:45 AM sharp.",
    publish_date: "2026-09-27",
    is_pinned: false,
    is_active: true,
    views_count: 640
  },
  {
    id: 5,
    title: "Mandatory Parent-Teacher Conference (PTC) for Junior & Senior Sections",
    slug: "mandatory-parent-teacher-conference-for-junior-senior-sections",
    category: "academic",
    category_display: "Academic",
    content: "The Term 1 Parent-Teacher Conference will take place on Saturday, October 12, 2026. Parents are requested to meet subject teachers according to the designated time slots distributed via student diaries.",
    publish_date: "2026-09-24",
    is_pinned: false,
    is_active: true,
    views_count: 1120
  },
  {
    id: 6,
    title: "Inter-House Annual Athletics Championship 2026 Selection Trials",
    slug: "inter-house-annual-athletics-championship-2026-selection-trials",
    category: "events",
    category_display: "Events & Celebrations",
    content: "House masters announce preliminary trials for 100m, 400m, high jump, long jump, and relay races. All registered student athletes must assemble on the main school ground in proper PE uniforms.",
    publish_date: "2026-09-20",
    is_pinned: false,
    is_active: true,
    views_count: 890
  }
];

export const FALLBACK_CLUBS: Club[] = [
  {
    id: 1,
    name: "Josephite Science & Robotics Club (JSRC)",
    slug: "josephite-science-and-robotics-club",
    category: "stem",
    category_display: "STEM & Innovation",
    motto: "Curiosity Unveils Tomorrow",
    description: "One of Bangladesh's premier school-level STEM hubs. JSRC fosters hands-on inquiry in robotics, IoT automation, astro-physics, drone engineering, and environmental technologies through national competitions.",
    icon_name: "Cpu",
    image_url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200&auto=format&fit=crop",
    moderator_name: "Mr. Tahsin Rahman (Senior Physics Faculty)",
    schedule: "Tuesdays & Thursdays, 3:30 PM - 5:00 PM",
    key_activities: [
      "Hands-on Arduino & Raspberry Pi workshops",
      "Annual 'Scintilla' National Science Festival",
      "Astronomy night sky observations",
      "Competitive Robo-Wars and maze-solver leagues"
    ],
    achievements: [
      "Champion - National Robotech Carnival 2025",
      "Global finalist - First Lego League Asia-Pacific",
      "Best Innovation Award - BUET Tech Fest"
    ],
    order: 1,
    is_active: true
  },
  {
    id: 2,
    name: "St. Joseph Debating Society (SJDS)",
    slug: "st-joseph-debating-society",
    category: "debate",
    category_display: "Debate & Public Speaking",
    motto: "Veritas et Eloquentia (Truth & Eloquence)",
    description: "Renowned across South Asia for producing articulate thinkers, parliamentarians, and legal scholars. SJDS trains students in British Parliamentary, Asian Parliamentary, and traditional debating formats.",
    icon_name: "Mic",
    image_url: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=1200&auto=format&fit=crop",
    moderator_name: "Ms. Farhana Haque (Department of English)",
    schedule: "Wednesdays, 3:00 PM - 5:00 PM",
    key_activities: [
      "Weekly mock parliamentary debates",
      "Public speaking and extempore masterclasses",
      "Inter-House Josephite Debating Championship",
      "International delegations to Harvard & Oxford Model UN"
    ],
    achievements: [
      "Undefeated Champions - National English Debate Championship 2025",
      "Best Delegation - Dhaka University Model UN",
      "Winner - BTV National School Debating Series"
    ],
    order: 2,
    is_active: true
  },
  {
    id: 3,
    name: "Josephite Cultural & Performing Arts Club",
    slug: "josephite-cultural-and-performing-arts-club",
    category: "arts",
    category_display: "Cultural & Fine Arts",
    motto: "Harmony in Heritage and Expression",
    description: "Celebrating the rich cultural tapestry of Bengal and world literature. The club organizes classical and contemporary music ensembles, theatrical plays, traditional dance forms, and annual Rabindra-Nazrul tributes.",
    icon_name: "Music",
    image_url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop",
    moderator_name: "Mr. Anupam Sen (Fine Arts Director)",
    schedule: "Mondays, 3:30 PM - 4:45 PM",
    key_activities: [
      "Annual Drama Production & Shakespearean Play",
      "Orchestra and choral music workshops",
      "Pahela Baishakh Cultural Carnival",
      "Inter-school vocal and instrument contests"
    ],
    achievements: [
      "1st Place - Shilpakala National Youth Drama Fest",
      "Gold Trophy - National Inter-School Choral Championship"
    ],
    order: 3,
    is_active: true
  },
  {
    id: 4,
    name: "St. Joseph ICT & Coding Society",
    slug: "st-joseph-ict-and-coding-society",
    category: "stem",
    category_display: "STEM & Innovation",
    motto: "Code. Build. Transform.",
    description: "Empowering students with 21st-century computational thinking, web development, algorithms, artificial intelligence, and competitive programming in Python, C++, and JavaScript.",
    icon_name: "Terminal",
    image_url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop",
    moderator_name: "Engr. Salman Kabir (Computer Science Lead)",
    schedule: "Fridays, 9:00 AM - 11:30 AM",
    key_activities: [
      "Competitive programming rounds on Codeforces/LeetCode",
      "Web & Fullstack app development bootcamps",
      "Cybersecurity and ethical hacking fundamentals",
      "School portal maintenance and tech mentorship"
    ],
    achievements: [
      "Gold Medalists - National Olympiad in Informatics (NOI)",
      "1st Place - HackDhaka Youth Hackathon 2025"
    ],
    order: 4,
    is_active: true
  },
  {
    id: 5,
    name: "Josephite Sports & Athletics Guild",
    slug: "josephite-sports-and-athletics-guild",
    category: "sports",
    category_display: "Sports & Athletics",
    motto: "Strength, Discipline, Honor",
    description: "Instilling sportsmanship and physical resilience. From inter-school football, cricket, and basketball tournaments to table tennis and athletics, the guild trains champions.",
    icon_name: "Trophy",
    image_url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop",
    moderator_name: "Coach Rafiqul Islam (Physical Education Director)",
    schedule: "Everyday After School, 4:00 PM - 6:00 PM",
    key_activities: [
      "Intra-School Premier League Football & Cricket",
      "Inter-School Basketball Invitational Tournament",
      "Athletics conditioning & sprint coaching",
      "Annual Sports Day Extravaganza"
    ],
    achievements: [
      "Dhaka Divisional School Football Champions (3 consecutive years)",
      "Runners-up - National Inter-School Cricket Cup"
    ],
    order: 5,
    is_active: true
  },
  {
    id: 6,
    name: "Josephite Eco & Social Welfare Guild",
    slug: "josephite-eco-and-social-welfare-guild",
    category: "service",
    category_display: "Leadership & Social Welfare",
    motto: "Serving Mankind, Healing the Earth",
    description: "Living the Holy Cross ethos of selfless service. Students spearhead tree plantation drives, flood relief distributions, community health campaigns, and campus green audits.",
    icon_name: "HeartHandshake",
    image_url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1200&auto=format&fit=crop",
    moderator_name: "Brother Joy Gomez, CSC",
    schedule: "Alternate Saturdays, 10:00 AM - 12:30 PM",
    key_activities: [
      "Old Dhaka Urban Greening & Clean Campus Initiatives",
      "Annual Winter Clothes & Relief Drive",
      "Free tutoring for underprivileged children in Narinda",
      "Plastic-Free School Campaign & Composting"
    ],
    achievements: [
      "Eco-School Green Flag Award 2025",
      "Community Impact Certificate from Holy Cross Congregation"
    ],
    order: 6,
    is_active: true
  }
];

export const FALLBACK_ADMISSION: AdmissionGuide = {
  academic_year: "2026-2027",
  title: "Admissions for Academic Session 2026-2027",
  overview: "St. Joseph International School, Narinda invites applications from passionate, diligent learners for the 2026-2027 academic session. We offer a holistic educational journey blending the acclaimed Cambridge Assessment International Education (CAIE) curriculum with our time-honored Josephite values.",
  is_open: true,
  eligibility: [
    {
      level: "Early Childhood (Playgroup & Nursery)",
      age_bracket: "3.5 to 4.5 Years as of January 1, 2026",
      criteria: "Friendly interactive session assessing basic communication, motor skills, and social readiness."
    },
    {
      level: "Primary School (Grades 1 to 5)",
      age_bracket: "6 to 10 Years",
      criteria: "Written evaluation in English, Mathematics, and General Awareness, followed by a family interaction."
    },
    {
      level: "Middle & Secondary (Grades 6 to 9)",
      age_bracket: "11 to 15 Years",
      criteria: "Rigorous entrance test in English, Advanced Math, and Science with academic transcripts from previous school."
    },
    {
      level: "Cambridge O-Levels & A-Levels",
      age_bracket: "15+ Years",
      criteria: "Outstanding academic record, minimum grades in checkpoint or IGCSE exams, and subject counseling."
    }
  ],
  application_steps: [
    {
      step: 1,
      title: "Online Application Submission",
      description: "Fill out the interactive admission inquiry form with candidate details, parent information, and target grade."
    },
    {
      step: 2,
      title: "Document Verification & Fee Payment",
      description: "Upload scanned copies of birth certificate, previous school report cards, and pay the nominal test processing fee."
    },
    {
      step: 3,
      title: "Assessment Test & Interactive Session",
      description: "Candidates participate in age-appropriate diagnostic evaluations measuring aptitude and conceptual clarity."
    },
    {
      step: 4,
      title: "Parent & Student Dialogue",
      description: "Informal meeting with the Headmaster and academic council to ensure shared educational goals."
    },
    {
      step: 5,
      title: "Offer Letter & Admission Confirmation",
      description: "Successful applicants receive admission confirmation and welcome packs with uniform and orientation guides."
    }
  ],
  required_documents: [
    "Attested copy of Child's Digital Birth Registration Certificate",
    "Previous 2 academic years' certified report cards and transfer certificate",
    "4 recent passport-size photographs of the student in white background",
    "National ID (NID) or Passport copy of Father, Mother, or Legal Guardian",
    "Medical fitness certificate and immunization records"
  ],
  fee_structure: [
    {
      section: "Early Childhood (Playgroup - KG)",
      admission_fee: "BDT 45,000 (One-time)",
      monthly_tuition: "BDT 7,500",
      annual_session_charge: "BDT 15,000"
    },
    {
      section: "Primary Section (Grade 1 - 5)",
      admission_fee: "BDT 55,000 (One-time)",
      monthly_tuition: "BDT 9,000",
      annual_session_charge: "BDT 18,000"
    },
    {
      section: "Junior Section (Grade 6 - 8)",
      admission_fee: "BDT 65,000 (One-time)",
      monthly_tuition: "BDT 11,500",
      annual_session_charge: "BDT 22,000"
    },
    {
      section: "Cambridge IGCSE & O-Levels (Grade 9 - 10)",
      admission_fee: "BDT 75,000 (One-time)",
      monthly_tuition: "BDT 14,000",
      annual_session_charge: "BDT 25,000"
    },
    {
      section: "Advanced Level (Grade 11 - 12)",
      admission_fee: "BDT 85,000 (One-time)",
      monthly_tuition: "BDT 16,500",
      annual_session_charge: "BDT 28,000"
    }
  ],
  important_dates: [
    { event: "Online Application Begins", date: "October 1, 2026" },
    { event: "Application Submission Deadline", date: "November 20, 2026" },
    { event: "Entrance Assessment Dates", date: "November 28 - 30, 2026" },
    { event: "Publication of Merit List", date: "December 8, 2026" },
    { event: "Orientation & Session Commencement", date: "January 10, 2027" }
  ]
};

export const FALLBACK_GALLERY: GalleryItem[] = [
  {
    id: 1,
    title: "Historic Narinda Campus Quadrangle",
    category: "campus",
    category_display: "Campus & Heritage",
    media_type: "image",
    image_url: "https://images.unsplash.com/photo-1546422904-90eab23c3d7e?q=80&w=1200&auto=format&fit=crop",
    caption: "The serene, red-brick heritage architecture and lush green lawns of St. Joseph Narinda campus.",
    is_featured: true,
    order: 1
  },
  {
    id: 2,
    title: "Students in Modern Robotics & STEM Lab",
    category: "academics",
    category_display: "Academic & STEM Labs",
    media_type: "image",
    image_url: "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1200&auto=format&fit=crop",
    caption: "Junior scientists collaborating on autonomous robotic prototypes and AI sensors.",
    is_featured: true,
    order: 2
  },
  {
    id: 3,
    title: "Annual Inter-House Football Championship",
    category: "sports",
    category_display: "Sports & Athletics",
    media_type: "image",
    image_url: "https://images.unsplash.com/photo-1511629091441-ee46146481b6?q=80&w=1200&auto=format&fit=crop",
    caption: "Electric atmosphere during the final showdown of the Inter-House Football League.",
    is_featured: true,
    order: 3
  },
  {
    id: 4,
    title: "Annual Cultural Gala & Musical Performance",
    category: "cultural",
    category_display: "Cultural & Performing Arts",
    media_type: "image",
    image_url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop",
    caption: "Students performing traditional Bengali classical melodies in the grand auditorium.",
    is_featured: true,
    order: 4
  },
  {
    id: 5,
    title: "Interactive Smart Classroom Learning",
    category: "academics",
    category_display: "Academic & STEM Labs",
    media_type: "image",
    image_url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop",
    caption: "Digital smart-board integrated pedagogy bringing complex concepts to life.",
    is_featured: true,
    order: 5
  },
  {
    id: 6,
    title: "Pahela Baishakh Bangla New Year Festivities",
    category: "cultural",
    category_display: "Cultural & Performing Arts",
    media_type: "image",
    image_url: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1200&auto=format&fit=crop",
    caption: "Color, joy, and traditional celebration welcoming the Bengali New Year at Narinda.",
    is_featured: true,
    order: 6
  },
  {
    id: 7,
    title: "National Science Carnival 'Scintilla' Project Exhibition",
    category: "events",
    category_display: "Annual Events & Celebrations",
    media_type: "image",
    image_url: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?q=80&w=1200&auto=format&fit=crop",
    caption: "Over 500 projects displayed by young innovators from schools across the nation.",
    is_featured: false,
    order: 7
  },
  {
    id: 8,
    title: "Central Library & Digital Archives Hall",
    category: "campus",
    category_display: "Campus & Heritage",
    media_type: "image",
    image_url: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1200&auto=format&fit=crop",
    caption: "A peaceful sanctuary housing over 25,000 books, journals, and digital research bays.",
    is_featured: false,
    order: 8
  },
  {
    id: 9,
    title: "Annual Athletic Meet Track & Field Events",
    category: "sports",
    category_display: "Sports & Athletics",
    media_type: "image",
    image_url: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1200&auto=format&fit=crop",
    caption: "Athletes competing in 100-meter dash and relay events on sports day.",
    is_featured: false,
    order: 9
  },
  {
    id: 10,
    title: "Graduation & Valedictory Ceremony",
    category: "events",
    category_display: "Annual Events & Celebrations",
    media_type: "image",
    image_url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop",
    caption: "Celebrating the graduating batch stepping out to conquer global horizons.",
    is_featured: false,
    order: 10
  }
];

export const FALLBACK_BUNDLE: LandingBundle = {
  slides: FALLBACK_SLIDES,
  about: FALLBACK_ABOUT,
  notices: FALLBACK_NOTICES,
  clubs: FALLBACK_CLUBS,
  gallery: FALLBACK_GALLERY.slice(0, 6)
};

export const FALLBACK_FACULTY: StaffMember[] = [
  // Administration Body
  {
    id: 1,
    name: "Brother Leo Pereira, CSC",
    role_type: "admin",
    designation: "Administrator & Head of Institution",
    department: "Executive Directorate & Holy Cross Council",
    qualification: "M.Ed. (Boston College, USA), B.A. (Notre Dame University)",
    image_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
    email: "administrator@sjis-narinda.edu.bd",
    bio: "Serving as Administrator, Brother Leo leads the institutional mission of holistic human formation, moral rectitude, and academic rigor in the Holy Cross tradition.",
    order: 1,
    is_featured: true,
    is_active: true,
  },
  {
    id: 2,
    name: "Dr. Ronald Gomes",
    role_type: "admin",
    role_type_display: "Administration Body & Leadership",
    designation: "Vice Principal & Academic Dean",
    department: "Academic Council & CAIE Standards",
    qualification: "Ph.D. in Educational Administration, M.Sc. Applied Mathematics",
    image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
    email: "vice.principal@sjis-narinda.edu.bd",
    bio: "Overseeing curriculum compliance, pedagogical training, and Cambridge Assessment standards across O Level and A Level cohorts.",
    order: 2,
    is_featured: true,
    is_active: true,
  },
  {
    id: 3,
    name: "Rev. Father Anthony Rozario, CSC",
    role_type: "admin",
    role_type_display: "Administration Body & Leadership",
    designation: "Chairman, School Governing Body",
    department: "Congregation of Holy Cross Council",
    qualification: "Licentiate in Theology (Rome), M.A. Philosophy (DU)",
    image_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop",
    email: "governing.board@sjis-narinda.edu.bd",
    bio: "Guiding institutional policy, ethical development, philanthropic aid, and community outreach for St. Joseph International School.",
    order: 3,
    is_featured: true,
    is_active: true,
  },
  {
    id: 4,
    name: "Ms. Marianne D'Souza",
    role_type: "admin",
    role_type_display: "Administration Body & Leadership",
    designation: "Director of Admissions & Student Welfare",
    department: "Student Affairs Directorate",
    qualification: "M.A. English (DU), Cambridge Certificate in Educational Leadership",
    image_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop",
    email: "admissions@sjis-narinda.edu.bd",
    bio: "Directing applicant evaluation pathways, student pastoral care, and co-curricular guild mentoring across all academic divisions.",
    order: 4,
    is_featured: true,
    is_active: true,
  },
  {
    id: 5,
    name: "Mr. Kazi Ashfaqur Rahman",
    role_type: "admin",
    role_type_display: "Administration Body & Leadership",
    designation: "Director of Finance & Campus Operations",
    department: "Bursar & Corporate Affairs",
    qualification: "FCA (ICAB), MBA in Finance (IBA, University of Dhaka)",
    image_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop",
    email: "bursar@sjis-narinda.edu.bd",
    bio: "Overseeing long-term endowment investments, capital campus infrastructure expansion, and corporate governance compliance.",
    order: 5,
    is_featured: true,
    is_active: true,
  },

  // Teachers (Academic Faculty)
  {
    id: 6,
    name: "Dr. Syed Aminul Islam",
    role_type: "teacher",
    role_type_display: "Academic Faculty & Teaching Staff",
    designation: "Head of Science & Senior Cambridge Physics Faculty",
    department: "Department of Physics",
    qualification: "Ph.D. in Physics, M.Sc. (First Class, DU), Cambridge Examiner",
    image_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop",
    email: "aminul.physics@sjis-narinda.edu.bd",
    bio: "With over 22 years of pedagogical leadership, Dr. Islam mentors national science olympiad medalists and leads advanced Cambridge Physics.",
    order: 10,
    is_featured: true,
    is_active: true,
  },
  {
    id: 7,
    name: "Ms. Nusrat Jahan",
    role_type: "teacher",
    role_type_display: "Academic Faculty & Teaching Staff",
    designation: "Head of Mathematics Department",
    department: "Department of Mathematics",
    qualification: "M.Sc. in Applied Mathematics (DU), Cambridge Professional Fellow",
    image_url: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?q=80&w=800&auto=format&fit=crop",
    email: "nusrat.math@sjis-narinda.edu.bd",
    bio: "Specialist in Further Pure Mathematics, Calculus, and Statistics with multiple Josephite alumni securing Cambridge World Highest marks.",
    order: 11,
    is_featured: true,
    is_active: true,
  },
  {
    id: 8,
    name: "Mr. Robert Anthony Cruze",
    role_type: "teacher",
    role_type_display: "Academic Faculty & Teaching Staff",
    designation: "Senior Cambridge Chemistry Faculty & Lab Director",
    department: "Department of Chemistry",
    qualification: "M.Sc. in Chemistry (JU), Postgraduate Diploma in Education",
    image_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop",
    email: "cruze.chem@sjis-narinda.edu.bd",
    bio: "Leading analytical chemistry research, laboratory micro-experimentation, and practical chemistry workshops for senior scholars.",
    order: 12,
    is_featured: false,
    is_active: true,
  },
  {
    id: 9,
    name: "Ms. Sharmin Akhter",
    role_type: "teacher",
    role_type_display: "Academic Faculty & Teaching Staff",
    designation: "Head of English Language & World Literature",
    department: "Department of English",
    qualification: "M.A. in English Literature (DU), CELTA Certified",
    image_url: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=800&auto=format&fit=crop",
    email: "sharmin.english@sjis-narinda.edu.bd",
    bio: "Directs rhetorical composition, classical literature, and coaches the championship St. Joseph Debating Society.",
    order: 13,
    is_featured: false,
    is_active: true,
  },
  {
    id: 10,
    name: "Mr. Tanvir Hasan",
    role_type: "teacher",
    role_type_display: "Academic Faculty & Teaching Staff",
    designation: "Lead Faculty in Computer Science, Robotics & AI",
    department: "Department of Computer Science & Robotics",
    qualification: "B.Sc. in Computer Science & Engineering (BUET)",
    image_url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800&auto=format&fit=crop",
    email: "tanvir.cs@sjis-narinda.edu.bd",
    bio: "Mentors algorithmic competitive programming, embedded Arduino/Raspberry Pi robotics, and international olympiad teams.",
    order: 14,
    is_featured: true,
    is_active: true,
  },
  {
    id: 11,
    name: "Ms. Sabina Yasmin",
    role_type: "teacher",
    role_type_display: "Academic Faculty & Teaching Staff",
    designation: "Senior Biology & Biotechnology Faculty",
    department: "Department of Biological Sciences",
    qualification: "M.Sc. in Biochemistry & Molecular Biology (DU)",
    image_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop",
    email: "sabina.bio@sjis-narinda.edu.bd",
    bio: "Focuses on human cellular biology, genetics, and moderates the student Eco-Conservation & Nature Forum.",
    order: 15,
    is_featured: false,
    is_active: true,
  },
  {
    id: 12,
    name: "Mr. John Benedict",
    role_type: "teacher",
    role_type_display: "Academic Faculty & Teaching Staff",
    designation: "Senior Faculty in Economics & Business Studies",
    department: "Department of Economics & Commerce",
    qualification: "M.Sc. in Economics (LSE, UK), BBA (IBA)",
    image_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop",
    email: "benedict.econ@sjis-narinda.edu.bd",
    bio: "Specializing in macroeconomics, market behavior, financial literacy, and moderator of the St. Joseph Business & Entrepreneurship Guild.",
    order: 16,
    is_featured: false,
    is_active: true,
  },
  {
    id: 13,
    name: "Ms. Farhana Chowdhury",
    role_type: "teacher",
    role_type_display: "Academic Faculty & Teaching Staff",
    designation: "Cambridge Primary & Middle Years Coordinator",
    department: "Primary & Middle School Division",
    qualification: "M.Ed. in Child Psychology & Early Education",
    image_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop",
    email: "farhana.primary@sjis-narinda.edu.bd",
    bio: "Directs progressive early-years inquiry curriculum, foundational phonics, mathematical reasoning, and social development.",
    order: 17,
    is_featured: false,
    is_active: true,
  },

  // Staff (Support & Operations)
  {
    id: 14,
    name: "Mr. David Rozario",
    role_type: "office",
    role_type_display: "Office & Administrative Staff",
    designation: "Chief Registrar & Academic Records Officer",
    department: "Office of the Registrar & Examinations",
    qualification: "M.A., 18+ Years Institutional Registrar Experience",
    image_url: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=800&auto=format&fit=crop",
    email: "registrar@sjis-narinda.edu.bd",
    bio: "Oversees official examination candidacies, student registration registers, official academic transcripts, and credentials authentication.",
    order: 20,
    is_featured: false,
    is_active: true,
  },
  {
    id: 15,
    name: "Engr. Faisal Ahmed",
    role_type: "office",
    role_type_display: "Office & Administrative Staff",
    designation: "Chief Systems Administrator & Digital Infrastructure",
    department: "Campus Information Technology Directorate",
    qualification: "B.Sc. in EEE, Cisco CCNA, Red Hat Certified Engineer",
    image_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
    email: "it.admin@sjis-narinda.edu.bd",
    bio: "Architect of the campus-wide gigabit optical network, examination computer labs, multi-layered cybersecurity, and smart learning boards.",
    order: 21,
    is_featured: false,
    is_active: true,
  },
  {
    id: 16,
    name: "Ms. Rebecca Costa",
    role_type: "office",
    role_type_display: "Office & Administrative Staff",
    designation: "Head Librarian & Digital Resource Center Manager",
    department: "Central Academic Library",
    qualification: "M.A. in Information Science & Library Management (DU)",
    image_url: "https://images.unsplash.com/photo-1534751516642-a171edd2521d?q=80&w=800&auto=format&fit=crop",
    email: "library@sjis-narinda.edu.bd",
    bio: "Curates a repository of 35,000+ volumes, international academic research journals, audio-visual suites, and heritage archives.",
    order: 22,
    is_featured: false,
    is_active: true,
  },
  {
    id: 17,
    name: "Ms. Dilruba Parveen",
    role_type: "office",
    role_type_display: "Office & Administrative Staff",
    designation: "Lead Student Counselor & Mental Wellness Officer",
    department: "Student Counseling & Emotional Guidance Unit",
    qualification: "M.S. in Clinical Psychology (DU), Certified Adolescent Counselor",
    image_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop",
    email: "counseling@sjis-narinda.edu.bd",
    bio: "Offers confidential guidance, adolescent emotional health support, academic stress mitigation, and career development roadmaps.",
    order: 23,
    is_featured: false,
    is_active: true,
  },
  {
    id: 18,
    name: "Mr. Ashraful Alam",
    role_type: "office",
    role_type_display: "Office & Administrative Staff",
    designation: "Senior Accounts & Bursar Operations Officer",
    department: "Accounts & Financial Services Division",
    qualification: "M.Com in Accounting, Certified Public Finance Fellow",
    image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
    email: "accounts@sjis-narinda.edu.bd",
    bio: "Directs fee schedules, fiscal compliance, bursary disbursements, and procurement audits with precision transparency.",
    order: 24,
    is_featured: false,
    is_active: true,
  },
  {
    id: 19,
    name: "Mr. Subhash Chandra Roy",
    role_type: "staff",
    role_type_display: "Support & Operations Staff",
    designation: "Senior Science Laboratories Superintendent",
    department: "STEM Research & Practical Facilities",
    qualification: "B.Sc. in Applied Chemistry, Lab Safety Certified",
    image_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop",
    email: "labs@sjis-narinda.edu.bd",
    bio: "Maintains state-of-the-art laboratory safety standards, reagent logistics, and precision optical sensors for practical assessments.",
    order: 25,
    is_featured: false,
    is_active: true,
  },
  {
    id: 20,
    name: "Mr. Peter Gomez",
    role_type: "staff",
    role_type_display: "Support & Operations Staff",
    designation: "Director of Campus Security & Estate Operations",
    department: "Campus Security & Estate Logistics",
    qualification: "Ex-Defense Services Logistics & Security Management",
    image_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop",
    email: "security@sjis-narinda.edu.bd",
    bio: "Guarantees 24/7 student perimeter safety, high-definition automated gate surveillance, emergency readiness, and campus facilities upkeep.",
    order: 26,
    is_featured: false,
    is_active: true,
  },
  {
    id: 21,
    name: "Mr. Manuel Costa",
    role_type: "staff",
    role_type_display: "Support & Operations Staff",
    designation: "Senior Laboratory Technician & STEM Support",
    department: "Physics & Chemistry Laboratories",
    qualification: "Diploma in Lab Technology & Apparatus Calibration",
    image_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop",
    email: "stem.support@sjis-narinda.edu.bd",
    bio: "Prepares scientific apparatus, balances, glassware, and digital testing probes for secondary and higher secondary lab practicals.",
    order: 27,
    is_featured: false,
    is_active: true,
  },
  {
    id: 22,
    name: "Mr. Babul Tripura",
    role_type: "staff",
    role_type_display: "Support & Operations Staff",
    designation: "Campus Transport & Fleet Operations Coordinator",
    department: "Transport & Logistics Division",
    qualification: "Advanced Vehicle Fleet Safety & Logistics Certified",
    image_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop",
    email: "transport@sjis-narinda.edu.bd",
    bio: "Coordinates air-conditioned student buses, driver vetting, real-time GPS tracking, and daily commute logistics across Dhaka.",
    order: 28,
    is_featured: false,
    is_active: true,
  },
];

