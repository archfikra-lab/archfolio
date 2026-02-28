'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';

type HelpSection = {
    icon: string;
    title: string;
    titleAr: string;
    steps: string[];
    stepsAr: string[];
    tip?: string;
    tipAr?: string;
};

type PageHelp = {
    pageTitle: string;
    pageTitleAr: string;
    pageIcon: string;
    overview: string;
    overviewAr: string;
    sections: HelpSection[];
};

const helpContent: Record<string, PageHelp> = {
    '/': {
        pageTitle: 'Homepage',
        pageTitleAr: 'الصفحة الرئيسية',
        pageIcon: 'home',
        overview: 'The homepage provides a high-level overview of the Archfolio platform — featuring published projects, partner information, and community testimonials.',
        overviewAr: 'تقدم الصفحة الرئيسية نظرة عامة على منصة Archfolio — تعرض المشاريع المنشورة ومعلومات الشركاء والشهادات.',
        sections: [
            {
                icon: 'visibility',
                title: 'Browsing the Hero Section',
                titleAr: 'تصفح القسم الرئيسي',
                steps: [
                    'The hero displays the platform\'s mission and a featured architectural blueprint.',
                    'Key statistics (Projects, Authors, Countries) are shown below the description.',
                    'Click "View Technical Work" to browse the full project archive.',
                ],
                stepsAr: [
                    'يعرض القسم الرئيسي مهمة المنصة ومخطط معماري مميز.',
                    'الإحصائيات الرئيسية (المشاريع، المؤلفون، الدول) معروضة أسفل الوصف.',
                    'اضغط "عرض الأعمال التقنية" لتصفح أرشيف المشاريع الكامل.',
                ],
                tip: 'The hero image rotates to feature different architectural styles.',
                tipAr: 'تتغير صورة القسم الرئيسي لعرض أساليب معمارية مختلفة.',
            },
            {
                icon: 'route',
                title: 'How It Works',
                titleAr: 'كيف يعمل',
                steps: [
                    'Step 1: Submit — Upload your project through the Author Dashboard.',
                    'Step 2: Review — Experts and academics evaluate your submission.',
                    'Step 3: Publish — Approved projects are permanently archived and searchable.',
                ],
                stepsAr: [
                    'الخطوة 1: التقديم — ارفع مشروعك عبر لوحة المؤلف.',
                    'الخطوة 2: المراجعة — يقيّم الخبراء والأكاديميون تقديمك.',
                    'الخطوة 3: النشر — المشاريع المعتمدة تُؤرشف بشكل دائم.',
                ],
            },
            {
                icon: 'folder_open',
                title: 'Engineering Portfolio',
                titleAr: 'المحفظة الهندسية',
                steps: [
                    'Browse real project case studies organized by discipline.',
                    'Each project card links to a detailed view page with full technical data.',
                    'Filter projects by All Layers, Structural, or MEP categories.',
                ],
                stepsAr: [
                    'تصفح دراسات الحالة الحقيقية مرتبة حسب التخصص.',
                    'كل بطاقة مشروع تربط بصفحة عرض مفصلة مع بيانات تقنية كاملة.',
                    'رتب المشاريع حسب جميع الطبقات أو الإنشائي أو الكهروميكانيكي.',
                ],
            },
        ],
    },
    '/explore': {
        pageTitle: 'Explore Projects',
        pageTitleAr: 'استكشف المشاريع',
        pageIcon: 'search',
        overview: 'Discover, filter, and compare verified architectural projects from around the world.',
        overviewAr: 'اكتشف ورتب وقارن المشاريع المعمارية الموثقة من جميع أنحاء العالم.',
        sections: [
            {
                icon: 'filter_alt',
                title: 'Filtering Projects',
                titleAr: 'ترشيح المشاريع',
                steps: [
                    'Use the Search field to find projects by name or location.',
                    'Select a Typology to filter by building type.',
                    'Choose an Architectural Style to narrow results further.',
                    'Use the Sort By dropdown to order results.',
                ],
                stepsAr: [
                    'استخدم حقل البحث للعثور على المشاريع حسب الاسم أو الموقع.',
                    'اختر نوع المبنى للترشيح حسب النوع.',
                    'اختر أسلوباً معمارياً لتضييق النتائج.',
                    'استخدم قائمة الترتيب لتنظيم النتائج.',
                ],
                tip: 'Click "Clear All Filters" to reset everything at once.',
                tipAr: 'اضغط "مسح جميع الفلاتر" لإعادة التعيين دفعة واحدة.',
            },
            {
                icon: 'grid_view',
                title: 'View Modes',
                titleAr: 'أوضاع العرض',
                steps: [
                    'Grid View: Displays project cards in a visual grid layout.',
                    'Map View: Shows projects on an interactive world map.',
                    'Toggle between views using the icons in the top-right corner.',
                ],
                stepsAr: [
                    'العرض الشبكي: يعرض بطاقات المشاريع في تخطيط شبكي بصري.',
                    'عرض الخريطة: يعرض المشاريع على خريطة عالمية تفاعلية.',
                    'بدّل بين الأوضاع باستخدام الأيقونات في الزاوية العلوية.',
                ],
            },
            {
                icon: 'compare',
                title: 'Comparing Projects',
                titleAr: 'مقارنة المشاريع',
                steps: [
                    'Click the "Compare" checkbox on any project card.',
                    'Select 2-4 projects to compare side by side.',
                    'Click "Compare Selected" for a detailed comparison table.',
                ],
                stepsAr: [
                    'اضغط على خانة "المقارنة" في أي بطاقة مشروع.',
                    'اختر 2-4 مشاريع للمقارنة جنباً إلى جنب.',
                    'اضغط "مقارنة المحدد" لجدول مقارنة مفصل.',
                ],
                tip: 'Comparison covers typology, location, disciplines, and more.',
                tipAr: 'تغطي المقارنة النوع والموقع والتخصصات والمزيد.',
            },
        ],
    },
    '/about': {
        pageTitle: 'About Archfolio',
        pageTitleAr: 'عن Archfolio',
        pageIcon: 'info',
        overview: 'Learn about the platform\'s mission, values, timeline, team, and technology stack.',
        overviewAr: 'تعرف على مهمة المنصة وقيمها وجدولها الزمني وفريقها.',
        sections: [
            {
                icon: 'flag',
                title: 'Mission & Values',
                titleAr: 'المهمة والقيم',
                steps: [
                    'Archfolio prioritizes Rigor, Accessibility, Collaboration, and Sustainability.',
                    'Every submitted project undergoes multi-layered peer review.',
                ],
                stepsAr: [
                    'يعطي Archfolio الأولوية للدقة وسهولة الوصول والتعاون والاستدامة.',
                    'كل مشروع مقدم يخضع لمراجعة متعددة الطبقات.',
                ],
            },
            {
                icon: 'timeline',
                title: 'Platform Timeline',
                titleAr: 'الجدول الزمني للمنصة',
                steps: [
                    '2022: Concept phase — gap identified in MENA architectural documentation.',
                    '2023: Development — multi-discipline review framework established.',
                    '2024: Beta Launch — first reviewers onboarded.',
                    '2025: Public Release — global submissions open.',
                ],
                stepsAr: [
                    '2022: مرحلة المفهوم — تم تحديد فجوة في توثيق العمارة في المنطقة.',
                    '2023: التطوير — إنشاء إطار مراجعة متعدد التخصصات.',
                    '2024: الإطلاق التجريبي — انضمام أول المراجعين.',
                    '2025: الإطلاق العام — فتح التقديمات العالمية.',
                ],
            },
        ],
    },
    '/firms': {
        pageTitle: 'Firm Directory',
        pageTitleAr: 'دليل الشركات',
        pageIcon: 'business',
        overview: 'Browse registered firms, studios, and engineering practices.',
        overviewAr: 'تصفح الشركات والاستوديوهات والممارسات الهندسية المسجلة.',
        sections: [
            {
                icon: 'business',
                title: 'Finding Firms',
                titleAr: 'البحث عن الشركات',
                steps: [
                    'Firms are listed with specialization, project count, and location.',
                    'Click on a firm card to view their profile and published projects.',
                    'Stats bar shows total studios, verified projects, and team size.',
                ],
                stepsAr: [
                    'الشركات مدرجة مع التخصص وعدد المشاريع والموقع.',
                    'اضغط على بطاقة الشركة لعرض ملفها ومشاريعها.',
                    'شريط الإحصائيات يعرض إجمالي الاستوديوهات والمشاريع الموثقة.',
                ],
            },
        ],
    },
    '/author': {
        pageTitle: 'Author Dashboard',
        pageTitleAr: 'لوحة المؤلف',
        pageIcon: 'edit_note',
        overview: 'Your personal workspace to create, manage, and track project submissions.',
        overviewAr: 'مساحة عملك الشخصية لإنشاء وإدارة وتتبع تقديمات المشاريع.',
        sections: [
            {
                icon: 'add_circle',
                title: 'Submitting a Project',
                titleAr: 'تقديم مشروع',
                steps: [
                    'Click "Submit New Project" to start a new case study.',
                    'Fill in the project metadata: Title, Location, Typology, Year.',
                    'Add discipline data: Architectural, Structural, MEP, Sustainability.',
                    'Upload photos, drawings, and documents.',
                    'Submit for review when ready.',
                ],
                stepsAr: [
                    'اضغط "تقديم مشروع جديد" لبدء دراسة حالة جديدة.',
                    'أملأ بيانات المشروع: العنوان والموقع والنوع والسنة.',
                    'أضف بيانات التخصص: معماري وإنشائي وكهروميكانيكي واستدامة.',
                    'ارفع الصور والرسومات والوثائق.',
                    'قدم للمراجعة عندما تكون جاهزاً.',
                ],
                tip: 'Save as Draft to continue working later.',
                tipAr: 'احفظ كمسودة لمتابعة العمل لاحقاً.',
            },
            {
                icon: 'track_changes',
                title: 'Tracking Progress',
                titleAr: 'تتبع التقدم',
                steps: [
                    'View status: Draft, Pending Review, Approved, or Rejected.',
                    'Check reviewer feedback in the project detail view.',
                    'Resubmit after addressing feedback.',
                ],
                stepsAr: [
                    'عرض الحالة: مسودة أو قيد المراجعة أو معتمد أو مرفوض.',
                    'تحقق من ملاحظات المراجع في صفحة تفاصيل المشروع.',
                    'أعد التقديم بعد معالجة الملاحظات.',
                ],
            },
        ],
    },
    '/expert': {
        pageTitle: 'Expert Review Panel',
        pageTitleAr: 'لوحة مراجعة الخبراء',
        pageIcon: 'rate_review',
        overview: 'Review and evaluate submitted projects for technical accuracy.',
        overviewAr: 'مراجعة وتقييم المشاريع المقدمة للدقة التقنية.',
        sections: [
            {
                icon: 'assignment',
                title: 'Reviewing Projects',
                titleAr: 'مراجعة المشاريع',
                steps: [
                    'View assigned projects in your review queue.',
                    'Evaluate structural integrity, MEP systems, and documentation.',
                    'Provide detailed feedback and approve or request revisions.',
                ],
                stepsAr: [
                    'عرض المشاريع المعينة في قائمة المراجعة.',
                    'تقييم السلامة الإنشائية وأنظمة MEP والتوثيق.',
                    'تقديم ملاحظات مفصلة والموافقة أو طلب التعديلات.',
                ],
                tip: 'Detailed feedback helps authors improve quality.',
                tipAr: 'الملاحظات المفصلة تساعد المؤلفين على تحسين الجودة.',
            },
        ],
    },
    '/academic': {
        pageTitle: 'Academic Portal',
        pageTitleAr: 'البوابة الأكاديمية',
        pageIcon: 'school',
        overview: 'Access verified case studies for academic research and citation.',
        overviewAr: 'الوصول إلى دراسات الحالة الموثقة للبحث الأكاديمي والاستشهاد.',
        sections: [
            {
                icon: 'library_books',
                title: 'Research Access',
                titleAr: 'الوصول البحثي',
                steps: [
                    'Browse verified case studies with full technical documentation.',
                    'Cite projects using standardized references.',
                    'Export citation data for your papers and thesis.',
                ],
                stepsAr: [
                    'تصفح دراسات الحالة الموثقة مع وثائق تقنية كاملة.',
                    'استشهد بالمشاريع باستخدام مراجع قياسية.',
                    'تصدير بيانات الاستشهاد لأوراقك وأطروحاتك.',
                ],
            },
        ],
    },
    '/admin': {
        pageTitle: 'Admin Dashboard',
        pageTitleAr: 'لوحة الإدارة',
        pageIcon: 'admin_panel_settings',
        overview: 'Platform administration — manage users, content, partners, ads, and localization.',
        overviewAr: 'إدارة المنصة — إدارة المستخدمين والمحتوى والشركاء والإعلانات والتوطين.',
        sections: [
            {
                icon: 'dashboard',
                title: 'Dashboard Overview',
                titleAr: 'نظرة عامة على اللوحة',
                steps: [
                    'View KPIs: total submissions, pending reviews, approved projects.',
                    'Monitor recent activity and user registrations.',
                    'Quick-access buttons for Partners, Ads, Users, and Localization.',
                ],
                stepsAr: [
                    'عرض المؤشرات: إجمالي التقديمات والمراجعات المعلقة والمشاريع المعتمدة.',
                    'متابعة النشاط الأخير وتسجيلات المستخدمين.',
                    'أزرار وصول سريع للشركاء والإعلانات والمستخدمين والتوطين.',
                ],
            },
            {
                icon: 'translate',
                title: 'Localization Manager',
                titleAr: 'مدير التوطين',
                steps: [
                    'Click "Localization" to manage translations.',
                    'Search and filter by section.',
                    'Edit translations inline and track completion.',
                ],
                stepsAr: [
                    'اضغط "التوطين" لإدارة الترجمات.',
                    'ابحث ورتب حسب القسم.',
                    'حرر الترجمات مباشرة وتتبع نسبة الإنجاز.',
                ],
            },
        ],
    },
};

const fallbackHelp: PageHelp = {
    pageTitle: 'Help',
    pageTitleAr: 'مساعدة',
    pageIcon: 'help',
    overview: 'Welcome to Archfolio! Use the navigation menu to explore the platform.',
    overviewAr: 'مرحباً بك في Archfolio! استخدم قائمة التنقل لاستكشاف المنصة.',
    sections: [
        {
            icon: 'explore',
            title: 'Getting Started',
            titleAr: 'البدء',
            steps: [
                'Use the top navigation to explore projects, firms, and awards.',
                'Sign in to access your dashboard and submit projects.',
                'Toggle between themes using the theme switcher.',
                'Switch between English and Arabic using the language switcher.',
            ],
            stepsAr: [
                'استخدم التنقل العلوي لاستكشاف المشاريع والشركات والجوائز.',
                'سجل الدخول للوصول إلى لوحتك وتقديم المشاريع.',
                'بدّل بين السمات باستخدام مبدل السمات.',
                'بدّل بين الإنجليزية والعربية باستخدام مبدل اللغة.',
            ],
        },
    ],
};

export default function HelpOverlay() {
    const [open, setOpen] = useState(false);
    const [activeSection, setActiveSection] = useState(0);
    const pathname = usePathname();
    const isArabic = pathname.startsWith('/ar');

    const getPageHelp = useCallback((): PageHelp => {
        const path = pathname.replace(/^\/(en|ar)/, '') || '/';
        if (helpContent[path]) return helpContent[path];
        const segments = path.split('/');
        for (let i = segments.length; i >= 1; i--) {
            const prefix = segments.slice(0, i).join('/');
            if (helpContent[prefix]) return helpContent[prefix];
        }
        return fallbackHelp;
    }, [pathname]);

    const pageHelp = getPageHelp();

    useEffect(() => { setActiveSection(0); }, [pathname]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    return (
        <>
            {/* Floating Help Button */}
            <button
                onClick={() => setOpen(true)}
                className="fixed bottom-6 right-6 z-[998] w-14 h-14 bg-[var(--electric-teal)] text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-[var(--deep-teal)] transition-all hover:scale-110 group"
                aria-label="Open Help"
                title={isArabic ? 'المساعدة والدليل' : 'Help & Guide'}
            >
                <span className="material-symbols-outlined text-2xl group-hover:rotate-12 transition-transform">support_agent</span>
            </button>

            {/* Help Overlay */}
            {open && (
                <div className="fixed inset-0 z-[9998] flex items-stretch justify-end" onClick={() => setOpen(false)}>
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

                    <div
                        className={`relative w-full max-w-lg bg-[var(--drafting-white)] shadow-2xl overflow-y-auto animate-[slideInFromRight_0.3s_ease] ${isArabic ? 'border-r border-[var(--ink-line)]' : 'border-l border-[var(--ink-line)]'}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-[var(--deep-teal)] text-[var(--drafting-white)] p-6 z-10">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 border border-[var(--mustard-gold)] flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[var(--mustard-gold)]">{pageHelp.pageIcon}</span>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-[var(--drafting-white)]/50">{isArabic ? 'دليل الصفحة' : 'Page Guide'}</p>
                                        <h2 className="text-lg font-bold tracking-tight">{isArabic ? pageHelp.pageTitleAr : pageHelp.pageTitle}</h2>
                                    </div>
                                </div>
                                <button onClick={() => setOpen(false)} className="text-[var(--drafting-white)]/60 hover:text-[var(--drafting-white)] transition-colors">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                            <p className="text-sm text-[var(--drafting-white)]/70 leading-relaxed">{isArabic ? pageHelp.overviewAr : pageHelp.overview}</p>
                        </div>

                        {/* Section tabs */}
                        {pageHelp.sections.length > 1 && (
                            <div className="flex overflow-x-auto border-b border-[var(--ink-line)] bg-[var(--card-bg)]">
                                {pageHelp.sections.map((sec, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveSection(i)}
                                        className={`flex-shrink-0 px-4 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center gap-1.5 border-b-2 ${i === activeSection
                                            ? 'text-[var(--deep-teal)] border-[var(--mustard-gold)]'
                                            : 'text-[var(--paper-plane-grey)] border-transparent hover:text-[var(--deep-teal)]'
                                            }`}
                                    >
                                        <span className="material-symbols-outlined text-sm">{sec.icon}</span>
                                        {isArabic ? sec.titleAr : sec.title}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Active Section Content */}
                        <div className="p-6 space-y-6">
                            {pageHelp.sections.map((sec, sIdx) => (
                                <div key={sIdx} className={sIdx === activeSection || pageHelp.sections.length === 1 ? 'block' : 'hidden'}>
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="w-10 h-10 bg-[var(--deep-teal)]/5 border border-[var(--ink-line)] flex items-center justify-center">
                                            <span className="material-symbols-outlined text-[var(--deep-teal)]">{sec.icon}</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-[var(--deep-teal)] tracking-tight">{isArabic ? sec.titleAr : sec.title}</h3>
                                    </div>

                                    <div className="space-y-3">
                                        {(isArabic ? sec.stepsAr : sec.steps).map((step, i) => (
                                            <div key={i} className="flex gap-3 items-start group">
                                                <div className="flex-shrink-0 w-7 h-7 border border-[var(--electric-teal)] flex items-center justify-center text-[10px] font-bold text-[var(--electric-teal)] mt-0.5 group-hover:bg-[var(--electric-teal)] group-hover:text-white transition-colors">
                                                    {i + 1}
                                                </div>
                                                <p className="text-sm text-[var(--deep-teal)] leading-relaxed pt-1">{step}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {(isArabic ? sec.tipAr : sec.tip) && (
                                        <div className="mt-5 bg-[var(--mustard-gold)]/5 border border-[var(--mustard-gold)]/20 p-4 flex gap-3">
                                            <span className="material-symbols-outlined text-[var(--mustard-gold)] text-lg flex-shrink-0 mt-0.5">lightbulb</span>
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--mustard-gold)] mb-1">{isArabic ? 'نصيحة' : 'Pro Tip'}</p>
                                                <p className="text-xs text-[var(--deep-teal)] leading-relaxed">{isArabic ? sec.tipAr : sec.tip}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="sticky bottom-0 bg-[var(--card-bg)] border-t border-[var(--ink-line)] p-4 flex items-center justify-between">
                            <p className="text-[9px] text-[var(--paper-plane-grey)] uppercase tracking-widest">{isArabic ? 'اضغط ESC للإغلاق' : 'Press ESC to close'}</p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        // Clear all tutorial localStorage keys
                                        Object.keys(localStorage).forEach(key => {
                                            if (key.startsWith('archfolio_tutorial_')) localStorage.removeItem(key);
                                        });
                                        setOpen(false);
                                        window.location.reload();
                                    }}
                                    className="text-[10px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)] hover:text-[var(--deep-teal)] transition-colors border border-[var(--ink-line)] px-3 py-1.5"
                                >
                                    {isArabic ? 'إعادة العرض التعليمي' : 'Replay Tutorial'}
                                </button>
                                <button
                                    onClick={() => setOpen(false)}
                                    className="text-[10px] font-bold uppercase tracking-widest bg-[var(--deep-teal)] text-white px-4 py-1.5 hover:bg-[var(--electric-teal)] transition-colors"
                                >
                                    {isArabic ? 'فهمت' : 'Got It'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
