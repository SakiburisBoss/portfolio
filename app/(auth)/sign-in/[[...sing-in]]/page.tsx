import { SignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface SignInPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const SignInPage = async ({ searchParams }: SignInPageProps) => {
  // Get the redirect URL from query params or default to home
  const redirectUrl = Array.isArray(searchParams.redirect_url)
    ? searchParams.redirect_url[0]
    : searchParams.redirect_url || "/";

  // Check if user is already signed in
  const session = await auth();
  
  if (session.userId) {
    redirect(redirectUrl);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <SignIn 
        redirectUrl={redirectUrl}
        afterSignInUrl={redirectUrl}
      />
    </div>
  );
};

export default SignInPage;
