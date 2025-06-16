import Techs from "@/components/techs/all-techs";
import { prisma } from "@/lib/prisma";
import React from "react";

const page = async () => {
  const techs = await prisma.techs.findMany();

  return <Techs techs={techs} />;
};

export default page;
