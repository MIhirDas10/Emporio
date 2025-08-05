import CategoryItem from "../components/CategoryItem";

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
        <img
          src="/hero-img.jpg"
          alt="Demo Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-opacity-50 flex items-center justify-center flex-col text-center px-4">
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

      <div className="max-w-6xl mx-auto px-4 py-12">
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
      </div>
    </div>
  );
};

export default HomePage;
