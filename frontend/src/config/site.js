export const BRAND = {
  name: "BookHive",
  wordmark: {
    leading: "Book",
    accent: "Hive",
  },
  tagline: "READ | DISCOVER | ENJOY",
};

export const TOP_BAR = {
  promo: "Free shipping on orders over INR 999",
  rating: "4.8/5 from 10K+ reviews",
};

export const NAV_ITEMS = [
  { path: "/", label: "Home" },
  { path: "/books", label: "Books" },
  { path: "/categories", label: "Categories" },
  { path: "/bestsellers", label: "Bestsellers" },
  { path: "/new-arrivals", label: "New Arrivals" },
  { path: "/deals", label: "Deals" },
  { path: "/about", label: "About" },
  { path: "/contact", label: "Contact" },
];

export const CONTACT_INFO = {
  email: "support@bookhive.com",
  phone: "+1 (555) 123-4567",
  addressLines: ["123 Library Lane, Suite 100", "New York, NY 10001"],
  hours: "Mon-Sat, 9:00 AM - 7:00 PM",
};

export const FOOTER = {
  description:
    "Discover, rate, and share your favorite books with a growing community of readers.",
  sections: [
    {
      title: "Company",
      links: [
        { label: "About Us", to: "/about" },
        { label: "Contact", to: "/contact" },
      ],
    },
    {
      title: "Explore",
      links: [{ label: "Browse Books", to: "/books" }],
    },
  ],
  social: [
    { label: "Instagram", href: null },
    { label: "Github", href: null },
    { label: "Email", href: "mailto:support@bookhive.com" },
  ],
};

export const HOME_CONTENT = {
  badge: "The Collector's Archive",
  heroTitle: "Welcome to",
  heroEmphasis: "BookHive.",
  heroSubtitle:
    "Where every story finds its place. Browse our curated selection of fine literature and modern classics in a space built for readers.",
  heroPrimaryCta: "Browse Hive",
  heroSecondaryCta: "Bestsellers",
  featuredKicker: "Prime Picks",
  featuredTitle: "Hive Bestsellers",
  libraryTitle: "Explore the Full Hive",
  libraryDescription:
    "Our entire collection of meticulously sourced volumes, ranging from history and science to the finest fiction.",
  libraryCta: "See All Volumes",
  ctaTitle: "Ready to grow your collection?",
  ctaDescription:
    "Join 5,000+ BookHive members and get access to exclusive first-editions and monthly reading club discussions.",
  ctaLoggedIn: "Continue Exploring",
  ctaLoggedOut: "Join the Hive",
};
