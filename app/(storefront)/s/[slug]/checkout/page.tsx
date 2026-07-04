import { CheckoutForm } from "@/components/storefront/checkout-form";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <main>
      <CheckoutForm slug={slug} />
    </main>
  );
}
