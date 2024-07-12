import { companyName, companyOperatingCountry, lastUpdated } from '@/lib/config';
import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="w-full flex justify-center items-center">
      <div className="flex flex-col w-[800px] p-4">
        <h1 className="text-2xl font-bold pb-4">Terms of Service</h1>
        <p className="pb-4">Last updated: {lastUpdated}</p>

        <section className="pb-6">
          <h2 className="text-xl font-semibold pb-2">1. Acceptance of Terms</h2>
          <p>
            By accessing and using services provided by {companyName}, you accept and agree to be bound by the terms and
            provision of this agreement.
          </p>
        </section>

        <section className="pb-6">
          <h2 className="text-xl font-semibold pb-2">2. Use of Service</h2>
          <p>
            You agree to use our service for lawful purposes only and in a way that does not infringe the rights of, restrict
            or inhibit anyone else&apos;s use and enjoyment of the website.
          </p>
        </section>

        <section className="pb-6">
          <h2 className="text-xl font-semibold pb-2">3. User Account</h2>
          <p>
            If you create an account on our website, you are responsible for maintaining the security of your account, and
            you are fully responsible for all activities that occur under the account and any other actions taken in
            connection with it.
          </p>
        </section>

        <section className="pb-6">
          <h2 className="text-xl font-semibold pb-2">4. Intellectual Property</h2>
          <p>
            The content, organization, graphics, design, compilation, magnetic translation, digital conversion and other
            matters related to the Site are protected under applicable copyrights, trademarks and other proprietary rights.
          </p>
        </section>

        <section className="pb-6">
          <h2 className="text-xl font-semibold pb-2">5. Limitation of Liability</h2>
          <p>
            In no event shall {companyName}, nor its directors, employees, partners, agents, suppliers, or affiliates, be
            liable for any indirect, incidental, special, consequential or punitive damages, including without limitation,
            loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or
            inability to access or use the service.
          </p>
        </section>

        <section className="pb-6">
          <h2 className="text-xl font-semibold pb-2">6. Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the laws of {companyOperatingCountry}, without
            regard to its conflict of law provisions.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold pb-2">7. Changes to Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a
            material change will be determined at our sole discretion.
          </p>
        </section>
      </div>
    </div>
  );
}
