/**
 * JSON-LD structured data component for SEO
 * Supports Organization, LegalService, Person (Attorney), and other schema types
 */

interface JsonLdProps {
  data: object | object[];
}

export default function JsonLd({ data }: JsonLdProps) {
  const jsonData = Array.isArray(data) ? data : [data];
  
  return (
    <>
      {jsonData.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ 
            __html: JSON.stringify(item, null, 0) 
          }}
        />
      ))}
    </>
  );
}
