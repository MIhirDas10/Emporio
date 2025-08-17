import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useCartStore } from "../stores/useCartStore";
import { Link } from "react-router-dom";
import { MoveRight, ChevronLeft, ChevronRight } from "lucide-react";

const OrderSummary = () => {
  const { total, subtotal, coupon, isCouponApplied } = useCartStore();

  const [selectedIndex, setSelectedIndex] = useState(0);

  const paymentMethods = [
    {
      name: "Stripe",
      bgColor: "#111030",
      textColor: "#fff",
      logo: "https://cdn.brandfetch.io/idxAg10C0L/w/800/h/380/theme/dark/logo.png?c=1bxid64Mup7aczewSAYMX&t=1746435914582",
    },
    {
      name: "PayPal",
      bgColor: "#ffffff",
      textColor: "#000",
      logo: "https://www.paypalobjects.com/webstatic/icon/pp258.png",
    },
    {
      name: "GooglePay",
      bgColor: "#d4e0ff",
      textColor: "#061F5E",
      size: 30,
      logo: "https://pay.google.com/gp/promo/p_referrals/static/images/gp3-lockup.svg",
    },
  ];

  const savings = subtotal - total;
  const formattedSubtotal = subtotal.toFixed(2);
  const formattedTotal = total.toFixed(2);
  const formattedSavings = savings.toFixed(2);

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % paymentMethods.length);
  };

  const handlePrev = () => {
    setSelectedIndex((prev) =>
      prev === 0 ? paymentMethods.length - 1 : prev - 1
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative w-full max-w-sm rounded-2xl pl-10 pr-10 p-8 shadow-2xl"
      style={{
        background: "linear-gradient(145deg, #091129, #02060F, #091129)",
      }}
    >
      <div className="relative h-28 mb-5 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={paymentMethods[selectedIndex].name}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="w-[90%] rounded-xl p-4 font-semibold shadow-lg flex justify-between items-center"
            style={{
              backgroundColor: paymentMethods[selectedIndex].bgColor,
              color: paymentMethods[selectedIndex].textColor,
            }}
          >
            <span>{paymentMethods[selectedIndex].name}</span>
            {paymentMethods[selectedIndex].logo && (
              <img
                src={paymentMethods[selectedIndex].logo}
                alt={paymentMethods[selectedIndex].name}
                className="h-5 object-contain"
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* prev Button */}
        <button
          onClick={handlePrev}
          className="absolute left-0 -translate-x-6 p-2 rounded-full bg-gray-700 hover:bg-gray-600"
        >
          <ChevronLeft size={16} className="text-white" />
        </button>

        {/* next Button */}
        <button
          onClick={handleNext}
          className="absolute right-0 translate-x-6 p-2 rounded-full bg-gray-700 hover:bg-gray-600"
        >
          <ChevronRight size={16} className="text-white" />
        </button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <dl className="flex items-center justify-between gap-4">
            <dt className="text-base font-normal text-gray-300">
              Original price
            </dt>
            <dd className="text-base font-medium text-white">
              ${formattedSubtotal}
            </dd>
          </dl>

          {savings > 0 && (
            <dl className="flex items-center justify-between gap-4">
              <dt className="text-base font-normal text-gray-300">Savings</dt>
              <dd className="text-base font-medium text-emerald-400">
                -${formattedSavings}
              </dd>
            </dl>
          )}

          {coupon && isCouponApplied && (
            <dl className="flex items-center justify-between gap-4">
              <dt className="text-base font-normal text-gray-300">
                Coupon ({coupon.code})
              </dt>
              <dd className="text-base font-medium text-emerald-400">
                -{coupon.discountPercentage}%
              </dd>
            </dl>
          )}
          <dl className="flex items-center justify-between gap-4 border-t border-gray-600 pt-2">
            <dt className="text-base font-bold text-white">Total</dt>
            <dd className="text-base font-bold text-emerald-400">
              ${formattedTotal}
            </dd>
          </dl>
        </div>

        <motion.button
          className="flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          //   onClick={handlePayment}
        >
          Proceed to Checkout
        </motion.button>

        <div className="flex items-center justify-center gap-2">
          <span className="text-sm font-normal text-gray-400">or</span>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-emerald-400 underline hover:text-emerald-300 hover:no-underline"
          >
            Continue Shopping
            <MoveRight size={16} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderSummary;
