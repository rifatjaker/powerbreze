import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  Activity, ArrowDown, ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight,
  BadgeCheck, Building2, Cable, Check, ChevronRight,
  CircleHelp, ClipboardCheck, Factory, Gauge, Globe2, HardHat, Layers3, Leaf, Ruler,
  LockKeyhole, Mail, MapPin, Menu, MessageCircle, Phone, Plus, Send,
  Settings2, ShieldCheck, Sun, Upload, Wind, X, Zap,
  type LucideIcon,
} from "lucide-react";
import { apiRequest, authToken } from "./api";
import { companyProfile as seedCompany, products as seedProducts, projects as seedProjects, services as seedServices, slides, type CompanyProfile, type Product, type Project, type Service } from "./content";

type Resource = "company" | "services" | "products" | "projects" | "inquiries";
type RecordItem = Record<string, string | number | boolean | null>;

const iconMap: Record<string, LucideIcon> = {
  Zap, Activity, Gauge, Sun, Cable, Factory, Building2, Wind, Layers3, HardHat,
  ShieldCheck, Settings2, Leaf, ClipboardCheck, Ruler,
};

const resourceLabels: Record<Resource, string> = {
  company: "Company & offices",
  services: "Services",
  products: "Products",
  projects: "Projects",
  inquiries: "Inquiries",
};

function Logo({ light = false, companyName = "Power Breeze Engineering" }: { light?: boolean; companyName?: string }) {
  return (
    <a className={`brand-lockup ${light ? "brand-lockup-light" : ""}`} href="/" aria-label={`${companyName} home`}>
      <span className="brand-symbol" aria-hidden="true">
        <svg viewBox="0 0 46 46" role="img">
          <path d="M22.8 3.5 26 12l6.5-4.1-1 8.5 8.8.6-6.7 5.4 4.1 7.7-8.3-2.6-3.1 8.4-3.7-7.9-7.8 4 .9-8.4-8.5-1.6 7.4-4.5-3.2-7.9 8 3z" fill="currentColor" />
          <path d="M22.9 29v11.2" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      </span>
      <span className="brand-name"><strong>{companyName.replace(/\s+Engineering$/i, "").toUpperCase()}</strong><small>ENGINEERING</small></span>
    </a>
  );
}

function SiteHeader({ onAdmin, company }: { onAdmin: () => void; company: CompanyProfile }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = [
    ["Expertise", "#expertise"], ["Products", "#products"], ["Projects", "#projects"],
    ["About us", "#about"], ["Contact", "#contact"],
  ];

  return (
    <>
      <div className="utility-bar">
        <div className="page-shell utility-inner">
          <span className="utility-note"><span className="utility-dot" /> Engineering confidence since 2012</span>
          <div className="utility-right">
            <a href={`mailto:${company.email}`}><Mail size={13} /> {company.email}</a>
            <span className="utility-divider" />
            <span><MapPin size={13} /> Dhaka · Toronto</span>
          </div>
        </div>
      </div>
      <header className="site-header">
        <div className="page-shell nav-inner">
          <Logo companyName={company.company_name} />
          <button className="mobile-menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen}>
            {menuOpen ? <X /> : <Menu />}
          </button>
          <nav className={`main-nav ${menuOpen ? "main-nav-open" : ""}`} aria-label="Main navigation">
            {navItems.map(([label, href]) => (
              <a href={href} key={href} onClick={() => setMenuOpen(false)}>{label}</a>
            ))}
            <button className="nav-cta" onClick={() => { setMenuOpen(false); onAdmin(); }}>
              Admin <ArrowUpRight size={15} />
            </button>
          </nav>
        </div>
      </header>
    </>
  );
}

function Hero({ onInquiry }: { onInquiry: (type?: string) => void }) {
  const [active, setActive] = useState(0);
  const slide = slides[active];

  useEffect(() => {
    const timer = window.setInterval(() => setActive((current) => (current + 1) % slides.length), 7000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="hero" aria-roledescription="carousel" aria-label="Featured engineering capabilities">
      {slides.map((item, index) => (
        <div
          key={item.title}
          className={`hero-image ${index === active ? "hero-image-active" : ""}`}
          style={{ backgroundImage: `url("${item.image}")` }}
          aria-hidden="true"
        />
      ))}
      <div className="hero-grain" />
      <div className="hero-content page-shell">
        <div className="hero-copy" key={slide.title}>
          <div className="hero-kicker"><span className="kicker-line" /> {slide.kicker}</div>
          <h1>{slide.title.split("\n").map((line, index) => <span key={line}>{index === 1 ? <em>{line}</em> : line}<br /></span>)}</h1>
          <p>{slide.body}</p>
          <div className="hero-actions">
            <button className="button button-red" onClick={() => onInquiry("Project / Service")}><span>Discuss a project</span><ArrowUpRight size={17} /></button>
            <a href="#expertise" className="hero-text-link">Explore our expertise <ArrowDownRight size={17} /></a>
          </div>
        </div>
        <div className="hero-side-note"><span>01</span><span className="hero-side-rule" /><span>Powering<br />possibility</span></div>
        <div className="hero-bottom">
          <div className="hero-pagination">
            {slides.map((item, index) => (
              <button key={item.title} onClick={() => setActive(index)} aria-label={`Show slide ${index + 1}: ${item.badge}`} aria-current={index === active}>
                <span className={index === active ? "pagination-active" : ""}>0{index + 1}</span>
                <i className={index === active ? "pagination-line pagination-line-active" : "pagination-line"} />
              </button>
            ))}
          </div>
          <span className="hero-caption"><span className="caption-dot" /> {slide.badge}</span>
        </div>
      </div>
      <a className="scroll-cue" href="#expertise" aria-label="Scroll to our expertise"><ArrowDown size={16} /></a>
    </section>
  );
}

function TrustStrip({ foundedYear }: { foundedYear: number }) {
  const proofPoints = [
    { icon: BadgeCheck, value: `Since ${foundedYear}`, label: "Engineering experience" },
    { icon: ShieldCheck, value: "Full lifecycle", label: "Survey to commissioning" },
    { icon: Globe2, value: "Two offices", label: "Bangladesh & Canada" },
    { icon: HardHat, value: "Public & private", label: "Sector experience" },
  ];
  return (
    <div className="trust-strip">
      <div className="page-shell trust-grid">
        {proofPoints.map(({ icon: Icon, value, label }) => (
          <div className="trust-item" key={value}>
            <span className="trust-icon"><Icon size={19} strokeWidth={1.7} /></span>
            <span><strong>{value}</strong><small>{label}</small></span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionHeading({ eyebrow, title, description, light = false }: { eyebrow: string; title: ReactNode; description?: string; light?: boolean }) {
  return (
    <div className={`section-heading ${light ? "section-heading-light" : ""}`}>
      <span className="eyebrow"><i /> {eyebrow}</span>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}

function Expertise({ items, onInquiry }: { items: Service[]; onInquiry: (type?: string) => void }) {
  return (
    <section className="section expertise-section" id="expertise">
      <div className="page-shell">
        <div className="expertise-top">
          <SectionHeading eyebrow="What we do" title={<>Infrastructure starts<br />with <em>the right expertise.</em></>} description="Practical engineering capability across power, utilities, commercial buildings and industrial projects." />
          <button className="text-button" onClick={() => onInquiry("Project / Service")}>Explore all capabilities <ArrowUpRight size={17} /></button>
        </div>
        <div className="service-grid">
          {items.slice(0, 8).map((service, index) => {
            const Icon = iconMap[service.icon] ?? Zap;
            return (
              <article className="service-card" key={service.id}>
                <div className="service-card-image" style={{ backgroundImage: `url("${service.image}")` }}>
                  <span className="service-index">0{index + 1}</span>
                  <span className="service-image-mark"><Icon size={21} /></span>
                </div>
                <div className="service-card-body">
                  <span className="service-category">{service.category}</span>
                  <h3>{service.title}</h3>
                  <p>{service.summary}</p>
                  <button className="card-link" onClick={() => onInquiry(service.title)} aria-label={`Ask about ${service.title}`}>
                    Discuss this capability <ArrowUpRight size={15} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ProductSection({ items, onInquiry }: { items: Product[]; onInquiry: (type?: string) => void }) {
  const [category, setCategory] = useState("All equipment");
  const categories = useMemo(() => ["All equipment", ...new Set(items.map((item) => item.category))], [items]);
  const filtered = category === "All equipment" ? items : items.filter((item) => item.category === category);

  return (
    <section className="section products-section" id="products">
      <div className="page-shell">
        <div className="products-heading-row">
          <SectionHeading eyebrow="Equipment & supply" title={<>Components that keep<br /><em>systems moving.</em></>} description="A curated equipment catalogue for infrastructure, utility and institutional projects. Specifications and availability confirmed on request." />
          <a className="button button-outline" href="#contact">Request product details <ArrowUpRight size={16} /></a>
        </div>
        <div className="product-filters" role="group" aria-label="Filter products by category">
          {categories.map((item) => (
            <button className={category === item ? "filter-chip filter-chip-active" : "filter-chip"} key={item} onClick={() => setCategory(item)}>{item}</button>
          ))}
        </div>
        <div className="product-grid">
          {filtered.slice(0, 8).map((product, index) => (
            <article className="product-card" key={product.id}>
              <div className="product-image" style={{ backgroundImage: `url("${product.image}")` }}>
                <span className="product-number">PB / 0{index + 1}</span>
                <button aria-label={`Request information about ${product.name}`} onClick={() => onInquiry(product.name)}><ArrowUpRight size={18} /></button>
              </div>
              <div className="product-info">
                <span>{product.category}</span>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <button className="product-ask" onClick={() => onInquiry(product.name)}>Ask about this product <ArrowRight size={14} /></button>
              </div>
            </article>
          ))}
        </div>
        <p className="catalogue-note"><CircleHelp size={15} /> Product specifications and availability are confirmed against each project's requirements.</p>
      </div>
    </section>
  );
}

function Projects({ items, onInquiry }: { items: Project[]; onInquiry: (type?: string) => void }) {
  const lead = items[0];
  const rest = items.slice(1, 4);
  return (
    <section className="section projects-section" id="projects">
      <div className="page-shell">
        <div className="projects-heading-row">
          <SectionHeading eyebrow="Selected experience" title={<>Made real in the<br /><em>field.</em></>} description="A glimpse of the infrastructure work represented in Power Breeze Engineering's project portfolio." />
          <span className="portfolio-stamp"><span>PROJECT<br />PORTFOLIO</span><ArrowUpRight size={20} /></span>
        </div>
        {lead && (
          <div className="featured-project">
            <div className="featured-project-image" style={{ backgroundImage: `url("${lead.image}")` }}>
              <span className="project-image-label"><span /> {lead.location}</span>
            </div>
            <div className="featured-project-copy">
              <div className="project-meta"><span>{lead.year}</span><span>{lead.size}</span></div>
              <h3>{lead.title}</h3>
              <p>{lead.client}</p>
              <div className="project-separator" />
              <span className="project-kicker">Selected project experience</span>
              <button className="button button-dark" onClick={() => onInquiry("Project / Service")}>Talk to our team <ArrowUpRight size={16} /></button>
            </div>
          </div>
        )}
        <div className="project-mini-grid">
          {rest.map((project) => (
            <article className="project-mini" key={project.id}>
              <div className="project-mini-image" style={{ backgroundImage: `url("${project.image}")` }}>
                <span>{project.year} <i /> {project.size}</span>
              </div>
              <div className="project-mini-copy">
                <span>{project.client}</span>
                <h3>{project.title}</h3>
                <small><MapPin size={12} /> {project.location}</small>
              </div>
            </article>
          ))}
        </div>
        <p className="project-disclaimer">Project references are drawn from the existing company portfolio; client names and project details should be reconfirmed before launch.</p>
      </div>
    </section>
  );
}

function CompanySection({ company }: { company: CompanyProfile }) {
  return (
    <section className="company-section" id="about">
      <div className="page-shell company-grid">
        <div className="company-image-wrap">
          <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85" alt="Modern infrastructure and engineering architecture" loading="lazy" />
          <div className="company-image-tag"><span>12+</span><small>Years building<br />powerful partnerships</small></div>
          <span className="company-image-caption">Built with purpose. Engineered to last.</span>
        </div>
        <div className="company-copy">
          <SectionHeading eyebrow="The Power Breeze difference" title={<>We connect ambition<br />to <em>reliable energy.</em></>} />
          <p className="company-intro">{company.about_intro}</p>
          <p className="company-body">{company.about_body}</p>
          <div className="company-values">
            <div><span><Check size={15} /></span><p><strong>One coordinated team</strong><small>Connected disciplines, accountable delivery.</small></p></div>
            <div><span><Check size={15} /></span><p><strong>Solutions made to fit</strong><small>Practical engineering for real project needs.</small></p></div>
            <div><span><Check size={15} /></span><p><strong>Quality at every stage</strong><small>Careful execution from planning to handover.</small></p></div>
          </div>
          <a className="text-button" href="#contact">Get to know our team <ArrowUpRight size={17} /></a>
        </div>
      </div>
    </section>
  );
}

function ContactSection({ onSubmitted, company }: { onSubmitted: (message: string) => void; company: CompanyProfile }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());
    try {
      await apiRequest("inquiries", { method: "POST", body: JSON.stringify({ ...values, inquiry_type: values.inquiry_type || "General", website: values.website || "" }) });
      form.reset();
      onSubmitted("Thank you — your inquiry has been received. Our team will be in touch.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "We couldn't send your message. Please email or call us instead.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="contact-section" id="contact">
      <div className="contact-glow" />
      <div className="page-shell contact-layout">
        <div className="contact-copy">
          <SectionHeading eyebrow="Let's build something that lasts" title={<>Have a project<br />in <em>mind?</em></>} description="Tell us what you are planning. Our team will help identify the next step." light />
          <div className="contact-lines">
            <a href={`tel:${company.office_bd_phone.replace(/[^\d+]/g, "")}`}><span><Phone size={17} /></span><div><small>Call our Dhaka office</small><strong>{company.office_bd_phone}</strong></div><ArrowUpRight size={16} /></a>
            <a href={`mailto:${company.email}`}><span><Mail size={17} /></span><div><small>Email our team</small><strong>{company.email}</strong></div><ArrowUpRight size={16} /></a>
          </div>
        </div>
        <form className="inquiry-form" onSubmit={submit}>
          <div className="form-topline"><span>PROJECT INQUIRY</span><span>01 <i /> 03</span></div>
          <h3>Start a conversation</h3>
          <p>Share a few details and we’ll get back to you.</p>
          <div className="form-row">
            <label>Your name<input name="name" autoComplete="name" placeholder="e.g. Alex Morgan" required maxLength={120} /></label>
            <label>Work email<input name="email" type="email" autoComplete="email" placeholder="you@company.com" required maxLength={190} /></label>
          </div>
          <div className="form-row">
            <label>Organization<input name="organization" autoComplete="organization" placeholder="Company / organization" maxLength={160} /></label>
            <label>Phone (optional)<input name="phone" type="tel" autoComplete="tel" placeholder="+1 / +880" maxLength={50} /></label>
          </div>
          <label>What can we help with?
            <select name="inquiry_type" defaultValue="Project / Service">
              <option>Project / Service</option><option>Product / Equipment</option><option>General inquiry</option>
            </select>
          </label>
          <label>Tell us about your project<textarea name="message" rows={3} placeholder="Project location, scope, timeline or equipment requirements..." required maxLength={4000} /></label>
          <input className="honeypot" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
          <div className="form-bottom">
            <small><LockKeyhole size={13} /> Your project information stays private.</small>
            <button className="button button-red" type="submit" disabled={submitting}>{submitting ? "Sending..." : "Send inquiry"} <Send size={15} /></button>
          </div>
          {error && <p className="form-error" role="alert">{error}</p>}
        </form>
      </div>
      <div className="office-row page-shell">
        {[
          { label: "Dhaka · Head office", address: company.office_bd_address, phone: company.office_bd_phone },
          { label: "Dhaka · Local office", address: company.office_local_address, phone: company.office_local_phone },
          { label: "Toronto · Canada office", address: company.office_ca_address, phone: company.office_ca_phone },
        ].filter((office) => office.address.trim()).map((office) => (
          <article className="office-card" key={office.label}>
            <div className="office-label"><MapPin size={14} /> {office.label}</div>
            <p>{office.address}</p>
            <div className="office-links"><a href={`tel:${office.phone.replace(/[^\d+]/g, "")}`}>{office.phone}</a></div>
          </article>
        ))}
      </div>
    </section>
  );
}

function SiteFooter({ onAdmin, company }: { onAdmin: () => void; company: CompanyProfile }) {
  return (
    <footer className="site-footer">
      <div className="page-shell footer-main">
        <div className="footer-brand">
          <Logo light companyName={company.company_name} />
          <p>Thoughtful engineering for a more connected, resilient energy future.</p>
          <div className="footer-socials"><a href="https://a2technologiesbd.com/" target="_blank" rel="noreferrer" aria-label="A2 Technologies"><ArrowUpRight size={16} /></a><a href={`mailto:${company.email}`} aria-label="Email Power Breeze"><Mail size={16} /></a></div>
        </div>
        <div className="footer-column"><span className="footer-heading">Explore</span><a href="#expertise">Our expertise</a><a href="#products">Products & equipment</a><a href="#projects">Project experience</a><a href="#about">About the company</a></div>
        <div className="footer-column"><span className="footer-heading">Capabilities</span><a href="#expertise">Substations & switchgear</a><a href="#expertise">Solar power systems</a><a href="#expertise">Generators & panels</a><a href="#expertise">Turnkey engineering</a></div>
        <div className="footer-column footer-address"><span className="footer-heading">Find us</span><strong>Dhaka · Head office</strong><p>{company.office_bd_address}</p><a href={`tel:${company.office_bd_phone.replace(/[^\d+]/g, "")}`}>{company.office_bd_phone}</a><a href={`mailto:${company.email}`}>{company.email}</a></div>
      </div>
      <div className="page-shell footer-bottom">
        <span>© {new Date().getFullYear()} {company.company_name}. All rights reserved.</span>
        <span>Built with care by <a href="https://a2technologiesbd.com/" target="_blank" rel="noreferrer">A2 Technologies <ArrowUpRight size={12} /></a></span>
        <button onClick={onAdmin}>Admin access</button>
      </div>
    </footer>
  );
}

function WhatsAppButton({ phone }: { phone: string }) {
  return (
    <a className="whatsapp-float" href={`https://wa.me/${phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" aria-label="Chat with Power Breeze Engineering on WhatsApp">
      <MessageCircle size={23} /><span>Let's talk</span>
    </a>
  );
}

function PublicSite({ onAdmin, onToast }: { onAdmin: () => void; onToast: (message: string) => void }) {
  const [serviceItems, setServiceItems] = useState(seedServices);
  const [productItems, setProductItems] = useState(seedProducts);
  const [projectItems, setProjectItems] = useState(seedProjects);
  const [company, setCompany] = useState(seedCompany);
  const [formType, setFormType] = useState<string>();

  useEffect(() => {
    let active = true;
    void Promise.all([
      apiRequest<Service[]>("services"),
      apiRequest<Product[]>("products"),
      apiRequest<Project[]>("projects"),
      apiRequest<CompanyProfile[]>("company"),
    ]).then(([serviceData, productData, projectData, companyData]) => {
      if (!active) return;
      if (serviceData.length) setServiceItems(serviceData);
      if (productData.length) setProductItems(productData);
      if (projectData.length) setProjectItems(projectData);
      if (companyData.length) setCompany(companyData[0]);
    }).catch(() => {
      // The bundled catalogue remains available while the PHP API is offline.
    });
    return () => { active = false; };
  }, []);

  function goToInquiry(type?: string) {
    setFormType(type);
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    if (type) {
      window.setTimeout(() => {
        const select = document.querySelector<HTMLSelectElement>('select[name="inquiry_type"]');
        if (select) select.value = type.includes("Product") || productItems.some((item) => item.name === type) ? "Product / Equipment" : "Project / Service";
      }, 400);
    }
  }

  return (
    <>
      <SiteHeader onAdmin={onAdmin} company={company} />
      <main>
        <Hero onInquiry={goToInquiry} />
        <TrustStrip foundedYear={Number(company.founded_year)} />
        <Expertise items={serviceItems} onInquiry={goToInquiry} />
        <ProductSection items={productItems} onInquiry={goToInquiry} />
        <Projects items={projectItems} onInquiry={goToInquiry} />
        <CompanySection company={company} />
        <ContactSection onSubmitted={onToast} company={company} />
      </main>
      <SiteFooter onAdmin={onAdmin} company={company} />
      <WhatsAppButton phone={company.whatsapp_phone} />
      {formType && <span className="sr-only" aria-live="polite">Inquiry type selected: {formType}</span>}
    </>
  );
}

const editableFields: Record<Exclude<Resource, "inquiries">, Array<{ key: string; label: string; type?: string }>> = {
  company: [
    { key: "company_name", label: "Company name" }, { key: "tagline", label: "Tagline" },
    { key: "founded_year", label: "Established year", type: "number" },
    { key: "about_intro", label: "Company introduction", type: "textarea" },
    { key: "about_body", label: "About the company", type: "textarea" },
    { key: "email", label: "Business email" }, { key: "whatsapp_phone", label: "WhatsApp number (international digits)" },
    { key: "office_bd_address", label: "Dhaka head office address", type: "textarea" },
    { key: "office_bd_phone", label: "Dhaka head office phone" },
    { key: "office_local_address", label: "Dhaka local office address", type: "textarea" },
    { key: "office_local_phone", label: "Dhaka local office phone" },
    { key: "office_ca_address", label: "Canada office address", type: "textarea" },
    { key: "office_ca_phone", label: "Canada office phone" },
  ],
  services: [
    { key: "title", label: "Title" }, { key: "category", label: "Category" },
    { key: "summary", label: "Short summary", type: "textarea" }, { key: "icon", label: "Icon name" },
    { key: "image", label: "Image URL" }, { key: "sort_order", label: "Sort order", type: "number" },
  ],
  products: [
    { key: "name", label: "Product name" }, { key: "category", label: "Category" },
    { key: "description", label: "Description", type: "textarea" }, { key: "image", label: "Image URL" },
    { key: "sort_order", label: "Sort order", type: "number" },
  ],
  projects: [
    { key: "title", label: "Project title" }, { key: "client", label: "Client" },
    { key: "location", label: "Location" }, { key: "year", label: "Year" },
    { key: "size", label: "Capacity / voltage" }, { key: "image", label: "Image URL" },
  ],
};

function AdminPortal({ onClose }: { onClose: () => void }) {
  const [token, setToken] = useState(authToken.get());
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resource, setResource] = useState<Resource>("products");
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [editing, setEditing] = useState<RecordItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function loadRecords(selected: Resource = resource) {
    setError("");
    try {
      const data = await apiRequest<RecordItem[]>(selected);
      setRecords(data);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to load records.");
    }
  }

  useEffect(() => {
    if (token) void loadRecords(resource);
    // Load only after login and when the selected content type changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, resource]);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const result = await apiRequest<{ token: string }>("auth", {
        action: "login",
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      authToken.set(result.token);
      setToken(result.token);
      setPassword("");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Admin sign-in failed.");
    } finally {
      setBusy(false);
    }
  }

  async function saveRecord(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (resource === "inquiries" || !editing) return;
    setBusy(true);
    setError("");
    const values = Object.fromEntries(new FormData(event.currentTarget).entries());
    const body: Record<string, string | number | boolean> = {};
    for (const [key, value] of Object.entries(values)) {
      body[key] = key === "sort_order" ? Number(value || 0) : String(value);
    }
    body.is_published = values.is_published === "1";
    try {
      await apiRequest(resource, { method: isNew ? "POST" : "PATCH", body: JSON.stringify({ ...editing, ...body }) });
      setNotice(`${resourceLabels[resource].slice(0, -1)} saved.`);
      setEditing(null);
      await loadRecords(resource);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to save this record.");
    } finally {
      setBusy(false);
    }
  }

  async function deleteRecord(record: RecordItem) {
    if (!window.confirm("Delete this record? This cannot be undone.")) return;
    try {
      await apiRequest(resource, { method: "DELETE", body: JSON.stringify({ id: record.id }) });
      setNotice("Record deleted.");
      await loadRecords(resource);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to delete this record.");
    }
  }

  function logout() {
    authToken.clear();
    setToken(null);
    setRecords([]);
    setEditing(null);
  }

  if (!token) {
    return (
      <main className="admin-login-page">
        <div className="admin-login-art">
          <button className="admin-back-link" onClick={onClose}><ArrowLeft size={16} /> Back to website</button>
          <Logo light />
          <div className="admin-art-copy"><span>CONTROL ROOM / 01</span><h1>Good work starts<br />with a <em>clear view.</em></h1><p>Manage your public capabilities, equipment, and project experience from one secure place.</p></div>
          <div className="admin-art-foot">POWER BREEZE ENGINEERING <span>EST. 2012</span></div>
        </div>
        <div className="admin-login-panel">
          <form onSubmit={login}>
            <div className="admin-mobile-brand"><Logo /></div>
            <span className="eyebrow"><i /> ADMINISTRATOR ACCESS</span>
            <h2>Welcome back.</h2><p>Sign in to manage your website content.</p>
            <label>Admin email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@powerbreezebd.net" autoComplete="username" required /></label>
            <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" autoComplete="current-password" required /></label>
            <button className="button button-red admin-signin" disabled={busy}>{busy ? "Signing in..." : "Sign in securely"} <ArrowRight size={17} /></button>
            {error && <div className="admin-error" role="alert">{error}</div>}
            <small className="admin-security-note"><LockKeyhole size={13} /> Protected by secure token-based authentication.</small>
          </form>
        </div>
      </main>
    );
  }

  const fields = resource === "inquiries" ? [] : editableFields[resource];

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Logo light />
        <div className="admin-side-label">WORKSPACE</div>
        {(["company", "services", "products", "projects", "inquiries"] as Resource[]).map((item) => (
          <button key={item} className={resource === item ? "admin-side-link admin-side-link-active" : "admin-side-link"} onClick={() => { setResource(item); setEditing(null); setNotice(""); }}>
            {item === "company" ? <Building2 size={17} /> : item === "services" ? <Zap size={17} /> : item === "products" ? <Settings2 size={17} /> : item === "projects" ? <Building2 size={17} /> : <Mail size={17} />}
            {resourceLabels[item]}{resource === item && <ChevronRight size={15} />}
          </button>
        ))}
        <div className="admin-sidebar-bottom"><span className="admin-online-dot" /> Secure content workspace <button onClick={logout}>Sign out</button></div>
      </aside>
      <main className="admin-main">
        <header className="admin-topbar"><div><span>CONTENT MANAGEMENT</span><h1>{resourceLabels[resource]}</h1></div><div className="admin-top-actions"><button onClick={onClose}><ArrowLeft size={15} /> View website</button>{resource !== "inquiries" && resource !== "company" && <button className="button button-red" onClick={() => { setIsNew(true); setEditing({ is_published: true }); setError(""); }}> <Plus size={16} /> Add {resourceLabels[resource].slice(0, -1)}</button>}</div></header>
        {error && <div className="admin-error admin-error-wide" role="alert">{error}</div>}
        {notice && <div className="admin-notice"><Check size={15} /> {notice}<button onClick={() => setNotice("")}><X size={15} /></button></div>}
        <div className="admin-table-head"><span>{records.length} {resourceLabels[resource].toLowerCase()} records</span><button onClick={() => void loadRecords()}><Upload size={15} /> Refresh</button></div>
        <div className="admin-record-list">
          {records.map((record) => (
            <article className="admin-record" key={String(record.id)}>
              {resource !== "inquiries" && record.image && <img src={String(record.image)} alt="" />}
              <div className="admin-record-content">
                <strong>{String(record.title || record.name || record.subject || record.email || "Untitled")}</strong>
                <span>{String(record.category || record.client || record.inquiry_type || record.created_at || "")}</span>
                {resource === "inquiries" && <p>{String(record.message || "")}</p>}
              </div>
              {resource !== "inquiries" && <span className={record.is_published ? "published-badge" : "draft-badge"}>{record.is_published ? "Published" : "Draft"}</span>}
              {resource !== "inquiries" && <div className="admin-record-actions"><button onClick={() => { setIsNew(false); setEditing(record); setError(""); }}>Edit</button><button onClick={() => void deleteRecord(record)}>Delete</button></div>}
            </article>
          ))}
          {!records.length && !error && <div className="admin-empty"><Layers3 size={24} /><strong>No records yet</strong><span>Add the first {resourceLabels[resource].toLowerCase()} record to get started.</span></div>}
        </div>
        {editing && resource !== "inquiries" && (
          <div className="editor-backdrop" role="presentation" onClick={() => setEditing(null)}>
            <form className="record-editor" onSubmit={saveRecord} onClick={(event) => event.stopPropagation()}>
              <div className="editor-heading"><div><span>{isNew ? "NEW RECORD" : "EDIT RECORD"}</span><h2>{isNew ? `Add ${resourceLabels[resource].slice(0, -1)}` : `Edit ${String(editing.title || editing.name || "")}`}</h2></div><button type="button" onClick={() => setEditing(null)} aria-label="Close editor"><X size={18} /></button></div>
              {fields.map((field) => (
                <label key={field.key}>{field.label}
                  {field.type === "textarea" ? <textarea name={field.key} defaultValue={String(editing[field.key] || "")} required={["title", "name", "summary", "description"].includes(field.key)} rows={3} /> : <input name={field.key} type={field.type || "text"} defaultValue={String(editing[field.key] || "")} required={["title", "name", "category", "summary", "description"].includes(field.key)} />}
                </label>
              ))}
              {resource !== "company" && <label className="publish-toggle"><input type="checkbox" name="is_published" value="1" defaultChecked={editing.is_published !== false && editing.is_published !== 0} /> Publish on website</label>}
              <button className="button button-red editor-save" disabled={busy}>{busy ? "Saving..." : "Save changes"} <Check size={16} /></button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default function App() {
  const [adminMode, setAdminMode] = useState(window.location.pathname === "/admin");
  const [toast, setToast] = useState("");

  useEffect(() => {
    const handlePopState = () => setAdminMode(window.location.pathname === "/admin");
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  function showAdmin() {
    window.history.pushState({}, "", "/admin");
    setAdminMode(true);
    window.scrollTo(0, 0);
  }

  function showWebsite() {
    window.history.pushState({}, "", "/");
    setAdminMode(false);
    window.scrollTo(0, 0);
  }

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 6000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  return (
    <>
      {adminMode ? <AdminPortal onClose={showWebsite} /> : <PublicSite onAdmin={showAdmin} onToast={setToast} />}
      {toast && !adminMode && <div className="toast-message" role="status"><Check size={17} />{toast}<button onClick={() => setToast("")} aria-label="Dismiss notification"><X size={16} /></button></div>}
    </>
  );
}
