<!--
  Paste your resume below (any format is fine — plain text, bullet points, whatever
  you have). This file is just a working input for Claude Code to read from; it's
  not part of the built site and won't be deployed. Tell Claude when you've pasted
  it in and it'll map the content into src/i18n.ts, src/about-i18n.ts,
  chatbot-prompt.txt, and public/llms.txt.

  Feel free to come back and update this file whenever you have resume changes —
  just paste the new/updated section and ask Claude to sync it across the site.
-->
	           Louis(Yinhe) Lu
yl4372@columbia.edu  |  858-228-7240  |  https://yil479.github.io/luislu/


EDUCATION
Columbia University, New York, NY	Aug 2019-Dec 2020
M.S. in Data Science	
The University of California, San Diego, CA	Aug 2015-Jun 2019
B.S. in Cognitive Science specialized in Machine Learning and Computation     	  

SKILLS
Languages & Frameworks: Java, JavaScript, TypeScript, Python, Scala, R, Bash, Spring Boot, Akka, Flask, Vue, Angular, React
Databases: Oracle SQL, MongoDB, AWS RDS, DynamoDB, AWS DocumentDB, Redis
Cloud & Infrastructure: AWS EC2, AWS EKS, AWS Lambda, AWS Gateway, Docker, Eureka, Jenkins, RabbitMQ, Git 
Monitoring: OpenTelemetry, Tableau, Grafana, Ambari Hadoop


PROFESSIONAL EXPERIENCE	
JPMorgan Chase, New York, NY
Software Engineer, Senior Associate | Risk AI Platform 	Apr 2025 – Present
Led the architecture and development of a RAG-based document assistant for auditors and risk analysts, designing a LlamaIndex ingestion pipeline with contextual retrieval (LLM-generated chunk context prepended before embedding) into a ChromaDB vector store, improving retrieval accuracy by 8% and reducing retrieval latency by 6%; integrated the service into an enterprise risk platform supporting the review of millions of daily transactions.
Built the production RAG serving layer, including query condensation, hybrid search across multiple document collections using Reciprocal Rank Fusion (RRF), streaming response generation (GPT-4o-mini), and a safety gate that blocks unsafe requests before retrieval and generation.
Led an AI-assisted migration from Angular to React and TypeScript, establishing GitHub Copilot migration standards, reusable conversion patterns, and automated unit and regression-test validation; reduced migration defects by 20% and delivered two months ahead of schedule.
Owned technical onboarding for a newly formed team of four engineers, establishing service architecture standards and CI/CD practices with Jenkins, Docker, and AWS EKS; reduced ramp-up time by 30% and stabilized delivery within two months.
Fulgent Genetics, Los Angeles, CA	Feb 2021- Apr 2025
Senior Software Engineer | AI Diagnostics Platform | Dec 2024 - Apr 2025
Served as founding tech lead for Eziopath, Fulgent’s first cloud-based digital AI pathology platform, leading six engineers through the end-to-end architecture and launch of cloud-native workflows for AI-assisted pathology review, case management, visualization, and whole-slide image ingestion; increased end-to-end workflow throughput by 5×.
Partnered with ML scientists to productionize cancer-detection foundation models and build a multimodal pathology assistant, implementing model-serving integrations and human-in-the-loop review while capturing slide images, annotations, model outputs, and pathologist feedback for future post training and evaluation; increased pathologist review throughput by 3× and reduced average case-review time by 75%.
Software Engineer II  | AI Diagnostics Platform |Feb 2023- Dec 2024
Led a cross-departmental team of 5 engineers to develop an Automated Lab Quality Check and User Management System, reducing manual workload by 2+ hours per person and cutting error rates from 8% to 0.1% using Spring Boot and React.js.
Engineered a full-stack system using Spring Boot, AWS RDS, AWS Glacier, and RabbitMQ to process 200TB of daily genetics data with 10-year retention requirements; built enrollment software with distributed architecture for high-throughput ingestion and real-time system observability..
Software Engineer  |  Feb 2021- Feb 2023
Redesigned and optimized Scala/Java bioinformatics pipeline by implementing dynamic job allocation across a 20+ server HPC cluster (AWS EC2 and on-premise), reducing average job processing time by 15% and increasing cluster utilization by 25%. 
Designed and automated COVID-19 testing pipelines processing 10,000+ daily samples, building real-time variant reporting systems integrated with CDC and 46 state health departments' APIs, supporting critical public health monitoring during pandemic peak. 
Developed an automated error detection system integrated with Jira API that identifies bioinformatics pipeline failures and creates prioritized tickets with diagnostic information, reducing incident response time by 3+ hours daily and improving on-call team efficiency by 40%.
Software Engineer Intern |  Nov 2020- Dec 2020	
Designed a Spring Boot-based user management system with JWT authentication, adopted as the centralized authentication solution across multiple teams; built a Parquet conversion system for large TSV/CSV files, reducing daily storage by 20% via AWS Glacier integration.

PERSONAL PROJECT EXPERIENCE
1st Place Winner of 2019 Columbia Data Science Hackathon
	Led a team of 4 to develop a random forest model predicting customer traffic for retail companies with ~85% accuracy. Presented solutions to industry leaders (Facebook, Wolfram Alpha, and NYC Data Science Academy)  and won 1st place out of 30 teams.
Gigapixel Pathology Images Cancer Detection
	Designed an end-to-end pathology pipeline leveraging a multi-scale CNN for tumor detection, achieving 92.4% accuracy. Integrated data preprocessing, model training, and visualization for scalable cancer diagnostics.
