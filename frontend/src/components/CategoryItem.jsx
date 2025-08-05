import { Link } from "react-router-dom";

const CategoryItem = ({ category }) => {
  return (
    <div className="relative rounded-xl overflow-hidden group shadow-md backdrop-blur-md bg-white/5 hover:bg-white/10 transition duration-300">
      <Link to={"/category" + category.href}>
        <div className="w-full h-48 sm:h-56 md:h-60 relative">
          <img
            src={category.imageUrl}
            alt={category.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          <div className="absolute inset-0 z-10">
            <div className="absolute inset-1 rounded-b-2xl bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            {/* bottom shade */}
            <div className="absolute bottom-0 w-full h-16 bg-gradient-to-t from-black/70 to-transparent" />
          </div>

          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 text-center z-20">
            <h3 className="text-white text-lg font-bold">{category.name}</h3>
            <p className="text-gray-300 text-xs">Shop {category.name}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CategoryItem;
