import CategoryItem from "../components/CategoryItem";
import Wishlist from "../components/Wishlist";
import CompanyLogos from "../components/CompanyLogos";
import {
  BookOpen,
  Code,
  Palette,
  Search,
  Users,
  ShoppingCart,
} from "lucide-react";

const categories = [
  { href: "/ebooks", name: "E-books", imageUrl: "/ebook.gif" },
  { href: "/cheetsheets", name: "Cheatsheets", imageUrl: "/cheetsheet.gif" },
  { href: "/icons", name: "Icons", imageUrl: "/icon.gif" },
  { href: "/photos", name: "Photos", imageUrl: "/photo.gif" },
  { href: "/templates", name: "Templates", imageUrl: "/template.gif" },
  {
    href: "/codesnippets",
    name: "Code Snippets",
    imageUrl: "/codesnippet.gif",
  },
];

const services = [
  {
    icon: BookOpen,
    title: "Digital Assets Hub",
    description:
      "E-books, templates, code snippets, icons, and photos all in one place.",
    iconColor: "text-emerald-400",
  },
  {
    icon: Search,
    title: "Smart Search",
    description:
      "Advanced search by name, description, and category for quick discovery.",
    iconColor: "text-blue-400",
  },
  {
    icon: ShoppingCart,
    title: "Cart System",
    description:
      "Seamless cart management with quantity control and order summaries.",
    iconColor: "text-purple-400",
  },
  {
    icon: Users,
    title: "Community Platform",
    description:
      "Connect with designers, developers, and creators through our community.",
    iconColor: "text-orange-400",
  },
  {
    icon: Palette,
    title: "Categorized Marketplace",
    description:
      "Proper categorization of the digital products to create convenience for the customers.",
    iconColor: "text-indigo-400",
  },
  {
    icon: Code,
    title: "Free & Paid Tiers",
    description:
      "Choose from free resources or premium paid content with secure payments.",
    iconColor: "text-yellow-400",
  },
];

const HomePage = () => {
  return (
    <div className="bg-gray-950 text-white">
      {/* Hero Section */}
      <div className="relative w-full h-[400px] sm:h-[700px]">
        <div className="absolute inset-0 z-10">
          <img
            src="/durve.svg"
            alt="Background Vector"
            className="w-full h-full object-cover opacity-10"
          />
        </div>

        <img
          src="/hero-img.jpg"
          alt="Demo Background"
          className="absolute inset-0 w-full h-full object-cover z-10"
        />

        <div className="absolute inset-0 bg-opacity-50 flex items-center justify-center flex-col text-center px-4 z-30">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 mt-20">
            All your digital needs. One place.
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mb-10">
            Tired of searching everywhere? Emporio has it all — in one place.
          </p>
          <a
            href="#categories"
            className="inline-block bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300"
          >
            Browse Categories
          </a>
        </div>
      </div>
      {/* Services Section */}
      <div className="bg-gradient-to-b from-gray-900 to-gray-950 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              <span className="text-emerald-400">Services</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              A comprehensive digital marketplace designed for creators and
              professionals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.title}
                  className={`
                    group relative overflow-hidden
                    bg-gradient-to-br from-gray-800/40 to-gray-900/40
                    backdrop-blur-sm border border-gray-700/30
                    rounded-xl p-5 h-[160px]
                    hover:border-emerald-500/50 hover:shadow-lg
                    hover:shadow-emerald-500/10
                    transition-all duration-300 ease-out
                    hover:scale-[1.02] hover:-translate-y-1
                    cursor-pointer
                  `}
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  <div className="relative z-10 h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`
                        flex items-center justify-center w-10 h-10 
                        bg-gray-700/50 rounded-lg
                        group-hover:scale-110 transition-transform duration-300
                      `}
                      >
                        <Icon
                          size={20}
                          className={`${service.iconColor} group-hover:scale-110 transition-transform duration-300`}
                        />
                      </div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-emerald-300 transition-colors">
                        {service.title}
                      </h3>
                    </div>
                    <p className="text-gray-400 group-hover:text-gray-300 transition-colors text-sm leading-relaxed flex-1">
                      {service.description}
                    </p>
                    <div className="mt-3 h-0.5 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="absolute top-2 right-2 w-8 h-8 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* Categories Section */}
      <div id="categories" className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-center text-3xl sm:text-4xl font-bold text-emerald-400 mb-3">
          Our Categories
        </h2>
        <p className="text-center text-lg text-gray-400 mb-10">
          Discover the latest digital resources at your convenience
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
          {categories.map((category) => (
            <CategoryItem category={category} key={category.name} />
          ))}
        </div>

        {/* Flexible Wishlist + Prompt Section */}
        <div className="mt-40 mb-10">
          <div className="flex flex-col lg:flex-row gap-8 items-stretch">
            {/* Left: Prompt with Enhanced SVG Grid Pattern Background */}
            <div className="flex-1 relative overflow-hidden bg-gray-900/90 rounded-2xl p-8 flex flex-col justify-center items-center text-center">
              {/* Enhanced SVG Grid Pattern with Faded Edges */}
              <svg
                className="absolute inset-0 w-full h-full opacity-30 pointer-events-none"
                width="100%"
                height="100%"
                viewBox="0 0 400 400"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ zIndex: 0 }}
              >
                <defs>
                  {/* Small grid pattern with thicker lines */}
                  <pattern
                    id="largeGrid"
                    width="20"
                    height="20"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 20 0 L 0 0 0 20"
                      fill="none"
                      stroke="#19e4be"
                      strokeWidth="2"
                    />
                  </pattern>

                  {/* Large grid pattern with even thicker lines */}
                  <pattern
                    id="grid"
                    width="90"
                    height="80"
                    patternUnits="userSpaceOnUse"
                  >
                    <rect width="80" height="80" fill="url(#smallGrid)" />
                    <path
                      d="M 80 0 L 10 10 0 80"
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="3"
                    />
                  </pattern>

                  {/* Fade mask for edges */}
                  <mask id="fadeMask">
                    <rect width="100%" height="100%" fill="white" />

                    {/* Top fade */}
                    <rect width="100%" height="60" fill="url(#topFade)" />

                    {/* Bottom fade */}
                    <rect
                      y="340"
                      width="100%"
                      height="60"
                      fill="url(#bottomFade)"
                    />

                    {/* Left fade */}
                    <rect width="60" height="100%" fill="url(#leftFade)" />

                    {/* Right fade */}
                    <rect
                      x="340"
                      width="60"
                      height="100%"
                      fill="url(#rightFade)"
                    />
                  </mask>

                  {/* Fade gradients for each edge */}
                  <linearGradient id="topFade" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="black" />
                    <stop offset="100%" stopColor="white" />
                  </linearGradient>

                  <linearGradient id="bottomFade" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="white" />
                    <stop offset="100%" stopColor="black" />
                  </linearGradient>

                  <linearGradient id="leftFade" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="black" />
                    <stop offset="100%" stopColor="white" />
                  </linearGradient>

                  <linearGradient id="rightFade" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="white" />
                    <stop offset="100%" stopColor="black" />
                  </linearGradient>
                </defs>

                {/* Apply the grid pattern with fade mask */}
                <rect
                  width="100%"
                  height="100%"
                  fill="url(#grid)"
                  mask="url(#fadeMask)"
                />
              </svg>

              {/* Subtle overlay for better text readability */}
              <div className="absolute inset-0 bg-gray-900/80"></div>

              <div className="absolute inset-0 rounded-2xl shadow-[inset_0_0_120px_90px_#030712,inset_0_0_60px_20px_rgba(3,7,18,0.8),inset_0_0_10px_4px_#030712] pointer-events-none"></div>

              {/* Content */}
              <div className="relative z-10">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2 select-none">
                  Can't find a product?
                </h2>
                <h3 className="text-lg sm:text-2xl font-semibold text-emerald-400 mb-4 select-none">
                  Wishlist it now to get it soon!
                </h3>
                <p className="text-gray-400 max-w-md mx-auto">
                  Tell us what you want. Your votes and suggestions help decide
                  which products and resources are released next!
                </p>
              </div>
            </div>

            {/* Right: Wishlist stays unchanged */}
            <div className="flex justify-center">
              <Wishlist />
            </div>
          </div>
        </div>
      </div>
      {/* Company Logos Section - Moved to Bottom with Matching Color */}
      <div className="bg-[#0c1323] mt-20 py-8">
        <CompanyLogos />
      </div>
      {/* ------------------------------- */}

      {/* Modern FAQ Section */}
      <div className="w-full flex flex-col items-center justify-center pt-24 pb-14 bg-transparent">
        {/* Small label over the FAQ */}
        <div className="mb-4">
          <span className="px-4 py-1 rounded-full bg-gradient-to-r from-blue-500/40 to-emerald-500/40 text-sm font-medium text-white/80 shadow-sm backdrop-blur-sm">
            Get to know
          </span>
        </div>
        <h2 className="text-center text-3xl sm:text-4xl font-bold mb-12 text-white tracking-tight">
          Frequently Asked
          <br className="sm:hidden" /> Questions
        </h2>
        <div className="w-full max-w-2xl space-y-5">
          {[
            {
              q: "Is my content safe and secure when using your AI software?",
              a: "Yes, your content privacy and security are top priorities. All user data is encrypted and protected on our platform.",
            },
            {
              q: "Do you provide customer support or training resources for users?",
              a: "Absolutely! We offer detailed documentation, tutorials, and live support to help users make the most of our services.",
            },
            {
              q: "How can your AI software improve the quality of my content?",
              a: "Our AI leverages advanced algorithms to enhance content clarity, structure, and engagement based on your targets.",
            },
          ].map((faq, idx) => (
            <details
              key={idx}
              className="bg-[#18151d] shadow-[0_8px_32px_0_rgba(31,38,135,0.12)] rounded-xl group transition-all"
            >
              <summary className="flex items-center justify-between px-7 py-5 text-base sm:text-lg font-medium text-gray-100 cursor-pointer group-open:text-emerald-300 transition-all">
                {faq.q}
                <span className="ml-6">
                  <svg
                    className="w-5 h-5 text-emerald-300 group-open:rotate-45 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={3}
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12 5v14m7-7H5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </summary>
              <div className="px-7 pb-6 pt-1 text-sm text-gray-400">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* ------------------------ */}
      {/* FAQ + Join Community Section */}
      <div className="max-w-6xl mx-auto px-4 py-20 lg:py-3">
        {/* FAQ Section */}

        {/* Community CTA */}
        <div className="mt-16 bg-gradient-to-tr from-emerald-700/60 via-[#18222c]/80 to-[#161c24] rounded-2xl flex flex-col items-center justify-center px-8 py-12 shadow-lg text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Let's discuss, make something{" "}
            <span className="text-emerald-400">cool</span> together
          </h2>
          <p className="text-gray-300 mb-6 max-w-2xl">
            Join our community of creators and digital makers. Ask questions,
            give feedback, find collaborators and discover more!
          </p>
          <a
            href="/community"
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-8 rounded-lg text-lg shadow-md transition duration-300"
          >
            Join Community
          </a>
        </div>
      </div>

      {/* Compact Modern Footer */}
      <footer className="relative mt-28 pt-12 pb-6 w-full bg-gray-900 text-white border-t border-gray-700/50">
        <div className="max-w-6xl mx-auto px-6">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 relative">
            {/* Brand & Description */}
            <div className="space-y-4 relative">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold bg-gradient-to-r bg-emerald-400 bg-clip-text text-transparent">
                  Emporio
                </span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Your one-stop digital marketplace for creators and
                professionals.
              </p>
              <div className="flex space-x-3">
                {/* facebook */}
                <a
                  href="https://facebook.com"
                  className="w-8 h-8 bg-gray-800 hover:bg-emerald-600 rounded-md flex items-center justify-center transition-colors"
                  aria-label="Facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                {/* github */}
                <a
                  href="https://github.com/MIhirDas10"
                  className="w-8 h-8 bg-gray-800 hover:bg-emerald-600 rounded-md flex items-center justify-center transition-colors"
                  aria-label="Twitter"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />{" "}
                  </svg>
                </a>
                {/* twitter or x */}
                <a
                  href="https://x.com"
                  className="w-8 h-8 bg-gray-800 hover:bg-emerald-600 rounded-md flex items-center justify-center transition-colors"
                  aria-label="x"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                {/* linkedin */}
                <a
                  href="https://linkedin.com"
                  className="w-8 h-8 bg-gray-800 hover:bg-emerald-600 rounded-md flex items-center justify-center transition-colors"
                  aria-label="LinkedIn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>

              {/* Vertical separator after first column */}
              <div className="absolute top-0 -right-4 w-px h-full bg-gray-700/50 hidden md:block"></div>
            </div>

            {/* Quick Links */}
            <div className="relative">
              <h3 className="text-white font-semibold text-base mb-3">
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/"
                    className="text-gray-400 hover:text-emerald-400 text-sm transition-colors"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="/about"
                    className="text-gray-400 hover:text-emerald-400 text-sm transition-colors"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="/products"
                    className="text-gray-400 hover:text-emerald-400 text-sm transition-colors"
                  >
                    Products
                  </a>
                </li>
                <li>
                  <a
                    href="/community"
                    className="text-gray-400 hover:text-emerald-400 text-sm transition-colors"
                  >
                    Community
                  </a>
                </li>
                <li>
                  <a
                    href="https://artnetmihir.blogspot.com/"
                    className="text-gray-400 hover:text-emerald-400 text-sm transition-colors"
                  >
                    Blog - <b>Artnet</b>
                  </a>
                </li>
              </ul>

              {/* Vertical separator after second column */}
              <div className="absolute top-0 -right-4 w-px h-full bg-gray-700/50 hidden md:block"></div>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-white font-semibold text-base mb-3">
                Support
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/help"
                    className="text-gray-400 hover:text-emerald-400 text-sm transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="text-gray-400 hover:text-emerald-400 text-sm transition-colors"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="/privacy"
                    className="text-gray-400 hover:text-emerald-400 text-sm transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/terms"
                    className="text-gray-400 hover:text-emerald-400 text-sm transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="border-t border-gray-700/50 pt-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-400">
                © {new Date().getFullYear()}{" "}
                <span className="font-medium">Emporio</span>. All rights
                reserved.
              </div>
              <div className="text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <span>Created by</span>
                  <a
                    href="https://github.com/MIhirDas10"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
                  >
                    <img
                      src="https://avatars.githubusercontent.com/u/69119099?v=4"
                      alt="Mihir Das"
                      className="w-6 h-6 rounded-full border border-gray-600"
                    />
                    <span className="font-medium">@MIhirDas30</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
