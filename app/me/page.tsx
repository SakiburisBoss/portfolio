import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MePage() {
  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to My Profile</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Click the button below to view my tech stack
        </p>
        <Button asChild size="lg">
          <Link href="/me/techs">
            View My Tech Stack
          </Link>
        </Button>
      </div>
    </div>
  );
}
