import Image from "next/image";
import React from "react";
import { StaticImageData } from "next/image";

interface SkillProps {
  skill: {
    name: string;
    img: string | StaticImageData; // Accept both string and StaticImageData
    level: string;
  };
}

const SkillItem: React.FC<SkillProps> = ({ skill }) => {
  return (
    <div
      id={skill.name}
      className="flex items-center gap-2 p-3 w-48 sm:w-fit whitespace-nowrap shadow-[#070608] shadow-lg bg-[#1E1A27] rounded-lg hover:scale-105 duration-300 ease-in-out"
    >
      <div className="p-2 bg-[#33303ad5] rounded-md border-[#ffffff2a] border-2">
        <Image
          src={skill.img}
          className="w-10 z-10"
          alt={skill.name}
          width={40}
          height={40}
        />
      </div>
      <h2 className="text-white font-medium border-gray-300 pl-4 text-lg">
        {skill.name}
      </h2>
    </div>
  );
};

export default SkillItem;
