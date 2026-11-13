/* ============================================
   Portfolio JS — Avinash Sahu
   Smooth scroll, sticky nav, hamburger,
   dark/light toggle, counters, filter, reveal
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Theme Toggle ---
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;
  const saved = localStorage.getItem('theme');
  if (saved) html.setAttribute('data-theme', saved);

  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });

  // --- Navbar scroll effect ---
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });

  // --- Hamburger Menu ---
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('open');
  });

  // Close menu on link click
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('open');
    });
  });

  // --- Active nav link on scroll ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveLink() {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }
  window.addEventListener('scroll', updateActiveLink);

  // --- Counter Animation ---
  const counters = document.querySelectorAll('.stat-num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = 'true';
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'));
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.floor(eased * target).toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target.toLocaleString() + suffix;
    }
    requestAnimationFrame(update);
  }

  // --- Scroll Reveal Animation ---
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  reveals.forEach(el => revealObserver.observe(el));

  // --- Project Filter ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cat = card.getAttribute('data-cat');
        if (filter === 'all' || cat === filter) {
          card.style.display = '';
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          requestAnimationFrame(() => {
            card.style.transition = 'all .4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // --- Smooth scroll for all anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // =============================================
  // AI CHATBOT — Avinash's Capability Assistant
  // =============================================
  const chatFab = document.getElementById('chatbotFab');
  const chatWindow = document.getElementById('chatbotWindow');
  const chatClose = document.getElementById('chatbotClose');
  const chatMessages = document.getElementById('chatbotMessages');
  const chatInput = document.getElementById('chatInput');
  const chatSend = document.getElementById('chatSend');

  // Toggle chatbot window
  chatFab.addEventListener('click', () => {
    chatWindow.classList.toggle('open');
    if (chatWindow.classList.contains('open')) {
      chatInput.focus();
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  });
  chatClose.addEventListener('click', () => chatWindow.classList.remove('open'));

  // Close chatbot when clicking outside
  document.addEventListener('click', (e) => {
    if (!chatWindow.contains(e.target) && !chatFab.contains(e.target)) {
      chatWindow.classList.remove('open');
    }
  });

  // Suggestion buttons
  document.querySelectorAll('.suggestion-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const q = btn.getAttribute('data-q');
      sendUserMessage(q);
    });
  });

  // Send on Enter or button click
  chatSend.addEventListener('click', () => {
    const msg = chatInput.value.trim();
    if (msg) sendUserMessage(msg);
  });
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const msg = chatInput.value.trim();
      if (msg) sendUserMessage(msg);
    }
  });

  function sendUserMessage(text) {
    addMessage(text, 'user');
    chatInput.value = '';
    // Show typing indicator
    const typing = addTyping();
    setTimeout(() => {
      typing.remove();
      const reply = generateReply(text);
      addMessage(reply, 'bot');
    }, 600 + Math.random() * 600);
  }

  function addMessage(text, sender) {
    const div = document.createElement('div');
    div.className = `chat-msg ${sender}`;
    div.innerHTML = `<div class="chat-bubble">${text}</div>`;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return div;
  }

  function addTyping() {
    const div = document.createElement('div');
    div.className = 'chat-msg bot';
    div.innerHTML = `<div class="chat-bubble"><div class="typing-dots"><span></span><span></span><span></span></div></div>`;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return div;
  }

  // --- Knowledge Base ---
  const KB = {
    name: "Avinash Sahu",
    title: "Microsoft 365, Cloud, Network & DevOps Engineer",
    company: "Trinesis Technologies",
    experience: "3+ years",
    email: "avinashsahu7415@gmail.com",
    linkedin: "https://www.linkedin.com/in/avinash-sahu-0ba434181/",
    github: "https://github.com/1998avinashsahu",
    portfolio: "https://1998avinashsahu.github.io/portfolio/",

    skills: {
      m365: ["Exchange Online (mailbox conversion, delegation, forwarding and mail-flow control)", "Entra ID (users, groups, admin roles, MFA, break-glass accounts)", "Intune for Windows and iOS (compliance, BitLocker, Autopilot, Apple APNs)", "Defender, firewall and Edge policies", "SPF, DKIM and DMARC email security", "Licence management and security incident response", "PowerShell with Microsoft Graph and Exchange Online modules"],
      network: ["AWS VPC, subnets, route tables, NAT Gateway, VPC Peering", "Security Groups and NACLs", "Cloud-to-on-premise VPN", "DNS and Route 53, ALB/NLB, CloudFront, AWS WAF", "TLS 1.2/1.3 and mutual TLS", "Wireshark and tcpdump troubleshooting", "Working knowledge (lab level): FortiGate, OSPF/BGP, VLANs, SD-WAN concepts, Hyper-V"],
      cloud: ["AWS (ECS Fargate, Lambda, RDS, S3, CloudWatch)", "GCP (Cloud Run, Cloud SQL, Secret Manager)", "Azure (AKS, ACR, Key Vault)"],
      iac: ["Terraform (9,000+ lines production)", "Docker", "Kubernetes", "Helm", "Ansible"],
      cicd: ["Jenkins (Multibranch, Seed Jobs)", "GitHub Actions", "ArgoCD (GitOps)", "AWS CodeDeploy", "Azure DevOps"],
      monitoring: ["Prometheus", "Grafana", "CloudWatch", "Alertmanager"],
      security: ["FedRAMP/FIPS compliance", "Zero-trust architecture", "IAM/RBAC", "SSL/TLS hardening"],
      ai: ["Claude API", "AI Agents", "Prompt Engineering", "n8n Automation", "LLM Integration"],
      languages: ["Python", "Bash", "HCL (Terraform)", "Groovy (Jenkins)", "YAML"],
      databases: ["PostgreSQL", "Redis", "InfluxDB"]
    },

    highlights: [
      "126 Microsoft 365 tenant changes with zero incidents and zero mail lost",
      "Built Intune from scratch for Windows and iOS devices (BitLocker, Autopilot, APNs)",
      "Designed VPC/VNet networks on AWS, Azure and GCP, including an air-gapped VPC for FedRAMP",
      "Managing 6 concurrent projects across AWS, GCP, and Azure for international clients",
      "Deployed 45+ microservices with 50+ CI/CD pipelines",
      "Wrote 9,000+ lines of production Terraform",
      "Achieved 40% cloud cost optimization",
      "Zero compliance violations across 30+ microservices (FedRAMP/FIPS)",
      "Built AI-powered DevOps agent for automated infrastructure audit",
      "590+ commits as top contributor"
    ],

    projects: [
      { name: "terraform-aws-ecs-microservices", desc: "Production AWS ECS Fargate infra — multi-env, auto-scaling, RDS Aurora, FedRAMP-ready" },
      { name: "terraform-gcp-cloud-run", desc: "GCP Cloud Run with zero-trust IAM auth, Cloud SQL, Secret Manager" },
      { name: "terraform-azure-aks", desc: "Azure AKS with Helm, auto-scaling, ACR, Key Vault, RBAC" },
      { name: "ai-devops-agent", desc: "AI-powered DevOps agent using Claude API — infra audit, cost optimization, log analysis" },
      { name: "jenkins-cicd-pipelines", desc: "Production Jenkins patterns — Multibranch, Seed Jobs, Quality Gates" },
      { name: "docker-compose-microservices", desc: "Multi-service stack — Nginx, FastAPI, PostgreSQL, Redis, InfluxDB" },
      { name: "gitops-argocd-kubernetes", desc: "GitOps with ArgoCD — App-of-Apps, Kustomize overlays" },
      { name: "aws-lambda-automation", desc: "Lambda suite — ECR cleanup, EBS snapshots, cost reports, security audit" }
    ],

    certifications: [
      "Anthropic Academy — AI Fluency: Framework & Foundations",
      "Anthropic Academy — Building with the Claude API",
      "Google AI Essentials Certificate",
      "Microsoft + LinkedIn — Generative AI Essentials",
      "Preparing for AWS Solutions Architect Associate"
    ],

    whyHire: [
      "Microsoft 365 and network skills on top of DevOps: Exchange Online, Entra ID, Intune, email security and cloud networking",
      "Multi-cloud expertise: production experience across AWS, GCP, and Azure — not just one cloud",
      "Security-first mindset: FedRAMP/FIPS compliance with zero violations",
      "Cost optimizer: proven 40% cloud cost reduction through right-sizing and serverless",
      "AI + DevOps pioneer: building intelligent automation agents — the future of infrastructure management",
      "Scale-proven: 45+ microservices, 50+ pipelines, 6 concurrent projects",
      "Continuous learner: actively pursuing AI certifications and AWS SA certification"
    ]
  };

  function ctaLinks() {
    var S = window.SITE || {};
    var out = S.bookingUrl
      ? `<a href="${S.bookingUrl}" target="_blank" rel="noopener" style="color:var(--accent)">Book a free 20-min call</a>`
      : `<a href="mailto:${S.email || KB.email}?subject=Free%2020-minute%20call%20request" style="color:var(--accent)">Request a free 20-min call</a>`;
    if (S.whatsapp) out += ` or <a href="https://wa.me/${S.whatsapp}" target="_blank" rel="noopener" style="color:var(--accent)">message on WhatsApp</a>`;
    return out;
  }

  // --- Intent Matching ---
  function generateReply(input) {
    const q = input.toLowerCase();

    // Greetings
    if (/^(hi|hello|hey|namaste|howdy|sup|yo)\b/.test(q)) {
      return `Hello! I answer common questions about ${KB.name}'s <b>services</b>, <b>results</b>, <b>how he works</b>, <b>availability</b> and <b>pricing</b>. What would you like to know?`;
    }

    // --- Client questions (checked first) ---
    if (/guide|checklist|resource|blog|article|sample report|how to set up|template|free/.test(q)) {
      return `<b>Free guides & resources:</b><br><br>` +
        `• <a href="blog/dkim-dmarc-microsoft-365.html" style="color:var(--accent)">SPF, DKIM and DMARC in Microsoft 365</a><br>` +
        `• <a href="blog/intune-bitlocker-recovery-keys-missing.html" style="color:var(--accent)">Why Intune BitLocker keys go missing</a><br>` +
        `• <a href="resources/m365-security-health-check.html" style="color:var(--accent)">Security health check (15 checks, PDF)</a><br>` +
        `• <a href="resources/sample-work-report.html" style="color:var(--accent)">Sample project report</a>`;
    }
    if (/availab|when can|how soon|get started|how (do|to) (we |i )?start|start a project|onboard|what do you need|capacity/.test(q)) {
      return `<b>Availability & getting started:</b><br><br>` +
        `• Avinash is <b>open to new projects</b><br>` +
        `• Send two or three lines about the problem<br>` +
        `• He replies with questions or a clear next step<br>` +
        `• To start he needs: a short description, a contact who can approve changes, and an admin invite<br><br>` +
        ctaLinks();
    }
    if (/pric(e|ing)|how much|quote|hourly|per hour|budget|rate card|\brates?\b|retainer|fixed[- ]scope|what do you charge/.test(q)) {
      return `<b>Pricing:</b><br><br>` +
        `There is no fixed price list because the scope decides the cost. Avinash works in three ways:<br>` +
        `• <b>Hourly support</b> with a short written summary of work and hours<br>` +
        `• <b>Fixed-scope project</b> with a quote after a read-only audit<br>` +
        `• <b>Ongoing care</b> with monthly reports and support<br><br>` +
        ctaLinks() + `<br>He will suggest the best fit.`;
    }
    if (/service|offer|what (do|can) you (do|help)|can you help|help (me|us)|what do you do/.test(q)) {
      return `<b>Services:</b><br><br>` +
        `• <b>Microsoft 365 administration & security:</b> Exchange Online, Entra ID, licences, MFA, SPF/DKIM/DMARC, phishing clean-up<br>` +
        `• <b>Intune & endpoint management:</b> Windows and iOS, BitLocker, Autopilot, compliance policies<br>` +
        `• <b>Cloud & network engineering:</b> VPC/VNet, VPN, NAT, DNS, TLS on AWS, Azure and GCP<br>` +
        `• <b>DevOps & automation:</b> Terraform, CI/CD pipelines, Docker, Kubernetes, PowerShell<br><br>` +
        `See details in <a href="#services" style="color:var(--accent)">Services</a>.`;
    }
    if (/case stud|results?\b|proof|success|past work|client work|references?|track record/.test(q)) {
      return `<b>Selected results (client names are private):</b><br><br>` +
        `• Microsoft 365 tenant: <b>126 changes, 0 incidents, 0 mail lost</b>, 12 licences recovered<br>` +
        `• Intune: <b>7 devices</b> (Windows and iOS) managed from scratch<br>` +
        `• Phishing clean-up: <b>12 apps removed, 49 reviewed, 371 audit records checked</b><br>` +
        `• FedRAMP AWS platform: <b>40% cost cut, 0 compliance violations</b><br>` +
        `• GCP fintech: <b>zero-downtime</b> PostgreSQL upgrade, <b>30% cost cut</b><br><br>` +
        `Full write-ups are in <a href="#case-studies" style="color:var(--accent)">Case Studies</a>.`;
    }
    if (/how (do|does) (you|he) work|how.*(work|process)|process|workflow|safe|rollback|approval|risk|change control|access to (our|my)|my systems|passwords?/.test(q) && !/skill|tech stack|experience|why/.test(q)) {
      return `<b>How Avinash works:</b><br><br>` +
        `1. <b>Read-only audit</b>: he reviews your setup without changing anything<br>` +
        `2. <b>Written approval</b>: nothing changes without your OK<br>` +
        `3. <b>Careful changes</b>: dry run first, log after, rollback path for each change<br>` +
        `4. <b>Evidence & handover</b>: change log, runbooks and short reports with hours<br><br>` +
        `He uses an admin account you invite, with only the roles needed, never asks for your passwords, and removes his access when the work ends.`;
    }
    if (/time ?zone|working hours|overlap|central time|\bcst\b|\best\b|\bpst\b/.test(q)) {
      return `<b>Time zone:</b><br><br>` +
        `Avinash works from India and adjusts to your time zone. For clients in the Americas he overlaps with <b>their morning hours</b>. Most work is done on his own time, with a short written update at the end of each day.`;
    }

    // Microsoft 365 / network
    if (/microsoft|m365|365|intune|exchange|entra|office|dkim|dmarc|spf|email security/.test(q)) {
      return `<b>Microsoft 365 & Email Security:</b><br>` + KB.skills.m365.map(s => `• ${s}`).join('<br>');
    }
    if (/network|vpn|firewall|fortigate|dns|routing|subnet|vpc/.test(q)) {
      return `<b>Network Engineering:</b><br>` + KB.skills.network.map(s => `• ${s}`).join('<br>');
    }

    // Skills
    if (/skill|tech|stack|tool|what (can|does) he (do|know|use)|expertise|proficien/.test(q)) {
      if (/cloud/.test(q)) return `<b>Cloud Platforms:</b><br>` + KB.skills.cloud.map(s => `• ${s}`).join('<br>');
      if (/terraform|iac|infrastructure as code/.test(q)) return `<b>IaC & Containers:</b><br>` + KB.skills.iac.map(s => `• ${s}`).join('<br>');
      if (/ci|cd|pipeline|jenkins|github action|deploy/.test(q)) return `<b>CI/CD & Automation:</b><br>` + KB.skills.cicd.map(s => `• ${s}`).join('<br>');
      if (/monitor|grafana|prometheus/.test(q)) return `<b>Monitoring:</b><br>` + KB.skills.monitoring.map(s => `• ${s}`).join('<br>');
      if (/secur|compliance|fedramp|fips/.test(q)) return `<b>Security & Compliance:</b><br>` + KB.skills.security.map(s => `• ${s}`).join('<br>');
      if (/ai|ml|machine learn|agent|llm|claude|prompt/.test(q)) return `<b>AI & Automation:</b><br>` + KB.skills.ai.map(s => `• ${s}`).join('<br>');
      if (/python|bash|language|coding|program/.test(q)) return `<b>Languages:</b><br>` + KB.skills.languages.map(s => `• ${s}`).join('<br>') + `<br><br><b>Databases:</b><br>` + KB.skills.databases.map(s => `• ${s}`).join('<br>');

      return `<b>${KB.name}'s Tech Stack:</b><br><br>` +
        `<b>Microsoft 365:</b> Exchange Online, Entra ID, Intune, Defender<br>` +
        `<b>Network:</b> VPC/VNet, VPN, DNS, TLS<br>` +
        `<b>Cloud:</b> AWS, GCP, Azure<br>` +
        `<b>IaC:</b> Terraform (9K+ lines), Docker, K8s, Helm<br>` +
        `<b>CI/CD:</b> Jenkins, GitHub Actions, ArgoCD, CodeDeploy<br>` +
        `<b>Monitoring:</b> Prometheus, Grafana, CloudWatch<br>` +
        `<b>Security:</b> FedRAMP/FIPS, Zero-trust, IAM<br>` +
        `<b>AI:</b> Claude API, AI Agents, Prompt Engineering<br>` +
        `<b>Languages:</b> Python, Bash, HCL, Groovy<br><br>` +
        `Ask about any specific area for details!`;
    }

    // Experience
    if (/experience|work|career|job|role|company|trinesis|history|background/.test(q)) {
      return `<b>${KB.name} — ${KB.title}</b><br>` +
        `<b>Company:</b> ${KB.company}<br>` +
        `<b>Experience:</b> ${KB.experience}<br><br>` +
        `<b>Key Achievements:</b><br>` +
        KB.highlights.map(h => `• ${h}`).join('<br>') +
        `<br><br>He manages production multi-cloud infrastructure for international clients across AWS, GCP & Azure.`;
    }

    // Projects
    if (/project|repo|portfolio|built|github|open.?source|work sample/.test(q)) {
      return `<b>Featured Projects (20+ repos):</b><br><br>` +
        KB.projects.map(p => `<b>${p.name}</b><br>${p.desc}`).join('<br><br>') +
        `<br><br><a href="${KB.github}" target="_blank" style="color:var(--accent)">View all on GitHub →</a>`;
    }

    // Certifications
    if (/cert|certification|course|training|learn|study|qualif/.test(q)) {
      return `<b>Certifications & Training (2026):</b><br><br>` +
        KB.certifications.map(c => `• ${c}`).join('<br>') +
        `<br><br>He's actively investing in AI + Cloud certifications to stay at the cutting edge.`;
    }

    // Why hire
    if (/why.*(hire|choose|pick|best|good|right)|what makes|stand.?out|unique|differ|advantage/.test(q)) {
      return `<b>Why Hire ${KB.name}?</b><br><br>` +
        KB.whyHire.map(r => `• ${r}`).join('<br>') +
        `<br><br>In short: multi-cloud expertise + security-first + cost optimizer + AI-forward thinking.`;
    }

    // Contact
    if (/contact|reach|email|phone|connect|talk|message|hire|avail/.test(q)) {
      return `<b>Get in Touch:</b><br><br>` +
        `📧 <b>Email:</b> <a href="mailto:${KB.email}" style="color:var(--accent)">${KB.email}</a><br>` +
        `💼 <b>LinkedIn:</b> <a href="${KB.linkedin}" target="_blank" style="color:var(--accent)">Connect on LinkedIn</a><br>` +
        `💻 <b>GitHub:</b> <a href="${KB.github}" target="_blank" style="color:var(--accent)">1998avinashsahu</a><br><br>` +
        `He's currently <b>open to opportunities</b> in Microsoft 365, Network, Cloud Engineering, DevOps, and AI-related roles!`;
    }

    // AWS specific
    if (/\baws\b/.test(q)) {
      return `<b>AWS Expertise:</b><br><br>` +
        `• ECS Fargate — deployed 45+ microservices<br>` +
        `• Lambda — ECR cleanup, EBS snapshots, cost automation<br>` +
        `• RDS Aurora — production database management<br>` +
        `• S3, CloudFront, Route53 — static hosting & CDN<br>` +
        `• CloudWatch — monitoring & alerting<br>` +
        `• FedRAMP/FIPS compliance — zero violations<br>` +
        `• CodeDeploy + CodeBuild — CI/CD pipelines<br>` +
        `• Preparing for <b>AWS Solutions Architect Associate</b> certification`;
    }

    // Terraform
    if (/terraform/.test(q)) {
      return `<b>Terraform Expertise:</b><br><br>` +
        `• 9,000+ lines of production Terraform<br>` +
        `• Multi-cloud modules: AWS, GCP, Azure<br>` +
        `• Reusable module library (VPC, ECS, RDS, S3, SG)<br>` +
        `• State management with S3/GCS backends<br>` +
        `• Terragrunt for DRY configs<br><br>` +
        `<b>Open-source repos:</b><br>` +
        `• terraform-aws-ecs-microservices<br>` +
        `• terraform-gcp-cloud-run<br>` +
        `• terraform-azure-aks<br>` +
        `• terraform-modules-library`;
    }

    // Kubernetes / Docker
    if (/kubernetes|k8s|docker|container|helm/.test(q)) {
      return `<b>Containers & Orchestration:</b><br><br>` +
        `• Docker Compose multi-service stacks (Nginx, FastAPI, PostgreSQL, Redis)<br>` +
        `• Kubernetes — HPA, PDB, NetworkPolicy, RBAC, monitoring<br>` +
        `• Helm charts for standardized deployments<br>` +
        `• AKS (Azure) and ECS Fargate (AWS) in production<br>` +
        `• ArgoCD for GitOps-based deployment<br>` +
        `• Image scanning and security hardening`;
    }

    // AI specific
    if (/\bai\b|artificial|intelligent|agent|claude|llm|automat/.test(q)) {
      return `<b>AI + DevOps Capabilities:</b><br><br>` +
        `• Built an <b>AI DevOps Agent</b> using Claude API<br>` +
        `• Automated infrastructure auditing with natural language<br>` +
        `• Terraform code review powered by AI<br>` +
        `• Log analysis and anomaly detection<br>` +
        `• Cost optimization recommendations via AI<br>` +
        `• Certified in Anthropic AI Fluency & Claude API<br>` +
        `• Proficient in prompt engineering for DevOps workflows<br><br>` +
        `He believes <b>AI + DevOps</b> is the future of infrastructure management.`;
    }

    // Location / availability
    if (/where|location|city|country|remote|onsite|relocat/.test(q)) {
      return `<b>Location & Availability:</b><br><br>` +
        `• Based in India<br>` +
        `• Currently working remotely with clients abroad<br>` +
        `• Comfortable working across time zones<br>` +
        `• Open to remote and hybrid opportunities`;
    }

    // Salary / rate (deflect politely)
    if (/salary|pay|rate|compensation|cost|charge|price/.test(q)) {
      return `Compensation is best discussed directly with Avinash based on the role scope and requirements.<br><br>` +
        `📧 Reach out: <a href="mailto:${KB.email}" style="color:var(--accent)">${KB.email}</a><br>` +
        `💼 Or connect on <a href="${KB.linkedin}" target="_blank" style="color:var(--accent)">LinkedIn</a>`;
    }

    // Resume
    if (/resume|cv|download/.test(q)) {
      return `You can download Avinash's resume here:<br><br>` +
        `<a href="https://1998avinashsahu.github.io/portfolio/assets/Avinash_Sahu_Resume.pdf" target="_blank" style="color:var(--accent)">📄 Download Resume (PDF)</a>`;
    }

    // Thank you
    if (/thank|thanks|thx|appreciate/.test(q)) {
      return `You're welcome! If you have more questions about Avinash, feel free to ask. You can also <a href="${KB.linkedin}" target="_blank" style="color:var(--accent)">connect with him on LinkedIn</a>!`;
    }

    // Default fallback
    return `I'm a quick-answer assistant, so I may not have that one. I can help with:<br><br>` +
      `• <b>Services</b> and <b>case studies</b><br>` +
      `• <b>How he works</b> and keeps changes safe<br>` +
      `• <b>Availability</b>, <b>pricing</b> and <b>time zone</b><br>` +
      `• <b>Skills</b>, <b>experience</b> and <b>projects</b><br><br>` +
      `For anything specific, <a href="mailto:avinashsahu7415@gmail.com?subject=Project%20enquiry%20from%20your%20portfolio" style="color:var(--accent)">email Avinash</a> and he replies personally.`;
  }

});


// --- Scroll progress bar + sticky mobile CTA ---
(function () {
  var bar = document.getElementById('scrollProgress');
  var cta = document.getElementById('stickyCta');
  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    if (bar && max > 0) bar.style.width = (h.scrollTop / max * 100) + '%';
    if (cta) {
      var contact = document.getElementById('contact');
      var nearContact = contact && contact.getBoundingClientRect().top < window.innerHeight * 0.8;
      cta.classList.toggle('show', h.scrollTop > 500 && !nearContact);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
