import Container from "@/components/Container";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export const metadata = {
  title: "Terms of Service - MockupForest",
  description:
    "Read the terms of service for MockupForest. Free PSD mockups for personal and commercial use. Redistribution rules and licensing details.",
};

export const revalidate = 60;

export default function TermsPage() {
  return (
    <>
      <Header />{" "}
      <Container>
        <main className="max-w-3xl mx-auto py-16 prose prose-neutral">
          <h1 className="text-3xl font-medium text-gray-900 mb-8">
            Terms of Service
          </h1>

          <div className="prose prose-lg text-gray-700 max-w-none">
            <p>
              Welcome to <strong>MockupForest.com</strong>. By accessing or
              using this website, you agree to the following Terms of Service.
              Please read them carefully before using the resources.
            </p>

            <h3>1. Use of Content</h3>
            <p>
              All PSD mockups and resources on MockupForest are{" "}
              <strong>free to use</strong> for both{" "}
              <strong>personal and commercial projects</strong>. You may
              download, edit, and incorporate them into your designs, client
              work, and products.
            </p>

            <h3>2. Redistribution and Sharing</h3>
            <ul>
              <li>
                You <strong>may not</strong> upload, host, or redistribute the
                files on your own servers, websites, or marketplaces.
              </li>
              <li>
                If you wish to share resources, you must{" "}
                <strong>link back to the original download page</strong> on
                MockupForest.com.
              </li>
              <li>
                Direct file linking (hotlinking) or offering the files as your
                own is strictly prohibited.
              </li>
            </ul>

            <h3>3. Intellectual Property</h3>
            <p>
              While the mockups are free to use, I retain ownership of the
              original files and branding. You may not claim ownership of or
              attempt to copyright the resources available here.
            </p>

            <h3>4. No Warranties</h3>
            <p>
              All resources are provided <em>&quot;as is&quot;</em> without any
              warranties of any kind, expressed or implied. I am not liable for
              any damages, losses, or issues arising from the use of these
              resources.
            </p>

            <h3>5. Termination</h3>
            <p>
              I reserve the right to restrict or terminate access to this site
              and its resources if you violate these Terms.
            </p>

            <h3>6. Changes to Terms</h3>
            <p>
              I may update these Terms of Service from time to time. Changes
              will take effect immediately upon posting on this page.
            </p>

            <h3>7. Contact</h3>
            <p>
              For any questions about these Terms, please contact me at:{" "}
              <a href="mailto:info@mockupforest.com">info@mockupforest.com</a>
            </p>
          </div>
        </main>
      </Container>
      <Footer />
    </>
  );
}
