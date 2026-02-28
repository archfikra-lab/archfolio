'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';

type TutorialStep = {
    icon: string;
    title: string;
    titleAr: string;
    subtitle: string;
    subtitleAr: string;
    description: string;
    descriptionAr: string;
};

type PageTutorial = {
    steps: TutorialStep[];
};

const globalTutorial: TutorialStep[] = [
    {
        icon: 'architecture',
        title: 'Welcome to Archfolio',
        titleAr: 'مرحباً بك في Archfolio',
        subtitle: 'Your Technical Archive',
        subtitleAr: 'أرشيفك التقني',
        description: 'Archfolio is a peer-reviewed repository for high-performance architectural case studies. Explore, submit, and get your projects verified by industry experts.',
        descriptionAr: 'Archfolio هو مستودع محكّم لدراسات الحالة المعمارية عالية الأداء. استكشف، واقدم، واحصل على تحقق مشاريعك من خبراء الصناعة.',
    },
    {
        icon: 'search',
        title: 'Explore Projects',
        titleAr: 'استكشف المشاريع',
        subtitle: 'Discover & Compare',
        subtitleAr: 'اكتشف وقارن',
        description: 'Browse verified projects worldwide. Filter by typology and style. Use grid or map view to discover projects geographically, or compare up to 4 side-by-side.',
        descriptionAr: 'تصفح المشاريع الموثقة حول العالم. رتب حسب النوع والأسلوب. استخدم العرض الشبكي أو الخريطة لاكتشاف المشاريع جغرافياً.',
    },
    {
        icon: 'edit_square',
        title: 'Submit Your Work',
        titleAr: 'قدّم أعمالك',
        subtitle: 'Author Dashboard',
        subtitleAr: 'لوحة المؤلف',
        description: 'Upload your project with multi-discipline documentation — Architectural, Structural, MEP, and Sustainability data. Attach photos, drawings, and documents.',
        descriptionAr: 'ارفع مشروعك مع وثائق متعددة التخصصات — معماري، إنشائي، وكهروميكانيكي. أضف الصور والرسومات والوثائق.',
    },
    {
        icon: 'rate_review',
        title: 'Peer Review',
        titleAr: 'مراجعة النظراء',
        subtitle: 'Expert & Academic Review',
        subtitleAr: 'مراجعة الخبراء والأكاديميين',
        description: 'Every submission goes through a structured review cycle. Expert engineers evaluate technical accuracy while academic reviewers assess the theoretical context.',
        descriptionAr: 'كل تقديم يمر بدورة مراجعة هيكلية. يقيّم المهندسون الخبراء الدقة التقنية بينما يقيّم المراجعون الأكاديميون السياق النظري.',
    },
    {
        icon: 'verified',
        title: 'Get Verified',
        titleAr: 'احصل على التوثيق',
        subtitle: 'Fikra Verification Badge',
        subtitleAr: 'شارة توثيق فكرة',
        description: 'Projects that pass review receive the Fikra Verification Badge — a mark of technical rigor and documentation excellence, permanently archived.',
        descriptionAr: 'المشاريع التي تجتاز المراجعة تحصل على شارة توثيق فكرة — علامة على الدقة التقنية والتميز في التوثيق.',
    },
];

const pageTutorials: Record<string, PageTutorial> = {
    '/explore': {
        steps: [
            {
                icon: 'filter_alt',
                title: 'Explore Page',
                titleAr: 'صفحة الاستكشاف',
                subtitle: 'Filter & Find Projects',
                subtitleAr: 'رتب وابحث عن مشاريع',
                description: 'Use filters to search projects by name, typology, architectural style, and location. Sort results by date or alphabetically.',
                descriptionAr: 'استخدم الفلاتر للبحث عن المشاريع حسب الاسم والنوع والأسلوب المعماري والموقع.',
            },
            {
                icon: 'map',
                title: 'Map & Grid Views',
                titleAr: 'العرض الشبكي والخريطة',
                subtitle: 'Toggle Display Modes',
                subtitleAr: 'تبديل أوضاع العرض',
                description: 'Switch between grid and map view. Map view shows project locations on an interactive world map.',
                descriptionAr: 'بدّل بين العرض الشبكي والخريطة. يعرض وضع الخريطة مواقع المشاريع على خريطة تفاعلية.',
            },
        ],
    },
    '/firms': {
        steps: [
            {
                icon: 'business',
                title: 'Firm Directory',
                titleAr: 'دليل الشركات',
                subtitle: 'Browse Architecture Firms',
                subtitleAr: 'تصفح شركات الهندسة المعمارية',
                description: 'Discover registered studios and engineering practices. View their profiles, specializations, and published projects.',
                descriptionAr: 'اكتشف الاستوديوهات والممارسات الهندسية المسجلة. اطلع على ملفاتهم وتخصصاتهم.',
            },
        ],
    },
    '/about': {
        steps: [
            {
                icon: 'info',
                title: 'About Archfolio',
                titleAr: 'عن Archfolio',
                subtitle: 'Mission & Values',
                subtitleAr: 'المهمة والقيم',
                description: 'Learn about our mission: Rigor, Accessibility, Collaboration, and Sustainability. Read our timeline and meet the team.',
                descriptionAr: 'تعرف على مهمتنا: الدقة، سهولة الوصول، التعاون، والاستدامة. اقرأ الجدول الزمني وتعرف على الفريق.',
            },
        ],
    },
    '/admin': {
        steps: [
            {
                icon: 'admin_panel_settings',
                title: 'Admin Dashboard',
                titleAr: 'لوحة الإدارة',
                subtitle: 'Platform Management',
                subtitleAr: 'إدارة المنصة',
                description: 'Manage users, partners, ads, and localization. View platform-wide KPIs and moderate submissions.',
                descriptionAr: 'إدارة المستخدمين والشركاء والإعلانات والتوطين. عرض مؤشرات الأداء الرئيسية ومراجعة المحتوى.',
            },
        ],
    },
    '/author': {
        steps: [
            {
                icon: 'edit_note',
                title: 'Author Studio',
                titleAr: 'استوديو المؤلف',
                subtitle: 'Create & Manage Projects',
                subtitleAr: 'إنشاء وإدارة المشاريع',
                description: 'Submit new architectural case studies, track review status, and manage your project portfolio. Save drafts and publish when ready.',
                descriptionAr: 'قدم دراسات حالة معمارية جديدة، تابع حالة المراجعة، وادر مشاريعك. احفظ المسودات وانشر عندما تكون جاهزاً.',
            },
        ],
    },
    '/expert': {
        steps: [
            {
                icon: 'rate_review',
                title: 'Expert Review Panel',
                titleAr: 'لوحة مراجعة الخبراء',
                subtitle: 'Technical Evaluation',
                subtitleAr: 'التقييم التقني',
                description: 'Review assigned submissions for technical accuracy. Evaluate structural integrity, MEP systems, and documentation quality.',
                descriptionAr: 'راجع المقدمات المعينة للدقة التقنية. قيّم السلامة الإنشائية وأنظمة MEP وجودة التوثيق.',
            },
        ],
    },
    '/academic': {
        steps: [
            {
                icon: 'school',
                title: 'Academic Portal',
                titleAr: 'البوابة الأكاديمية',
                subtitle: 'Research & Citation',
                subtitleAr: 'البحث والاستشهاد',
                description: 'Access verified case studies for academic research. Cite projects using standardized references for your papers and thesis.',
                descriptionAr: 'الوصول إلى دراسات الحالة الموثقة للبحث الأكاديمي. استشهد بالمشاريع باستخدام مراجع قياسية.',
            },
        ],
    },
};

export default function WelcomeTutorial() {
    const [show, setShow] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [animating, setAnimating] = useState(false);
    const [steps, setSteps] = useState<TutorialStep[]>([]);
    const pathname = usePathname();
    const isArabic = pathname.startsWith('/ar');

    const getPageKey = useCallback((): string => {
        const path = pathname.replace(/^\/(en|ar)/, '');
        return path || '/';
    }, [pathname]);

    useEffect(() => {
        const pageKey = getPageKey();
        const storageKey = `archfolio_tutorial_${pageKey === '/' ? 'home' : pageKey.replace(/\//g, '_')}`;
        const seen = localStorage.getItem(storageKey);

        if (!seen) {
            // Build the steps: global + page-specific
            let combinedSteps: TutorialStep[] = [];

            // Show the full tutorial on homepage first visit
            const globalSeen = localStorage.getItem('archfolio_tutorial_global');
            if (!globalSeen && pageKey === '/') {
                combinedSteps = globalTutorial;
                localStorage.setItem('archfolio_tutorial_global', 'true');
            } else if (pageTutorials[pageKey]) {
                combinedSteps = pageTutorials[pageKey].steps;
            }

            if (combinedSteps.length > 0) {
                setSteps(combinedSteps);
                setCurrentStep(0);
                const timer = setTimeout(() => setShow(true), 1000);
                localStorage.setItem(storageKey, 'true');
                return () => clearTimeout(timer);
            }
        }
    }, [getPageKey]);

    const dismiss = () => {
        setShow(false);
    };

    const next = () => {
        if (currentStep < steps.length - 1) {
            setAnimating(true);
            setTimeout(() => { setCurrentStep(currentStep + 1); setAnimating(false); }, 200);
        } else {
            dismiss();
        }
    };

    const prev = () => {
        if (currentStep > 0) {
            setAnimating(true);
            setTimeout(() => { setCurrentStep(currentStep - 1); setAnimating(false); }, 200);
        }
    };

    if (!show || steps.length === 0) return null;

    const step = steps[currentStep];
    const isLast = currentStep === steps.length - 1;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
            <div className="w-full max-w-2xl mx-4 animate-[fadeInUp_0.4s_ease]">
                {/* Card */}
                <div className="bg-[var(--drafting-white)] border border-[var(--ink-line)] overflow-hidden shadow-2xl">
                    {/* Top Visual */}
                    <div className="relative h-56 bg-[var(--deep-teal)] overflow-hidden flex items-center justify-center">
                        <div className="absolute inset-0 opacity-10"
                            style={{
                                backgroundImage: 'linear-gradient(var(--drafting-white) 1px, transparent 1px), linear-gradient(90deg, var(--drafting-white) 1px, transparent 1px)',
                                backgroundSize: '30px 30px'
                            }}>
                        </div>
                        <div className="absolute -bottom-12 -left-12 w-48 h-48 border border-[var(--electric-teal)]/20 rounded-full"></div>
                        <div className="absolute -top-8 -right-8 w-36 h-36 border border-[var(--mustard-gold)]/20 rounded-full"></div>

                        <div className={`relative z-10 transition-all duration-300 ${animating ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}>
                            <div className="w-24 h-24 border-2 border-[var(--mustard-gold)] flex items-center justify-center bg-[var(--mustard-gold)]/10 backdrop-blur-sm">
                                <span className="material-symbols-outlined text-5xl text-[var(--mustard-gold)]">{step.icon}</span>
                            </div>
                        </div>

                        <div className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-widest text-[var(--drafting-white)]/50">
                            {isArabic ? `الخطوة ${currentStep + 1} من ${steps.length}` : `Step ${currentStep + 1} of ${steps.length}`}
                        </div>

                        <button onClick={dismiss} className="absolute top-4 left-4 text-[var(--drafting-white)]/50 hover:text-[var(--drafting-white)] transition-colors">
                            <span className="material-symbols-outlined text-lg">close</span>
                        </button>
                    </div>

                    {/* Content */}
                    <div className={`p-8 text-center transition-all duration-300 ${animating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
                        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--electric-teal)] mb-2">
                            {isArabic ? step.subtitleAr : step.subtitle}
                        </p>
                        <h2 className="text-3xl font-bold text-[var(--deep-teal)] tracking-tight mb-4">
                            {isArabic ? step.titleAr : step.title}
                        </h2>
                        <p className="text-sm text-[var(--paper-plane-grey)] leading-relaxed max-w-md mx-auto">
                            {isArabic ? step.descriptionAr : step.description}
                        </p>
                    </div>

                    {/* Progress dots */}
                    {steps.length > 1 && (
                        <div className="flex justify-center gap-2 pb-6">
                            {steps.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => { setAnimating(true); setTimeout(() => { setCurrentStep(i); setAnimating(false); }, 200); }}
                                    className={`h-1.5 transition-all duration-300 ${i === currentStep
                                        ? 'w-8 bg-[var(--mustard-gold)]'
                                        : i < currentStep
                                            ? 'w-4 bg-[var(--electric-teal)]'
                                            : 'w-4 bg-[var(--ink-line)]'
                                        }`}
                                />
                            ))}
                        </div>
                    )}

                    {/* Actions */}
                    <div className={`flex items-center justify-between px-8 pb-8 ${isArabic ? 'flex-row-reverse' : ''}`}>
                        {steps.length > 1 ? (
                            <button
                                onClick={prev}
                                disabled={currentStep === 0}
                                className={`text-xs font-bold uppercase tracking-widest flex items-center gap-1 transition-colors ${currentStep === 0 ? 'text-[var(--ink-line)] cursor-not-allowed' : 'text-[var(--paper-plane-grey)] hover:text-[var(--deep-teal)]'}`}
                            >
                                <span className="material-symbols-outlined text-sm">arrow_back</span>
                                {isArabic ? 'السابق' : 'Previous'}
                            </button>
                        ) : <span />}

                        <button
                            onClick={next}
                            className="bg-[var(--mustard-gold)] text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[var(--deep-teal)] transition-colors flex items-center gap-2"
                        >
                            {isLast ? (isArabic ? 'ابدأ الآن' : 'Get Started') : (isArabic ? 'التالي' : 'Next')}
                            <span className="material-symbols-outlined text-sm">{isLast ? 'rocket_launch' : 'arrow_forward'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
