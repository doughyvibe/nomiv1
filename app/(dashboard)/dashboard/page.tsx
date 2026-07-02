import { redirect } from "next/navigation";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="mx-auto flex min-h-full max-w-lg flex-col justify-center p-8">
      <Card>
        <CardHeader>
          <CardTitle>Seller Dashboard</CardTitle>
          <CardDescription>
            Signed in as {user.email ?? "seller"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button>shadcn Button</Button>
          <SignOutButton />
        </CardContent>
      </Card>
    </main>
  );
}
