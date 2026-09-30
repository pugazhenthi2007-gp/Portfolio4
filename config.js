/* ==========================================================
   SITE CONFIG  -  edit this file only to update your details
   ========================================================== */
window.SITE_CONFIG = {
  name: "Pugazhenthi G",

  /* Replace with your real details */
  email: "YOUR_EMAIL@example.com",
  whatsappNumber: "YOUR_NUMBER", // country code + number, digits only. Example: 919876543210
  whatsappMessage: "Hi Pugazhenthi, I saw your portfolio and I'd like to discuss a project.",

  github: "https://github.com/pugazhenthi2007-gp",
  linkedin: "https://www.linkedin.com/in/pugazhenthi-g/",

  /* Optional: paste a Formspree / Getform URL here later so the form
     sends without opening an email app. Leave empty to use mailto. */
  formEndpoint: "",

  /* Projects. Set github / demo to a real URL when available.
     Leave as "" and the button shows as a clearly marked placeholder.
     Replace `image` with a real screenshot (png / webp / jpg). */
  projects: [
    {
      id: "code-debugger",
      name: "AI Code Debugger & Explainer",
      description: "An AI-powered developer tool that analyzes code, identifies potential issues and explains errors in beginner-friendly language.",
      problem: "Error messages are hard to read for beginners, so they lose time guessing what went wrong.",
      tech: ["Python", "FastAPI", "LLM APIs", "React"],
      image: "code-debugger.svg",
      github: "",
      demo: ""
    },
    {
      id: "fraudguard",
      name: "FraudGuard AI",
      description: "An AI-powered cyber fraud detection platform designed to analyze suspicious activity and help users identify potential online fraud.",
      problem: "Everyday users find it hard to tell whether a message, link or activity is a scam.",
      tech: ["Python", "FastAPI", "Generative AI", "SQLite"],
      image: "fraudguard.svg",
      github: "",
      demo: ""
    },
    {
      id: "kidsai",
      name: "KidsAI Studio",
      description: "An AI-powered children's content creation platform for generating educational stories, animations and short-form content.",
      problem: "Creating safe, educational content for children takes a lot of time and creative effort.",
      tech: ["React", "Vite", "Tailwind CSS", "Generative AI"],
      image: "kidsai.svg",
      github: "",
      demo: ""
    },
    {
      id: "threat-intel",
      name: "AI Cyber Threat Intelligence Platform",
      description: "An AI-focused cybersecurity platform concept for analyzing cyber threats and presenting actionable intelligence.",
      problem: "Threat data is scattered and technical, which makes it hard to see what needs attention first.",
      tech: ["Python", "AI Automation", "REST APIs"],
      image: "threat-intel.svg",
      github: "",
      demo: ""
    }
  ]
};
