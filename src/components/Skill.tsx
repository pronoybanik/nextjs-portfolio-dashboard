"use client";

import React from "react";
import { motion } from "framer-motion";
import html from "../images/development-logo/html/html-svgrepo-com.svg";
import css from "../images/development-logo/css/download.png";
import js from "../images/development-logo/js/download (1).png";
import Bootstrap from "../images/development-logo/Bootstrap/download.png";
import Tailwind from "../images/development-logo/tailwind/download.png";
import Github from "../images/development-logo/Github/download (2).png";
import redux from "../images/development-logo/redux/download.png";
import Figma from "../images/development-logo/Figma/icons8-figma-48.png";
import Express from "../images/development-logo/ex/download (1).png";
import Firebase from "../images/development-logo/firebase/icons8-firebase-48.png";
import Mongo from "../images/development-logo/mongoose/icons8-mongodb-48.png";
import Netlify from "../images/development-logo/Netlify/download.png";
import postgresql from "../images/development-logo/postgresql/download.png";
import react from "../images/development-logo/react/download (1).png";
import typescript from "../images/development-logo/typesript/download (1).png";
import angular from "../images/development-logo/anguler/icons8-angular-480.png";
import SkillItem from "./SkillItem";

const skills = [
  { name: "HTML", img: html, level: "Advance" },
  { name: "CSS", img: css, level: "Advance" },
  { name: "Javascript", img: js, level: "Advance" },
  { name: "React", img: react, level: "Advance" },
  { name: "Redux", img: redux, level: "Moderate" },
  { name: "TypeScript", img: typescript, level: "Moderate" },
  { name: "Angular", img: angular, level: "Moderate" },
  { name: "PostgreSQL", img: postgresql, level: "Moderate" },
  { name: "Bootstrap", img: Bootstrap, level: "Advance" },
  { name: "Tailwind CSS", img: Tailwind, level: "Advance" },
  { name: "Github", img: Github, level: "Moderate" },
  { name: "Figma", img: Figma, level: "Moderate" },
  { name: "Express js", img: Express, level: "Beginner" },
  { name: "Firebase", img: Firebase, level: "Moderate" },
  { name: "Mongo DB", img: Mongo, level: "Beginner" },
  { name: "Netlify", img: Netlify, level: "Moderate" },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
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
      stiffness: 80,
      damping: 16,
    },
  },
};

const Skill = ({ id }: { id: string }) => {
  return (
    <motion.section
      id={id}
      className="py-16 px-4 md:px-8 lg:px-16 min-h-screen bg-gray-50"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      <motion.div className="text-center my-20" variants={itemVariants}>
        <h2 className="text-4xl sm:text-5xl md:text-7xl my-4 md:my-6 font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 leading-tight">
          My Skills
        </h2>
        <p className="text-black mt-8 text-xl font-medium text-center max-w-3xl mx-auto">
          We put your ideas and thus your wishes in the form of a unique web
          project that inspires you and your customers.
        </p>
      </motion.div>

      <motion.div
        className="mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-10"
        variants={containerVariants}
      >
        {skills.map((skill, i) => (
          <motion.div key={i} variants={itemVariants}>
            <SkillItem skill={skill} />
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
};

export default Skill;
