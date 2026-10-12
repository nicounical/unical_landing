import { contact, cta } from "@/content/site";

export const ContactMeta = ({ className = "" }: { className?: string }) => (
  <div className={`ctm ${className}`}>
    <a href={contact.phoneHref}>{contact.phone}</a>
    <a href={`mailto:${contact.email}`}>{contact.email}</a>
    <span>{contact.address}</span>
  </div>
);

export const CtaTitle = ({ className = "" }: { className?: string }) => (
  <h2 className={className}><span className="u-hollow">{cta.titleHollow}</span><br />{cta.titleSolid}</h2>
);
