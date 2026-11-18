/* Concept D v4: project data used by the cards and the project modal.
   Edit this file to change project content. Visuals marked illustrative or sample are drawings, not real data. */
window.AB_DATA = {
"projects": [
{
"id": "genstudio-service",
"title": "The GenAI service behind Adobe GenStudio",
"kicker": "Enterprise GenAI, in production",
"summary": "An enterprise pipeline that turns campaign inputs into on-brand ad copy and assets for big brands.",
"facts": [
[
"Role",
"Senior Software Engineer, AI/ML Applications"
],
[
"Where",
"Adobe"
],
[
"Since",
"2025"
],
[
"Stack",
"Python, async services"
]
],
"hero": {
"kind": "viz",
"viz": "genstudio",
"title": "Generation pipeline",
"caption": "Illustrative console. Toggle the model route to see requests move between Azure OpenAI and a customer-hosted model."
},
"tiles": [
{
"size": "l",
"title": "Context first, then generate",
"text": "Brand, product and audience context is gathered before any copy is written, so every variant starts from the brand rather than a blank prompt.",
"vis": {
"kind": "illu",
"name": "context"
},
"kicker": "Pipeline"
},
{
"size": "s",
"title": "Brand-safety checks",
"text": "Every output is post-processed for brand safety before it reaches a campaign.",
"vis": {
"kind": "icon",
"icon": "shield"
},
"kicker": "Quality"
},
{
"size": "m",
"title": "Routing across providers",
"text": "Requests are routed across model providers, including Azure OpenAI.",
"vis": {
"kind": "illu",
"name": "router"
},
"kicker": "Models"
},
{
"size": "m",
"title": "Bring your own model",
"text": "Integrations that let enterprises run generation on their own hosted models, designed directly with customer engineering teams.",
"vis": {
"kind": "icon",
"icon": "plug"
},
"kicker": "Enterprise"
},
{
"size": "w",
"title": "Shared, pluggable pipelines",
"text": "The service was reshaped into shared pipelines, so new channels and models plug in with little code and no repeated boilerplate.",
"vis": {
"kind": "icon",
"icon": "layers"
},
"kicker": "Architecture"
},
{
"size": "w",
"title": "Tech",
"text": "",
"vis": {
"kind": "chips",
"items": [
"Python",
"Async services",
"Multi-step LLM generation",
"Azure OpenAI",
"Multi-provider routing"
]
}
}
],
"card": {
"name": "GenStudio service",
"year": "2025–now",
"line": "Turns campaign briefs into on-brand ad copy and assets for big brands.",
"tags": [
"Python",
"LLM pipelines",
"Model routing"
],
"filters": [],
"group": "system",
"highlight": false
}
},
{
"id": "layers",
"title": "Layers",
"kicker": "Agentic AI design app, deployed",
"summary": "An AI agent composes a scene layer by layer, or splits a flat image into editable layers; either way you can export it back to an image or turn it into a video.",
"facts": [
[
"Built",
"End to end"
],
[
"Status",
"Deployed"
],
[
"Agent",
"Claude tool calling"
],
[
"Quality",
"Regression eval harness"
]
],
"hero": {
"kind": "viz",
"viz": "layers",
"title": "Compose, decompose, export",
"caption": "Illustration of what the app does, using an original drawn poster. Switch between Decompose (flat image to layers) and Compose (build a scene layer by layer). Click any layer in the panel to see what it holds; play, pause or pick a step."
},
"tiles": [
{
"size": "m",
"title": "The agent loop",
"text": "A custom Claude tool-calling agent decides which tool to call next, from segmentation to image models to compositing.",
"vis": {
"kind": "icon",
"icon": "agent"
},
"kicker": "Agent"
},
{
"size": "m",
"title": "Segmentation and image models",
"text": "SAM2 finds the pieces; Gemini image models handle the pixels.",
"vis": {
"kind": "icon",
"icon": "image"
},
"kicker": "Models"
},
{
"size": "s",
"title": "Video from elements",
"text": "Veo turns a composition’s elements into video.",
"vis": {
"kind": "icon",
"icon": "video"
},
"kicker": "Video"
},
{
"size": "s",
"title": "Regression evals",
"text": "A regression eval harness keeps the image pipeline honest as prompts and models change.",
"vis": {
"kind": "icon",
"icon": "eval"
},
"kicker": "Quality"
},
{
"size": "s",
"title": "End to end",
"text": "Built and deployed by Arjun, from the agent loop to production.",
"vis": {
"kind": "icon",
"icon": "cube"
},
"kicker": "Ownership"
},
{
"size": "w",
"title": "The real thing",
"text": "A slot for the actual Layers demo.",
"vis": {
"kind": "slot",
"label": "Slot for the real Layers demo image or video",
"note": "Arjun's Layers demo goes here; point AB.LAYERS_ART in assets/site.js at its layers",
"icon": "image"
}
}
],
"card": {
"name": "Layers",
"year": "",
"line": "An AI agent builds scenes layer by layer or splits images into layers, then exports an image or a video.",
"tags": [
"Claude tool calling",
"SAM2",
"Veo"
],
"filters": [],
"group": "system",
"highlight": false
}
},
{
"id": "omnigen",
"title": "OmniGen",
"kicker": "Adobe hackathon, 2025",
"summary": "An agentic ad-generation prototype: an agent plans the ad, then produces a set of variants, each with its own copy, image and video.",
"facts": [
[
"Event",
"Adobe hackathon"
],
[
"Year",
"2025"
],
[
"Type",
"Agentic prototype"
],
[
"Output",
"Copy, image, video"
]
],
"hero": {
"kind": "viz",
"viz": "omnigen",
"title": "Plan, then generate",
"caption": "Illustrative console with sample briefs. Press Run plan to try another one."
},
"tiles": [
{
"size": "l",
"title": "Plan first",
"text": "A planning agent reads the brief and decides the audience and message before anything is generated.",
"vis": {
"kind": "icon",
"icon": "agent"
},
"kicker": "Planning"
},
{
"size": "s",
"title": "One brief, three outputs",
"text": "Copy, a hero image and a short video come from the same plan.",
"vis": {
"kind": "icon",
"icon": "brief"
},
"kicker": "Output"
},
{
"size": "w",
"title": "Tech",
"text": "",
"vis": {
"kind": "chips",
"items": [
"Planning agent",
"LLMs",
"Image generation",
"Video generation"
]
}
}
],
"card": {
"name": "OmniGen",
"year": "2025",
"line": "An agent plans an ad set, then makes several variants of copy, image and video.",
"tags": [
"Planning agent",
"Image gen",
"Video gen"
],
"filters": [],
"group": "system",
"highlight": false
}
},
{
"id": "coding-agent-skills",
"title": "Coding-agent skills",
"kicker": "AI developer tooling",
"summary": "Repository-aware Claude Code skills and a shared wiki for debugging, code review and onboarding, now part of the daily routine on two teams.",
"facts": [
[
"Built on",
"Claude Code custom skills"
],
[
"Adopted by",
"Two teams"
],
[
"Used for",
"Debugging, review, onboarding"
]
],
"hero": {
"kind": "viz",
"viz": "skills",
"title": "Skill console",
"caption": "Illustrative console with sample runs. Pick a skill to replay it."
},
"tiles": [
{
"size": "s",
"title": "Debugging",
"text": "Skills that know the repository and how it fails.",
"vis": {
"kind": "icon",
"icon": "bug"
},
"kicker": "Skill"
},
{
"size": "s",
"title": "Code review",
"text": "A consistent first pass before a human looks.",
"vis": {
"kind": "icon",
"icon": "review"
},
"kicker": "Skill"
},
{
"size": "s",
"title": "Onboarding",
"text": "Shared wiki knowledge new engineers can ask.",
"vis": {
"kind": "icon",
"icon": "book"
},
"kicker": "Skill"
},
{
"size": "w",
"title": "Two teams",
"text": "Adopted by engineers on Arjun’s team and on an adjacent model-gateway team.",
"vis": {
"kind": "icon",
"icon": "users"
},
"kicker": "Adoption"
}
],
"card": {
"name": "Coding-agent skills",
"year": "",
"line": "Repository-aware skills for debugging, code review and onboarding, used daily on two teams.",
"tags": [
"Claude Code",
"Shared wiki"
],
"filters": [],
"group": "system",
"highlight": false
}
},
{
"id": "mobile-sdk",
"anchor": "mobile-sdk",
"title": "Adobe’s mobile and TV SDKs",
"kicker": "Eight years, open source",
"summary": "The plugin-based Mobile SDK for iOS and Android, and data-collection SDKs for Roku and Amazon Vega OS (Fire TV). Code that runs on millions of devices.",
"facts": [
[
"Years",
"2017 to 2025"
],
[
"Role",
"Software Engineer, Mobile"
],
[
"Platforms",
"iOS, Android, Roku, Vega OS"
],
[
"Status",
"Open source"
]
],
"hero": {
"kind": "viz",
"viz": "sdks",
"title": "Plugin-based core",
"caption": "Illustrative console. Toggle extensions to see which event types flow."
},
"tiles": [
{
"size": "m",
"title": "Two new TV platforms",
"text": "Built Adobe’s data-collection SDKs for Roku and Amazon Vega OS (Fire TV), from architecture through release.",
"vis": {
"kind": "icon",
"icon": "tv"
},
"kicker": "Roku and Vega OS"
},
{
"size": "m",
"title": "iOS and Android",
"text": "Shipped the plugin-based Mobile SDK for data collection and media analytics on both platforms.",
"vis": {
"kind": "icon",
"icon": "phone"
},
"kicker": "Mobile"
},
{
"size": "l",
"title": "Validation tooling",
"text": "Test automation, validator apps and cross-version compatibility suites.",
"vis": {
"kind": "icon",
"icon": "test"
},
"kicker": "Quality"
},
{
"size": "s",
"title": "Open source",
"text": "Contributed to the open-source Mobile SDK.",
"vis": {
"kind": "icon",
"icon": "opensource"
}
},
{
"size": "s",
"title": "Mentoring",
"text": "Mentored a junior engineer on SDK architecture and design decisions.",
"vis": {
"kind": "icon",
"icon": "users"
}
},
{
"size": "l",
"title": "Tech",
"text": "",
"vis": {
"kind": "chips",
"items": [
"Swift",
"Objective-C",
"Java",
"Kotlin",
"JavaScript",
"BrightScript"
]
}
}
],
"card": {
"name": "Mobile and TV SDKs",
"year": "2017–2025",
"line": "Plugin-based SDKs for iOS, Android, Roku and Vega OS, on millions of devices.",
"tags": [
"Swift",
"Kotlin / Java",
"BrightScript"
],
"filters": [],
"group": "system",
"highlight": false
}
},
{
"id": "voyager",
"title": "Voyager",
"kicker": "AI tools workbench, internal",
"summary": "An internal workbench of AI tools and utilities: API and load testing for the GenStudio generation service, plus LLM tools like an LLM council and side-by-side model comparison. Every tool keeps a run history and exports reports.",
"facts": [
[
"Type",
"Internal workbench"
],
[
"Testing",
"API and load tests for the GenStudio service"
],
[
"LLM tools",
"LLM council, model comparison"
],
[
"Every run",
"History and exportable reports"
]
],
"hero": {
"kind": "viz",
"viz": "voyager",
"title": "AI tools and testing workbench",
"caption": "Illustrative console with sample prompts and sample data. The tool rail shows what the workbench holds; the demo runs Compare and Load test, then saves the run and offers a report."
},
"tiles": [
{
"size": "m",
"kicker": "Testing",
"title": "API testing",
"text": "Exercise the GenStudio generation service's APIs from one place.",
"vis": {
"kind": "icon",
"icon": "terminal"
}
},
{
"size": "m",
"kicker": "Testing",
"title": "Load testing",
"text": "Put the same APIs under concurrent load and watch how they hold up.",
"vis": {
"kind": "icon",
"icon": "gauge"
}
},
{
"size": "m",
"kicker": "LLM tools",
"title": "LLM council",
"text": "Bring several models to the same question and weigh their answers together.",
"vis": {
"kind": "icon",
"icon": "users"
}
},
{
"size": "m",
"kicker": "LLM tools",
"title": "Model comparison",
"text": "Run one prompt across models side by side.",
"vis": {
"kind": "icon",
"icon": "compare"
}
},
{
"size": "l",
"kicker": "Every tool",
"title": "History and reports",
"text": "Each tool and utility keeps its run history, and any run can be exported as a report.",
"vis": {
"kind": "icon",
"icon": "report"
}
}
],
"card": {
"name": "Voyager",
"year": "",
"line": "AI tools workbench: API and load testing, an LLM council and model comparison, with history and reports.",
"tags": [
"LLM tools",
"API testing",
"Load testing"
],
"filters": [],
"group": "system",
"highlight": false
}
},
{
"id": "sj-moti",
"title": "San José MOTI website",
"kicker": "Pro bono, web, from 2018",
"summary": "Pro bono work: volunteered as a software engineer and helped develop the website for the San José Mayor’s Office of Technology & Innovation.",
"facts": [
[
"Role",
"Volunteer software engineer"
],
[
"Since",
"November 2018"
],
[
"Type",
"Pro bono"
],
[
"Credit",
"Named on the team page"
]
],
"hero": {
"kind": "demo",
"demo": "moti",
"site": "https://web.archive.org/web/20191101000538if_/https://moti.sanjosemayor.org/",
"siteOpen": "https://web.archive.org/web/20191101000538/https://moti.sanjosemayor.org/",
"siteLabel": "moti.sanjosemayor.org, November 2019 (Internet Archive)",
"caption": "The real site as the Internet Archive saved it in November 2019. You can scroll and click around inside it. In previews where outside pages can't be embedded, a simple wireframe and a link to the archive show instead."
},
"tiles": [
{
"size": "w",
"title": "Credited by name",
"text": "The office’s team page thanks Arjun by name.",
"vis": {
"kind": "illu",
"name": "credit"
},
"kicker": "Credit"
},
{
"size": "m",
"title": "The 2019 site",
"text": "Preserved by the Internet Archive.",
"vis": {
"kind": "links",
"items": [
{
"label": "View archived site (2019)",
"href": "https://web.archive.org/web/20191101000538/https://moti.sanjosemayor.org/",
"icon": "archive"
},
{
"label": "See the credit (archived)",
"href": "https://web.archive.org/web/20191101000536/https://moti.sanjosemayor.org/shireen-santosham-moti-team/",
"icon": "users"
}
]
},
"kicker": "Links"
}
],
"card": {
"name": "San José MOTI website",
"year": "2018",
"line": "Pro bono: helped build the website for the Mayor’s Office of Technology & Innovation.",
"tags": [
"Pro bono",
"Web"
],
"filters": [
"web"
],
"group": "archive",
"highlight": true
}
},
{
"id": "snapplock",
"title": "SnappLock",
"kicker": "Android, 2014",
"summary": "“An App Locker, With a Difference. When you can protect your data, you are safe. But when you get to catch the thief, it’s fun!”",
"facts": [
[
"Platform",
"Android"
],
[
"Downloads",
"5K+ on Google Play"
],
[
"Paper",
"IJCA 104(16)"
],
[
"Status",
"Free, later open source"
]
],
"hero": {
"kind": "demo",
"demo": "snapplock",
"caption": "Recreated UI with generic apps. Lock an app, enter wrong passcodes, and the intruder’s snapshot lands in the log."
},
"tiles": [
{
"size": "m",
"title": "Intruder ID",
"text": "A wrong passcode captures a front-camera image of whoever tried.",
"vis": {
"kind": "illu",
"name": "intruder"
},
"kicker": "Catch the thief"
},
{
"size": "m",
"title": "Three strikes",
"text": "After three wrong passcodes, a text goes to a number you choose and an alert tone plays.",
"vis": {
"kind": "illu",
"name": "sms"
},
"kicker": "Alerts"
},
{
"size": "s",
"title": "Relock policy",
"text": "Unlock all apps for a set period, then relock.",
"vis": {
"kind": "illu",
"name": "relock"
}
},
{
"size": "s",
"title": "Auto-start",
"text": "Protection comes back on by itself after a reboot.",
"vis": {
"kind": "icon",
"icon": "power"
}
},
{
"size": "s",
"title": "The paper",
"text": "Co-authored the related paper in IJCA 104(16).",
"vis": {
"kind": "illu",
"name": "paper"
},
"kicker": "Research"
},
{
"size": "m",
"title": "Get it",
"text": "Free on Google Play, later open-sourced.",
"vis": {
"kind": "links",
"items": [
{
"label": "Source on GitHub",
"href": "https://github.com/addb/SnappLock-An-Android-Application-Locker",
"icon": "github"
},
{
"label": "Google Play (archived listing)",
"todo": "replace with the Internet Archive URL of the SnappLock (com.addb.snapplock) Google Play listing",
"icon": "archive"
}
]
},
"kicker": "Links"
},
{
"size": "w",
"title": "Real screenshots",
"text": "Slot for the original app screens.",
"vis": {
"kind": "slot",
"label": "Slot for real screenshots (without third-party app icons)",
"note": "Real SnappLock screenshots go here",
"icon": "phone"
}
}
],
"card": {
"name": "SnappLock",
"year": "2014",
"line": "App locker that snaps whoever enters a wrong passcode. 5K+ downloads.",
"tags": [
"Android",
"Java",
"IJCA paper"
],
"filters": [
"mobile",
"ai"
],
"group": "archive",
"highlight": true
}
},
{
"id": "abc3d",
"title": "ABC3D",
"kicker": "Augmented reality, 2015",
"summary": "An AR literacy game in two modes: scan a letter and a 3D object pops up, then drive a toy car around a little world collecting things that start with that letter.",
"facts": [
[
"Built with",
"Unity, Vuforia"
],
[
"Year",
"2015"
],
[
"Paper",
"IEEE PerCom Workshops 2016"
],
[
"Role",
"Co-developed"
]
],
"hero": {
"kind": "demo",
"demo": "abc3d",
"drive": true,
"caption": "Illustrated demo. Scan a letter card, then Drive & Collect. Press Drive it yourself to steer with the arrow keys or by dragging."
},
"tiles": [
{
"size": "m",
"title": "Mode 1: scan a letter",
"text": "The camera recognizes an alphabet marker and shows a 3D object for it: A for apple.",
"vis": {
"kind": "illu",
"name": "scan"
},
"kicker": "Scanning"
},
{
"size": "m",
"title": "Mode 2: drive and collect",
"text": "Children collect a set number of objects that start with the letter, in a bounded little world. Things that start with other letters don’t count.",
"vis": {
"kind": "icon",
"icon": "car"
},
"kicker": "Vehicle"
},
{
"size": "m",
"title": "The paper",
"text": "Co-authored the IEEE PerCom Workshops 2016 paper.",
"vis": {
"kind": "illu",
"name": "paper"
},
"kicker": "Research"
},
{
"size": "m",
"title": "Co-developed",
"text": "A team project built with Unity and Vuforia.",
"vis": {
"kind": "illu",
"name": "team"
},
"kicker": "Team"
},
{
"size": "s",
"title": "Links",
"text": "",
"vis": {
"kind": "links",
"items": [
{
"label": "Read the paper (PDF)",
"href": "https://ics.uci.edu/~kobsa/papers/2016-PerCom-ABC3D-Kobsa.pdf",
"icon": "paper"
},
{
"label": "Google Play (archived listing)",
"todo": "replace with the Internet Archive URL of the ABC3D car game's Google Play listing",
"icon": "archive"
}
]
}
}
],
"card": {
"name": "ABC3D",
"year": "2015",
"line": "AR literacy game: scan a letter, see it in 3D, then drive and collect.",
"tags": [
"Unity",
"Vuforia",
"AR"
],
"filters": [
"mobile",
"games",
"ai"
],
"group": "archive",
"highlight": true
}
},
{
"id": "canon-dashboard",
"title": "Pipeline monitoring dashboard",
"kicker": "Canon internship, 2016",
"summary": "A Python/Flask and Java monitoring dashboard for enterprise data pipelines, with failure diagnostics and alerts.",
"facts": [
[
"Role",
"Senior Intern, Enterprise Technology"
],
[
"Where",
"Canon Information & Imaging Solutions"
],
[
"Year",
"2016"
],
[
"Code",
"Internal, not public"
]
],
"hero": {
"kind": "demo",
"demo": "canon",
"caption": "Illustrative demo with sample data."
},
"tiles": [
{
"size": "m",
"title": "Failure diagnostics",
"text": "Find the failing pipeline component and why.",
"vis": {
"kind": "icon",
"icon": "alert"
}
},
{
"size": "m",
"title": "Alerts",
"text": "Failures raise an alert.",
"vis": {
"kind": "icon",
"icon": "bell"
}
},
{
"size": "w",
"title": "Tech",
"text": "",
"vis": {
"kind": "chips",
"items": [
"Python",
"Flask",
"Java"
]
}
}
],
"card": {
"name": "Pipeline monitoring dashboard",
"year": "2016",
"line": "Monitoring for enterprise data pipelines, with diagnostics and alerts.",
"tags": [
"Python",
"Flask",
"Java"
],
"filters": [
"data",
"web"
],
"group": "archive",
"highlight": false
}
},
{
"id": "places",
"title": "Places",
"kicker": "Android, 2016",
"summary": "A location-aware Android social app: a photo and event feed with Krumbs capture, Eventshop data and Foursquare nearby places.",
"facts": [
[
"Platform",
"Android"
],
[
"Year",
"2016"
]
],
"hero": {
"kind": "demo",
"demo": "places",
"caption": "Illustrative demo."
},
"tiles": [
{
"size": "s",
"title": "Krumbs capture",
"text": "Photos captured with Krumbs.",
"vis": {
"kind": "icon",
"icon": "camera"
}
},
{
"size": "s",
"title": "Eventshop events",
"text": "Event data from Eventshop.",
"vis": {
"kind": "icon",
"icon": "calendar"
}
},
{
"size": "s",
"title": "Nearby places",
"text": "Foursquare places around you.",
"vis": {
"kind": "icon",
"icon": "pin"
}
},
{
"size": "w",
"title": "Links",
"text": "",
"vis": {
"kind": "links",
"items": [
{
"label": "Source on GitHub",
"href": "https://github.com/addb/Places-Social-Media-Android-App",
"icon": "github"
}
]
}
}
],
"card": {
"name": "Places",
"year": "2016",
"line": "Location-aware Android social app with a photo and event feed.",
"tags": [
"Android",
"Java",
"Location"
],
"filters": [
"mobile"
],
"group": "archive",
"highlight": false
}
},
{
"id": "search-engine",
"title": "Search Engine",
"kicker": "Team project, 2016",
"summary": "University-domain crawling, indexing and PageRank-style ranking in Java and MySQL.",
"facts": [
[
"Year",
"2016"
],
[
"Stack",
"Java, MySQL"
],
[
"Type",
"Team project"
]
],
"hero": {
"kind": "demo",
"demo": "search",
"caption": "Illustrative demo with sample results."
},
"tiles": [
{
"size": "s",
"title": "Crawl",
"text": "Follow links across a university domain.",
"vis": {
"kind": "icon",
"icon": "graph"
}
},
{
"size": "s",
"title": "Index",
"text": "Store pages in MySQL for lookup.",
"vis": {
"kind": "icon",
"icon": "database"
}
},
{
"size": "s",
"title": "Rank",
"text": "Order results with a PageRank-style score.",
"vis": {
"kind": "icon",
"icon": "chart"
}
},
{
"size": "w",
"title": "Links",
"text": "",
"vis": {
"kind": "links",
"items": [
{
"label": "Source on GitHub",
"href": "https://github.com/addb/Search-Engine",
"icon": "github"
}
]
}
}
],
"card": {
"name": "Search Engine",
"year": "2016",
"line": "University-domain crawler with PageRank-style ranking.",
"tags": [
"Java",
"MySQL",
"PageRank"
],
"filters": [
"data",
"web"
],
"group": "archive",
"highlight": false
}
},
{
"id": "intelligent-business-analytics",
"title": "Intelligent Business Analytics",
"kicker": "B.E. final-year project, VESIT, 2015",
"summary": "A gadget portal with descriptions, specs, best-buy prices and comparisons, plus a Twitter trend view that classifies tweets with a Naive Bayes classifier.",
"facts": [
[
"Year",
"2015"
],
[
"Type",
"B.E. final-year project"
],
[
"Where",
"VESIT, University of Mumbai"
],
[
"Model",
"Naive Bayes"
]
],
"hero": {
"kind": "demo",
"demo": "iba",
"caption": "Illustrative demo with generic gadgets and sample posts."
},
"tiles": [
{
"size": "m",
"title": "The portal",
"text": "Gadget descriptions, specs, best-buy prices and comparisons in one place.",
"vis": {
"kind": "icon",
"icon": "cart"
},
"kicker": "Portal"
},
{
"size": "m",
"title": "Naive Bayes on tweets",
"text": "Tweets with a gadget’s hashtag are classified as positive, negative or neutral.",
"vis": {
"kind": "illu",
"name": "nb"
},
"kicker": "Trend view"
},
{
"size": "w",
"title": "Final-year project",
"text": "B.E. in Information Technology, VESIT, University of Mumbai.",
"vis": {
"kind": "icon",
"icon": "school"
}
}
],
"card": {
"name": "Intelligent Business Analytics",
"year": "2015",
"line": "Gadget portal with Naive Bayes sentiment on tweets.",
"tags": [
"Naive Bayes",
"Sentiment",
"Web portal"
],
"filters": [
"ai",
"web",
"data"
],
"group": "archive",
"highlight": false
}
},
{
"id": "d-deal",
"title": "The D-Deal",
"kicker": "2015",
"summary": "A website for a fully automated, real-time online auctioning and trading event, built for 300 simultaneous users.",
"facts": [
[
"Year",
"2015"
],
[
"Built for",
"300 simultaneous users"
]
],
"hero": {
"kind": "demo",
"demo": "ddeal",
"caption": "Illustrative demo with sample lots and bids."
},
"tiles": [
{
"size": "m",
"title": "Real time",
"text": "Bids and trades update live for everyone.",
"vis": {
"kind": "icon",
"icon": "bolt"
}
},
{
"size": "m",
"title": "Fully automated",
"text": "Auctions and trades settle on their own.",
"vis": {
"kind": "icon",
"icon": "gavel"
}
}
],
"card": {
"name": "The D-Deal",
"year": "2015",
"line": "Real-time online auction and trading event for 300 users.",
"tags": [
"Real time",
"Web"
],
"filters": [
"web"
],
"group": "archive",
"highlight": false
}
},
{
"id": "ehealth",
"title": "Health Care Management Institution Portal",
"kicker": "E-commerce course project, 2015",
"summary": "Patients see their appointments, treatment history and bills; doctors manage appointments and schedules.",
"facts": [
[
"Year",
"2015"
],
[
"Type",
"Course project"
]
],
"hero": {
"kind": "demo",
"demo": "ehealth",
"caption": "Illustrative demo with sample records."
},
"tiles": [
{
"size": "m",
"title": "For patients",
"text": "Appointments, treatment history and bills.",
"vis": {
"kind": "icon",
"icon": "heart"
}
},
{
"size": "m",
"title": "For doctors",
"text": "Manage appointments and schedules.",
"vis": {
"kind": "icon",
"icon": "calendar"
}
},
{
"size": "w",
"title": "Links",
"text": "",
"vis": {
"kind": "links",
"items": [
{
"label": "Source on GitHub",
"href": "https://github.com/addb/Ehealth",
"icon": "github"
}
]
}
}
],
"card": {
"name": "Health Care Portal",
"year": "2015",
"line": "Appointments, treatment history and bills for patients; schedules for doctors.",
"tags": [
"Web portal",
"MySQL"
],
"filters": [
"web",
"data"
],
"group": "archive",
"highlight": false
}
},
{
"id": "gamemaker-game",
"title": "GameMaker game",
"kicker": "Game Architecture & Programming course, 2015",
"summary": "An action game built in GameMaker Studio 8.1 with Google SketchUp assets: pick a character and fight enemies.",
"facts": [
[
"Year",
"2015"
],
[
"Engine",
"GameMaker Studio 8.1"
],
[
"Assets",
"Google SketchUp"
]
],
"hero": {
"kind": "demo",
"demo": "game",
"caption": "An original pixel sprite, not the game’s own art."
},
"tiles": [
{
"size": "s",
"title": "Pick a character",
"text": "Choose who to play.",
"vis": {
"kind": "icon",
"icon": "users"
}
},
{
"size": "s",
"title": "Fight enemies",
"text": "Take them on as you go.",
"vis": {
"kind": "icon",
"icon": "sword"
}
},
{
"size": "s",
"title": "Built with",
"text": "GameMaker Studio 8.1, with assets from Google SketchUp.",
"vis": {
"kind": "icon",
"icon": "tool"
}
}
],
"card": {
"name": "GameMaker game",
"year": "2015",
"line": "Course action game: pick a character and fight enemies.",
"tags": [
"GameMaker",
"SketchUp"
],
"filters": [
"games"
],
"group": "archive",
"highlight": false
}
},
{
"id": "run-and-urn",
"title": "Run & Urn",
"kicker": "Code for Good hackathon, J.P. Morgan India, 2014",
"summary": "A web app for the NGO Magic Bus to create running-event campaigns that raise money, with the public taking part and corporate sponsors funding campaigns.",
"facts": [
[
"Event",
"Code for Good hackathon"
],
[
"Year",
"2014"
],
[
"For",
"Magic Bus"
]
],
"hero": {
"kind": "demo",
"demo": "runurn",
"caption": "Illustrative demo with sample numbers."
},
"tiles": [
{
"size": "s",
"title": "Campaigns",
"text": "The NGO creates running-event campaigns.",
"vis": {
"kind": "icon",
"icon": "run"
}
},
{
"size": "s",
"title": "The public joins",
"text": "Runners sign up to take part.",
"vis": {
"kind": "icon",
"icon": "users"
}
},
{
"size": "s",
"title": "Sponsors fund",
"text": "Corporate sponsors fund campaigns.",
"vis": {
"kind": "icon",
"icon": "heart"
}
}
],
"card": {
"name": "Run & Urn",
"year": "2014",
"line": "Hackathon web app for an NGO’s fundraising runs.",
"tags": [
"Hackathon",
"Web"
],
"filters": [
"web"
],
"group": "archive",
"highlight": false
}
},
{
"id": "inventory-management",
"title": "Online Inventory Management",
"kicker": "J2EE course project, 2014",
"summary": "Buy, sell, edit and view stock in the browser.",
"facts": [
[
"Year",
"2014"
],
[
"Stack",
"HTML, CSS, JavaScript, PHP, AJAX"
]
],
"hero": {
"kind": "demo",
"demo": "inventory",
"caption": "Illustrative demo with sample items."
},
"tiles": [
{
"size": "m",
"title": "Buy and sell",
"text": "Stock updates with every sale and purchase.",
"vis": {
"kind": "icon",
"icon": "cart"
}
},
{
"size": "m",
"title": "Edit and view",
"text": "Keep the catalog current.",
"vis": {
"kind": "icon",
"icon": "table"
}
},
{
"size": "w",
"title": "Tech",
"text": "",
"vis": {
"kind": "chips",
"items": [
"HTML",
"CSS",
"JavaScript",
"PHP",
"AJAX"
]
}
}
],
"card": {
"name": "Online Inventory Management",
"year": "2014",
"line": "Buy, sell, edit and view stock in the browser.",
"tags": [
"PHP",
"AJAX",
"JavaScript"
],
"filters": [
"web",
"data"
],
"group": "archive",
"highlight": false
}
},
{
"id": "project-management",
"title": "Online Project Management",
"kicker": "Software Engineering course project, 2014",
"summary": "Students upload their projects; professors review and grade them.",
"facts": [
[
"Year",
"2014"
],
[
"Type",
"Course project"
]
],
"hero": {
"kind": "demo",
"demo": "projmgmt",
"caption": "Illustrative demo with a sample grade."
},
"tiles": [
{
"size": "s",
"title": "Upload",
"text": "Students submit projects.",
"vis": {
"kind": "icon",
"icon": "upload"
}
},
{
"size": "s",
"title": "Review",
"text": "Professors leave feedback.",
"vis": {
"kind": "icon",
"icon": "review"
}
},
{
"size": "s",
"title": "Grade",
"text": "Grades go back to students.",
"vis": {
"kind": "icon",
"icon": "grade"
}
}
],
"card": {
"name": "Online Project Management",
"year": "2014",
"line": "Students upload projects; professors review and grade.",
"tags": [
"Web portal",
"Course project"
],
"filters": [
"web"
],
"group": "archive",
"highlight": false
}
},
{
"id": "iste-vesit",
"title": "ISTE VESIT website and app",
"kicker": "Student chapter, 2013–14",
"summary": "The website and Android app for the ISTE VESIT student chapter. Arjun also volunteered as the chapter’s coordinator in 2012–13.",
"facts": [
[
"Years",
"2013–14"
],
[
"Platforms",
"Web, Android"
],
[
"Volunteering",
"Coordinator, 2012–13"
]
],
"hero": {
"kind": "demo",
"demo": "iste",
"caption": "Illustrative demo."
},
"tiles": [
{
"size": "m",
"title": "Website",
"text": "The chapter’s home on the web.",
"vis": {
"kind": "icon",
"icon": "web"
}
},
{
"size": "m",
"title": "Android app",
"text": "Events and news in your pocket.",
"vis": {
"kind": "icon",
"icon": "android"
}
}
],
"card": {
"name": "ISTE VESIT website and app",
"year": "2013–14",
"line": "Student-chapter website and Android app.",
"tags": [
"Web",
"Android"
],
"filters": [
"web",
"mobile"
],
"group": "archive",
"highlight": false
}
},
{
"id": "cricket-league-db",
"title": "Cricket league database",
"kicker": "GUI and DBMS project, 2013",
"summary": "A small database application with an MS-SQL database and a VB.NET interface.",
"facts": [
[
"Year",
"2013"
],
[
"Stack",
"MS-SQL, VB.NET"
]
],
"hero": {
"kind": "demo",
"demo": "cricket",
"caption": "Illustrative demo with sample data."
},
"tiles": [
{
"size": "m",
"title": "MS-SQL database",
"text": "Teams and players in tables.",
"vis": {
"kind": "icon",
"icon": "database"
}
},
{
"size": "m",
"title": "VB.NET interface",
"text": "Run queries from a desktop app.",
"vis": {
"kind": "icon",
"icon": "table"
}
}
],
"card": {
"name": "Cricket league database",
"year": "2013",
"line": "MS-SQL database with a VB.NET interface.",
"tags": [
"MS-SQL",
"VB.NET"
],
"filters": [
"data"
],
"group": "archive",
"highlight": false
}
},
{
"id": "chat-app",
"title": "NodeJS ChatApp",
"kicker": "Web",
"summary": "Multi-room browser chat on Node.js.",
"facts": [
[
"Stack",
"Node.js, JavaScript"
]
],
"hero": {
"kind": "demo",
"demo": "chat",
"caption": "Illustrative demo."
},
"tiles": [
{
"size": "m",
"title": "Rooms",
"text": "Separate conversations, side by side.",
"vis": {
"kind": "icon",
"icon": "rooms"
}
},
{
"size": "m",
"title": "Real time",
"text": "Messages appear without a refresh.",
"vis": {
"kind": "icon",
"icon": "bolt"
}
},
{
"size": "s",
"title": "Links",
"text": "",
"vis": {
"kind": "links",
"items": [
{
"label": "Source on GitHub",
"href": "https://github.com/addb/NodeJS_ChatApp",
"icon": "github"
}
]
}
}
],
"card": {
"name": "NodeJS ChatApp",
"year": "",
"line": "Multi-room browser chat on Node.js.",
"tags": [
"Node.js",
"JavaScript"
],
"filters": [
"web"
],
"group": "archive",
"highlight": false
}
}
],
"icons": {
"layers": "<path d=\"M3 8l9-4.5L21 8l-9 4.5z\"/><path d=\"M3 12.5l9 4.5 9-4.5M3 17l9 4.5 9-4.5\"/>",
"image": "<rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"2\"/><circle cx=\"9\" cy=\"10\" r=\"2\"/><path d=\"M3 17l5-5 4 4 3-3 6 6\"/>",
"agent": "<circle cx=\"12\" cy=\"12\" r=\"3.2\"/><path d=\"M12 3v3M12 18v3M3 12h3M18 12h3\"/><path d=\"M17.5 6.5a8 8 0 0 1 0 11M6.5 17.5a8 8 0 0 1 0-11\"/>",
"edit": "<path d=\"M4 20h4l11-11-4-4L4 16z\"/><path d=\"M13.5 6.5l4 4\"/>",
"export": "<rect x=\"3\" y=\"5\" width=\"13\" height=\"14\" rx=\"2\"/><path d=\"M12 12h9M18 9l3 3-3 3\"/>",
"video": "<rect x=\"3\" y=\"6\" width=\"13\" height=\"12\" rx=\"2\"/><path d=\"M16 10l5-3v10l-5-3\"/>",
"eval": "<path d=\"M4 6h10M4 12h10M4 18h10\"/><path d=\"M17 5l1.5 1.5L21 4M17 11l1.5 1.5L21 10M17 17l1.5 1.5L21 16\"/>",
"tool": "<path d=\"M14 6a4 4 0 0 0 5 5l-8.5 8.5a2 2 0 0 1-3-3L16 8\"/>",
"cube": "<path d=\"M12 3l8 4.5v9L12 21l-8-4.5v-9z\"/><path d=\"M4 7.5l8 4.5 8-4.5M12 12v9\"/>",
"route": "<circle cx=\"5\" cy=\"12\" r=\"2\"/><circle cx=\"19\" cy=\"6\" r=\"2\"/><circle cx=\"19\" cy=\"18\" r=\"2\"/><path d=\"M7 12h4l6-5M11 12l6 5\"/>",
"shield": "<path d=\"M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z\"/><path d=\"M8.5 12l2.5 2.5 4.5-5\"/>",
"plug": "<path d=\"M9 3v5M15 3v5M7 8h10v3a5 5 0 0 1-10 0z\"/><path d=\"M12 16v5\"/>",
"brief": "<rect x=\"4\" y=\"3\" width=\"16\" height=\"18\" rx=\"2\"/><path d=\"M8 8h8M8 12h8M8 16h5\"/>",
"context": "<circle cx=\"6\" cy=\"6\" r=\"2.5\"/><circle cx=\"6\" cy=\"18\" r=\"2.5\"/><circle cx=\"18\" cy=\"12\" r=\"3\"/><path d=\"M8.3 7l6.9 3.8M8.3 17l6.9-3.8\"/>",
"pipeline": "<rect x=\"2.5\" y=\"9\" width=\"5\" height=\"6\" rx=\"1\"/><rect x=\"9.5\" y=\"9\" width=\"5\" height=\"6\" rx=\"1\"/><rect x=\"16.5\" y=\"9\" width=\"5\" height=\"6\" rx=\"1\"/><path d=\"M7.5 12h2M14.5 12h2\"/>",
"terminal": "<rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"2\"/><path d=\"M7 10l3 2.5L7 15M12 16h5\"/>",
"bug": "<rect x=\"7\" y=\"8\" width=\"10\" height=\"12\" rx=\"5\"/><path d=\"M9 8a3 3 0 0 1 6 0M3 13h4M17 13h4M4 8l3 2M20 8l-3 2M4 19l3-2M20 19l-3-2\"/>",
"review": "<path d=\"M4 5h16v11H9l-5 4z\"/><path d=\"M8 10l2 2 4-4\"/>",
"book": "<path d=\"M4 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4z\"/><path d=\"M20 4h-6a3 3 0 0 0-3 3\"/><path d=\"M20 4v14h-7\"/>",
"users": "<circle cx=\"8\" cy=\"9\" r=\"3\"/><circle cx=\"16.5\" cy=\"9.5\" r=\"2.5\"/><path d=\"M3 19c.6-3 2.7-5 5-5s4.4 2 5 5M14 14.5c2.4 0 4.3 1.6 5 4.5\"/>",
"phone": "<rect x=\"7\" y=\"2.5\" width=\"10\" height=\"19\" rx=\"2.2\"/><path d=\"M10.5 18.5h3\"/>",
"tv": "<rect x=\"3\" y=\"4\" width=\"18\" height=\"12\" rx=\"1.5\"/><path d=\"M8 20h8M12 16v4\"/>",
"plugin": "<rect x=\"9\" y=\"9\" width=\"6\" height=\"6\" rx=\"1\"/><path d=\"M12 3v6M12 15v6M3 12h6M15 12h6\"/><circle cx=\"12\" cy=\"3\" r=\"1\"/><circle cx=\"12\" cy=\"21\" r=\"1\"/><circle cx=\"3\" cy=\"12\" r=\"1\"/><circle cx=\"21\" cy=\"12\" r=\"1\"/>",
"test": "<path d=\"M9 3v6l-5 9a2 2 0 0 0 1.8 3h12.4a2 2 0 0 0 1.8-3l-5-9V3\"/><path d=\"M8 3h8M7 15h10\"/>",
"opensource": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M9.5 15.5a3.5 3.5 0 1 1 5 0L16 20\"/><path d=\"M9.5 15.5L8 20\"/>",
"compare": "<rect x=\"3\" y=\"4\" width=\"8\" height=\"16\" rx=\"1.5\"/><rect x=\"13\" y=\"4\" width=\"8\" height=\"16\" rx=\"1.5\"/><path d=\"M5.5 9h3M15.5 9h3M5.5 12h3M15.5 12h2\"/>",
"gauge": "<path d=\"M4 17a8 8 0 1 1 16 0\"/><path d=\"M12 17l4-5\"/><circle cx=\"12\" cy=\"17\" r=\"1.2\"/>",
"history": "<path d=\"M3 12a9 9 0 1 0 3-6.7L3 8\"/><path d=\"M3 3v5h5M12 7v5l3 2\"/>",
"report": "<path d=\"M6 3h9l4 4v14H6z\"/><path d=\"M15 3v4h4M9 17v-3M12 17v-6M15 17v-4\"/>",
"lock": "<rect x=\"5\" y=\"10\" width=\"14\" height=\"10\" rx=\"2\"/><path d=\"M8 10V7a4 4 0 0 1 8 0v3\"/><circle cx=\"12\" cy=\"15\" r=\"1.4\"/>",
"camera": "<path d=\"M4 8h3l2-3h6l2 3h3v11H4z\"/><circle cx=\"12\" cy=\"13\" r=\"3.5\"/>",
"sms": "<path d=\"M4 5h16v11H9l-5 4z\"/><path d=\"M8 10h8M8 13h5\"/>",
"bell": "<path d=\"M6 16V11a6 6 0 0 1 12 0v5l2 2H4z\"/><path d=\"M10 20a2 2 0 0 0 4 0\"/>",
"clock": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M12 7v5l3 2\"/>",
"power": "<path d=\"M12 3v9\"/><path d=\"M6.3 7a8 8 0 1 0 11.4 0\"/>",
"log": "<rect x=\"4\" y=\"3\" width=\"16\" height=\"18\" rx=\"2\"/><circle cx=\"9\" cy=\"9\" r=\"2\"/><path d=\"M13 8h4M13 11h3M7 15h10M7 18h7\"/>",
"paper": "<path d=\"M6 3h9l4 4v14H6z\"/><path d=\"M15 3v4h4M9 11h7M9 14h7M9 17h4\"/>",
"github": "<circle cx=\"7\" cy=\"6.5\" r=\"2.5\"/><circle cx=\"7\" cy=\"17.5\" r=\"2.5\"/><circle cx=\"17\" cy=\"9\" r=\"2.5\"/><path d=\"M7 9v6M17 11.5c0 3.5-4.5 3.5-8.5 5\"/>",
"store": "<path d=\"M5 3l14 9-14 9z\"/><path d=\"M5 3l9 9-9 9\"/>",
"scan": "<path d=\"M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3\"/><path d=\"M9 16l3-8 3 8M10 13.5h4\"/>",
"car": "<path d=\"M3 15l2-5a2 2 0 0 1 2-1.4h10a2 2 0 0 1 2 1.4l2 5v3H3z\"/><circle cx=\"7.5\" cy=\"18\" r=\"1.8\"/><circle cx=\"16.5\" cy=\"18\" r=\"1.8\"/><path d=\"M5 12h14\"/>",
"star": "<path d=\"M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z\"/>",
"globe": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18\"/>",
"heart": "<path d=\"M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10z\"/>",
"archive": "<rect x=\"3\" y=\"4\" width=\"18\" height=\"5\" rx=\"1\"/><path d=\"M5 9v11h14V9M10 13h4\"/>",
"chart": "<path d=\"M4 20V4M4 20h16\"/><path d=\"M8 16v-4M12 16V8M16 16v-6\"/>",
"tag": "<path d=\"M3 12V4h8l10 10-8 8z\"/><circle cx=\"7.5\" cy=\"8\" r=\"1.5\"/>",
"cart": "<path d=\"M3 4h2l2.5 11h11L21 8H6.5\"/><circle cx=\"9\" cy=\"19\" r=\"1.5\"/><circle cx=\"17\" cy=\"19\" r=\"1.5\"/>",
"map": "<path d=\"M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z\"/><path d=\"M9 4v14M15 6v14\"/>",
"pin": "<path d=\"M12 21s-6-5.5-6-11a6 6 0 0 1 12 0c0 5.5-6 11-6 11z\"/><circle cx=\"12\" cy=\"10\" r=\"2.2\"/>",
"feed": "<rect x=\"4\" y=\"3\" width=\"16\" height=\"7\" rx=\"1.5\"/><rect x=\"4\" y=\"14\" width=\"16\" height=\"7\" rx=\"1.5\"/>",
"search": "<circle cx=\"10.5\" cy=\"10.5\" r=\"6\"/><path d=\"M15 15l5 5\"/>",
"graph": "<circle cx=\"5\" cy=\"6\" r=\"2\"/><circle cx=\"19\" cy=\"6\" r=\"2\"/><circle cx=\"12\" cy=\"18\" r=\"2\"/><circle cx=\"12\" cy=\"10\" r=\"2\"/><path d=\"M6.7 7l3.6 2M17.3 7l-3.6 2M12 12v4\"/>",
"database": "<ellipse cx=\"12\" cy=\"5.5\" rx=\"7\" ry=\"2.5\"/><path d=\"M5 5.5v13c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-13M5 12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5\"/>",
"calendar": "<rect x=\"3\" y=\"5\" width=\"18\" height=\"16\" rx=\"2\"/><path d=\"M3 10h18M8 3v4M16 3v4\"/>",
"bill": "<path d=\"M6 3h12v18l-3-2-3 2-3-2-3 2z\"/><path d=\"M9 8h6M9 12h6\"/>",
"chat": "<path d=\"M4 5h11v8H8l-4 3z\"/><path d=\"M15 9h5v8l-3-2h-5v-2\"/>",
"rooms": "<rect x=\"3\" y=\"4\" width=\"7\" height=\"16\" rx=\"1.5\"/><path d=\"M13 7h8M13 11h8M13 15h5\"/>",
"bolt": "<path d=\"M13 3L5 13h6l-1 8 8-10h-6z\"/>",
"sun": "<circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4\"/>",
"thermo": "<path d=\"M10 14V5a2 2 0 0 1 4 0v9a4 4 0 1 1-4 0z\"/><path d=\"M12 9v7\"/>",
"chip": "<rect x=\"7\" y=\"7\" width=\"10\" height=\"10\" rx=\"1.5\"/><path d=\"M9 3v4M15 3v4M9 17v4M15 17v4M3 9h4M3 15h4M17 9h4M17 15h4\"/>",
"wifi": "<path d=\"M3 9a13 13 0 0 1 18 0M6.5 12.5a8 8 0 0 1 11 0M10 16a3 3 0 0 1 4 0\"/><circle cx=\"12\" cy=\"19\" r=\"1\"/>",
"brightness": "<circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"M12 3v2M12 19v2M3 12h2M19 12h2\"/><path d=\"M12 8v8\" stroke-width=\"3\"/>",
"gavel": "<path d=\"M14 4l6 6M11 7l6 6M12.5 5.5l-5 5 6 6 5-5M3 21l6-6\"/>",
"run": "<circle cx=\"14\" cy=\"4.5\" r=\"2\"/><path d=\"M8 21l3-6 3 2v4M10 9l3-2 3 3 3 1M13 7l-2 6\"/>",
"grade": "<rect x=\"4\" y=\"3\" width=\"16\" height=\"18\" rx=\"2\"/><path d=\"M9 15l3-7 3 7M10 13h4\"/>",
"upload": "<path d=\"M12 16V4M7 9l5-5 5 5M4 16v4h16v-4\"/>",
"box": "<path d=\"M3 7l9-4 9 4v10l-9 4-9-4z\"/><path d=\"M3 7l9 4 9-4M12 11v10\"/>",
"table": "<rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"1.5\"/><path d=\"M3 9h18M3 14h18M9 4v16\"/>",
"game": "<rect x=\"2.5\" y=\"7\" width=\"19\" height=\"11\" rx=\"5\"/><path d=\"M7 11v3M5.5 12.5h3\"/><circle cx=\"16\" cy=\"11.5\" r=\"1\"/><circle cx=\"18\" cy=\"14\" r=\"1\"/>",
"sword": "<path d=\"M19 3l-9 9M14 3h5v5\"/><path d=\"M7 13l4 4M5 15l4 4M4 20l2-2\"/>",
"school": "<path d=\"M2 9l10-5 10 5-10 5z\"/><path d=\"M6 11v5c2 2 10 2 12 0v-5\"/>",
"web": "<rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"2\"/><path d=\"M3 9h18\"/><circle cx=\"6\" cy=\"6.5\" r=\".6\"/><circle cx=\"8.5\" cy=\"6.5\" r=\".6\"/>",
"alert": "<path d=\"M12 3l9 16H3z\"/><path d=\"M12 10v4M12 17v.5\"/>",
"dag": "<rect x=\"3\" y=\"4\" width=\"6\" height=\"4\" rx=\"1\"/><rect x=\"15\" y=\"4\" width=\"6\" height=\"4\" rx=\"1\"/><rect x=\"9\" y=\"16\" width=\"6\" height=\"4\" rx=\"1\"/><path d=\"M6 8v3h12V8M12 11v5\"/>",
"nb": "<path d=\"M4 20h16\"/><rect x=\"5\" y=\"11\" width=\"3\" height=\"9\"/><rect x=\"10.5\" y=\"7\" width=\"3\" height=\"13\"/><rect x=\"16\" y=\"14\" width=\"3\" height=\"6\"/>",
"android": "<rect x=\"5\" y=\"9\" width=\"14\" height=\"10\" rx=\"2\"/><path d=\"M8 9a4 4 0 0 1 8 0M8 5l1.5 2M16 5l-1.5 2\"/><circle cx=\"10\" cy=\"7\" r=\".5\"/><circle cx=\"14\" cy=\"7\" r=\".5\"/>"
},
"illu": {
"intruder": "<svg viewBox=\"0 0 220 170\" class=\"illu\" role=\"img\" aria-label=\"Illustration of an intruder snapshot: an abstract silhouette in a camera frame, stamped Intruder ID.\">\n  <rect x=\"50\" y=\"10\" width=\"120\" height=\"150\" rx=\"14\" fill=\"#0b141c\" stroke=\"rgba(155,232,255,.45)\"/>\n  <rect x=\"60\" y=\"24\" width=\"100\" height=\"100\" rx=\"6\" fill=\"#2a3441\"/>\n  <circle cx=\"110\" cy=\"62\" r=\"18\" fill=\"#7b8696\"/><path d=\"M76 124c4-22 18-32 34-32s30 10 34 32z\" fill=\"#7b8696\"/>\n  <path d=\"M60 36V24h12M148 24h12v12M160 112v12h-12M72 124H60v-12\" stroke=\"#9be8ff\" stroke-width=\"2\" fill=\"none\"/>\n  <rect x=\"68\" y=\"132\" width=\"84\" height=\"18\" rx=\"9\" fill=\"#ffb27a\"/><text x=\"110\" y=\"144.5\" text-anchor=\"middle\" font-size=\"10\" font-family=\"IBM Plex Sans, sans-serif\" font-weight=\"600\" fill=\"#1a1208\">Intruder ID</text>\n  <circle cx=\"110\" cy=\"17\" r=\"2.5\" fill=\"#9be8ff\"/></svg>",
"sms": "<svg viewBox=\"0 0 220 170\" class=\"illu\" role=\"img\" aria-label=\"Illustration of an SMS alert sent after three wrong passcodes.\">\n  <rect x=\"40\" y=\"18\" width=\"140\" height=\"134\" rx=\"14\" fill=\"#0b141c\" stroke=\"rgba(155,232,255,.35)\"/>\n  <rect x=\"48\" y=\"38\" width=\"124\" height=\"44\" rx=\"10\" fill=\"#e4f1f6\"/><path d=\"M60 82l-6 10 14-10\" fill=\"#e4f1f6\"/>\n  <text x=\"58\" y=\"55\" font-size=\"10\" font-family=\"IBM Plex Sans, sans-serif\" font-weight=\"600\" fill=\"#0b141c\">SnappLock alert</text>\n  <text x=\"58\" y=\"70\" font-size=\"8.6\" font-family=\"IBM Plex Sans, sans-serif\" fill=\"#334155\">3 wrong passcodes on Chat</text>\n  <rect x=\"54\" y=\"100\" width=\"70\" height=\"8\" rx=\"4\" fill=\"rgba(155,232,255,.25)\"/><rect x=\"54\" y=\"114\" width=\"50\" height=\"8\" rx=\"4\" fill=\"rgba(155,232,255,.15)\"/>\n  <text x=\"110\" y=\"142\" text-anchor=\"middle\" font-size=\"9\" font-family=\"IBM Plex Sans, sans-serif\" fill=\"#9db3bf\">Sample message</text></svg>",
"tone": "<svg viewBox=\"0 0 220 170\" class=\"illu\" aria-hidden=\"true\"><path d=\"M70 70h20l26-22v74l-26-22H70z\" fill=\"rgba(255,178,122,.18)\" stroke=\"#ffb27a\" stroke-width=\"2\" stroke-linejoin=\"round\"/>\n  <path d=\"M132 66c8 10 8 28 0 38M144 56c14 16 14 42 0 58M156 46c20 22 20 56 0 78\" fill=\"none\" stroke=\"#9be8ff\" stroke-width=\"2\" stroke-linecap=\"round\"/></svg>",
"relock": "<svg viewBox=\"0 0 220 170\" class=\"illu\" aria-hidden=\"true\"><circle cx=\"110\" cy=\"85\" r=\"56\" fill=\"none\" stroke=\"rgba(155,232,255,.2)\" stroke-width=\"10\"/>\n  <path d=\"M110 29a56 56 0 0 1 48.5 84\" fill=\"none\" stroke=\"#9be8ff\" stroke-width=\"10\" stroke-linecap=\"round\"/>\n  <rect x=\"94\" y=\"80\" width=\"32\" height=\"26\" rx=\"5\" fill=\"none\" stroke=\"#ffb27a\" stroke-width=\"2.4\"/><path d=\"M101 80v-8a9 9 0 0 1 17-4\" fill=\"none\" stroke=\"#ffb27a\" stroke-width=\"2.4\" stroke-linecap=\"round\"/></svg>",
"paper": "<svg viewBox=\"0 0 220 170\" class=\"illu\" aria-hidden=\"true\"><g transform=\"rotate(-5 110 85)\"><rect x=\"62\" y=\"14\" width=\"96\" height=\"136\" rx=\"4\" fill=\"#e7ecef\"/>\n  <rect x=\"74\" y=\"28\" width=\"72\" height=\"7\" rx=\"2\" fill=\"#2c3339\"/><rect x=\"74\" y=\"40\" width=\"52\" height=\"5\" rx=\"2\" fill=\"#5b6670\"/>\n  <g fill=\"#9aa5ae\"><rect x=\"74\" y=\"56\" width=\"33\" height=\"3\"/><rect x=\"113\" y=\"56\" width=\"33\" height=\"3\"/><rect x=\"74\" y=\"63\" width=\"33\" height=\"3\"/><rect x=\"113\" y=\"63\" width=\"33\" height=\"3\"/><rect x=\"74\" y=\"70\" width=\"33\" height=\"3\"/><rect x=\"113\" y=\"70\" width=\"28\" height=\"3\"/><rect x=\"74\" y=\"77\" width=\"30\" height=\"3\"/><rect x=\"113\" y=\"77\" width=\"33\" height=\"3\"/></g>\n  <rect x=\"74\" y=\"88\" width=\"33\" height=\"26\" fill=\"#cfd8de\"/><g fill=\"#9aa5ae\"><rect x=\"113\" y=\"88\" width=\"33\" height=\"3\"/><rect x=\"113\" y=\"95\" width=\"33\" height=\"3\"/><rect x=\"113\" y=\"102\" width=\"26\" height=\"3\"/><rect x=\"74\" y=\"122\" width=\"72\" height=\"3\"/><rect x=\"74\" y=\"129\" width=\"60\" height=\"3\"/></g></g></svg>",
"credit": "<svg viewBox=\"0 0 220 170\" class=\"illu\" role=\"img\" aria-label=\"Illustration of a team web page with one credit line highlighted.\">\n  <rect x=\"26\" y=\"14\" width=\"168\" height=\"142\" rx=\"10\" fill=\"#f4f6f8\"/><rect x=\"26\" y=\"14\" width=\"168\" height=\"18\" rx=\"10\" fill=\"#dfe5ea\"/>\n  <g fill=\"#cbd5e1\"><circle cx=\"50\" cy=\"52\" r=\"10\"/><circle cx=\"80\" cy=\"52\" r=\"10\"/><circle cx=\"110\" cy=\"52\" r=\"10\"/><circle cx=\"140\" cy=\"52\" r=\"10\"/><circle cx=\"170\" cy=\"52\" r=\"10\"/>\n  <rect x=\"40\" y=\"76\" width=\"140\" height=\"5\" rx=\"2\"/><rect x=\"40\" y=\"88\" width=\"120\" height=\"5\" rx=\"2\"/><rect x=\"40\" y=\"124\" width=\"130\" height=\"5\" rx=\"2\"/><rect x=\"40\" y=\"136\" width=\"96\" height=\"5\" rx=\"2\"/></g>\n  <rect x=\"36\" y=\"100\" width=\"148\" height=\"16\" rx=\"4\" fill=\"#fff3c4\"/><text x=\"44\" y=\"111.5\" font-size=\"9\" font-family=\"IBM Plex Sans, sans-serif\" fill=\"#1d2733\">Special thanks also to Arjun Bhadra</text></svg>",
"router": "<svg viewBox=\"0 0 220 170\" class=\"illu\" role=\"img\" aria-label=\"Illustration of a model router sending requests to Azure OpenAI or to a customer-hosted model.\">\n  <rect x=\"14\" y=\"68\" width=\"56\" height=\"34\" rx=\"8\" fill=\"rgba(155,232,255,.08)\" stroke=\"#9be8ff\"/><text x=\"42\" y=\"89\" text-anchor=\"middle\" font-size=\"10\" font-family=\"IBM Plex Sans, sans-serif\" fill=\"#e4f1f6\">Router</text>\n  <path d=\"M70 85c22 0 22-40 44-40M70 85c22 0 22 40 44 40\" fill=\"none\" stroke=\"#ffb27a\" stroke-width=\"2\"/>\n  <rect x=\"114\" y=\"28\" width=\"94\" height=\"32\" rx=\"8\" fill=\"rgba(255,178,122,.1)\" stroke=\"#ffb27a\"/><text x=\"161\" y=\"48\" text-anchor=\"middle\" font-size=\"10\" font-family=\"IBM Plex Sans, sans-serif\" fill=\"#e4f1f6\">Azure OpenAI</text>\n  <rect x=\"114\" y=\"110\" width=\"94\" height=\"32\" rx=\"8\" fill=\"rgba(255,178,122,.1)\" stroke=\"#ffb27a\"/><text x=\"161\" y=\"124\" text-anchor=\"middle\" font-size=\"9\" font-family=\"IBM Plex Sans, sans-serif\" fill=\"#e4f1f6\">Customer-hosted</text><text x=\"161\" y=\"136\" text-anchor=\"middle\" font-size=\"9\" font-family=\"IBM Plex Sans, sans-serif\" fill=\"#e4f1f6\">model</text></svg>",
"plugin": "<svg viewBox=\"0 0 220 170\" class=\"illu\" role=\"img\" aria-label=\"Illustration of a plugin-based core with analytics, media, identity and consent extensions.\">\n  <rect x=\"78\" y=\"62\" width=\"64\" height=\"46\" rx=\"10\" fill=\"rgba(16,44,58,.95)\" stroke=\"#9be8ff\"/><text x=\"110\" y=\"89\" text-anchor=\"middle\" font-size=\"10\" font-family=\"IBM Plex Sans, sans-serif\" fill=\"#e4f1f6\">Core</text>\n  <g font-size=\"9\" font-family=\"IBM Plex Sans, sans-serif\" fill=\"#e4f1f6\" text-anchor=\"middle\">\n  <rect x=\"10\" y=\"22\" width=\"62\" height=\"24\" rx=\"6\" fill=\"rgba(155,232,255,.06)\" stroke=\"#9be8ff\"/><text x=\"41\" y=\"37\">Analytics</text>\n  <rect x=\"148\" y=\"22\" width=\"62\" height=\"24\" rx=\"6\" fill=\"rgba(155,232,255,.06)\" stroke=\"#ffb27a\"/><text x=\"179\" y=\"37\">Media</text>\n  <rect x=\"10\" y=\"124\" width=\"62\" height=\"24\" rx=\"6\" fill=\"rgba(155,232,255,.06)\" stroke=\"#c4b5fd\"/><text x=\"41\" y=\"139\">Identity</text>\n  <rect x=\"148\" y=\"124\" width=\"62\" height=\"24\" rx=\"6\" fill=\"rgba(155,232,255,.06)\" stroke=\"#86efac\"/><text x=\"179\" y=\"139\">Consent</text></g>\n  <path d=\"M72 40l12 22M148 40l-12 22M72 130l12-22M148 130l-12-22\" stroke=\"rgba(155,232,255,.4)\" stroke-dasharray=\"3 3\"/></svg>",
"nb": "<svg viewBox=\"0 0 220 170\" class=\"illu\" role=\"img\" aria-label=\"Illustration of sample posts classified as positive, neutral or negative.\">\n  <g font-family=\"IBM Plex Sans, sans-serif\" font-size=\"10\">\n  <text x=\"22\" y=\"40\" fill=\"#e4f1f6\">Positive</text><rect x=\"90\" y=\"31\" width=\"100\" height=\"12\" rx=\"6\" fill=\"rgba(155,232,255,.12)\"/><rect x=\"90\" y=\"31\" width=\"64\" height=\"12\" rx=\"6\" fill=\"#86efac\"/>\n  <text x=\"22\" y=\"74\" fill=\"#e4f1f6\">Neutral</text><rect x=\"90\" y=\"65\" width=\"100\" height=\"12\" rx=\"6\" fill=\"rgba(155,232,255,.12)\"/><rect x=\"90\" y=\"65\" width=\"38\" height=\"12\" rx=\"6\" fill=\"#9db3bf\"/>\n  <text x=\"22\" y=\"108\" fill=\"#e4f1f6\">Negative</text><rect x=\"90\" y=\"99\" width=\"100\" height=\"12\" rx=\"6\" fill=\"rgba(155,232,255,.12)\"/><rect x=\"90\" y=\"99\" width=\"30\" height=\"12\" rx=\"6\" fill=\"#fca5a5\"/>\n  <text x=\"110\" y=\"146\" text-anchor=\"middle\" fill=\"#9db3bf\">Sample split for one hashtag</text></g></svg>",
"context": "<svg viewBox=\"0 0 220 170\" class=\"illu\" role=\"img\" aria-label=\"Illustration of brand, product and audience context feeding generation.\">\n  <g font-family=\"IBM Plex Sans, sans-serif\" font-size=\"10\" fill=\"#e4f1f6\" text-anchor=\"middle\">\n  <rect x=\"14\" y=\"24\" width=\"70\" height=\"26\" rx=\"13\" fill=\"rgba(155,232,255,.08)\" stroke=\"#9be8ff\"/><text x=\"49\" y=\"41\">Brand</text>\n  <rect x=\"14\" y=\"72\" width=\"70\" height=\"26\" rx=\"13\" fill=\"rgba(155,232,255,.08)\" stroke=\"#9be8ff\"/><text x=\"49\" y=\"89\">Product</text>\n  <rect x=\"14\" y=\"120\" width=\"70\" height=\"26\" rx=\"13\" fill=\"rgba(155,232,255,.08)\" stroke=\"#9be8ff\"/><text x=\"49\" y=\"137\">Audience</text>\n  <rect x=\"128\" y=\"58\" width=\"80\" height=\"54\" rx=\"10\" fill=\"rgba(16,44,58,.95)\" stroke=\"#9be8ff\"/><text x=\"168\" y=\"82\">Generation</text><text x=\"168\" y=\"97\" font-size=\"9\" fill=\"#9db3bf\">multi-step</text></g>\n  <path d=\"M84 37c24 0 20 38 44 44M84 85h44M84 133c24 0 20-38 44-44\" fill=\"none\" stroke=\"rgba(155,232,255,.5)\"/></svg>",
"compare": "<svg viewBox=\"0 0 220 170\" class=\"illu\" role=\"img\" aria-label=\"Illustration of two model outputs side by side for the same prompt.\">\n  <rect x=\"14\" y=\"16\" width=\"192\" height=\"24\" rx=\"8\" fill=\"rgba(155,232,255,.06)\" stroke=\"rgba(155,232,255,.35)\"/><rect x=\"24\" y=\"25\" width=\"120\" height=\"6\" rx=\"3\" fill=\"#e4f1f6\" opacity=\".7\"/>\n  <rect x=\"14\" y=\"52\" width=\"92\" height=\"104\" rx=\"8\" fill=\"rgba(155,232,255,.04)\" stroke=\"#9be8ff\"/><rect x=\"114\" y=\"52\" width=\"92\" height=\"104\" rx=\"8\" fill=\"rgba(155,232,255,.04)\" stroke=\"#ffb27a\"/>\n  <g fill=\"rgba(228,241,246,.5)\"><rect x=\"24\" y=\"66\" width=\"70\" height=\"5\" rx=\"2\"/><rect x=\"24\" y=\"78\" width=\"60\" height=\"5\" rx=\"2\"/><rect x=\"24\" y=\"90\" width=\"66\" height=\"5\" rx=\"2\"/><rect x=\"24\" y=\"102\" width=\"40\" height=\"5\" rx=\"2\"/>\n  <rect x=\"124\" y=\"66\" width=\"70\" height=\"5\" rx=\"2\"/><rect x=\"124\" y=\"78\" width=\"50\" height=\"5\" rx=\"2\"/></g></svg>",
"loadtest": "<svg viewBox=\"0 0 220 170\" class=\"illu\" role=\"img\" aria-label=\"Illustration of a load-test chart with sample data.\">\n  <path d=\"M14 140H206M14 20V140\" stroke=\"rgba(155,232,255,.25)\"/><path d=\"M14 120 L34 104 L54 110 L74 84 L94 90 L114 66 L134 72 L154 52 L174 58 L194 40 L206 44\" fill=\"none\" stroke=\"#9be8ff\" stroke-width=\"2\"/>\n  <path d=\"M14 120 L34 104 L54 110 L74 84 L94 90 L114 66 L134 72 L154 52 L174 58 L194 40 L206 44 V140 H14Z\" fill=\"rgba(155,232,255,.08)\"/>\n  <text x=\"206\" y=\"158\" text-anchor=\"end\" font-size=\"9\" font-family=\"IBM Plex Sans, sans-serif\" fill=\"#9db3bf\">Sample data</text></svg>",
"scan": "<svg viewBox=\"0 0 220 170\" class=\"illu\" role=\"img\" aria-label=\"Illustration of a phone camera framing a printed letter card.\">\n  <rect x=\"58\" y=\"96\" width=\"104\" height=\"58\" rx=\"4\" fill=\"#f8fafc\" transform=\"skewX(-12) translate(18 0)\"/><text x=\"122\" y=\"138\" text-anchor=\"middle\" font-size=\"36\" font-family=\"Georgia, serif\" fill=\"#2563eb\">A</text>\n  <path d=\"M66 86v-14h14M154 72h14v14M168 150v14h-14M80 164H66v-14\" stroke=\"#9be8ff\" stroke-width=\"2.4\" fill=\"none\"/>\n  <rect x=\"80\" y=\"12\" width=\"60\" height=\"40\" rx=\"8\" fill=\"#0b141c\" stroke=\"rgba(155,232,255,.45)\"/><circle cx=\"110\" cy=\"32\" r=\"9\" fill=\"none\" stroke=\"#9be8ff\" stroke-width=\"2\"/></svg>",
"team": "<svg viewBox=\"0 0 220 170\" class=\"illu\" aria-hidden=\"true\"><g fill=\"none\" stroke-width=\"2\">\n  <circle cx=\"70\" cy=\"70\" r=\"20\" stroke=\"#9be8ff\"/><path d=\"M40 130c4-20 16-30 30-30s26 10 30 30\" stroke=\"#9be8ff\"/>\n  <circle cx=\"150\" cy=\"70\" r=\"20\" stroke=\"#ffb27a\"/><path d=\"M120 130c4-20 16-30 30-30s26 10 30 30\" stroke=\"#ffb27a\"/>\n  <path d=\"M100 70h20\" stroke=\"rgba(155,232,255,.5)\" stroke-dasharray=\"3 4\"/></g></svg>"
},
"filters": [
[
"all",
"All"
],
[
"mobile",
"Mobile"
],
[
"web",
"Web"
],
[
"data",
"Data"
],
[
"games",
"Games"
],
[
"ai",
"AI / Research"
]
]
};
