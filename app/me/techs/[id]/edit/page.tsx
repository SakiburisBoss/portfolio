import EditTechPage from "@/components/techs/edit-tech";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

type TechPageParams = {
  params: Promise<{ id: string }>;
};

const page: React.FC<TechPageParams> = async ({ params }) => {
  const id = Number((await params).id);

  const tech = await prisma.techs.findUnique({
    where: { id },
  });

  // If no tech is found, return 404
  if (!tech) {
    notFound();
  }

  return <EditTechPage tech={tech} />;
};

export default page;
