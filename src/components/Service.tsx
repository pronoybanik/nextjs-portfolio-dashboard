"use client";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const services = [
  {
    id: 1,
    title: "Web Development",
    description:
      "Ensure your website looks great on any device, with layouts that adapt to different screen sizes seamlessly.",
  },
  {
    id: 2,
    title: "UI/UX Design",
    description:
      "Set up user-friendly CMS solutions like WordPress or custom-built options so clients can manage content easily.",
  },
  {
    id: 3,
    title: "Content Writing",
    description:
      "Build and integrate APIs to connect websites with third-party applications, enhancing functionality and performance.",
  },
  {
    id: 4,
    title: "Digital Marketing",
    description:
      "Refresh outdated websites with modern, appealing designs that align with current brand goals and user expectations.",
  },
];

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 60,
      damping: 15,
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 70,
      damping: 16,
    },
  },
};

const Services = ({ id }: { id: string }) => {
  const [selected, setSelected] = useState(1);

  return (
    <motion.section
      id={id}
      className="bg-gray-50 py-16 px-4 md:px-8 lg:px-16 min-h-screen"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      <motion.div className="text-center my-10" variants={itemVariants}>
        <h2 className="text-4xl sm:text-5xl md:text-7xl my-4 md:my-6 font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 leading-tight">
          My Quality Services
        </h2>
        <p className="text-black mt-6 text-lg sm:text-xl font-medium text-center max-w-3xl mx-auto">
          We put your ideas and thus your wishes in the form of a unique web
          project that inspires you and your customers.
        </p>
      </motion.div>

      <motion.div
        className="max-w-4xl mx-auto space-y-4"
        variants={containerVariants}
      >
        {services.map((service) => (
          <motion.div
            key={service.id}
            variants={itemVariants}
            layout
            onClick={() => setSelected(service.id)}
            className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-lg transition-all duration-300 cursor-pointer ${
              selected === service.id
                ? "bg-gradient-to-r from-purple-500 to-purple-900 text-white shadow-lg scale-105"
                : "bg-white text-gray-800 hover:bg-gray-200"
            }`}
          >
            <div>
              <span
                className={`flex text-2xl sm:text-3xl font-bold ${
                  selected === service.id ? "text-white" : "text-purple-600"
                }`}
              >
                0{service.id}
              </span>
              <h3
                className={`text-xl sm:text-2xl font-bold mt-1 ${
                  selected === service.id ? "text-white" : "text-purple-600"
                }`}
              >
                {service.title}
              </h3>

              {selected === service.id && (
                <motion.p
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.4 }}
                  className="text-white text-sm sm:text-base mt-2 font-medium"
                >
                  {service.description}
                </motion.p>
              )}
            </div>

            <ArrowUpRight
              className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 ${
                selected === service.id
                  ? "text-white transform rotate-45"
                  : "text-purple-600 hover:text-purple-800"
              }`}
            />
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
};

export default Services;
