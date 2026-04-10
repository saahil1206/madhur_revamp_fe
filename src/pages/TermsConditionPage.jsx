import { useEffect, useState } from "react";
import Footer from "../components/layout/Footer";
import { applySeoFromMetaHeader } from "../utils/applySeoFromMetaHeader";

const termsPoints = [
  {
    title: "1. Website Purpose",
    body: "Madhur Bazar is an informational platform that provides Satta Matka results, charts, historical data, guessing numbers, and entertainment-related content. We do not promote or support illegal gambling activities.",
  },
  {
    title: "2. Acceptance of Terms",
    body: "By visiting MadhurBazar.com, you confirm that you are legally permitted to access such content under the laws applicable in your country, state, or region. These terms apply to all visitors, users, and subscribers of the website.",
  },
  {
    title: "3. Eligibility",
    body: "This website is strictly intended for users who are 18 years of age or older. If you are under 18, you must not use this website.",
  },
  {
    title: "4. Accuracy of Information",
    body: "We strive to provide accurate and up-to-date Satta Matka results and charts. However, Madhur Bazar does not guarantee the accuracy, completeness, or reliability of any information displayed on the website.",
  },
  {
    title: "5. Disclaimer of Gambling Liability",
    body: "MadhurBazar.com does not encourage, promote, or facilitate gambling. Any action taken by users based on information found on this website is entirely at their own risk.",
  },
  {
    title: "6. User Responsibility",
    body: "Users are solely responsible for verifying local laws related to gambling or betting activities before taking any action.",
  },
  {
    title: "7. Intellectual Property Rights",
    body: "All content published on MadhurBazar.com, including text, logos, charts, graphics, and website design, is the intellectual property of Madhur Bazar unless otherwise stated.",
  },
  {
    title: "8. Third-Party Links",
    body: "Madhur Bazar may include links to third-party websites for additional information or reference. Visiting third-party links is at your own discretion and risk.",
  },
  {
    title: "9. Limitation of Liability",
    body: "Under no circumstances shall Madhur Bazar, its owners, partners, or affiliates be liable for any direct, indirect, incidental, or consequential damages arising from the use or inability to use the website.",
  },
  {
    title: "10. Website Availability",
    body: "We reserve the right to modify, suspend, or discontinue any part of the website at any time without prior notice.",
  },
  {
    title: "11. Content Updates and Modifications",
    body: "Madhur Bazar reserves the right to update, revise, or change these Terms and Conditions at any time. Continued use of the website after changes are posted constitutes acceptance of the updated terms.",
  },
  {
    title: "12. Privacy Policy",
    body: "Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect user information.",
  },
  {
    title: "13. Governing Law",
    body: "These Terms and Conditions shall be governed and interpreted in accordance with the laws applicable in India.",
  },
  {
    title: "14. Termination of Access",
    body: "Madhur Bazar reserves the right to block or terminate user access if any misuse, illegal activity, or violation of these terms is detected.",
  },
  {
    title: "15. Contact Information",
    body: "If you have any questions or concerns regarding these Terms and Conditions, you may contact us through the official communication channels available on MadhurBazar.com.",
  },
];

function TermsConditionPage() {
  const [pageHtml, setPageHtml] = useState("");

  useEffect(() => {
    const loadSeo = async () => {
      try {
        const apiBaseUrl =
          import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
        const res = await fetch(
          `${apiBaseUrl}/api/seoPublic?siteId=1&pageName=term-condition&gameId=0`,
        );
        const data = await res.json();
        applySeoFromMetaHeader(data?.metaHeader || "");
        const raw = String(data?.pageHtml || "").trim();
        if (raw) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(raw, "text/html");
          setPageHtml(doc.body?.innerHTML?.trim() || raw);
        } else {
          setPageHtml("");
        }
      } catch (_error) {}
    };
    loadSeo();
  }, []);

  if (pageHtml) {
    return (
      <>
        <section className="terms-page-section py-5">
          <div className="container">
            <div className="terms-hero text-center">
              <h1 className="terms-title Poppins-SemiBold mb-3">
                Terms & Conditions
              </h1>
              <p className="terms-subtitle Poppins-light mb-0">
                Welcome to <strong>MadhurBazar.com</strong>. By accessing or
                using this website, you agree to comply with these Terms and
                Conditions.
              </p>
            </div>
            <div className="terms-card mt-4">
              <div
                className="seo-page-content"
                dangerouslySetInnerHTML={{ __html: pageHtml }}
              />
            </div>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  return (
    <>
      <section className="terms-page-section py-5">
        <div className="container">
          <div className="terms-hero text-center">
            <h1 className="terms-title Poppins-SemiBold mb-3">
              Terms & Conditions
            </h1>
            <p className="terms-subtitle Poppins-light mb-0">
              Welcome to <strong>MadhurBazar.com</strong>. By accessing or using
              this website, you agree to comply with these Terms and Conditions.
            </p>
          </div>

          <div className="terms-grid mt-4">
            {termsPoints.map((item) => (
              <article key={item.title} className="terms-card">
                <h2 className="terms-card-title Poppins-SemiBold mb-2">
                  {item.title}
                </h2>
                <p className="terms-card-body Poppins-light mb-0">
                  {item.body}
                </p>
              </article>
            ))}
          </div>

          <p className="terms-updated text-center Poppins-SemiBold mt-4 mb-0">
            Last Updated: 2026
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default TermsConditionPage;
