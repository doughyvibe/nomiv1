import type { Metadata } from "next";

import { LegalPage } from "@/components/marketing/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy — Nomi",
  description: "How Nomi collects, uses, and stores personal data.",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="14 July 2026">
      <p>
        This Policy explains how Nomi handles personal data when you use the
        marketing site, seller dashboard, or a storefront hosted on Nomi.
      </p>

      <h2>Who we are</h2>
      <p>
        Nomi operates software that lets sellers run PayNow-ready storefronts.
        Sellers control their own catalogue and order handling. PayNow payments
        are processed by the buyer’s and seller’s banks — not by Nomi.
      </p>

      <h2>Data we collect</h2>
      <ul>
        <li>
          <strong>Sellers:</strong> account details from Google sign-in (such as
          name and email), store settings, product information, PayNow proxy
          details you enter, and order records for your store.
        </li>
        <li>
          <strong>Buyers:</strong> name, mobile number, email, delivery address
          (if provided), order notes, and order/payment status needed to complete
          a purchase with a seller.
        </li>
        <li>
          <strong>Technical:</strong> basic logs such as IP address, device/browser
          type, and pages requested, used for security and reliability.
        </li>
      </ul>

      <h2>How we use data</h2>
      <ul>
        <li>To provide and improve the Nomi service</li>
        <li>To create and display orders for sellers and buyers</li>
        <li>To generate PayNow QR payloads with the amount and reference you see</li>
        <li>To send optional seller push alerts you enable in settings</li>
        <li>To prevent abuse and secure accounts</li>
      </ul>

      <h2>Sharing</h2>
      <p>
        Order details are visible to the seller whose store you ordered from.
        We use infrastructure providers (for example hosting and database) to run
        the app. We do not sell personal data. We may disclose information if
        required by law.
      </p>

      <h2>Retention</h2>
      <p>
        We keep account and order data while your account is active and as needed
        for legitimate business or legal reasons. You may request deletion of
        seller account data; some order records may need to be retained for a
        period to resolve disputes or meet legal obligations.
      </p>

      <h2>Security</h2>
      <p>
        We use industry-standard safeguards (including encrypted transport and
        access controls). No method of transmission or storage is perfectly
        secure.
      </p>

      <h2>Your choices</h2>
      <ul>
        <li>Sellers can update store and PayNow settings in the dashboard</li>
        <li>Sellers can disable push notifications in settings</li>
        <li>
          Buyers should contact the seller for order-specific requests; contact
          Nomi for platform privacy questions
        </li>
      </ul>

      <h2>Children</h2>
      <p>
        Nomi is not directed at children under 13. Do not use the service if you
        are under 13.
      </p>

      <h2>Changes</h2>
      <p>
        We may update this Policy. The “Last updated” date on this page will
        change when we do.
      </p>

      <h2>Contact</h2>
      <p>
        For privacy questions, use the contact channel published on the Nomi
        marketing site when available.
      </p>
    </LegalPage>
  );
}
