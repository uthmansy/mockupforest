import Container from "@/components/Container";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - MockupForest",
  description:
    "Privacy Policy for MockupForest.com, explaining how we collect, use, and protect your information.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <Container>
        <main className="max-w-3xl mx-auto py-16 prose prose-neutral">
          <div className="prose mx-auto max-w-4xl p-6">
            <h1>Privacy Policy</h1>
            <p>
              <strong>Effective Date:</strong> 2025
            </p>

            <p>
              At <strong>MockupForest.com</strong>, your privacy is important.
              This Privacy Policy explains how information is collected, used,
              and protected when you use our website. By using our site, you
              agree to this policy.
            </p>

            <h3>1. Information We Collect</h3>
            <ul>
              <li>
                We do not require account registration to download mockups.
              </li>
              <li>
                We may collect non-personal information automatically, such as
                browser type, device information, and IP address, to improve
                site performance.
              </li>
              <li>
                If you contact us, we may store your email and message to
                respond to your inquiry.
              </li>
            </ul>

            <h3>2. Use of Information</h3>
            <ul>
              <li>To provide, maintain, and improve the website.</li>
              <li>
                To understand how visitors use the site and improve user
                experience.
              </li>
              <li>To communicate with you if you reach out directly.</li>
            </ul>

            <h3>3. Cookies</h3>
            <p>
              We may use cookies or similar technologies to analyze traffic and
              improve services. You can disable cookies in your browser
              settings, though some features may not function properly.
            </p>

            <h3>4. Third-Party Services</h3>
            <p>
              We may use analytics tools (e.g., Google Analytics) to understand
              traffic and usage trends. These third parties may collect
              information according to their own privacy policies.
            </p>
            <p>
              Ads or external links on the site may lead to third-party
              websites. We are not responsible for their privacy practices.
            </p>

            <h3>5. Data Sharing</h3>
            <p>
              We do not sell, rent, or trade your personal information.
              Information may be disclosed if required by law or to protect our
              rights.
            </p>

            <h3>6. Data Security</h3>
            <p>
              We take reasonable measures to protect your data. However, no
              method of transmission over the internet is 100% secure.
            </p>

            <h3>7. Children’s Privacy</h3>
            <p>
              Our site is not directed at children under 13. We do not knowingly
              collect data from children.
            </p>

            <h3>8. Changes to This Policy</h3>
            <p>
              We may update this Privacy Policy from time to time. Changes will
              be posted on this page with a new effective date.
            </p>

            <h3>9. Contact Us</h3>
            <p>
              If you have questions about this Privacy Policy, please contact us
              at: <strong>support@mockupforest.com</strong>
            </p>
          </div>
        </main>
      </Container>
      <Footer />
    </>
  );
}
