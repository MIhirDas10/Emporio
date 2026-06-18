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


  return (
    <div className="max-w-6xl mx-auto py-2 overflow-hidden">
      <h2 className="text-center text-sm sm:text-sm font-bold tracking-[0.25em] text-emerald-400 uppercase mb-12 drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]">
        Trusted by Leading Companies
      </h2>

      {/* Outer mask for fading edges */}
      <div className="relative h-16 flex items-center overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
        {/* Scrolling track */}
        <div className="flex animate-scroll-logos w-max">
          {/* First set of logos */}
          <div className="flex gap-16 md:gap-24 pr-16 md:pr-24">
            {companies.map((company, idx) => (
              <div
                key={`first-${company.name}-${idx}`}
                className="flex items-center justify-center w-24 h-12 flex-shrink-0"
              >
                <img
                  src={company.logo}
                  alt={`${company.name} logo`}
                  className="h-8 md:h-10 w-auto object-contain opacity-75 hover:opacity-100 transition-all duration-300 filter brightness-0 invert hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.5)] hover:scale-105"
                />
              </div>
            ))}
          </div>
          {/* Second identical set of logos for seamless loop */}
          <div className="flex gap-16 md:gap-24 pr-16 md:pr-24">
            {companies.map((company, idx) => (
              <div
                key={`second-${company.name}-${idx}`}
                className="flex items-center justify-center w-24 h-12 flex-shrink-0"
              >
                <img
                  src={company.logo}
                  alt={`${company.name} logo`}
                  className="h-8 md:h-10 w-auto object-contain opacity-75 hover:opacity-100 transition-all duration-300 filter brightness-0 invert hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.5)] hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyLogos;
