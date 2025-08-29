const CompanyLogos = () => {
  const companies = [
    { name: "PayPal", logo: "/PayPal.svg" },
    // { name: "Coinbase", logo: "/stripe.svg" },
    // { name: "Binance", logo: "/gpay.svg" },
    { name: "Exodus", logo: "/pinterest.svg" },
    { name: "Bitfinex", logo: "/adobe.svg" },
    { name: "Blockchain", logo: "/insta.svg" },
    // { name: "Coinbase", logo: "/stripe.svg" },
    // { name: "Binance", logo: "/gpay.svg" },
    { name: "Exodus", logo: "/pinterest.svg" },
    { name: "Bitfinex", logo: "/adobe.svg" },
    { name: "Blockchain", logo: "/insta.svg" },
    { name: "Exodus", logo: "/pinterest.svg" },
    { name: "Bitfinex", logo: "/adobe.svg" },
    { name: "Blockchain", logo: "/insta.svg" },
  ];

  // Duplicate twice for smooth infinite loop
  const logoItems = [...companies, ...companies];

  return (
    <div className="max-w-6xl mx-auto py-6 overflow-hidden">
      <h2 className="text-center text-2xl sm:text-3xl font-bold text-gray-300 mb-6">
        Trusted by Leading Companies
      </h2>

      {/* Outer mask */}
      <div className="relative h-16 flex items-center overflow-hidden">
        {/* Scrolling track */}
        <div className="flex animate-scroll-logos gap-12">
          {logoItems.map((company, idx) => (
            <div
              key={company.name + idx}
              className="flex items-center justify-center w-18 h-10 flex-shrink-0"
            >
              <img
                src={company.logo}
                alt={`${company.name} logo`}
                className="h-10 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity duration-300 filter brightness-0 invert"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyLogos;
