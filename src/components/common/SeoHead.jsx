import { Helmet } from "react-helmet-async";

function SeoHead({
  title = "Madhur Bazar",
  description = "Madhur Bazar",
  canonical = "",
  robots = "index,follow",
}) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      {canonical ? <link rel="canonical" href={canonical} /> : null}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
    </Helmet>
  );
}

export default SeoHead;
