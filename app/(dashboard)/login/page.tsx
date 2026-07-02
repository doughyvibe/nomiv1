import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="mx-auto flex min-h-full max-w-md flex-col justify-center p-8">
      <Card>
        <CardHeader>
          <CardTitle>Seller login</CardTitle>
          <CardDescription>
            Sign in to manage your Nomi storefront.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error ? (
            <p className="text-sm text-destructive">
              Sign-in failed. Please try again.
            </p>
          ) : null}
          <GoogleSignInButton />
        </CardContent>
      </Card>
    </main>
  );
}
