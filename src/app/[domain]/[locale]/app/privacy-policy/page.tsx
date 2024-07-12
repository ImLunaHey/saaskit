import { lastUpdated } from '@/lib/config';
import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="w-full flex justify-center items-center">
      <div className="flex flex-col w-[800px] p-4">
        <h1 className="text-2xl font-bold pb-4">Privacy Policy</h1>
        <p className="pb-4">Last updated: {lastUpdated}</p>

        <section className="pb-6">
          <h2 className="text-xl font-semibold pb-2">1. Introduction</h2>
          <p>We respect your privacy and are committed to protecting your personal data.</p>
        </section>

        <section className="pb-6">
          <h2 className="text-xl font-semibold pb-2">2. Information We Collect</h2>
          <p>We may collect, use, store and transfer different kinds of personal data about you, including:</p>
          <ul className="list-disc list-inside pl-4 pt-2">
            <li>Identity Data</li>
            <li>Contact Data</li>
            <li>Technical Data</li>
            <li>Usage Data</li>
          </ul>
        </section>

        <section className="pb-6">
          <h2 className="text-xl font-semibold pb-2">3. How We Use Your Information</h2>
          <p>
            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in
            the following circumstances:
          </p>
          <ul className="list-disc list-inside pl-4 pt-2">
            <li>To provide and maintain our service</li>
            <li>To notify you about changes to our service</li>
            <li>To provide customer support</li>
            <li>To gather analysis or valuable information so that we can improve our service</li>
          </ul>
        </section>

        <section className="pb-6">
          <h2 className="text-xl font-semibold pb-2">4. Data Security</h2>
          <p>
            We have put in place appropriate security measures to prevent your personal data from being accidentally lost,
            used or accessed in an unauthorized way, altered or disclosed.
          </p>
        </section>

        <section className="pb-6">
          <h2 className="text-xl font-semibold pb-2">5. Your Legal Rights</h2>
          <p>
            Under certain circumstances, you have rights under data protection laws in relation to your personal data,
            including the right to request access, correction, erasure, restriction, transfer, or to object to processing.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold pb-2">6. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at: [Your Contact Information]</p>
        </section>
      </div>
    </div>
  );
}
