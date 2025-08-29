import {
  BarChart,
  PlusCircle,
  ShoppingBasket,
  Megaphone,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CreateProductForm from "../components/CreateProductForm";
import ProductsList from "../components/ProductsList";
import AnalyticsTab from "../components/AnalyticsTab";
import useProductStore from "../stores/useProductStore";
import Wishlist from "../components/Wishlist";
import Community from "./Community";
import AdminAnnouncements from "../components/AdminAnnouncements";
import UserList from "../components/UserList";
import TopVotedProducts from "../components/TopVotedProducts";
import EditProductForm from "../components/EditProductForm";

const tabs = [
  { id: "users", label: "Users", icon: Users },
  { id: "products", label: "Products", icon: ShoppingBasket },
  { id: "create", label: "Create Product", icon: PlusCircle },
  { id: "analytics", label: "Analytics", icon: BarChart },
  { id: "Community", label: "Community Place", icon: ShoppingBasket },
  { id: "announcements", label: "Announcements", icon: Megaphone },
];

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("create");
  const [editingProduct, setEditingProduct] = useState(null);
  const { fetchAllProducts } = useProductStore();

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  const handleEditProduct = (product) => {
    setEditingProduct(product);
  };

  const handleCloseEdit = () => {
    setEditingProduct(null);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 py-16">
        <motion.h1
          className="text-3xl sm:text-4xl font-bold mb-8 text-emerald-400 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Admin Dashboard
        </motion.h1>

        {/* Responsive Tab Navigation */}
        <div className="mb-8">
          <div className="flex overflow-x-auto scrollbar-hide pb-2">
            <div className="flex flex-nowrap sm:flex-wrap gap-2 mx-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md 
                      whitespace-nowrap text-sm sm:text-base font-medium
                      transition-colors duration-200 min-w-max
                      ${
                        activeTab === tab.id
                          ? "bg-emerald-600 text-white"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }
                    `}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span className="hidden xs:block sm:block">
                      {tab.label}
                    </span>
                    {/* Show only icon on very small screens */}
                    <span className="block xs:hidden sm:hidden sr-only">
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="w-full">
          {activeTab === "users" && <UserList />}
          {activeTab === "products" && (
            <>
              <ProductsList onEditProduct={handleEditProduct} />
              {editingProduct && (
                <EditProductForm
                  product={editingProduct}
                  onClose={handleCloseEdit}
                />
              )}
            </>
          )}
          {activeTab === "analytics" && <AnalyticsTab />}
          {activeTab === "create" && <CreateProductForm />}
          {activeTab === "Community" && <Community />}
          {activeTab === "announcements" && <AdminAnnouncements />}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
