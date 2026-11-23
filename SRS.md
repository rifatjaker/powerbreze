# Website Requirements Specification

## Power Breeze Engineering Company Website

| Item | Details |
|---|---|
| Document version | 1.0 |
| Status | Draft |
| Date | 2026-11-23 |
| Project | Power Breeze Engineering website |
| Prepared for | Power Breeze Engineering |
| Prepared by | Imam Hossain Rifat (A2 Technologies) |

## 1. Introduction

### 1.1 Purpose

This document defines the functional and non-functional requirements for the Power Breeze Engineering public website. It reflects the company's electro-mechanical engineering, power infrastructure, electrical contracting, products, and project portfolio as represented on its existing company website.

### 1.2 Scope

Power Breeze Engineering is an electro-mechanical contractor and power engineering products and services provider, established in 2012. The website will serve government and private-sector clients, procurement teams, project owners, and engineering partners. It will present the company's verified services, imported and supplied products, project experience, client references, credentials, offices, and contact channels.

The in-scope system includes:

- Public website pages
- Responsive desktop, tablet, and mobile layouts
- Electro-mechanical service, product, and project information
- Company, credential, client, and office information
- General, project, and product inquiry forms
- Email notifications for customer inquiries
- Search-engine metadata
- Analytics integration (subject to consent requirements)
- Website administration for editing content
- Basic security, privacy, and accessibility features

The following are not included unless added by a change request:

- Customer accounts or login
- Online payments
- Appointment scheduling and calendar integration
- Live chat
- Technician dispatching
- Inventory, invoicing, or accounting
- Native mobile applications
- E-commerce

### 1.3 Definitions and Acronyms

| Term | Definition |
|---|---|
| HVAC | Heating, ventilation, and air conditioning |
| CTA | Call to action |
| SRS | Software Requirements Specification |
| CMS | Content Management System |
| SEO | Search Engine Optimization |

### 1.4 References

- [Current company website](http://powerbreezebd.net/)
- [Planned website domain](https://powerbreeze.ca/)
- Applicable Bangladesh privacy, cybersecurity, and procurement requirements (to be confirmed)
- Canadian privacy and anti-spam requirements where the Canada office or Canadian audiences are in scope
- WCAG 2.1 Level AA

### 1.5 Assumptions and Constraints

- Bangladesh is the company's primary operating market; a Canada office is also listed on the existing company website. Geographic service coverage must be confirmed before location-specific claims are published.
- The existing company website is the source of the service and product categories in this SRS. Product availability, technical specifications, licenses, and project/client permissions must be verified by the company before publication.
- Inquiry submissions are requests for information and do not create a legally binding quotation, contract, purchase order, or confirmed project.
- A single public website administrator will be sufficient for initial operations.
- The website will use HTTPS and will be hosted on a commercially supported web host.
- No appointment-availability or technician-dispatch integration is required in the initial release.

## 2. Overall Description

### 2.1 Product Perspective

The website is a standalone public-facing company and capability site. It will integrate with email delivery and optional analytics services. It should support a CMS or equivalent content-management mechanism for products, services, projects, clients, and corporate information.

### 2.2 Product Functions

- Present company profile, verified credentials, and engineering capabilities
- Categorize electro-mechanical services and products
- Showcase completed and approved projects and client references
- Capture project, product, and general business inquiries
- Present verified office and service-area information
- Provide click-to-call and email actions
- Present approved client references and project credentials
- Support content updates
- Produce crawlable, search-friendly pages

### 2.3 User Classes

| User | Description |
|---|---|
| Visitor / potential client | Reviews company capabilities, products, projects, and submits an inquiry |
| Procurement representative | Reviews product categories and submits a supply or tender-related inquiry |
| Administrator | Updates company pages, services, products, projects, clients, media, and settings |
| Inquiry recipient | Receives and follows up on submitted inquiries |

### 2.4 Operating Environment

- Modern desktop and mobile browsers
- Responsive layouts from 320 pixels wide upward
- Public hosting with HTTPS
- Web server, database, and CMS or static-site build system selected during implementation

### 2.5 Design and Implementation Constraints

- The public interface must be accessible and usable without JavaScript for core content.
- User data must be processed only for the stated inquiry purpose.
- Form submissions must be protected against spam and abuse.
- Content must be maintainable by a non-technical administrator.
- Third-party scripts must not block meaningful page rendering.
- License, certification, enlistment, project, and client information must be approved and substantiated before publication.

## 3. Specific Requirements

## 3.1 Functional Requirements

### FR-01: Home Page

The system shall provide a home page containing:

- Power Breeze Engineering name, logo, and concise power engineering value proposition
- Company establishment year and government/private-sector focus
- Primary CTA to submit a project or product inquiry
- Summary of electro-mechanical and power infrastructure capabilities
- Featured products and selected approved projects
- Verified licenses, credentials, and client/enlistment information
- Office/contact details and verified geographic coverage

### FR-02: About Page

The system shall provide a company profile page describing:

- Establishment in 2012 and company background
- Government and private-sector electro-mechanical work
- Mission, vision, strengths, and service approach
- Management and engineering team biographies, only when approved
- The current website's claim of first-class electro-mechanical contractor status, ABC License, and Electrical Supervisory License, only after exact issuing authority, current status, and evidence are confirmed
- Commitment to quality components, engineering standards, and turnkey delivery

### FR-03: Service Pages

The website shall present the following service categories, reflecting the company's existing website. The company shall confirm current availability, geographic scope, and exact technical scope before launch:

- Supply, installation, testing, and commissioning of 132/33/11 kV substations and related substation equipment
- Transformer, HT/LT switchgear, power factor improvement plant, busbar trunking (BBT), CT/PT, lightning arrester, DOFC, isolator, and insulator works
- Diesel and gas generator supply, installation, service, and synchronization/common-bus panel works
- Solar power plant and solar security-light solutions
- HT/LT underground and overhead cable, power-line, and commercial power-connection works
- Electrical wiring, distribution boards, motor control panels, changeover switches, and industrial/commercial lighting
- Electrical grounding and earthing, including GI pipe laying and boring where applicable
- Site survey, network planning, and design for MSPP and grounding work
- Installation, commissioning, and maintenance of battery, rectifier, and OSN equipment
- HVAC, elevator, cooling tower, lighting protection, and fire safety system supply and project work
- Turnkey electro-mechanical and civil construction, including interior decoration, where offered

Each service detail shall include a factual scope description, relevant equipment or project types, delivery stages (such as survey, design, supply, installation, testing, commissioning, or maintenance as applicable), applicable sector, and a project inquiry CTA. The site shall not imply certifications, voltage capability, safety approvals, or service availability beyond what the company verifies.

### FR-04: Products and Equipment

The website shall provide a product catalogue grouped by category. The current company website lists the following products for import or government supply; each listing is subject to confirmation of current availability, specifications, manufacturers, and procurement status:

- 33/11 kV, 2500 A vacuum circuit breaker (VCB)
- 11 kVA distribution dry-type transformer
- 132/33/11 kV underground cable
- 132/33/11 kV gas-insulated substation (GIS)
- Lighting protection system (LPS) and fire safety system (FSS)
- Batteries and battery chargers
- Oil testing sets and vacuum oil centrifuging machines
- Lightning arresters and drop-out fuse cutouts (DOFC)
- Isolators and insulators
- Current transformers (CT) and potential transformers (PT)
- Pre-paid meters and optical fiber
- Solar plants
- Busbar trunking (BBT) systems
- Passenger and bed elevators
- Transformers, distribution boxes, synchronizing/common-bus panels, solar power systems, and diesel engine generators

Each product record shall support a name, category, description, images, key specifications when verified, supply/availability notes, and inquiry CTA. The website shall not provide online purchasing unless explicitly approved in a future release.

### FR-05: Projects and Experience

The system shall provide a searchable or filterable portfolio of company projects. It may show project title, client/sector, location, scope, capacity or voltage where approved, completion period, project description, and approved imagery. The administrator shall be able to publish, edit, categorize, and archive project records. Confidential project details and client identities shall not be published without authorization.

### FR-06: Clients and Enlistments

The system may display government and private-sector clients, procurement enlistments, and institutional references listed by the company. Each logo, name, or status shall be published only with permission and current verification; display must not imply endorsement.

### FR-07: Offices and Coverage

The system shall display confirmed office addresses and contact details, including the Dhaka head office and any currently operated local or Canada offices. Geographic coverage shall be based on company confirmation; the website shall not create unsupported local-service claims or duplicate thin location pages.

The existing company website currently lists the following details, which shall be reconfirmed before launch:

- Dhaka head office: Dr. Nawab Ali Tower, Suite #501E, 24/A Purana Paltan, Dhaka-1000, Bangladesh; +88-02-9585474; +8801711520071; info@powerbreezebd.net
- Local office: 438 Abedin Market (3rd Floor), Noyapara, Sonirakhra, P.O. Dania, P.S. Jatrabari, Dhaka-1236; +8801819244217; ripon_218@yahoo.com
- Canada office: Suite 31, Workplace K Ltd, 1940 Eglinton Ave East, Scarborough, ON M1L 4R1, Toronto, Canada; +1 (647) 332-4217; +1 (647) 858-5225

### FR-08: Project and Product Inquiry Form

The inquiry form shall support general, project/service, and product/procurement inquiries. It shall collect, as applicable:

- Name
- Organization
- Role or department (optional)
- Phone number
- Email address
- Inquiry type
- Service or product category
- Project location
- Project scope, quantity, or technical requirements
- Message and optional file attachment, if supported
- Consent to be contacted

Required fields shall be minimal and clearly marked. The system shall validate contact details, restrict file type and size if attachments are enabled, and avoid collecting unnecessary sensitive or confidential tender information.

### FR-09: Inquiry Submission

When a visitor submits a valid inquiry, the system shall:

- Display a confirmation state
- Create a record in the backend or approved CRM/import queue
- Send a notification to the configured support inbox
- Send an optional confirmation email to the customer
- Protect against duplicate submissions
- Prevent submission when required or invalid fields are present

### FR-10: Contact Page

The contact page shall show:

- Confirmed company phone, fax, and email details
- Confirmed head, local, and Canada office addresses and contacts
- Verified business hours, if provided
- A general contact form
- Optional office map links or embeds
- Clear response-time expectation, if provided

### FR-11: Telephone and Email Actions

The system shall use device-friendly telephone links and a valid mailto link for published contact details. Clicking these actions shall not expose any additional personal information.

### FR-12: Clients, Credentials, and Featured Content

The system may display approved client references, license/certificate evidence, project highlights, and management messages. Client marks and formal credentials require permission and up-to-date validation.

The administrator shall be able to:

- Add and edit approved references
- Publish or unpublish references and credentials
- Reorder featured content

### FR-13: Project and Product Gallery

The system may display approved project and product photos. Every photo shall have appropriate alt text and shall not expose confidential project documents, restricted facilities, or personal information.

### FR-14: Frequently Asked Questions

The system may provide a reusable FAQ component for procurement, project delivery, products, and services. FAQ content shall be approved, accessible, and structured for search engines.

### FR-15: Navigation

The system shall provide:

- Header navigation
- Mobile navigation
- Footer navigation
- Breadcrumbs on nested pages
- Clear active-page indication
- Internal links to services, products, projects, clients, and contact pages

### FR-16: Search and Filtering

The system should provide site-wide search and project/product filtering when the catalogue size warrants it. Results shall:

- Be relevant
- Exclude unpublished content
- State when no result is found

### FR-17: CMS Administration

Authorized administrators shall be able to:

- Update navigation labels
- Create and edit pages
- Create and edit services
- Add, edit, publish, and archive products, projects, and client/reference records
- Update office contact details and business hours
- Manage credentials and approved media
- Upload and replace approved media
- Preview content before publication
- Preview publication-related metadata

### FR-18: SEO and Social Metadata

The system shall support:

- Unique page titles
- Unique descriptions
- Canonical URLs
- Open Graph metadata
- Structured Organization or relevant contracting-business schema
- Breadcrumb schema
- FAQ schema only for approved FAQ content
- XML sitemap
- Robots configuration
- Image alt text

### FR-19: Analytics

The system shall support an analytics implementation that records aggregate traffic and conversion events where consent permits. At minimum, track:

- Inquiry-form starts
- Inquiry-form submissions by inquiry type
- Telephone link clicks
- Email link clicks
- Key service, product, and project views

Tracking may be disabled by the visitor through consent controls where required.

### FR-20: Privacy and Consent

The system shall provide:

- A Privacy Policy
- A Cookie or analytics notice if analytics cookies are used
- Consent controls where legally required
- A link in the footer to privacy information

### FR-21: Error Pages

The system shall provide a branded 404 page and a generic 500 or unavailable page. Each error page shall offer navigation back to the home page and contact options.

## 3.2 External Interface Requirements

### 3.2.1 User Interfaces

- Branding shall use a consistent blue/green palette unless replaced by an approved brand guide.
- Typography shall remain readable across supported breakpoints.
- Buttons and links shall include visible keyboard focus.
- Form validation shall be understandable and accessible.
- Call buttons shall remain easily discoverable on mobile devices.
- Layout shall avoid horizontal scrolling at supported widths.

### 3.2.2 Hardware Interfaces

No direct hardware interfaces are required.

### 3.2.3 Software Interfaces

| Interface | Purpose |
|---|---|
| SMTP or transactional email provider | Send business inquiry notifications and optional confirmations |
| Analytics provider | Aggregate website measurement |
| Map provider | Optional embedded map |
| CMS or database | Manage pages, products, services, projects, and references |
| Form spam service | Detect automated or abusive submissions |

### 3.2.4 Communications Interfaces

- HTTPS for all public traffic
- REST or server-side form submission for inquiry data
- Email delivery using an authenticated provider
- Optional DNS, CDN, and caching integration

## 3.3 Non-Functional Requirements

### NFR-01: Performance

- Core content shall become visible within 2 seconds on a representative broadband connection.
- Largest Contentful Paint shall be below 2.5 seconds at the 75th percentile.
- Cumulative Layout Shift shall remain below 0.1.
- Interaction to Next Paint shall remain below 200 milliseconds at the 75th percentile.
- Images shall be compressed and served in modern formats.

### NFR-02: Availability

- Public pages shall target 99.9 percent monthly availability, excluding planned maintenance.
- Website hosting shall provide monitored backups and recovery procedures.

### NFR-03: Scalability

- The system shall support at least 500 concurrent website users during normal operations.
- Form submission endpoints shall support expected marketing traffic peaks.

### NFR-04: Security

- All data transfer shall use HTTPS.
- Authentication shall use a strong unique password and multi-factor authentication where supported.
- The system shall implement authorization controls for administration.
- Administrative access shall lock out or throttle repeated failed login attempts.
- Form submissions shall use server-side validation.
- Secrets shall not be stored in public source code.
- Dependencies shall be updated and reviewed for known vulnerabilities.
- Inquiry data shall be retained only according to an approved retention schedule.
- Customer submissions shall not appear in public URLs.
- File attachments, if enabled, shall be size/type restricted, scanned, and stored outside public executable paths.
- Procurement and project inquiry content shall be access-restricted to authorized staff.

### NFR-05: Accessibility

- The website shall conform to WCAG 2.1 Level AA.
- Pages shall support keyboard-only navigation.
- Links and controls shall have meaningful names.
- Images shall use appropriate alternative text.
- Color shall not be the only indicator of information.
- Form errors shall be announced to assistive technologies.
- Text and controls shall maintain sufficient contrast.

### NFR-06: SEO

- Pages shall have semantic heading structures.
- URLs shall be short and descriptive.
- Internal links shall use descriptive anchor text.
- Sitemaps shall update when published content changes.
- Duplicate location and service content shall be avoided.

### NFR-07: Usability

- A visitor shall reach a project or product inquiry form within two clicks from the home page.
- Important contact actions shall be visible on every page.
- Mobile navigation shall remain usable with one hand.
- Form labels shall remain visible after entry.
- Validation messages shall identify corrective action.

### NFR-08: Maintainability

- The project shall use version control.
- The codebase shall have environment-specific configuration.
- The deployment process shall be repeatable.
- Administrative workflows shall be documented.
- Third-party integrations shall be isolated from core rendering where possible.

### NFR-09: Compatibility

The system shall support current and previous major releases of:

- Chrome
- Safari
- Firefox
- Microsoft Edge
- Android Chrome
- Mobile Safari

### NFR-10: Backup and Recovery

- Website data shall be backed up at least once daily.
- Backups shall be retained according to the hosting agreement.
- Database and media recovery shall be tested before launch.
- A critical-site restore shall be achievable within four hours.

### NFR-11: Privacy

- The system shall collect only information necessary for its stated purpose.
- A submitted inquiry shall not be indexed or publicly exposed.
- Third-party integrations shall disclose their data purpose.
- Data removal requests shall be supported through an approved process.

## 4. Data Requirements

## 4.1 Key Entities

| Entity | Required Attributes |
|---|---|
| Service | ID, title, slug, category, description, status |
| Product | ID, name, category, description, specifications (verified), image, availability note, status |
| Project | ID, title, sector/client (approved), location, scope, capacity/voltage (verified), dates, media, status |
| Office | ID, office type, address, phone, email, operating status |
| Client/reference | ID, name/logo, permission/status, reference details |
| Credential | ID, title, issuer, identifier, valid dates, evidence, publication approval |
| Inquiry | ID, name, organization, contact information, inquiry type, service/product, project location, message, status, created date |
| Media | ID, file, alternative text, usage, status |
| Page | ID, title, slug, content, metadata, publication status |

## 4.2 Inquiry Retention and Confidentiality

Inquiry retention shall be defined before launch and comply with applicable law and company policy. Project, procurement, and tender details shall be treated as confidential business information and shall not be publicly displayed or included in analytics.

## 5. Acceptance Criteria

The initial release is acceptable when:

- The home, company profile, services, products, projects, clients/references, contact, privacy, and error pages are complete.
- The content reflects the company's actual electro-mechanical and power engineering work.
- Every product specification, credential, client reference, and project detail is supported by company approval and evidence.
- All links and CTAs point to valid destinations.
- Project, product, and general inquiry forms validate, submit, notify staff, and display confirmation.
- Spam protection is active.
- The site passes responsive checks from 320 to 1920 pixels.
- Core pages pass WCAG 2.1 Level AA automated and manual checks.
- Metadata, sitemap, robots, and canonical URLs are configured.
- Analytics and consent behavior are verified.
- HTTPS and security headers are active.
- A production backup and restore test has been completed.
- The site achieves the stated performance targets in a representative test.
- Search, duplicate, broken-link, and form-spam tests pass.

## 6. Verification and Testing

| Test Area | Verification Method |
|---|---|
| Navigation | Manual desktop and mobile testing |
| Forms | Valid, invalid, duplicate, spam, and restricted-attachment submissions |
| Responsive layout | Browser and viewport testing |
| Accessibility | Automated scanning plus keyboard and screen-reader testing |
| Performance | Lighthouse and WebPageTest measurements |
| SEO | Crawl, metadata, sitemap, and schema validation |
| Security | Dependency scan, penetration smoke test, HTTPS and header review |
| Administration | CRUD, permissions, preview, and publish testing |
| Email | Notification and confirmation delivery testing |
| Recovery | Backup restore simulation |
| Analytics | Event and consent testing |

## 7. Release Priorities

### Priority 1 — Launch

- Home page
- Company profile
- Core electro-mechanical and power engineering services
- Product catalogue
- Project portfolio
- Contact and project/product inquiry forms
- Approved credentials and client references
- CTA and phone actions
- Privacy policy
- Mobile responsiveness
- HTTPS
- Basic SEO
- Core accessibility

### Priority 2 — Expansion

- Additional products and project filters
- Detailed capability pages
- Client/enlistment directory
- Project and product gallery
- FAQ
- Analytics dashboard integration

### Priority 3 — Future

- CRM integration
- Tender/procurement document center, subject to access controls
- Project case studies
- Multilingual content (Bangla and English)

## 8. Open Items Requiring Confirmation

| Item | Required Decision |
|---|---|
| Company details | Confirm official legal/business name, language, company history, and office status |
| Service scope | Confirm current service categories, voltage ratings, capacity ranges, and geographic availability |
| Products | Confirm active import/supply items, brands, specifications, lead times, and warranty information |
| Licenses | Confirm current ABC Contractor and Electrical Supervisory License claims and publishable evidence |
| Projects | Approve project dates, client names, scopes, capacities, photos, and confidentiality status |
| Clients | Approve client/enlistment logos, names, current status, and permissions |
| Service area | Confirm Bangladesh coverage and whether/how Canada office serves clients |
| Commercial model | Confirm project inquiry, tender, procurement, and quotation workflow |
| Branding | Approve logo, colors, fonts, photography, and use of company name |
| Team | Approve staff biographies, roles, and credentials |
| Contact details | Confirm current phone, fax, email, office addresses, and preferred inquiry inbox |
| Languages | Confirm English-only launch or English/Bangla support |
| Contact workflow | Define response owner, response time, escalation, and retention |
| CMS | Preferred platform and hosting provider |
| Domain | DNS ownership and email configuration |
| Analytics | Provider and consent requirements |
