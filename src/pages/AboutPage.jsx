import { useEffect, useState } from "react";
import { applySeoFromMetaHeader } from "../utils/applySeoFromMetaHeader";

function normalizePageHtml(html) {
  const raw = String(html || "").trim();
  if (!raw) return "";
  const parser = new DOMParser();
  const doc = parser.parseFromString(raw, "text/html");
  const bodyHtml = doc.body?.innerHTML?.trim();
  return bodyHtml || raw;
}

function AboutPage() {
  const [pageHtml, setPageHtml] = useState("");

  useEffect(() => {
    const loadSeo = async () => {
      try {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
        const res = await fetch(`${apiBaseUrl}/api/seoPublic?siteId=1&pageName=about-us&gameId=0`);
        const data = await res.json();
        applySeoFromMetaHeader(data?.metaHeader || "");
        setPageHtml(normalizePageHtml(data?.pageHtml));
      } catch (_error) {}
    };
    loadSeo();
  }, []);

  if (pageHtml) {
    return (
      <div className="container mt-4">
        <div className="about-content-box" dangerouslySetInnerHTML={{ __html: pageHtml }} />
      </div>
    );
  }

  return (
    <>
      <div className="container mt-4">
        <h4 className="text-white poppins-bold mb-0">About Madhur</h4>
      </div>
      <div className="game-tabs-wrapper mt-4"></div>
      <div className="container mt-4">
        <div className="about-content-box">
          <h5 className="text-white Poppins-SemiBold mb-3">
            Welcome to the Madhur Bazaar
          </h5>
          <p className="text-white poppins-regular font-size-14">
            Madhur Bazar is a well-known and trusted informational platform
            created for users who regularly follow Madhur Bazar updates, charts,
            number history, and related insights. Our website is designed to
            provide fast, reliable, and easy-to-understand information for users
            who want daily references, historical data, and trend-based
            observations in one place.
          </p>
          <p className="text-white poppins-regular font-size-14">
            Over time, Madhur Bazar has built a strong reputation among users
            for maintaining transparency and consistency. We focus on presenting
            information in a clean, simple, and user-friendly way so visitors
            can quickly find what they are looking for without confusion.
            Whether you are checking previous records, browsing charts, or
            exploring entertainment tools, our platform ensures a smooth
            experience across all devices.
          </p>
          <p className="text-white poppins-regular font-size-14">
            The new version of Madhur Bazar is developed with modern technology
            to improve performance, speed, and accessibility. Our goal is not
            only to provide information but also to educate users on responsible
            usage. We continuously upgrade our system to ensure data clarity,
            reduced load times, and better navigation.
          </p>
          <p className="text-white poppins-regular font-size-14 mb-0">
            Madhur Bazar is strictly an informational and entertainment-based
            website. We do not promote illegal activities, nor do we encourage
            misuse of the information available on our platform. Users are
            advised to browse responsibly and use the content for reference
            purposes only.
          </p>
        </div>
      </div>
    </>
  );
}

export default AboutPage;
