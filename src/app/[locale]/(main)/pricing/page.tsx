import { getSubscriptionPlansAction } from "@/app/actions/subscriptions";
import { Link } from "@/i18n/routing";

export default async function PricingPage() {
    const result = await getSubscriptionPlansAction();
    const plans = result.data?.filter(p => p.active) || [];

    return (
        <div className="max-w-7xl mx-auto py-12 px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
                <h1 className="text-4xl md:text-5xl font-bold text-[var(--deep-teal)] mb-4">Subscription Plans</h1>
                <p className="text-lg text-[var(--paper-plane-grey)]">
                    Join Archfolio to access in-depth architectural case studies. Whether you are a student, professional, or firm, we have a plan designed for you.
                </p>
            </div>

            {plans.length === 0 ? (
                <div className="text-center p-12 bg-[var(--card-bg)] border border-[var(--ink-line)]">
                    <h2 className="text-xl text-[var(--paper-plane-grey)]">Plans are currently being updated. Please check back later.</h2>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan, index) => {
                        let features: string[] = [];
                        try { features = JSON.parse(plan.featuresJson); } catch (e) { }

                        // Highlight the middle plan generally (often "Professional")
                        const isHighlighted = index === 1;

                        return (
                            <div key={plan.id} className={`relative bg-[var(--card-bg)] border p-8 flex flex-col ${isHighlighted ? 'border-[var(--mustard-gold)] shadow-lg scale-105 z-10' : 'border-[var(--ink-line)]'}`}>
                                {isHighlighted && (
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--mustard-gold)] text-white px-4 py-1 text-xs font-bold uppercase tracking-widest">
                                        Most Popular
                                    </div>
                                )}

                                <div className="mb-8">
                                    <h3 className="text-2xl font-bold text-[var(--deep-teal)] mb-2">{plan.name}</h3>
                                    <p className="text-[var(--paper-plane-grey)] text-sm min-h-[40px]">{plan.description}</p>
                                </div>
                                <div className="mb-8 border-b border-[var(--ink-line)] pb-8">
                                    <div className="flex items-end gap-1">
                                        <span className="text-4xl font-bold text-[var(--deep-teal)]">${plan.price}</span>
                                        {plan.perMonth && <span className="text-[var(--paper-plane-grey)] mb-1">/mo</span>}
                                    </div>
                                </div>

                                <div className="flex-1 mb-8">
                                    <p className="font-bold text-[var(--deep-teal)] mb-4 text-sm uppercase tracking-widest">What's included</p>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-3 text-[var(--deep-teal)]">
                                            <span className="material-symbols-outlined text-[var(--mustard-gold)] text-sm mt-0.5">check_circle</span>
                                            <span>
                                                <strong>{plan.downloadLimit === -1 ? 'Unlimited' : plan.downloadLimit}</strong> case study downloads per month
                                            </span>
                                        </li>
                                        {features.map((feature, i) => (
                                            <li key={i} className="flex items-start gap-3 text-[var(--deep-teal)]">
                                                <span className="material-symbols-outlined text-[var(--mustard-gold)] text-sm mt-0.5">check_circle</span>
                                                <span className="text-sm">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <Link href="/register" className={`w-full py-3 text-center font-bold uppercase tracking-widest text-xs transition-colors ${isHighlighted ? 'bg-[var(--deep-teal)] text-white hover:bg-[var(--mustard-gold)]' : 'bg-[var(--platinum-sheen)] text-[var(--deep-teal)] hover:bg-[var(--ink-line)]'}`}>
                                    Get Started
                                </Link>
                            </div>
                        );
                    })}
                </div>
            )}

            <div className="mt-20 border-t border-[var(--ink-line)] pt-12 text-center text-[var(--paper-plane-grey)] max-w-2xl mx-auto">
                <p className="text-sm">Have a large team? <Link href="/contact" className="text-[var(--deep-teal)] underline hover:text-[var(--mustard-gold)]">Contact us</Link> for customized enterprise solutions.</p>
            </div>
        </div>
    );
}
