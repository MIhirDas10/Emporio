import CategoryItem from "../components/CategoryItem";
import Wishlist from "../components/Wishlist";

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

const HomePage = () => {
  return (
    <div className="bg-gray-950 text-white">
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

        <div className="mt-16">
          <Wishlist />
        </div>
      </div>
    </div>
  );
};

export default HomePage;

// that moving bg

// import CategoryItem from "../components/CategoryItem";
// // import WaterPlaneShader from "../components/WaterPlaneShader";
// import DarkVeil from "../components/DarkVeil"; // ⬅️ Import DarkVeil

// const categories = [
//   { href: "/ebooks", name: "E-books", imageUrl: "/ebook.gif" },
//   { href: "/cheetsheets", name: "Cheatsheets", imageUrl: "/cheetsheet.gif" },
//   { href: "/icons", name: "Icons", imageUrl: "/icon.gif" },
//   { href: "/photos", name: "Photos", imageUrl: "/photo.gif" },
//   { href: "/templates", name: "Templates", imageUrl: "/template.gif" },
//   {
//     href: "/codesnippets",
//     name: "Code Snippets",
//     imageUrl: "/codesnippet.gif",
//   },
// ];

// const HomePage = () => {
//   return (
//     <div className="bg-gray-950 text-white">
//       {/* HERO SECTION */}
//       <div className="relative w-full h-[400px] sm:h-[700px] overflow-hidden">
//         {/* DarkVeil sits at the very back */}
//         <div className="absolute inset-0 z-0">
//           <DarkVeil color="#00ff00" />
//         </div>

//         {/* Vector overlay */}
//         {/* <div className="absolute inset-0 z-10">
//           <img
//             src="/my-durves-vector.svg"
//             alt="Background Vector"
//             className="w-full h-full object-cover opacity-10"
//           />
//         </div> */}

//         {/* Background image */}
//         {/* <img
//           src="/hero-img.jpg"
//           alt="Demo Background"
//           className="absolute inset-0 w-full h-full object-cover z-10 mix-blend-overlay"
//         /> */}

//         {/* Hero content */}
//         <div className="absolute inset-0 bg-opacity-50 flex items-center justify-center flex-col text-center px-4 z-30">
//           <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 mt-20">
//             All your digital needs. One place.
//           </h1>
//           <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mb-10">
//             Tired of searching everywhere? Emporio has it all — in one place.
//           </p>
//           <a
//             href="#categories"
//             className="inline-block bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300"
//           >
//             Browse Categories
//           </a>
//         </div>
//       </div>

//       {/* CATEGORIES */}
//       <div id="categories" className="max-w-6xl mx-auto px-4 py-12">
//         <h2 className="text-center text-3xl sm:text-4xl font-bold text-emerald-400 mb-3">
//           Our Categories
//         </h2>
//         <p className="text-center text-lg text-gray-400 mb-10">
//           Discover the latest digital resources at your convenience
//         </p>

//         <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
//           {categories.map((category) => (
//             <CategoryItem category={category} key={category.name} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HomePage;
// this ends here
