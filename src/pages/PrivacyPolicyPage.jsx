import { useEffect, useState } from "react";
import Footer from "../components/layout/Footer";
import { applySeoFromMetaHeader } from "../utils/applySeoFromMetaHeader";

function PrivacyPolicyPage() {
  const [pageHtml, setPageHtml] = useState("");

  useEffect(() => {
    const loadSeo = async () => {
      try {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
        const res = await fetch(`${apiBaseUrl}/api/seoPublic?siteId=1&pageName=privacy-policy&gameId=0`);
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
        <section className="terms-page-section py-3 py-md-5">
          <div className="container px-2 px-md-3">
            <div className="terms-hero text-center">
              <h1 className="terms-title Poppins-SemiBold mb-3">Privacy Policy</h1>
            </div>
            <div className="terms-card mt-4">
              <div className="seo-page-content" dangerouslySetInnerHTML={{ __html: pageHtml }} />
            </div>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  return (
    <>
      <section className="terms-page-section py-3 py-md-5">
        <div className="container px-2 px-md-3">
          <div className="terms-hero text-center">
            <h1 className="terms-title Poppins-SemiBold mb-3">Privacy Policy</h1>
            <p className="terms-subtitle Poppins-light mb-0">
              This page will be updated soon.
            </p>
          </div>

          <div className="terms-card mt-4 text-center">
            <h2 className="terms-card-title Poppins-SemiBold mb-2">No Data Available</h2>
            <p className="terms-card-body Poppins-light mb-0">
              Privacy Policy content has not been added yet.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default PrivacyPolicyPage;
