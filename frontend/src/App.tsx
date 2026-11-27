import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  Activity, ArrowDown, ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight,
  BadgeCheck, Building2, Cable, Check, ChevronLeft, ChevronRight,
  CircleHelp, ClipboardCheck, Eye, EyeOff, Factory, Gauge, Globe2, HardHat, Image, Layers3, Leaf, Pencil, Printer, Ruler,
  Instagram, Linkedin, LockKeyhole, LogOut, Mail, MapPin, Menu, MessageCircle, Phone, Plus, Send,
  Settings2, ShieldCheck, Sun, Trash2, Upload, Wind, X, Zap, ZoomIn,
  Twitter, Youtube,
  type LucideIcon,
} from "lucide-react";
import { apiRequest, authToken } from "./api";
import { emptyCompanyProfile, slides, type Client, type CompanyProfile, type GalleryImage, type Product, type Project, type Service } from "./content";

type Resource = "company" | "services" | "products" | "projects" | "clients" | "gallery" | "inquiries";
type RecordItem = Record<string, string | number | boolean | null>;
const GALLERY_PAGE_SIZE = 12;

const iconMap: Record<string, LucideIcon> = {
  Zap, Activity, Gauge, Sun, Cable, Factory, Building2, Wind, Layers3, HardHat,
  ShieldCheck, Settings2, Leaf, ClipboardCheck, Ruler,
};

const resourceLabels: Record<Resource, string> = {
  company: "Company profile & offices",
  services: "Services",
  products: "Products",
  projects: "Projects",
  clients: "Clients",
  gallery: "Gallery",
  inquiries: "Inquiries",
};

const resourceItemLabels: Record<Resource, string> = {
  company: "company profile",
  services: "service",
  products: "product",
  projects: "project",
  clients: "client",
  gallery: "gallery image",
  inquiries: "inquiry",
};

function Logo({ light = false, companyName = "Power Breeze Engineering" }: { light?: boolean; companyName?: string }) {
  return (
    <a className={`brand-lockup ${light ? "brand-lockup-light" : ""}`} href="/" aria-label={`${companyName} home`}>
      <span className="brand-symbol" aria-hidden="true">
        <img src="/favicon.gif" alt="" />
      </span>
      <span className="brand-name"><strong>{companyName.replace(/\s+Engineering$/i, "").toUpperCase()}</strong><small>ENGINEERING</small></span>
    </a>
  );
}

function SiteHeader({ company, productsPage = false }: { company: CompanyProfile; productsPage?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const sectionLink = (section: string) => `${productsPage ? "/" : ""}#${section}`;
  const navItems = [
    { label: "Expertise", href: sectionLink("expertise"), icon: Zap },
    { label: "Products", href: sectionLink("products"), icon: Cable },
    { label: "Projects", href: sectionLink("projects"), icon: Building2 },
    { label: "Clients", href: sectionLink("clients"), icon: BadgeCheck },
    { label: "Gallery", href: sectionLink("gallery"), icon: Image },
    { label: "Company profile", href: sectionLink("company-profile"), icon: Building2 },
    { label: "Contact", href: sectionLink("contact"), icon: Mail },
  ];

  return (
    <>
      <div className="utility-bar">
        <div className="page-shell utility-inner">
          <span className="utility-note">
            <span className="utility-dot" />
            <span className="utility-note-copy">
              {company.founded_year
                ? <>Engineering confidence <strong>since {company.founded_year}</strong></>
                : "Company information coming soon"}
            </span>
          </span>
          <div className="utility-right">
            {company.email && <a href={`mailto:${company.email}`} aria-label={`Email ${company.email}`}><Mail size={15} aria-hidden="true" /> <span>{company.email}</span></a>}
            {company.email && (company.office_bd_address || company.office_ca_address) && <span className="utility-divider" />}
            {(company.office_bd_address || company.office_ca_address) && <span className="utility-locations">
              <MapPin size={13} aria-hidden="true" />
              {company.office_bd_address && <span className="utility-location">Bangladesh</span>}
              {company.office_ca_address && <span className="utility-location">Canada</span>}
            </span>}
          </div>
        </div>
      </div>
      <header className="site-header">
        <div className="page-shell nav-inner">
          <Logo companyName={company.company_name || "Coming soon"} />
          <button className="mobile-menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen}>
            {menuOpen ? <X /> : <Menu />}
          </button>
          <nav className={`main-nav ${menuOpen ? "main-nav-open" : ""}`} aria-label="Main navigation">
            {navItems.map(({ label, href, icon: Icon }) => (
              <a href={href} key={href} onClick={() => setMenuOpen(false)}>
                <Icon size={16} strokeWidth={1.9} aria-hidden="true" />
                <span>{label}</span>
              </a>
            ))}
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

function TrustStrip({ foundedYear, status }: { foundedYear: number; status: ContentStatus }) {
  if (!foundedYear) {
    return <div className="trust-strip"><div className="page-shell trust-grid"><ContentPlaceholder loading={status === "loading"} error={status === "error"} /></div></div>;
  }

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

function ContentPlaceholder({ loading, error }: { loading: boolean; error: boolean }) {
  const message = loading ? "Loading content…" : error ? "Content could not be loaded. Please try again later." : "Coming soon";
  return <div className="content-status" role="status">{message}</div>;
}

type ContentStatus = "loading" | "ready" | "error";
type ContentResource = "services" | "products" | "projects" | "clients" | "gallery" | "company";

function Expertise({ items, onInquiry, status }: { items: Service[]; onInquiry: (type?: string) => void; status: ContentStatus }) {
  return (
    <section className="section expertise-section" id="expertise">
      <div className="page-shell">
        <div className="expertise-top">
          <SectionHeading eyebrow="What we do" title={<>Infrastructure starts<br />with <em>the right expertise.</em></>} description="From substations and solar to complete electro-mechanical delivery, we bring practical engineering expertise to every stage of your project." />
          <button className="text-button" onClick={() => onInquiry("Project / Service")}>Talk to our engineering team <ArrowUpRight size={17} /></button>
        </div>
        <div className="service-grid">
          {items.length ? items.slice(0, 8).map((service, index) => {
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
          }) : <ContentPlaceholder loading={status === "loading"} error={status === "error"} />}
        </div>
      </div>
    </section>
  );
}

function ProductSection({ items, onInquiry, status, fullCatalogue = false }: { items: Product[]; onInquiry: (type?: string) => void; status: ContentStatus; fullCatalogue?: boolean }) {
  const [category, setCategory] = useState("All equipment");
  const [filterScroll, setFilterScroll] = useState({ hasOverflow: false, canScrollLeft: false, canScrollRight: false });
  const filterShellRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const categories = useMemo(() => ["All equipment", ...new Set(items.map((item) => item.category))], [items]);
  const filtered = category === "All equipment" ? items : items.filter((item) => item.category === category);
  const visibleProducts = fullCatalogue ? filtered : filtered.slice(0, 8);

  useEffect(() => {
    const shell = filterShellRef.current;
    const filters = filterRef.current;
    if (!shell || !filters) return;

    const updateScrollState = () => {
      const maxScroll = Math.max(0, filters.scrollWidth - filters.clientWidth);
      const next = {
        hasOverflow: filters.scrollWidth > shell.clientWidth + 1,
        canScrollLeft: filters.scrollLeft > 1,
        canScrollRight: filters.scrollLeft < maxScroll - 1,
      };
      setFilterScroll((current) =>
        current.hasOverflow === next.hasOverflow
          && current.canScrollLeft === next.canScrollLeft
          && current.canScrollRight === next.canScrollRight
          ? current
          : next
      );
    };

    const observer = new ResizeObserver(updateScrollState);
    observer.observe(shell);
    observer.observe(filters);
    Array.from(filters.children).forEach((child) => observer.observe(child));
    filters.addEventListener("scroll", updateScrollState, { passive: true });
    updateScrollState();

    return () => {
      observer.disconnect();
      filters.removeEventListener("scroll", updateScrollState);
    };
  }, [categories]);

  const scrollCategories = (direction: -1 | 1) => {
    const filters = filterRef.current;
    if (filters) filters.scrollBy({ left: direction * Math.max(180, filters.clientWidth * 0.75), behavior: "smooth" });
  };

  return (
    <section className={`section products-section ${fullCatalogue ? "products-section-full" : ""}`} id="products">
      <div className="page-shell">
        {fullCatalogue && <div className="catalogue-back-link"><a href="/"><ArrowLeft size={15} /> Back to home</a><span>POWER BREEZE · EQUIPMENT DIRECTORY</span></div>}
        <div className="products-heading-row">
          <SectionHeading
            eyebrow={fullCatalogue ? "Complete product catalogue" : "Equipment & supply"}
            title={fullCatalogue ? <>Equipment for<br /><em>critical systems.</em></> : <>Components that keep<br /><em>systems moving.</em></>}
            description={fullCatalogue
              ? items.length
                ? `Explore ${items.length} product references across substation, distribution, generator and solar systems. Confirm specifications and availability with our team.`
                : "Browse our equipment catalogue and contact the team to confirm product specifications and availability."
              : "A curated equipment catalogue for infrastructure, utility and institutional projects. Specifications and availability confirmed on request."}
          />
          <a className="button button-outline" href={fullCatalogue ? "/#contact" : "#contact"}>Request product details <ArrowUpRight size={16} /></a>
        </div>
        {items.length > 0 && <div className="product-filter-shell" ref={filterShellRef} role="group" aria-label="Filter products by category">
          {filterScroll.hasOverflow && <button
            type="button"
            className="product-filter-arrow"
            aria-label="Scroll categories left"
            aria-controls="product-category-filters"
            disabled={!filterScroll.canScrollLeft}
            onClick={() => scrollCategories(-1)}
          ><ChevronLeft size={18} /></button>}
          <div className="product-filters" id="product-category-filters" ref={filterRef}>
            {categories.map((item) => (
              <button
                type="button"
                className={category === item ? "filter-chip filter-chip-active" : "filter-chip"}
                key={item}
                onClick={() => setCategory(item)}
                aria-pressed={category === item}
              >
                {item}
              </button>
            ))}
          </div>
          {filterScroll.hasOverflow && <button
            type="button"
            className="product-filter-arrow"
            aria-label="Scroll categories right"
            aria-controls="product-category-filters"
            disabled={!filterScroll.canScrollRight}
            onClick={() => scrollCategories(1)}
          ><ChevronRight size={18} /></button>}
        </div>}
        <div className="product-grid">
          {visibleProducts.length ? visibleProducts.map((product, index) => (
            <article className="product-card" key={product.id}>
              <div className="product-image">
                {product.image
                  ? <img src={product.image} alt={product.name} loading="lazy" />
                  : <span className="product-image-placeholder" aria-hidden="true"><Cable size={32} /></span>}
                <span className="product-number">PB / {String(index + 1).padStart(2, "0")}</span>
                {fullCatalogue
                  ? <a href="/#contact" aria-label={`Request information about ${product.name}`}><ArrowUpRight size={18} /></a>
                  : <button aria-label={`Request information about ${product.name}`} onClick={() => onInquiry(product.name)}><ArrowUpRight size={18} /></button>}
              </div>
              <div className="product-info">
                <span>{product.category}</span>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                {fullCatalogue
                  ? <a className="product-ask" href="/#contact">Request product details <ArrowRight size={14} /></a>
                  : <button className="product-ask" onClick={() => onInquiry(product.name)}>Ask about this product <ArrowRight size={14} /></button>}
              </div>
            </article>
          )) : <ContentPlaceholder loading={status === "loading"} error={status === "error"} />}
        </div>
        {!fullCatalogue && items.length > 8 && <div className="catalogue-more">
          <div><strong>Looking for the complete range?</strong><span>Browse all {items.length} products and filter by equipment category.</span></div>
          <a className="button button-outline" href="/products">View all products <ArrowRight size={16} /></a>
        </div>}
        {items.length > 0 && <div className="catalogue-note" role="note">
          <span className="catalogue-note-icon" aria-hidden="true"><CircleHelp size={18} /></span>
          <span className="catalogue-note-copy">
            <strong>Need help choosing the right equipment?</strong>
            <span>Our team will confirm specifications and availability to suit your project.</span>
          </span>
        </div>}
      </div>
    </section>
  );
}

function Projects({ items, onInquiry, status }: { items: Project[]; onInquiry: (type?: string) => void; status: ContentStatus }) {
  const lead = items[0];
  const rest = items.slice(1, 4);
  return (
    <section className="section projects-section" id="projects">
      <div className="page-shell">
        <div className="projects-heading-row">
          <SectionHeading eyebrow="Selected project experience" title={<>Powering progress<br />through <em>real projects.</em></>} description="A selection of power and electro-mechanical work delivered for institutional and infrastructure clients." />
          <span className="portfolio-stamp"><span>PROJECT<br />PORTFOLIO</span><ArrowUpRight size={20} /></span>
        </div>
        {!lead && <ContentPlaceholder loading={status === "loading"} error={status === "error"} />}
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
              <span className="project-kicker">Power infrastructure · Project highlight</span>
              <button className="button button-dark" onClick={() => onInquiry("Project / Service")}>Discuss a similar project <ArrowUpRight size={16} /></button>
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
        {lead && <p className="project-disclaimer">Project references reflect the company’s existing portfolio. Client names, project details, and publication permissions should be reconfirmed before launch.</p>}
      </div>
    </section>
  );
}

function ClientsSection({ items, status }: { items: Client[]; status: ContentStatus }) {
  return (
    <section className="section clients-section" id="clients">
      <div className="page-shell">
        <SectionHeading
          eyebrow="Client relationships"
          title={<>Trusted organizations.<br /><em>Lasting partnerships.</em></>}
          description="A selection of public and private sector organizations featured in Power Breeze’s client portfolio."
        />
        <div className="client-grid">
          {items.length ? items.map((client) => (
            <article className="client-card" key={client.id}>
              <div className="client-logo">
                {client.image
                  ? <img src={client.image} alt={`${client.name} logo`} loading="lazy" />
                  : <span aria-hidden="true">{client.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase()}</span>}
              </div>
              <h3>{client.name}</h3>
              {client.description && <p>{client.description}</p>}
            </article>
          )) : <ContentPlaceholder loading={status === "loading"} error={status === "error"} />}
        </div>
        {items.length > 0 && <p className="client-disclaimer">Client references are shown only after verification and approval for publication.</p>}
      </div>
    </section>
  );
}

function GallerySection({ items, status }: { items: GalleryImage[]; status: ContentStatus }) {
  const [page, setPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastFocusedImageRef = useRef<HTMLButtonElement>(null);
  const pageCount = Math.ceil(items.length / GALLERY_PAGE_SIZE);
  const currentPage = Math.min(page, Math.max(pageCount, 1));
  const firstPageNumber = Math.max(1, Math.min(currentPage - 2, pageCount - 4));
  const pageNumbers = Array.from({ length: Math.min(pageCount, 5) }, (_, index) => firstPageNumber + index);
  const pageItems = items.slice((currentPage - 1) * GALLERY_PAGE_SIZE, currentPage * GALLERY_PAGE_SIZE);

  useEffect(() => {
    if (!selectedImage) {
      lastFocusedImageRef.current?.focus();
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedImage(null);
      if (event.key === "Tab") {
        event.preventDefault();
        closeButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedImage]);

  function goToPage(nextPage: number) {
    setPage(nextPage);
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section className="section gallery-section" id="gallery" ref={sectionRef}>
      <div className="page-shell">
        <div className="gallery-heading-row">
          <SectionHeading
            eyebrow="Project gallery"
            title={<>Work in focus.<br /><em>Progress in pictures.</em></>}
            description="A visual record of Power Breeze Engineering projects and field work."
          />
          {items.length > 0 && <span className="gallery-count"><Image size={16} /> {items.length} project photos</span>}
        </div>
        <div className="gallery-grid">
          {pageItems.length ? pageItems.map((item, index) => (
            <article className="gallery-card" key={item.id}>
              <div className="gallery-card-image">
                <button
                  type="button"
                  className="gallery-image-zoom"
                  aria-label={`View larger image: ${item.title}`}
                  onClick={(event) => {
                    lastFocusedImageRef.current = event.currentTarget;
                    setSelectedImage(item);
                  }}
                >
                  <img src={item.image} alt="" loading={index < 4 ? "eager" : "lazy"} decoding="async" />
                  <span className="gallery-zoom-hint"><ZoomIn size={17} /> View image</span>
                </button>
                <span className="gallery-card-index">PB / {String((currentPage - 1) * GALLERY_PAGE_SIZE + index + 1).padStart(2, "0")}</span>
              </div>
              <h3>{item.title}</h3>
            </article>
          )) : <ContentPlaceholder loading={status === "loading"} error={status === "error"} />}
        </div>
        {pageCount > 1 && <nav className="gallery-pagination" aria-label="Gallery pages">
          <button type="button" className="gallery-page-control" disabled={currentPage === 1} onClick={() => goToPage(currentPage - 1)}>
            <ChevronLeft size={16} /> Previous
          </button>
          <div className="gallery-page-numbers">
            {firstPageNumber > 1 && <>
              <button type="button" className="gallery-page-number" onClick={() => goToPage(1)} aria-label="Page 1">1</button>
              {firstPageNumber > 2 && <span aria-hidden="true">...</span>}
            </>}
            {pageNumbers.map((pageNumber) => (
              <button
                type="button"
                className={pageNumber === currentPage ? "gallery-page-number gallery-page-number-active" : "gallery-page-number"}
                key={pageNumber}
                onClick={() => goToPage(pageNumber)}
                aria-label={`Page ${pageNumber}`}
                aria-current={pageNumber === currentPage ? "page" : undefined}
              >{pageNumber}</button>
            ))}
            {firstPageNumber + pageNumbers.length - 1 < pageCount && <>
              {firstPageNumber + pageNumbers.length < pageCount && <span aria-hidden="true">...</span>}
              <button type="button" className="gallery-page-number" onClick={() => goToPage(pageCount)} aria-label={`Page ${pageCount}`}>{pageCount}</button>
            </>}
          </div>
          <button type="button" className="gallery-page-control" disabled={currentPage === pageCount} onClick={() => goToPage(currentPage + 1)}>
            Next <ChevronRight size={16} />
          </button>
        </nav>}
        {items.length > 0 && <p className="gallery-page-summary">
          Showing {(currentPage - 1) * GALLERY_PAGE_SIZE + 1}–{Math.min(currentPage * GALLERY_PAGE_SIZE, items.length)} of {items.length} project photos
        </p>}
      </div>
      {selectedImage && <div
        className="gallery-lightbox-backdrop"
        role="presentation"
        onClick={(event) => {
          if (event.target === event.currentTarget) setSelectedImage(null);
        }}
      >
        <section className="gallery-lightbox" role="dialog" aria-modal="true" aria-labelledby="gallery-lightbox-title" tabIndex={-1}>
          <header className="gallery-lightbox-header">
            <h2 id="gallery-lightbox-title">{selectedImage.title}</h2>
            <button ref={closeButtonRef} type="button" onClick={() => setSelectedImage(null)} aria-label="Close enlarged image">
              <X size={20} />
            </button>
          </header>
          <div className="gallery-lightbox-image">
            <img src={selectedImage.image} alt={selectedImage.title} />
          </div>
        </section>
      </div>}
    </section>
  );
}

function EstimateCta({ company, onEstimate }: { company: CompanyProfile; onEstimate: () => void }) {
  const phone = company.office_ca_phone || company.office_bd_phone;
  const phoneLabel = company.office_ca_phone ? "Call our Canada office" : "Call our office";

  return (
    <section className="estimate-cta" aria-label="Request a project estimate">
      <div className="estimate-cta-main">
        <div className="page-shell estimate-cta-inner">
          <div className="estimate-cta-copy">
            <span className="estimate-cta-eyebrow"><i /> READY TO GET STARTED?</span>
            <h2>Would you like an <em>estimate?</em></h2>
            {phone && <a className="estimate-cta-phone" href={`tel:${phone.replace(/[^\d+]/g, "")}`}>
              <Phone size={19} /> <span>{phone}</span>
            </a>}
          </div>
          <div className="estimate-cta-actions">
            <button type="button" className="estimate-quote-button" onClick={onEstimate}>Get a quote online <ArrowUpRight size={17} /></button>
            {phone && <a className="estimate-call-button" href={`tel:${phone.replace(/[^\d+]/g, "")}`}><Phone size={16} /> {phoneLabel}</a>}
          </div>
        </div>
      </div>
      <div className="estimate-cta-ribbon"><span>One call can move your project forward.</span></div>
    </section>
  );
}

function CompanySection({ company, status }: { company: CompanyProfile; status: ContentStatus }) {
  if (!company.about_intro.trim() && !company.about_body.trim()) {
    return (
      <section className="company-section" id="about">
        <div className="page-shell"><SectionHeading eyebrow="About the company" title={<>Get to know<br /><em>Power Breeze.</em></>} /><ContentPlaceholder loading={status === "loading"} error={status === "error"} /></div>
      </section>
    );
  }

  return (
    <section className="company-section" id="about">
      <div className="page-shell company-grid">
        <div className="company-image-wrap">
          <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85" alt="Modern infrastructure and engineering architecture" loading="lazy" />
          {company.founded_year > 0 && <div className="company-image-tag"><span>{Math.max(0, new Date().getFullYear() - Number(company.founded_year))}+</span><small>Years building<br />powerful partnerships</small></div>}
          <span className="company-image-caption">Built with purpose. Engineered to last.</span>
        </div>
        <div className="company-copy">
          <SectionHeading eyebrow="The Power Breeze difference" title={<>We connect ambition<br />to <em>reliable energy.</em></>} />
          {company.about_intro.trim() && <p className="company-intro">{company.about_intro}</p>}
          {company.about_body.trim() && <p className="company-body">{company.about_body}</p>}
          <div className="company-values">
            <div><span><Check size={17} /></span><p><strong>One coordinated team</strong><small>Connected disciplines, clear ownership, dependable delivery.</small></p></div>
            <div><span><Check size={17} /></span><p><strong>Solutions made to fit</strong><small>Practical engineering shaped around your project goals and site needs.</small></p></div>
            <div><span><Check size={17} /></span><p><strong>Quality at every stage</strong><small>Careful planning, precise execution, and a dependable handover.</small></p></div>
          </div>
          <a className="text-button" href="#contact">Get to know our team <ArrowUpRight size={17} /></a>
        </div>
      </div>
    </section>
  );
}

function CompanyProfileSection({ company, status }: { company: CompanyProfile; status: ContentStatus }) {
  const capabilities = company.profile_capabilities.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
  const credentials = company.profile_credentials.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
  const hasProfile = Boolean(company.profile_summary.trim() || company.profile_leadership.trim() || capabilities.length || credentials.length);

  if (!hasProfile) {
    return (
      <section className="profile-section" id="company-profile">
        <div className="page-shell"><SectionHeading eyebrow="Company profile" title={<>Engineering capability,<br /><em>built on experience.</em></>} /><ContentPlaceholder loading={status === "loading"} error={status === "error"} /></div>
      </section>
    );
  }

  return (
    <section className="profile-section" id="company-profile">
      <div className="page-shell">
        <div className="profile-heading">
          <SectionHeading eyebrow="Company profile" title={<>Engineering capability,<br /><em>built on experience.</em></>} />
          {company.profile_summary.trim() ? <p>{company.profile_summary}</p> : <ContentPlaceholder loading={status === "loading"} error={status === "error"} />}
        </div>
        <div className="profile-content-grid">
          <article className="profile-card profile-capabilities">
            <div className="profile-card-heading"><span><Zap size={19} /></span><div><small>WHAT WE DELIVER</small><h3>Core capabilities</h3></div></div>
            {capabilities.length ? <ul>{capabilities.map((item) => <li key={item}><Check size={16} aria-hidden="true" />{item}</li>)}</ul> : <ContentPlaceholder loading={status === "loading"} error={status === "error"} />}
          </article>
          <div className="profile-side-grid">
            <article className="profile-card">
              <div className="profile-card-heading"><span><BadgeCheck size={19} /></span><div><small>LEADERSHIP</small><h3>Built on engineering experience</h3></div></div>
              {company.profile_leadership.trim() ? <p>{company.profile_leadership}</p> : <ContentPlaceholder loading={status === "loading"} error={status === "error"} />}
            </article>
            <article className="profile-card">
              <div className="profile-card-heading"><span><ShieldCheck size={19} /></span><div><small>QUALIFICATIONS</small><h3>Credentials</h3></div></div>
              {credentials.length ? <ul>{credentials.map((item) => <li key={item}><Check size={16} aria-hidden="true" />{item}</li>)}</ul> : <ContentPlaceholder loading={status === "loading"} error={status === "error"} />}
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}

type OfficeLocation = { label: string; address: string; phone?: string; mobile?: string; fax?: string };

function googleMapsLink(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

function OfficeMap({ office, large = false }: { office: OfficeLocation; large?: boolean }) {
  return (
    <iframe
      className={large ? "office-map office-map-large" : "office-map office-map-preview"}
      src={`https://www.google.com/maps?q=${encodeURIComponent(office.address)}&output=embed`}
      title={`Map for ${office.label}`}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      allowFullScreen
    />
  );
}

function ContactSection({ onSubmitted, company, status }: { onSubmitted: (message: string) => void; company: CompanyProfile; status: ContentStatus }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [selectedOffice, setSelectedOffice] = useState<OfficeLocation | null>(null);
  const mapCloseButtonRef = useRef<HTMLButtonElement>(null);
  const offices: OfficeLocation[] = [
    { label: "Dhaka · Corporate office", address: company.office_bd_address || "", phone: company.office_bd_phone || "", mobile: company.office_bd_mobile || "", fax: company.office_bd_fax || "" },
    { label: "Dhaka · Local office", address: company.office_local_address || "", phone: company.office_local_phone || "" },
    { label: "Chattogram · Branch office", address: company.office_ctg_address || "" },
    { label: "Dhaka · Factory", address: company.office_factory_address || "" },
    { label: "Toronto · Canada office", address: company.office_ca_address || "", phone: company.office_ca_phone || "" },
  ].filter((office) => office.address.trim());

  useEffect(() => {
    if (!selectedOffice) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedOffice(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    mapCloseButtonRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [selectedOffice]);

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
          <SectionHeading eyebrow="Let's build something that lasts" title={<>Have a project<br />in <em>mind?</em></>} description="Share your project scope, location, and timeline. Our team will help you identify a practical next step." light />
          <div className="contact-lines">
            {company.office_bd_phone && <a href={`tel:${company.office_bd_phone.replace(/[^\d+]/g, "")}`}><span><Phone size={17} /></span><div><small>Call our Dhaka office</small><strong>{company.office_bd_phone}</strong></div><ArrowUpRight size={16} /></a>}
            {company.email && <a href={`mailto:${company.email}`}><span><Mail size={17} /></span><div><small>Email our team</small><strong>{company.email}</strong></div><ArrowUpRight size={16} /></a>}
          </div>
        </div>
        <form className="inquiry-form" onSubmit={submit}>
          <div className="form-topline"><span>PROJECT INQUIRY</span><span>01 <i /> 03</span></div>
          <h3>Start a conversation</h3>
          <p>Tell us what you’re planning and our engineering team will follow up.</p>
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
        {offices.length ? offices.map((office) => (
          <article className="office-card" key={office.label}>
            <div className="office-label"><MapPin size={14} /> {office.label}</div>
            <p>{office.address}</p>
            {(office.phone || office.mobile || office.fax) && <div className="office-links">
              {office.phone && <a href={`tel:${office.phone.replace(/[^\d+]/g, "")}`}><Phone size={14} aria-hidden="true" /> {office.phone}</a>}
              {office.mobile && <a href={`tel:${office.mobile.replace(/[^\d+]/g, "")}`}><Phone size={14} aria-hidden="true" /> {office.mobile}</a>}
              {office.fax && <span><Printer size={14} aria-hidden="true" /> Fax: {office.fax}</span>}
            </div>}
            <OfficeMap office={office} />
            <div className="office-card-actions">
              <button type="button" onClick={() => setSelectedOffice(office)}>View details <ArrowUpRight size={14} /></button>
            </div>
          </article>
        )) : <ContentPlaceholder loading={status === "loading"} error={status === "error"} />}
      </div>
      {selectedOffice && (
        <div className="map-modal-backdrop" onClick={(event) => {
          if (event.target === event.currentTarget) setSelectedOffice(null);
        }}>
          <section className="map-modal" role="dialog" aria-modal="true" aria-labelledby="office-map-title" tabIndex={-1}>
            <header className="map-modal-header">
              <div>
                <span>OFFICE LOCATION</span>
                <h2 id="office-map-title">{selectedOffice.label}</h2>
                <p>{selectedOffice.address}</p>
              </div>
              <button ref={mapCloseButtonRef} type="button" onClick={() => setSelectedOffice(null)} aria-label="Close map details"><X size={20} /></button>
            </header>
            <OfficeMap office={selectedOffice} large />
            <div className="map-modal-footer">
              <span>Map provided by Google Maps</span>
              <a href={googleMapsLink(selectedOffice.address)} target="_blank" rel="noreferrer">Open in Google Maps <ArrowUpRight size={14} /></a>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}

function SiteFooter({ company, productsPage = false }: { company: CompanyProfile; productsPage?: boolean }) {
  const sectionLink = (section: string) => `${productsPage ? "/" : ""}#${section}`;
  const socialLinks = [
    { label: "Facebook", href: company.facebook_url, icon: <span className="social-facebook-mark" aria-hidden="true">f</span> },
    { label: "YouTube", href: company.youtube_url, icon: <Youtube size={17} aria-hidden="true" /> },
    { label: "Twitter", href: company.twitter_url, icon: <Twitter size={17} aria-hidden="true" /> },
    { label: "LinkedIn", href: company.linkedin_url, icon: <Linkedin size={17} aria-hidden="true" /> },
    { label: "Instagram", href: company.instagram_url, icon: <Instagram size={17} aria-hidden="true" /> },
  ].filter((social) => social.href.trim());

  return (
    <footer className="site-footer">
      <div className="page-shell footer-main">
        <div className="footer-brand">
          <Logo light companyName={company.company_name || "Coming soon"} />
          {company.tagline && <p>{company.tagline}</p>}
          <div className="footer-socials">
            {company.email && <a href={`mailto:${company.email}`} aria-label={`Email ${company.email}`}><Mail size={16} aria-hidden="true" /></a>}
            {socialLinks.map((social) => <a key={social.label} href={social.href} target="_blank" rel="noreferrer noopener" aria-label={`Visit Power Breeze on ${social.label}`}>{social.icon}</a>)}
          </div>
        </div>
        <div className="footer-column"><span className="footer-heading">Explore</span><a href={sectionLink("expertise")}><ChevronRight size={14} aria-hidden="true" /> Our expertise</a><a href={sectionLink("products")}><ChevronRight size={14} aria-hidden="true" /> Products & equipment</a><a href={sectionLink("projects")}><ChevronRight size={14} aria-hidden="true" /> Project experience</a><a href={sectionLink("clients")}><ChevronRight size={14} aria-hidden="true" /> Our clients</a><a href={sectionLink("gallery")}><ChevronRight size={14} aria-hidden="true" /> Project gallery</a><a href={sectionLink("about")}><ChevronRight size={14} aria-hidden="true" /> About the company</a></div>
        <div className="footer-column"><span className="footer-heading">Capabilities</span><a href={sectionLink("expertise")}><ChevronRight size={14} aria-hidden="true" /> Substations & switchgear</a><a href={sectionLink("expertise")}><ChevronRight size={14} aria-hidden="true" /> Solar power systems</a><a href={sectionLink("expertise")}><ChevronRight size={14} aria-hidden="true" /> Generators & panels</a><a href={sectionLink("expertise")}><ChevronRight size={14} aria-hidden="true" /> Turnkey engineering</a></div>
        <div className="footer-column footer-address"><span className="footer-heading">Find us</span>{company.office_bd_address && <><strong>Dhaka · Corporate office</strong><p><MapPin size={14} aria-hidden="true" /> {company.office_bd_address}</p></>}{company.office_bd_phone && <a href={`tel:${company.office_bd_phone.replace(/[^\d+]/g, "")}`}><Phone size={14} aria-hidden="true" /> {company.office_bd_phone}</a>}{company.email && <a href={`mailto:${company.email}`}><Mail size={14} aria-hidden="true" /> {company.email}</a>}{!company.office_bd_address && !company.office_bd_phone && !company.email && <span>Coming soon</span>}</div>
      </div>
      <div className="page-shell footer-bottom">
        <span>© {new Date().getFullYear()} {company.company_name || "Coming soon"}. All rights reserved.</span>
        <span>Built with care by <a href="https://a2technologiesbd.com/" target="_blank" rel="noreferrer">A2 Technologies <ArrowUpRight size={12} /></a></span>
      </div>
    </footer>
  );
}

function WhatsAppButton({ phone }: { phone: string }) {
  if (!phone) return null;
  return (
    <a className="whatsapp-float" href={`https://wa.me/${phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" aria-label="Chat with Power Breeze Engineering on WhatsApp">
      <MessageCircle size={23} /><span>Let's talk</span>
    </a>
  );
}

function PublicSite({ onToast, productsPage = false }: { onToast: (message: string) => void; productsPage?: boolean }) {
  const [serviceItems, setServiceItems] = useState<Service[]>([]);
  const [productItems, setProductItems] = useState<Product[]>([]);
  const [projectItems, setProjectItems] = useState<Project[]>([]);
  const [clientItems, setClientItems] = useState<Client[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryImage[]>([]);
  const [company, setCompany] = useState(emptyCompanyProfile);
  const [contentStatus, setContentStatus] = useState<Record<ContentResource, ContentStatus>>({
    services: "loading",
    products: "loading",
    projects: "loading",
    clients: "loading",
    gallery: "loading",
    company: "loading",
  });
  const [formType, setFormType] = useState<string>();

  useEffect(() => {
    let active = true;

    async function loadContent<T>(resource: ContentResource, apply: (data: T) => void) {
      try {
        const data = await apiRequest<T>(resource);
        if (!active) return;
        apply(data);
        setContentStatus((current) => ({ ...current, [resource]: "ready" }));
      } catch (reason) {
        if (!active) return;
        console.error(`Unable to load ${resource} content from the database.`, reason);
        setContentStatus((current) => ({ ...current, [resource]: "error" }));
      }
    }

    void Promise.all([
      loadContent<Service[]>("services", setServiceItems),
      loadContent<Product[]>("products", setProductItems),
      loadContent<Project[]>("projects", setProjectItems),
      loadContent<Client[]>("clients", setClientItems),
      loadContent<GalleryImage[]>("gallery", setGalleryItems),
      loadContent<CompanyProfile[]>("company", (data) => {
        setCompany(data.length ? { ...emptyCompanyProfile, ...data[0] } : emptyCompanyProfile);
      }),
    ]);

    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!productsPage) return;
    const previousTitle = document.title;
    document.title = "Products & Equipment | Power Breeze Engineering";
    return () => { document.title = previousTitle; };
  }, [productsPage]);

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
      <SiteHeader company={company} productsPage={productsPage} />
      <main>
        {productsPage ? (
          <ProductSection items={productItems} onInquiry={goToInquiry} status={contentStatus.products} fullCatalogue />
        ) : (
          <>
            <Hero onInquiry={goToInquiry} />
            <TrustStrip foundedYear={Number(company.founded_year)} status={contentStatus.company} />
            <Expertise items={serviceItems} onInquiry={goToInquiry} status={contentStatus.services} />
            <ProductSection items={productItems} onInquiry={goToInquiry} status={contentStatus.products} />
            <Projects items={projectItems} onInquiry={goToInquiry} status={contentStatus.projects} />
            <ClientsSection items={clientItems} status={contentStatus.clients} />
            <GallerySection items={galleryItems} status={contentStatus.gallery} />
            <EstimateCta company={company} onEstimate={() => goToInquiry("Project / Service")} />
            <CompanySection company={company} status={contentStatus.company} />
            <CompanyProfileSection company={company} status={contentStatus.company} />
            <ContactSection onSubmitted={onToast} company={company} status={contentStatus.company} />
          </>
        )}
      </main>
      <SiteFooter company={company} productsPage={productsPage} />
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
    { key: "profile_summary", label: "Profile overview", type: "textarea" },
    { key: "profile_leadership", label: "Leadership profile", type: "textarea" },
    { key: "profile_credentials", label: "Credentials (one per line)", type: "textarea" },
    { key: "profile_capabilities", label: "Core capabilities (one per line)", type: "textarea" },
    { key: "email", label: "Business email", type: "email" },
    { key: "facebook_url", label: "Facebook page URL", type: "url" },
    { key: "youtube_url", label: "YouTube channel URL", type: "url" },
    { key: "twitter_url", label: "Twitter / X profile URL", type: "url" },
    { key: "linkedin_url", label: "LinkedIn page URL", type: "url" },
    { key: "instagram_url", label: "Instagram profile URL", type: "url" },
    { key: "whatsapp_phone", label: "WhatsApp number (international digits)" },
    { key: "office_bd_address", label: "Dhaka corporate office address", type: "textarea" },
    { key: "office_bd_phone", label: "Corporate office phone" },
    { key: "office_bd_mobile", label: "Corporate office mobile" },
    { key: "office_bd_fax", label: "Corporate office fax" },
    { key: "office_local_address", label: "Dhaka local office address", type: "textarea" },
    { key: "office_local_phone", label: "Dhaka local office phone" },
    { key: "office_ctg_address", label: "Chattogram branch address", type: "textarea" },
    { key: "office_factory_address", label: "Factory address", type: "textarea" },
    { key: "office_ca_address", label: "Canada office address", type: "textarea" },
    { key: "office_ca_phone", label: "Canada office phone" },
  ],
  services: [
    { key: "title", label: "Title" }, { key: "category", label: "Category" },
    { key: "summary", label: "Short summary", type: "textarea" }, { key: "icon", label: "Icon name" },
    { key: "image", label: "Service image", type: "file" }, { key: "sort_order", label: "Sort order", type: "number" },
  ],
  products: [
    { key: "name", label: "Product name" }, { key: "category", label: "Category" },
    { key: "description", label: "Description", type: "textarea" }, { key: "image", label: "Product image", type: "file" },
    { key: "sort_order", label: "Sort order", type: "number" },
  ],
  projects: [
    { key: "title", label: "Project title" }, { key: "client", label: "Client" },
    { key: "location", label: "Location" }, { key: "year", label: "Year" },
    { key: "size", label: "Capacity / voltage" }, { key: "image", label: "Project image", type: "file" },
  ],
  clients: [
    { key: "name", label: "Organization name" },
    { key: "description", label: "Reference details (optional)", type: "textarea" },
    { key: "image", label: "Client logo", type: "file" },
    { key: "sort_order", label: "Sort order", type: "number" },
  ],
  gallery: [
    { key: "title", label: "Image caption" },
    { key: "image", label: "Gallery image", type: "file" },
    { key: "sort_order", label: "Sort order", type: "number" },
  ],
};

function PasswordField({
  label,
  value,
  onChange,
  autoComplete,
  placeholder,
  minLength,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: string;
  placeholder?: string;
  minLength?: number;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <label className="admin-password-field">
      {label}
      <span className="admin-password-input">
        <LockKeyhole className="admin-credential-icon" size={16} aria-hidden="true" />
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={autoComplete}
          placeholder={placeholder}
          minLength={minLength}
          required
        />
        <button
          className="admin-password-visibility"
          type="button"
          aria-label={`${visible ? "Hide" : "Show"} ${label.toLowerCase()}`}
          aria-pressed={visible}
          onClick={() => setVisible((current) => !current)}
        >
          {visible ? <EyeOff size={17} aria-hidden="true" /> : <Eye size={17} aria-hidden="true" />}
        </button>
      </span>
    </label>
  );
}

function AdminPortal({ onClose }: { onClose: () => void }) {
  const [token, setToken] = useState(authToken.get());
  const [mustChangePassword, setMustChangePassword] = useState(authToken.requiresPasswordChange());
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loginNotice, setLoginNotice] = useState("");
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
    if (token && !mustChangePassword) void loadRecords(resource);
    // Load only after login and when the selected content type changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, resource, mustChangePassword]);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const result = await apiRequest<{ token: string; must_change_password: boolean }>("auth", {
        action: "login",
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      authToken.set(result.token, result.must_change_password);
      setToken(result.token);
      setMustChangePassword(result.must_change_password);
      setPassword("");
      setLoginNotice("");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Admin sign-in failed.");
    } finally {
      setBusy(false);
    }
  }

  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (newPassword !== confirmPassword) {
      setError("The new passwords do not match.");
      return;
    }

    setBusy(true);
    try {
      await apiRequest("auth", {
        action: "change-password",
        method: "POST",
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
      });
      authToken.clear();
      setToken(null);
      setMustChangePassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setLoginNotice("Password changed. Sign in again with your new password.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to change your password.");
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
    const selectedContentImage = values.image instanceof File && values.image.size > 0 ? values.image : null;
    if (["projects", "services", "products", "clients", "gallery"].includes(resource) && selectedContentImage && selectedContentImage.size > 5 * 1024 * 1024) {
      setError("Images must be 5 MB or smaller.");
      setBusy(false);
      return;
    }
    const body: Record<string, string | number | boolean> = {};
    for (const [key, value] of Object.entries(values)) {
      if (value instanceof File) continue;
      body[key] = key === "sort_order" ? Number(value || 0) : String(value);
    }
    body.is_published = values.is_published === "1";
    try {
      if (["projects", "services", "products", "clients", "gallery"].includes(resource)) {
        if (selectedContentImage) {
          const formData = new FormData();
          formData.append("image", selectedContentImage);
          const uploaded = await apiRequest<{ url: string }>(`${resource}-images`, {
            method: "POST",
            body: formData,
          });
          body.image = uploaded.url;
        } else {
          body.image = String(editing.image || "");
        }
      }
      await apiRequest(resource, { method: isNew ? "POST" : "PATCH", body: JSON.stringify({ ...editing, ...body }) });
      setNotice(`${resource === "company" ? "Company profile" : resourceItemLabels[resource]} saved.`);
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
    setMustChangePassword(false);
    setRecords([]);
    setEditing(null);
  }

  if (!token || mustChangePassword) {
    const changingPassword = Boolean(token && mustChangePassword);
    return (
      <main className="admin-login-page">
        <div className="admin-login-art">
          <button className="admin-back-link" onClick={onClose}><ArrowLeft size={16} /> Back to website</button>
          <Logo light />
          <div className="admin-art-copy"><span>CONTROL ROOM / 01</span><h1>{changingPassword ? <>Secure your<br /><em>workspace.</em></> : <>Good work starts<br />with a <em>clear view.</em></>}</h1><p>{changingPassword ? "Choose a new password before accessing the admin workspace." : "Manage your public capabilities, equipment, and project experience from one secure place."}</p></div>
          <div className="admin-art-foot">POWER BREEZE ENGINEERING <span>EST. 2012</span></div>
        </div>
        <div className="admin-login-panel">
          <form onSubmit={changingPassword ? changePassword : login}>
            <div className="admin-mobile-brand"><Logo /></div>
            <span className="eyebrow"><i /> {changingPassword ? "PASSWORD UPDATE REQUIRED" : "ADMINISTRATOR ACCESS"}</span>
            <h2>{changingPassword ? "Set a new password." : "Welcome back."}</h2>
            <p>{changingPassword ? "Your temporary password cannot be used to enter the admin workspace." : "Sign in to manage your website content."}</p>
            {changingPassword ? (
              <>
                <PasswordField label="Current password" value={currentPassword} onChange={setCurrentPassword} autoComplete="current-password" />
                <PasswordField label="New password" value={newPassword} onChange={setNewPassword} autoComplete="new-password" minLength={12} />
                <PasswordField label="Confirm new password" value={confirmPassword} onChange={setConfirmPassword} autoComplete="new-password" minLength={12} />
                <small>Use at least 12 characters. You will need to sign in again after changing it.</small>
              </>
            ) : (
              <>
                <label>Admin email
                  <span className="admin-credential-input">
                    <Mail className="admin-credential-icon" size={16} aria-hidden="true" />
                    <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@powerbreeze.ca" autoComplete="username" required />
                  </span>
                </label>
                <PasswordField label="Password" value={password} onChange={setPassword} placeholder="Enter your password" autoComplete="current-password" />
              </>
            )}
            <button className="button button-red admin-signin" disabled={busy}>{busy ? (changingPassword ? "Updating password..." : "Signing in...") : (changingPassword ? "Change password" : "Sign in securely")} <ArrowRight size={17} /></button>
            {loginNotice && <div className="admin-notice" role="status">{loginNotice}</div>}
            {error && <div className="admin-error" role="alert">{error}</div>}
            {!changingPassword && <small className="admin-security-note"><LockKeyhole size={13} /> Protected by secure token-based authentication.</small>}
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
        <nav className="admin-side-nav" aria-label="Admin workspace">
          <div className="admin-side-label">WORKSPACE</div>
          {(["company", "services", "products", "projects", "clients", "gallery", "inquiries"] as Resource[]).map((item) => (
            <button key={item} className={resource === item ? "admin-side-link admin-side-link-active" : "admin-side-link"} onClick={() => { setResource(item); setEditing(null); setNotice(""); }}>
              <span className="admin-side-icon">
                {item === "company" ? <Building2 size={18} /> : item === "services" ? <Zap size={18} /> : item === "products" ? <Settings2 size={18} /> : item === "projects" ? <Building2 size={18} /> : item === "clients" ? <BadgeCheck size={18} /> : item === "gallery" ? <Image size={18} /> : <Mail size={18} />}
              </span>
              <span className="admin-side-link-label">{resourceLabels[item]}</span>
              {resource === item && <ChevronRight className="admin-side-chevron" size={16} aria-hidden="true" />}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-bottom"><span className="admin-online-dot" /> Secure content workspace <button onClick={logout}><LogOut size={14} aria-hidden="true" /> Sign out</button></div>
      </aside>
      <main className="admin-main">
        <header className="admin-topbar"><div><span>CONTENT MANAGEMENT</span><h1>{resourceLabels[resource]}</h1></div><div className="admin-top-actions"><button onClick={onClose}><ArrowLeft size={15} /> View website</button>{resource !== "inquiries" && resource !== "company" && <button className="button button-red" onClick={() => { setIsNew(true);         setEditing({ is_published: resource !== "clients" }); setError(""); }}> <Plus size={16} /> Add {resourceItemLabels[resource]}</button>}</div></header>
        {error && <div className="admin-error admin-error-wide" role="alert">{error}</div>}
        {notice && <div className="admin-notice"><Check size={15} /> {notice}<button onClick={() => setNotice("")}><X size={15} /></button></div>}
        <div className="admin-table-head"><span>{records.length} {resourceLabels[resource].toLowerCase()} records</span><button onClick={() => void loadRecords()}><Upload size={15} /> Refresh</button></div>
        <div className="admin-record-list">
          {records.map((record) => (
            <article className="admin-record" key={String(record.id)}>
              {resource !== "inquiries" && record.image && <img src={String(record.image)} alt="" />}
              <div className="admin-record-content">
                <strong>{String(record.title || record.name || record.company_name || record.subject || record.email || "Untitled")}</strong>
                <span>{String(record.category || record.client || record.tagline || record.description || record.email || record.inquiry_type || record.created_at || "")}</span>
                {resource === "inquiries" && <p>{String(record.message || "")}</p>}
              </div>
              {resource !== "inquiries" && resource !== "company" && <span className={record.is_published ? "published-badge" : "draft-badge"}>{record.is_published ? "Published" : "Draft"}</span>}
              {resource !== "inquiries" && (
                <div className="admin-record-actions">
                  <button className="admin-action-edit" type="button" onClick={() => { setIsNew(false); setEditing(record); setError(""); }}>
                    <Pencil size={15} aria-hidden="true" /> Edit
                  </button>
                  {resource !== "company" && (
                    <button className="admin-action-delete" type="button" onClick={() => void deleteRecord(record)}>
                      <Trash2 size={15} aria-hidden="true" /> Delete
                    </button>
                  )}
                </div>
              )}
            </article>
          ))}
          {!records.length && !error && <div className="admin-empty"><Layers3 size={24} /><strong>No records yet</strong><span>Add the first {resourceLabels[resource].toLowerCase()} record to get started.</span></div>}
        </div>
        {editing && resource !== "inquiries" && (
          <div className="editor-backdrop" role="presentation" onClick={() => setEditing(null)}>
            <form className="record-editor" onSubmit={saveRecord} onClick={(event) => event.stopPropagation()}>
              <div className="editor-heading"><div><span>{isNew ? "NEW RECORD" : "EDIT RECORD"}</span><h2>{isNew ? `Add ${resourceItemLabels[resource]}` : `Edit ${String(editing.title || editing.name || "")}`}</h2></div><button type="button" onClick={() => setEditing(null)} aria-label="Close editor"><X size={18} /></button></div>
              {fields.map((field) => (
                <label key={field.key}>{field.label}
                  {field.type === "textarea" ? <textarea name={field.key} defaultValue={String(editing[field.key] || "")} required={resource === "company" ? ["about_intro", "about_body", "profile_summary", "profile_leadership", "profile_credentials", "profile_capabilities"].includes(field.key) : resource !== "clients" && ["summary", "description"].includes(field.key)} rows={3} /> : field.type === "file" ? <div className="content-image-upload">{editing.image && <img src={String(editing.image)} alt={`Current ${resource === "projects" ? "project" : resource === "products" ? "product" : resource === "clients" ? "client" : resource === "gallery" ? "gallery" : "service"}`} />}<input name={field.key} type="file" accept="image/jpeg,image/png,image/webp" required={resource === "gallery" && isNew} /><small>JPG, PNG or WebP. Maximum file size: 5 MB. Leave empty to keep the current image.</small></div> : <input name={field.key} type={field.type || "text"} defaultValue={String(editing[field.key] || "")} required={resource === "company" ? ["company_name", "tagline", "founded_year", "email", "whatsapp_phone", "office_bd_address", "office_bd_phone"].includes(field.key) : resource === "clients" ? field.key === "name" : ["title", "name", "category", "summary", "description"].includes(field.key)} />}
                </label>
              ))}
              {resource !== "company" && <label className="publish-toggle"><input type="checkbox" name="is_published" value="1" defaultChecked={editing.is_published !== false && editing.is_published !== 0} /> Publish on website</label>}
              <button className="button button-red editor-save" disabled={busy}>{busy ? "Saving..." : "Save changes"} <Check size={16} /></button>
            </form>
          </div>
        )}
        <footer className="admin-footer">
          <span>© {new Date().getFullYear()} Power Breeze Engineering. All rights reserved.</span>
          <button type="button" onClick={onClose}>View public website <ArrowUpRight size={15} aria-hidden="true" /></button>
        </footer>
      </main>
    </div>
  );
}

export default function App() {
  const [adminMode, setAdminMode] = useState(window.location.pathname === "/admin-login");
  const [productsPage, setProductsPage] = useState(window.location.pathname === "/products");
  const [toast, setToast] = useState("");

  useEffect(() => {
    const handlePopState = () => {
      setAdminMode(window.location.pathname === "/admin-login");
      setProductsPage(window.location.pathname === "/products");
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  function showWebsite() {
    window.history.pushState({}, "", "/");
    setAdminMode(false);
    setProductsPage(false);
    window.scrollTo(0, 0);
  }

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 6000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  return (
    <>
      {adminMode ? <AdminPortal onClose={showWebsite} /> : <PublicSite onToast={setToast} productsPage={productsPage} />}
      {toast && !adminMode && <div className="toast-message" role="status"><Check size={17} />{toast}<button onClick={() => setToast("")} aria-label="Dismiss notification"><X size={16} /></button></div>}
    </>
  );
}
