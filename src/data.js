import {resumeCorpus} from './resume-corpus.js';
import {profileDetails} from './profile-details.js';
export const projects = [
{ id:'supermemory', name:'SuperMemory', category:'AI', icon:'◈', color:'purple', subtitle:'A memory layer for everyday work.', description:'A local multimodal system that captures changing desktop activity, extracts meaning with vision LLMs, and makes past activity searchable in natural language.', detail:'Hierarchical memory compression connects raw observations, timed summaries, entities, and tasks. Structured applications, deadlines, links, and productivity signals persist locally in SQLite and JSON.', tags:['Python','Vision LLMs','SQLite','Vector retrieval'], date:'Jan 2026', source:'ai' },
{ id:'leveldb', name:'A faster path through LevelDB', category:'Systems', icon:'▤', color:'green', subtitle:'Skip the work. Keep the answer.', description:'Extended an LSM-tree storage engine with ZoneMap metadata and compact bitmasks to skip irrelevant blocks before disk I/O.', detail:'SIMD-assisted filtering adds about 0.3% storage overhead. Benchmarked from 1M to 500M records; selective 10M-record IoT workloads reached up to 31.2× speedup and 92.3% block skipping. Concurrent workloads sustained roughly 25–28× speedups with 96.42% I/O reduction.', tags:['C++','LevelDB','SIMD','LSM trees'], metric:'31.2×', metricLabel:'query speedup on selective workloads', date:'Apr 2026', source:'systems' },
{ id:'robotics', name:'Learning to move', category:'Robotics', icon:'⌘', color:'orange', subtitle:'From demonstrations to control.', description:'Implemented Behavioral Cloning and DAgger to train continuous-control policies in HalfCheetah and Hopper environments.', detail:'Iterative on-policy data collection mitigated distribution shift and compounding errors. DAgger reached 99.8% of expert return on HalfCheetah and 99.9% on Hopper; Hopper improved 316.7% over Behavioral Cloning.', tags:['PyTorch','MuJoCo','DAgger','OpenAI Gym'], metric:'99.9%', metricLabel:'of expert return on Hopper', date:'Nov 2025', source:'robotics' },
{ id:'database', name:'Conversational Database Agent', category:'AI', icon:'⌕', color:'blue', subtitle:'Ask a question. Understand your data.', description:'A natural-language database system that turns requests into validated SQL, executes against DuckDB, and returns explanations and visualizations.', detail:'A four-model architecture separates planning, SQL generation, execution, and visualization. Schema-aware clarification and selective context retrieval resolve ambiguity while reducing unnecessary prompt context.', tags:['React','TypeScript','Python','DuckDB'], date:'Feb 2026', source:'ai' },
{ id:'factual', name:'Factual article generation', category:'AI', icon:'✧', color:'purple', subtitle:'Better writing starts with better grounding.', description:'Fine-tuned Llama 3.2 with supervised learning and preference optimization to reduce hallucinations in news generation.', detail:'Trained on 13,629 articles followed by DPO on 500 preference pairs. A custom evaluation framework measured an 86% reduction in hallucination rates. LoRA used 0.65% trainable parameters; 4-bit quantization reduced memory requirements by about 60%, with sub-2-second inference.', tags:['Llama 3.2','LoRA','DPO','RAG'], metric:'86%', metricLabel:'reduction in measured hallucinations', date:'Jan 2026', source:'research' },
{ id:'weenix', name:'Inside a Unix-like kernel', category:'Systems', icon:'▧', color:'green', subtitle:'Systems, from the ground up.', description:'Implemented process and thread management, scheduling, synchronization, virtual filesystems, and system calls in Weenix.', detail:'Worked across a 10,000+ line C codebase, including fork(), exec(), waitpid(), file operations, directories, and path resolution. Used GDB and kernel logs to diagnose races, deadlocks, and lifecycle bugs; validated workloads with 100+ processes.', tags:['C','Linux','GDB','Concurrency'], date:'Dec 2025', source:'systems' },
{ id:'idol', name:'Idol Coach', category:'Systems', icon:'♫', color:'orange', subtitle:'A practice partner for your voice.', description:'A full-stack audio platform for recording, processing, and comparing user performances with reference vocals.', detail:'React and Next.js frontend, FastAPI APIs, asynchronous processing, PostgreSQL and MongoDB sessions, and persistent audio on AWS S3. Librosa and lyric alignment power the audio pipeline. Backend optimizations reduced inference and processing latency by approximately 30%.', tags:['React','FastAPI','AWS','Librosa'], date:'May 2025', source:'systems' },
{"id": "sinbad", "name": "Sinbad AI", "category": "AI", "icon": "♜", "color": "purple", "subtitle": "Your choices. A campaign that remembers.", "description": "A tabletop-style adventure game where an AI director builds branching campaigns around your decisions. Characters remember your choices, items have meaningful uses, and the story reaches a planned ending.", "detail": "Separated generative storytelling from authoritative game state: the model proposes narrative and structured changes, while the Python/FastAPI backend validates responses and tracks inventory quantities, durability, relationships, and objectives. Enforced a campaign turn limit. Per-campaign locks and stale-scene checks prevent duplicate actions; invalid generations leave progress unchanged and receive one bounded repair attempt. Redesigned the interaction model after playtesting: replaced generic tactical buttons and abstract progress points with contextual choices, interactive scenery, and freeform approaches that shape later scenes. Shipped the Next.js frontend on Vercel, containerized the backend on Render, and added persistent PostgreSQL storage on Neon. Added regression coverage for campaign completion, inventory consistency, concurrent quota enforcement, persistence, and model failures.", "tags": ["Next.js", "Python", "FastAPI", "PostgreSQL", "Vercel", "Render", "Neon"], "date": "May 2025", "source": "profile", "liveUrl": "https://sinbad-ai.vercel.app", "codeUrl": "https://github.com/aryanparab/SinbadAI"},
{ id:'alter-ego', name:'Alter Ego', category:'AI', icon:'☷', color:'blue', subtitle:'Different personas. Better conversations.', description:'A full-stack platform for creating and chatting with AI personas, with personalized conversational coaching.', detail:'Gemini-powered analysis rates messages from 1–5 and suggests next moves. Persona and session history persist in MongoDB, with Google OAuth authentication and retrieval-based context for longer conversations.', tags:['Python','Gemini','MongoDB','OAuth2'], date:'Jun 2025', source:'profile' },
{ id:'mood-music', name:'Mood Music Recommender', category:'AI', icon:'♫', color:'orange', subtitle:'A soundtrack for how you feel.', description:'A mood-based music application combining text sentiment and a CNN that recognizes emotion from voice tone.', detail:'React and Next.js frontend with a Python FastAPI backend. Spotify API and OAuth2 connect mood classification to music recommendations.', tags:['React','FastAPI','Spotify API','CNN'], date:'Apr 2022', source:'profile' },
{ id:'kyc', name:'Online KYC', category:'AI', icon:'▣', color:'green', subtitle:'Documents, identity, and a complete flow.', description:'An end-to-end Flask application connecting document upload, phone OTP, and face verification.', detail:'OpenCV and Haar cascades extract faces from identity documents; a VGG16 transfer-learning pipeline compares document photos. OCR, QR decoding, and fuzzy-field matching validate document consistency. The application includes session handling and reproducible model and dependency setup.', tags:['Flask','OpenCV','VGG16','OCR'], date:'Apr 2021', source:'profile' },
{ id:'grocery', name:'Grocery & Recipe Planner', category:'AI', icon:'♧', color:'green', subtitle:'From preferences to a week of meals.', description:'A Gemini-powered assistant that turns cuisine preferences, budget, and duration into grocery lists and recipes.', detail:'Built during information retrieval coursework with a Python backend and Streamlit frontend. MongoDB stores dated lists so users can revisit plans and align meals with fitness goals.', tags:['Python','Gemini','Streamlit','MongoDB'], date:'Apr 2025', source:'profile' },
{ id:'lstm', name:'LSTM Text Generation', category:'AI', icon:'¶', color:'purple', subtitle:'An early exploration of language models.', description:'A recurrent neural network for generating text sequences, trained with TensorFlow and Keras.', detail:'Trained an LSTM over 500 epochs with custom training loops, gradient optimization, and hyperparameter tuning. Reported evaluation accuracy was 89.76%; work also included ONNX conversion, model compression, and edge-deployment optimization.', tags:['TensorFlow','Keras','LSTM','ONNX'], date:'Aug 2020', source:'profile' }
];
const projectNotes = {
  "supermemory": [
    "Captures changing screens and extracts applications, entities, deadlines, links, and tasks with vision LLMs.",
    "Builds timed summaries and hierarchical memory so users can query their digital activity in natural language.",
    "Stores observations, productivity signals, and tasks locally in SQLite and JSON."
  ],
  "leveldb": [
    "Added ZoneMap metadata and compact bitmasks to skip irrelevant blocks before disk I/O.",
    "Used SIMD-assisted filtering with approximately 0.3% storage overhead.",
    "Benchmarked datasets from 1M to 500M records.",
    "Reached up to 31.2× query speedup and 92.3% block skipping on selective 10M-record IoT workloads.",
    "Concurrent workloads sustained roughly 25–28× speedups with 96.42% I/O reduction."
  ],
  "robotics": [
    "Implemented Behavioral Cloning and DAgger for HalfCheetah and Hopper continuous-control tasks.",
    "Collected on-policy demonstrations iteratively to reduce distribution shift and compounding errors.",
    "DAgger reached 99.8% of expert return on HalfCheetah and 99.9% on Hopper.",
    "Hopper performance improved 316.7% over Behavioral Cloning."
  ],
  "database": [
    "Separated planning, SQL generation, execution, and visualization across four specialized models.",
    "Generated validated SQL and executed queries against DuckDB.",
    "Returned explanations and charts from natural-language requests.",
    "Used schema-aware clarification and selective context retrieval to resolve ambiguous questions."
  ],
  "factual": [
    "Fine-tuned Llama 3.2 using supervised learning followed by Direct Preference Optimization.",
    "Used 13,629 articles for supervised training and 500 preference pairs for DPO.",
    "Measured an 86% reduction in hallucination rates with a custom evaluation framework.",
    "LoRA used 0.65% trainable parameters; 4-bit quantization reduced memory requirements by about 60%.",
    "Achieved sub-2-second inference."
  ],
  "weenix": [
    "Implemented process and thread management, scheduling, and synchronization.",
    "Built virtual filesystem operations, directories, path resolution, and system calls including fork(), exec(), and waitpid().",
    "Worked across a 10,000+ line C codebase.",
    "Used GDB and kernel logs to diagnose races, deadlocks, and lifecycle bugs.",
    "Validated workloads with 100+ processes."
  ],
  "idol": [
    "Built a React and Next.js interface for recording vocals and receiving coaching feedback.",
    "Implemented FastAPI APIs and asynchronous audio processing.",
    "Used Librosa and lyric alignment to compare performances with reference vocals.",
    "Stored user and session data in PostgreSQL and MongoDB, with persistent audio in AWS S3.",
    "Reduced inference and processing latency by approximately 30%."
  ],
  "sinbad": [
    "Built a tabletop-style adventure game where an AI director creates branching stories around the player’s decisions, with remembered choices, meaningful items, and a planned campaign ending.",
    "Separated generative storytelling from authoritative game state: the model proposes narrative and structured changes, while the Python/FastAPI backend validates responses and tracks inventory quantities, durability, relationships, and objectives.",
    "Enforced a campaign turn limit. Per-campaign locks and stale-scene checks prevent duplicate actions; invalid generations leave progress unchanged and receive one bounded repair attempt.",
    "Redesigned the interaction model after playtesting: replaced generic tactical buttons and abstract progress points with contextual choices, interactive scenery, and freeform approaches that shape later scenes.",
    "Shipped the Next.js frontend on Vercel, containerized the backend on Render, and added persistent PostgreSQL storage on Neon.",
    "Added regression coverage for campaign completion, inventory consistency, concurrent quota enforcement, persistence, and model failures."
],
  "alter-ego": [
    "Enabled users to create AI personas with distinct traits and conversational styles.",
    "Used Gemini-powered analysis to rate messages from 1–5 and suggest next moves.",
    "Persisted persona and session histories in MongoDB.",
    "Added Google OAuth authentication and retrieval-based context for longer conversations."
  ],
  "mood-music": [
    "Combined text sentiment analysis with a CNN that recognizes emotion from voice tone.",
    "Built the interface with React and Next.js and the backend with Python and FastAPI.",
    "Connected mood classification to Spotify recommendations through the Spotify API and OAuth2."
  ],
  "kyc": [
    "Connected document upload, phone OTP, and face verification in an end-to-end Flask flow.",
    "Used OpenCV and Haar cascades to extract faces from identity documents.",
    "Trained a VGG16 transfer-learning pipeline to compare document photos.",
    "Validated document consistency with OCR, QR decoding, and fuzzy-field matching.",
    "Implemented session handling and reproducible model and dependency setup."
  ],
  "grocery": [
    "Generated grocery lists and recipes from cuisine preferences, budget, and duration with Gemini.",
    "Built a Python backend and Streamlit frontend during information retrieval coursework.",
    "Stored dated grocery lists in MongoDB for revisiting plans.",
    "Connected meal planning with users’ fitness goals."
  ],
  "lstm": [
    "Trained a TensorFlow/Keras LSTM for text sequence generation over 500 epochs.",
    "Used custom training loops, gradient optimization, and hyperparameter tuning.",
    "Reported evaluation accuracy of 89.76%.",
    "Explored ONNX conversion, model compression, and edge-deployment optimization."
  ]
};
const projectLinks = {
  "leveldb": {
    "codeUrl": "https://github.com/aryanparab/proj2-543"
  },
  "idol": {
    "codeUrl": "https://github.com/aryanparab/Idol-Coach",
    "liveUrl": "https://idol-coach-git-main-aryanparabs-projects.vercel.app/"
  },
  "factual": {
    "codeUrl": "https://github.com/aryanparab/CNN-article-writer"
  },
  "grocery": {
    "codeUrl": "https://github.com/aryanparab/grocery-list-generator"
  },
  "alter-ego": {
    "codeUrl": "https://github.com/aryanparab/YourWingman"
  },
  "mood-music": {
    "codeUrl": "https://github.com/aryanparab/Music-recommendation-using-mood-detection"
  }
};
projects.forEach(project=>{project.notes=projectNotes[project.id];Object.assign(project,projectLinks[project.id]||{});});
projects.push(...[
  {
    "id": "impactlink",
    "name": "ImpactLink",
    "category": "AI",
    "icon": "⬡",
    "color": "purple",
    "subtitle": "Grant intelligence for NGOs.",
    "description": "An AI grant-intelligence platform that helps NGOs find funding, write funder-specific proposals, build localized budgets, and discover mission-aligned collaborators.",
    "detail": "Built an end-to-end grant-intelligence workflow for NGOs: upload PDF/DOCX proposals, discover relevant grants, draft funder-specific applications, build localized budgets, and find collaborators. Extracts proposal text with PyMuPDF and structures it with a parser. MiniLM-L6-v2 produces 384-dimensional embeddings; ChromaDB cosine search retrieves the top five grants. Uses Llama 3.3 70B through Groq to explain matches, assess fit, and suggest application tips. Retrieved vector results remain authoritative for grant IDs; the model only adds explanations. Streams eight-section, funder-specific drafts over Server-Sent Events, with inline editing, formatting, and PDF export. Provides a seven-step proposal interview that drafts sections as users answer, with approval, AI revision, and manual editing. Generates geography-aware line-item budgets from award ceilings and supports refinement through plain-English chat. Ranks collaboration-open NGO profiles against proposal embeddings in memory. The top six receive AI explanations, collaboration types, and shared-focus suggestions. Keeps saved work in a dashboard where selecting a proposal filters the matching grants. Built with React, FastAPI, LangChain, ChromaDB, and Llama.",
    "tags": [
      "React",
      "FastAPI",
      "LangChain",
      "ChromaDB",
      "MiniLM",
      "Groq",
      "Llama 3.3 70B"
    ],
    "date": "",
    "source": "profile",
    "codeUrl": "https://github.com/aryanparab/ImpactLink",
    "videoUrl": "https://youtu.be/-QlgHftegNg",
    "notes": [
      "Built an end-to-end grant-intelligence workflow for NGOs: upload PDF/DOCX proposals, discover relevant grants, draft funder-specific applications, build localized budgets, and find collaborators.",
      "Extracts proposal text with PyMuPDF and structures it with a parser. MiniLM-L6-v2 produces 384-dimensional embeddings; ChromaDB cosine search retrieves the top five grants.",
      "Uses Llama 3.3 70B through Groq to explain matches, assess fit, and suggest application tips. Retrieved vector results remain authoritative for grant IDs; the model only adds explanations.",
      "Streams eight-section, funder-specific drafts over Server-Sent Events, with inline editing, formatting, and PDF export.",
      "Provides a seven-step proposal interview that drafts sections as users answer, with approval, AI revision, and manual editing.",
      "Generates geography-aware line-item budgets from award ceilings and supports refinement through plain-English chat.",
      "Ranks collaboration-open NGO profiles against proposal embeddings in memory. The top six receive AI explanations, collaboration types, and shared-focus suggestions.",
      "Keeps saved work in a dashboard where selecting a proposal filters the matching grants. Built with React, FastAPI, LangChain, ChromaDB, and Llama."
    ]
  },
  {
    "id": "netflix-imdb",
    "name": "Netflix IMDb Recommender",
    "category": "Systems",
    "icon": "▻",
    "color": "orange",
    "subtitle": "Personalized discovery, enriched with IMDb.",
    "description": "A recommendation app that enriches your Netflix catalog with IMDb ratings and metadata, helping you discover highly rated titles and hidden gems you haven’t watched.",
    "detail": "Combines personalized Netflix recommendations with IMDb ratings and metadata to help users find highly rated titles and hidden gems. Built a Python scraping and enrichment pipeline with a React interface and Express backend. Added an admin panel with one-click scraping, real-time progress logs, full-pipeline automation, session management, and a data-status dashboard. Supports category, genre, minimum-rating, watched-status, and title-search filters. Persists watched status and merges re-scraped data without losing viewing history. Titles retain all their Netflix categories. Enriches only new titles on later runs and uses checkpoints to resume interrupted IMDb enrichment. Designed a responsive dark interface with movie cards, metadata, and an administrative workflow.",
    "tags": [
      "Python",
      "React",
      "Express",
      "Web scraping",
      "Data pipelines"
    ],
    "date": "",
    "source": "profile",
    "codeUrl": "https://github.com/aryanparab/netflix-imdb-scrapper",
    "notes": [
      "Combines personalized Netflix recommendations with IMDb ratings and metadata to help users find highly rated titles and hidden gems.",
      "Built a Python scraping and enrichment pipeline with a React interface and Express backend.",
      "Added an admin panel with one-click scraping, real-time progress logs, full-pipeline automation, session management, and a data-status dashboard.",
      "Supports category, genre, minimum-rating, watched-status, and title-search filters.",
      "Persists watched status and merges re-scraped data without losing viewing history. Titles retain all their Netflix categories.",
      "Enriches only new titles on later runs and uses checkpoints to resume interrupted IMDb enrichment.",
      "Designed a responsive dark interface with movie cards, metadata, and an administrative workflow."
    ]
  }
]);
export const resumes = {ai:{label:'AI & agents',file:'aryan-ai.pdf'},systems:{label:'Software & systems',file:'aryan-systems.pdf'},robotics:{label:'Robotics',file:'aryan-robotics.pdf'},research:{label:'AI research',file:'aryan-ai-research.pdf'}};
export const experience = [
{ name:'Cadence Design Systems', role:'Generative AI Software Engineering Intern', date:'May 2026 — Present', location:'San Jose, CA', points:[
'Planned reusable automation workflows across 1,000+ QA test cases.',
'Built an autonomous pipeline from QA specifications to executable tests.',
'Connected Playwright simulations with MCP-based Katalon tools.',
'Enabled agents to inspect failures, generate fixes, and retry execution.',
'Built a multi-agent Cloudflare threat-analysis and rule-review pipeline.'
], more:[
'Dependency-aware planning separates reusable components, shared state, and coordinated multi-step execution.',
'Traffic analysis combines 24-hour request data, WAF and bot scores, JA4 fingerprints, and IP behavior.',
'Cooperating agents diagnose threats and rule coverage; a recommendation agent correlates findings and proposes protections.',
'Scheduled daily execution automates ingestion, preprocessing, rule evaluation, report generation, and delivery to the security team.'
], source:'ai'},
{ name:'USC Marshall School of Business', role:'Research Assistant', date:'Feb 2026 — Present', location:'Los Angeles, CA', points:[
'Built automated LLM evaluation pipelines with Python and PyTorch.',
'Measured hallucination, factual consistency, and reasoning quality.',
'Benchmarked models including Claude and Llama.',
'Automated repeated experiments for multi-agent reasoning systems.',
'Created reusable validation workflows for reproducible evaluations.'
], more:[
'Infrastructure automates experiment execution, result aggregation, and model comparison across configurations.',
'Evaluation workflows help identify model failure modes and systematically compare AI system behavior.'
], source:'ai'},
{ name:'Deloitte', role:'Backend Engineer', date:'Nov 2023 — Dec 2024', location:'Mumbai, India', points:[
'Built Python ETL pipelines processing 100K+ records each week.',
'Organized 50,000+ unstructured documents for data rationalization.',
'Adapted and tuned K-Means clustering for client requirements.',
'Validated metadata and built pipelines for warehouse migration.',
'Presented clustering results through Power BI dashboards.'
], more:[
'Data preparation covered cleaning, transformation, and integration before clustering.',
'Iterative parameter tuning balanced dataset characteristics, cluster quality, and output interpretability.',
'Earned AWS Solutions Architect and Microsoft PL-300 certifications.'
], source:'profile'},
{ name:'Springwood', role:'Business Analyst', date:'Feb 2023 — May 2023', location:'Remote', points:[
'Integrated WebEngage analytics to track user events and funnels.',
'Designed audience segmentation and targeting strategies.',
'Built a website with ChatGPT-powered client interactions.',
'Improved the company website’s SEO, content, and performance.',
'Advised clients on CRM workflows and customer lifecycle management.'
], more:[
'Event and funnel analysis informed marketing campaign optimization.',
'Audience targeting supported customer engagement and retention across clients.',
'The lightweight website supported real-time push notifications and automated interactions.'
], source:'profile'},
{ name:'AIESEC in Mumbai', role:'Head of Outgoing Social Sector', date:'Feb 2022 — Feb 2023', location:'Mumbai, India', points:[
'Established 12+ international partnerships for exchange programs.',
'Generated ₹2.5+ lakh in income during the post-COVID recovery.',
'Grew overall operations by 25% with a 20% sales conversion ratio.',
'Led and coached a cross-functional team of 16.',
'Placed second in Outgoing Global Volunteer overall operations in AIESEC India.'
], more:[
'Tracked global demand and supply to adapt products for the local market.',
'Curated customer journeys to streamline exchange programs and improve the customer experience.',
'Coached marketing, sales, customer experience, and international relations teams.',
'Internship with AIESEC in India, based in Mumbai, Maharashtra.'
], source:'profile'}
];
export const skills = [ ['Languages','Python, TypeScript / JavaScript, C++, C, Java, SQL'], ['AI & agents','PyTorch, TensorFlow, Transformers, Hugging Face, RAG, FAISS, LangChain, MCP, multi-agent systems, LLM evaluation'], ['Systems & robotics','Linux, concurrency, storage engines, SIMD, Behavioral Cloning, DAgger, reinforcement learning, MuJoCo'], ['Web & infrastructure','React, Next.js, FastAPI, Flask, Node.js, PostgreSQL, MongoDB, DuckDB, Docker, AWS EC2 / S3, Git, CI/CD, Playwright'] ];
export const knowledge = [
...resumeCorpus,
...profileDetails,
{ id:'about', title:'Profile & contact', section:'about', source:'profile', text:'Aryan Parab is based in Los Angeles, California and works across AI agents, software systems, and robotics. Email: amparab@usc.edu. Phone: 310-869-1411. LinkedIn: linkedin.com/in/aryan-parab-0b44991b2. GitHub: github.com/aryanparab.' },
{ id:'education', title:'Education', section:'about', source:'profile', text:'Aryan is pursuing an M.S. in Computer Science at the University of Southern California, January 2025–December 2026, GPA 4.0/4.0. He earned a Bachelor of Engineering in Computer Engineering at Thadomal Shahani Engineering College, August 2019–May 2023, GPA 9.1/10. Master’s courses taken: Analysis of Algorithms; Information Retrieval and Search Engines; Web Development; Robotics; Operating Systems; Modern Database Architecture; Deep Learning and Its Applications; Game Development.' },
{ id:'interests', title:'Personal interests', section:'interests', source:'profile', text:'Aryan likes soccer, football, history, and mythology. The Mahabharata is his favorite text. His interests also include Greek mythology, Percy Jackson, Harry Potter, Ronaldo, Messi, Real Madrid, AI agents, AI developments, and software engineering.' },
{ id:'certifications', title:'Certifications', section:'experience', source:'profile', text:'Aryan earned AWS Solutions Architect and Microsoft PL-300 certifications while working at Deloitte.' },
{ id:'awards', title:'Hackathon wins', section:'about', source:'ai', text:'Winner of the four-hour USC Claude AI Hackathon 2025 and USC ACM Hackathon 2026. First runner-up in a quantum hackathon; top 10 in two hackathons during undergraduate study.' },
...experience.map((e,i)=>({id:'experience-'+i,title:e.name,section:'experience',source:e.source,text:`${e.role} at ${e.name}, ${e.date}, ${e.location}. ${e.points.join(' ')} ${(e.more||[]).join(' ')}`})),
...projects.map(p=>({id:p.id,title:p.name,section:'projects',source:p.source,text:`${p.name} (${p.category}), ${p.date}. ${p.description} ${p.detail} Live: ${p.liveUrl||'not provided'}. Code: ${p.codeUrl||'not provided'}. Video: ${p.videoUrl||'not provided'}. Technologies: ${p.tags.join(', ')}.`})),
...skills.map(([title,text],i)=>({id:'skills-'+i,title,section:'skills',source: title==='Systems & robotics'?'robotics':'ai',text:`${title}: ${text}.`}))
];
