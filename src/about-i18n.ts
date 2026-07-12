export const aboutContent = {
    slug: 'about',
    seo: {
      title: 'Louis Lu | Senior Software Engineer · Applied AI/ML',
      description: 'Senior Software Engineer building production RAG and AI systems at JPMorgan. Open to senior/staff engineering roles in applied AI.',
    },
    heading: 'Louis Lu',
    manifesto: "I don't ship AI demos. I ship AI that survives production.",
    subtitle: 'Senior Software Engineer · Applied AI/ML',
    location: 'New York, NY',
    lastUpdated: 'July 2026',
    bio: [
      "Senior Software Engineer with 5+ years building production AI, data, and distributed systems across fintech and healthcare. Currently building RAG-based risk and audit tools at JPMorgan; previously led the architecture of Fulgent Genetics' first cloud-based AI pathology platform.",
      'Builds systems that have to work under real constraints — a RAG pipeline reviewing millions of financial transactions, a bioinformatics platform processing 200TB of genetics data daily, and COVID-19 testing pipelines handling 10,000+ daily samples integrated with the CDC and 46 state health department APIs.',
      'M.S. in Data Science from Columbia University, B.S. in Cognitive Science (Machine Learning & Computation) from UC San Diego. 1st place, Columbia Data Science Hackathon.',
    ],
    seeking: 'Open to:',
    roles: ['Senior Software Engineer', 'AI/ML Infrastructure Engineer', 'Staff Software Engineer'],
    timelineHeading: 'Experience',
    timeline: [
      { period: 'Apr 2025 - Present', role: 'Software Engineer, Senior Associate', company: 'JPMorgan Chase', desc: 'Risk AI Platform — production RAG systems for enterprise audit and risk workflows' },
      { period: 'Feb 2021 - Apr 2025', role: 'Senior Software Engineer', company: 'Fulgent Genetics', desc: 'AI Diagnostics Platform — founding tech lead for Eziopath, a cloud-native AI pathology platform' },
    ],
    certificationsHeading: 'Certifications',
    certifications: [] as { org: string; items: string[] }[],
    educationHeading: 'Education',
    education: [
      'Columbia University — M.S. in Data Science (2019–2020)',
      'UC San Diego — B.S. in Cognitive Science, Machine Learning & Computation (2015–2019)',
    ],
    faqHeading: 'Frequently Asked Questions',
    faq: [
      { q: 'Who is Louis Lu?', a: 'Louis Lu is a Senior Software Engineer based in New York, NY, currently building production RAG and AI systems on the Risk AI Platform team at JPMorgan Chase. Before that, he spent four years at Fulgent Genetics leading AI diagnostics infrastructure, most recently as founding tech lead for Eziopath, the company\'s first cloud-based AI pathology platform. He holds an M.S. in Data Science from Columbia University and a B.S. in Cognitive Science from UC San Diego.' },
      { q: 'What roles are you looking for?', a: "Louis is open to senior or staff-level software engineering roles focused on applied AI/ML — RAG systems, LLM infrastructure, or production ML platforms — based in NYC or remote." },
      { q: 'What has Louis built?', a: 'At JPMorgan, Louis led a RAG-based document assistant for auditors and risk analysts, built on a contextual-retrieval pipeline with hybrid search and streaming generation. At Fulgent Genetics, he led Eziopath (a cloud-native AI pathology platform used by a team of 6 engineers), partnered with ML scientists to productionize cancer-detection models, and built distributed systems processing 200TB of genetics data and 10,000+ daily COVID-19 test results.' },
    ],
    connectHeading: 'Connect',
    email: 'yl4372@columbia.edu',
} as const
