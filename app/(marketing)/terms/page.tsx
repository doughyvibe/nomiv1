import type { Metadata } from "next";

import { LegalPage } from "@/components/marketing/legal-page";

export const metadata: Metadata = {
  title: "Terms of Service — Nomi",
  description: "Terms of Service for using Nomi storefronts and the seller dashboard.",
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="14 July 2026">
      <p>
        These Terms govern your use of Nomi — a storefront and order tool for
        Singapore social sellers. By creating an account or placing an order on a
        Nomi storefront, you agree to these Terms.
      </p>

      <h2>What Nomi is</h2>
      <p>
        Nomi provides software that helps sellers publish a simple product
        catalogue and collect PayNow payments. Nomi is not a bank, payment
        institution, or escrow service. PayNow transfers are made directly
        between the buyer and the seller.
      </p>

      <h2>Sellers</h2>
      <ul>
        <li>
          You are responsible for your store content, pricing, fulfilment, and
          customer support.
        </li>
        <li>
          You must provide accurate PayNow details. Nomi does not automatically
          verify that a payment was received — you confirm orders manually.
        </li>
        <li>
          You must comply with Singapore law, including consumer and product
          rules that apply to your business.
        </li>
        <li>
          You may unpublish your store at any time. Existing order pages may
          remain reachable so buyers can finish payment or check status.
        </li>
      </ul>

      <h2>Buyers</h2>
      <ul>
        <li>
          When you place an order, you are buying from the seller named on the
          storefront — not from Nomi.
        </li>
        <li>
          Follow the PayNow instructions on the order page. After paying, notify
          the seller so they can verify payment.
        </li>
        <li>
          Contact the seller directly for refunds, delivery issues, or product
          questions.
        </li>
      </ul>

      <h2>Acceptable use</h2>
      <p>
        Do not use Nomi for illegal goods or services, fraud, abuse of the
        platform, or anything that harms other users. We may suspend or remove
        stores that violate these Terms.
      </p>

      <h2>Availability</h2>
      <p>
        We aim to keep Nomi reliable but do not guarantee uninterrupted service.
        Features may change as we improve the product.
      </p>

      <h2>Liability</h2>
      <p>
        To the fullest extent permitted by law, Nomi is not liable for disputes
        between buyers and sellers, failed or delayed PayNow transfers, or losses
        arising from store content or fulfilment. Our total liability for any
        claim relating to the service is limited to the fees you paid us (if any)
        in the three months before the claim.
      </p>

      <h2>Changes</h2>
      <p>
        We may update these Terms. Continued use after an update means you accept
        the revised Terms. Material changes will be reflected by the “Last
        updated” date on this page.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these Terms: reach out via the contact channel published
        on the Nomi marketing site when available, or through your seller
        dashboard support path once provided.
      </p>
    </LegalPage>
  );
}
