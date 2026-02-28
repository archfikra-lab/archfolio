import Link from "next/link";

const faqs = [
    {
        category: "Getting Started",
        icon: "rocket_launch",
        questions: [
            {
                q: "How do I submit a project to Archfolio?",
                a: "Navigate to the Author Dashboard and click 'Submit Project'. You'll be guided through uploading your technical documentation, drawings, and project metadata. Our AI-assisted parser can extract data from PDFs automatically."
            },
            {
                q: "Do I need an account to browse projects?",
                a: "No — the Explore page, Archive, and Firms directory are publicly accessible. However, you'll need an account to submit projects, compare entries, or access portal dashboards."
            },
            {
                q: "What file formats are accepted for uploads?",
                a: "We accept PDF, JPG, PNG, and DWG files. PDFs are processed through our Gemini-powered parser to extract structured data. Maximum file size is 20MB per attachment."
            },
        ]
    },
    {
        category: "Review Process",
        icon: "rate_review",
        questions: [
            {
                q: "How does the review process work?",
                a: "After submission, your project enters 'Pending Review' status. Expert and Academic panels evaluate structural integrity, sustainability metrics, and design rigor. You'll receive feedback or approval within the platform."
            },
            {
                q: "What happens if my project is rejected?",
                a: "You'll receive detailed revision requests explaining what needs to be improved. You can update your submission and re-submit for review. Most rejections are due to incomplete technical documentation."
            },
            {
                q: "Can I update a project after it's been approved?",
                a: "Currently, approved projects are part of the permanent archive. Contact an administrator if corrections are needed. Future versions will support amendment requests."
            },
        ]
    },
    {
        category: "Platform Features",
        icon: "apps",
        questions: [
            {
                q: "How does the comparison feature work?",
                a: "On the Explore page, check the boxes on two or more project cards, then click 'Compare Projects'. This generates a side-by-side analysis of architectural, structural, and MEP specifications."
            },
            {
                q: "What themes are available?",
                a: "Archfolio supports three visual themes: Light (default tracing paper), Dark (midnight charcoal), and Blueprint (classic architectural cyan). Toggle between them using the theme switcher in the header."
            },
            {
                q: "What is the Archive vs. Explore page?",
                a: "Explore shows all approved projects with filters and map view. The Archive organizes the same projects by historical era (decade), offering a timeline-based perspective of the built environment."
            },
        ]
    },
    {
        category: "User Roles",
        icon: "badge",
        questions: [
            {
                q: "What are the different user roles?",
                a: "Archfolio has four roles: Author (submits projects), Expert (reviews structural/technical data), Academic (evaluates theoretical merit), and Admin (manages the platform). Each role has a dedicated dashboard."
            },
            {
                q: "How do I become an Expert or Academic reviewer?",
                a: "Contact the platform administrators through the feedback widget. Reviewer roles are granted based on professional credentials and academic affiliations."
            },
            {
                q: "Can one user have multiple roles?",
                a: "Currently, each account is assigned a single primary role. If you need access to multiple dashboards, contact an administrator to discuss your requirements."
            },
        ]
    },
];

const quickLinks = [
    { href: "/en/explore", label: "Explore Projects", icon: "search", desc: "Browse the full collection" },
    { href: "/en/author", label: "Submit a Project", icon: "publish", desc: "Start your submission" },
    { href: "/en/archive", label: "View Archive", icon: "inventory_2", desc: "Explore by decade" },
    { href: "/en/firms", label: "Firms Directory", icon: "business", desc: "Find architectural studios" },
];

export default function HelpPage() {
    return (
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 py-10 space-y-12">
            {/* Header */}
            <div className="border-b border-[var(--ink-line)] pb-8">
                <div className="inline-flex items-center gap-4 text-[var(--paper-plane-grey)] mb-4">
                    <span className="h-[1px] w-12 bg-[var(--ink-line)]"></span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.5em]">Support // Documentation</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-light text-[var(--deep-teal)] tracking-tighter uppercase mb-4">
                    Help <span className="italic opacity-80">Center</span>
                </h1>
                <p className="text-[var(--paper-plane-grey)] text-sm uppercase tracking-widest max-w-2xl">
                    Everything you need to know about navigating, contributing to, and getting the most from Archfolio.
                </p>
            </div>

            {/* Quick Links */}
            <section>
                <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--paper-plane-grey)] mb-4">Quick Navigation</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {quickLinks.map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="hand-drawn-card p-5 group hover-lift text-center"
                        >
                            <span className="material-symbols-outlined text-3xl text-[var(--paper-plane-grey)] group-hover:text-[var(--mustard-gold)] transition-colors mb-3 block">{link.icon}</span>
                            <h3 className="text-sm font-bold text-[var(--deep-teal)] uppercase tracking-tight mb-1">{link.label}</h3>
                            <p className="text-[10px] text-[var(--paper-plane-grey)] uppercase tracking-widest">{link.desc}</p>
                        </Link>
                    ))}
                </div>
            </section>

            {/* FAQ Sections */}
            <section className="space-y-10">
                <div className="flex items-center gap-4 mb-2">
                    <span className="material-symbols-outlined text-xl text-[var(--electric-teal)]">quiz</span>
                    <h2 className="text-xl font-bold text-[var(--deep-teal)] uppercase tracking-tight">Frequently Asked Questions</h2>
                    <div className="flex-1 h-px bg-[var(--ink-line)]"></div>
                </div>

                {faqs.map((section) => (
                    <div key={section.category}>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="material-symbols-outlined text-[var(--mustard-gold)]">{section.icon}</span>
                            <h3 className="text-lg font-bold text-[var(--deep-teal)] uppercase tracking-tight">{section.category}</h3>
                        </div>
                        <div className="space-y-3">
                            {section.questions.map((faq, i) => (
                                <details
                                    key={i}
                                    className="group bg-[var(--card-bg)] border border-[var(--ink-line)] hover:border-[var(--electric-teal)]/30 transition-colors"
                                >
                                    <summary className="cursor-pointer p-5 flex items-center justify-between text-[var(--deep-teal)] font-medium select-none list-none">
                                        <span className="flex items-center gap-3">
                                            <span className="text-[10px] font-bold text-[var(--paper-plane-grey)]">Q{i + 1}</span>
                                            <span className="text-sm">{faq.q}</span>
                                        </span>
                                        <span className="material-symbols-outlined text-[var(--paper-plane-grey)] group-open:rotate-180 transition-transform text-sm flex-shrink-0 ml-4">
                                            expand_more
                                        </span>
                                    </summary>
                                    <div className="px-5 pb-5 pt-0 ml-8 border-t border-[var(--ink-line)]">
                                        <p className="text-sm text-[var(--paper-plane-grey)] leading-relaxed pt-4 font-light">
                                            {faq.a}
                                        </p>
                                    </div>
                                </details>
                            ))}
                        </div>
                    </div>
                ))}
            </section>

            {/* Contact / Feedback CTA */}
            <section className="bg-[var(--card-bg)] border border-[var(--ink-line)] p-8 md:p-12 tracing-paper">
                <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="material-symbols-outlined text-2xl text-[var(--electric-teal)]">support_agent</span>
                            <h3 className="text-xl font-bold text-[var(--deep-teal)] uppercase tracking-tight">Still Need Help?</h3>
                        </div>
                        <p className="text-sm text-[var(--paper-plane-grey)] font-light max-w-lg leading-relaxed">
                            Use the feedback widget (bottom-right corner of any page) to send us a message. You can report bugs, request features, or ask questions directly to the development team.
                        </p>
                    </div>
                    <div className="flex flex-col gap-3 flex-shrink-0">
                        <Link
                            href="/en/explore"
                            className="chalk-btn px-8 py-3 text-xs font-bold uppercase tracking-widest text-[var(--deep-teal)] text-center flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined text-sm">search</span>
                            Start Exploring
                        </Link>
                        <Link
                            href="/en/author"
                            className="bg-[var(--mustard-gold)] text-white px-8 py-3 text-xs font-bold uppercase tracking-widest text-center flex items-center justify-center gap-2 hover:bg-[var(--deep-teal)] transition-colors"
                        >
                            <span className="material-symbols-outlined text-sm">edit_square</span>
                            Submit a Project
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
