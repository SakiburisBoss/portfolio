
import EditTechPage from "@/components/home/techs/edit-tech";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";


const page = async ({ params }: { params: { id: number } }) => {
  const id =Number((await params).id);


  const tech = await prisma.techs.findUnique({
    where: { id },
  });

  // If no tech is found, return 404
  if (!tech) {
    notFound();
  }

  return (
   <EditTechPage tech={tech} />
  );
};

export default page;