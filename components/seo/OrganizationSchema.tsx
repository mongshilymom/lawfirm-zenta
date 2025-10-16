export default function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "name": "[Your Law Firm Name]",
    "description": "A premium AI-first law firm providing exceptional legal services",
    "url": process.env.NEXT_PUBLIC_BASE_URL || "https://youalta.net",
    "logo": `${process.env.NEXT_PUBLIC_BASE_URL || "https://youalta.net"}/logo.svg`,
    "image": `${process.env.NEXT_PUBLIC_BASE_URL || "https://youalta.net"}/og-image.svg`,
    "telephone": "[Your Phone Number]",
    "email": "[Your Email]",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "[Street Address]",
      "addressLocality": "[City]",
      "addressRegion": "[State/Province]",
      "postalCode": "[Postal Code]",
      "addressCountry": "[Country Code]"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "[Latitude]",
      "longitude": "[Longitude]"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "18:00"
      }
    ],
    "sameAs": [
      "[LinkedIn URL]",
      "[Twitter URL]",
      "[Facebook URL]"
    ],
    "priceRange": "$$$",
    "areaServed": {
      "@type": "State",
      "name": "[Your Service Area]"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
