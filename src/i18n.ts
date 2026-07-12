export const seo = {
  title:
    'Louis Lu | Senior Software Engineer · Applied AI/ML',
  description:
    'Senior Software Engineer building production RAG and AI systems at JPMorgan. Previously led AI diagnostics platforms at Fulgent Genetics. M.S. Data Science, Columbia University.',
};

export const translations = {
    greeting: 'who ships AI to production',
    greetingRoles: ['Senior Software Engineer', 'RAG Systems Builder', 'Applied AI/ML Engineer'],
    pillLabels: ['Senior SWE', 'Applied AI/ML'],
    email: 'yl4372@columbia.edu',
    role: '',
    story: {
      context: '5+ years shipping AI and data systems to production.',
      reflections: ['It works. In production.', '...at scale.'],
      hookParagraphs: [
        ["I've spent my career building systems that have to work — not in a demo, but for real users making real decisions."],
        [
          'From bioinformatics pipelines processing *200TB a day* to RAG systems reviewing',
          '+millions of financial transactions+, production reliability was never optional.',
        ],
      ],
      why: 'At JPMorgan I led the architecture of a RAG-based document assistant for auditors and risk analysts — a contextual-retrieval pipeline that improved accuracy by 8% and now runs inside a platform reviewing millions of daily transactions.',
      seeking: [
        'Still early in the AI-systems era.',
        'Bigger platforms. Harder reliability problems.',
        "Ready for what's next.",
      ],
      nav: [
        { icon: 'briefcase', label: 'My path', href: '#experience' },
        { icon: 'folder', label: 'What I build', href: '#projects' },
        { icon: 'mail', label: "Let's talk", href: '#contact' },
        { icon: 'bot', label: 'Ask me', href: '#chat', highlight: true },
      ],
      skills: [
        'RAG & LLM Systems',
        'Distributed Systems',
        'Cloud Infrastructure (AWS)',
        'Full-Stack Engineering',
        'Technical Leadership',
        'AI-Assisted Engineering',
      ],
      skipButton: 'Skip intro',
    },
    taglines: [] as readonly string[],
    location: 'New York, NY',
    roles: [
      'Senior Software Engineer',
      'AI/ML Infrastructure Engineer',
      'Staff Software Engineer',
    ],
    summary: {
      title: 'Professional Summary',
      p1: 'Senior software engineer focused on',
      p1Highlight: 'production AI and RAG systems',
      p1End:
        'across fintech and healthcare — from an enterprise risk-review assistant at JPMorgan to a cloud-native AI pathology platform at Fulgent Genetics. M.S. in Data Science from Columbia University.',
      p2: 'End-to-end ownership across',
      p2Highlight: 'architecture → implementation → production observability',
      p2End: ', leading small teams and collaborating closely with ML scientists and stakeholders.',
      cards: [
        {
          title: 'Production-First',
          desc: 'Systems built for scale, reliability, and observability from day one',
        },
        {
          title: 'Strengths',
          desc: 'RAG/LLM systems, distributed data infrastructure, technical leadership',
        },
        {
          title: 'Technical Fluency',
          desc: 'Full-stack (Java/Spring, React/TypeScript), AWS, LLM orchestration, streaming pipelines',
        },
      ],
    },
    coreCompetencies: {
      title: 'Core Competencies',
      items: [
        {
          title: 'RAG & LLM Systems',
          desc: 'Retrieval pipelines, hybrid search, streaming generation, safety gating',
        },
        {
          title: 'Distributed Systems',
          desc: 'High-throughput data pipelines, HPC clusters, event-driven architecture',
        },
        {
          title: 'Cloud Infrastructure',
          desc: 'AWS (EC2, EKS, Lambda, RDS, DynamoDB), Docker, CI/CD',
        },
        {
          title: 'Technical Leadership',
          desc: 'Led engineering teams of 4-6, owned architecture and onboarding',
        },
        {
          title: 'Full-Stack Engineering',
          desc: 'Spring Boot, React, Angular, Vue, TypeScript',
        },
        {
          title: 'AI-Assisted Engineering',
          desc: 'GitHub Copilot-driven migrations, agentic coding workflows',
        },
      ],
    },
    techStack: {
      title: 'Tech Stack',
      categories: [
        {
          name: 'Languages',
          items: ['Java', 'TypeScript', 'JavaScript', 'Python', 'Scala', 'R', 'Bash'],
        },
        {
          name: 'AI / LLM',
          items: ['LlamaIndex', 'ChromaDB', 'GPT-4o-mini', 'RAG Pipelines', 'GitHub Copilot'],
        },
        {
          name: 'Frameworks',
          items: ['Spring Boot', 'Akka', 'Flask', 'React', 'Angular', 'Vue'],
        },
        {
          name: 'Databases',
          items: ['Oracle SQL', 'MongoDB', 'AWS RDS', 'DynamoDB', 'AWS DocumentDB', 'Redis'],
        },
        {
          name: 'Cloud & Infra',
          items: ['AWS EC2', 'AWS EKS', 'AWS Lambda', 'AWS API Gateway', 'Docker', 'Jenkins', 'RabbitMQ'],
        },
        { name: 'Monitoring', items: ['OpenTelemetry', 'Tableau', 'Grafana', 'Ambari Hadoop'] },
      ],
    },
    experience: {
      title: 'Work Experience',
      items: [
        {
          company: 'JPMorgan Chase',
          location: 'New York, NY',
          role: 'Software Engineer, Senior Associate — Risk AI Platform',
          period: 'Apr 2025 - Present',
          desc: 'Building production RAG and AI systems for enterprise risk and audit workflows reviewing millions of daily transactions.',
          highlights: [
            'Led architecture and development of a RAG-based document assistant for auditors and risk analysts: a LlamaIndex ingestion pipeline with contextual retrieval into ChromaDB, improving retrieval accuracy by 8% and reducing latency by 6%.',
            'Built the production RAG serving layer — query condensation, hybrid search with Reciprocal Rank Fusion, streaming generation (GPT-4o-mini), and a safety gate blocking unsafe requests before retrieval and generation.',
            'Led an AI-assisted migration from Angular to React/TypeScript using GitHub Copilot, establishing reusable migration patterns and automated test validation — cut migration defects by 20% and delivered two months ahead of schedule.',
            'Owned technical onboarding for a new 4-engineer team, establishing architecture standards and CI/CD (Jenkins, Docker, AWS EKS) that cut ramp-up time by 30%.',
          ],
        },
        {
          company: 'Fulgent Genetics',
          location: 'Los Angeles, CA',
          role: 'Senior Software Engineer — AI Diagnostics Platform',
          period: 'Feb 2021 - Apr 2025',
          desc: "Progressed from Software Engineer Intern to Senior Software Engineer over four years, building AI diagnostics infrastructure and leading the platform's first cloud-based pathology product.",
          highlights: [
            "Founding tech lead for Eziopath, Fulgent's first cloud-based AI pathology platform — led 6 engineers through the end-to-end architecture and launch of AI-assisted pathology review, increasing workflow throughput 5x.",
            'Partnered with ML scientists to productionize cancer-detection foundation models and a multimodal pathology assistant with human-in-the-loop review, increasing pathologist review throughput 3x and cutting case-review time by 75%.',
            'Led a cross-departmental team of 5 building an Automated Lab Quality Check and User Management System (Spring Boot, React), cutting error rates from 8% to 0.1%.',
            'Engineered a full-stack system (Spring Boot, AWS RDS, AWS Glacier, RabbitMQ) processing 200TB of daily genetics data under a 10-year retention requirement.',
            'Redesigned a Scala/Java bioinformatics pipeline with dynamic job allocation across a 20+ server HPC cluster, cutting processing time 15% and raising cluster utilization 25%.',
            'Designed and automated COVID-19 testing pipelines processing 10,000+ daily samples, with real-time variant reporting integrated with the CDC and 46 state health department APIs.',
          ],
        },
      ],
    },
    education: {
      title: 'Education',
      items: [
        {
          year: '2019 - 2020',
          org: 'Columbia University',
          title: 'M.S. in Data Science',
          desc: 'New York, NY',
        },
        {
          year: '2015 - 2019',
          org: 'UC San Diego',
          title: 'B.S. in Cognitive Science',
          desc: 'Specialization in Machine Learning and Computation',
        },
      ],
    },
    certifications: {
      title: 'Certifications',
      items: [] as { year: string; title: string; org: string; logo: string; url: string }[],
    },
    projects: {
      title: 'Personal Projects',
      items: [
        {
          title: 'Retail Traffic Prediction — 1st Place, Columbia Data Science Hackathon',
          badge: '1st of 30 teams',
          desc: 'Led a team of 4 to build a random forest model predicting customer foot traffic for retail companies with ~85% accuracy. Presented to judges from Facebook, Wolfram Alpha, and NYC Data Science Academy.',
          tech: ['Python', 'scikit-learn', 'Random Forest'],
        },
        {
          title: 'Gigapixel Pathology Cancer Detection',
          badge: '92.4% accuracy',
          desc: 'Designed an end-to-end pathology pipeline using a multi-scale CNN for tumor detection in gigapixel whole-slide images — data preprocessing, model training, and visualization for scalable cancer diagnostics.',
          tech: ['PyTorch', 'CNN', 'Computer Vision'],
        },
      ],
    },
    skills: {
      title: 'Skills',
      languagesHeading: 'Languages',
      languageList: [
        { name: 'English', level: 'Native' },
      ],
      technical: 'Technical Skills',
      soft: 'Soft Skills',
      softSkills: [
        'Technical Leadership',
        'Cross-functional Collaboration',
        'Systems Thinking',
        'Mentorship',
        'Ownership & Accountability',
        'Stakeholder Communication',
      ],
    },
    cta: {
      title: "Let's talk",
      desc: "I build production RAG and distributed systems. If you're hiring for senior/staff engineering roles in applied AI, let's talk.",
      contact: 'Contact',
    },
    ui: {
      typingIndicator: 'typing...',
    },
    chat: {
      placeholder: 'Type your question...',
      title: 'Louis Lu',
      subtitle: 'Ask me about my experience',
      greeting:
        "Hi! I'm **Louis**. Ask me anything: experience, projects, what drives me.",
      error: 'Error sending. Please try again.',
      offline: 'Looks like you\'re offline. Check your connection and try again.',
      prompts: [
        {
          icon: 'briefcase',
          label: 'AI Experience',
          query: "What is your experience with AI and automation?",
        },
        {
          icon: 'rocket',
          label: 'Top Projects',
          query: "What are your most notable projects?",
        },
        {
          icon: 'help',
          label: 'Why hire you?',
          query: 'Why should I hire you?',
        },
        {
          icon: 'mail',
          label: 'Contact',
          query: 'How can I contact you?',
        },
      ],
      contactCtaTitle: 'Want to talk directly?',
      voice: {
        start: 'Talk to me',
        stop: 'End',
        connecting: 'Connecting...',
        listening: 'Listening...',
        thinking: 'Thinking...',
        searching: 'Searching my projects...',
        speaking: 'Speaking...',
        timeWarning: '15 seconds remaining',
        ended: 'Voice session ended',
        rateLimited: 'You have reached the limit of 3 voice sessions per day',
        unsupported: 'Your browser does not support audio input',
        micDenied: 'Microphone access is needed for voice mode',
        switchToText: 'Switch to text',
        connection: 'Connection error. Please try again.',
      },
    },
} as const;
