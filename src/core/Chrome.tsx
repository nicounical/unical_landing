import { useEffect, useState } from "react";
import { contact, footer, nav } from "@/content/site";
import { Logo } from "./ui";

/** Cabecera común (no forma parte del comparador: es el marco de todas las combinaciones). */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("is-menu-open", open);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);
  return (
    <>
      <a className="u-skip" href="#main">Saltar al contenido</a>
      <header className={`hd ${scrolled ? "is-scrolled" : ""}`}>
        <div className="hd__in">
          <a href="/" className="hd__logo" aria-label="Unical Graphic – inicio"><Logo tone="light" height={30} /></a>
          <nav className="hd__nav" aria-label="Navegación principal">
            {nav.map((n) => <a key={n.href} href={n.href}>{n.label}</a>)}
          </nav>
          <div className="hd__right">
            <a className="hd__phone" href={contact.phoneHref}>{contact.phone}</a>
            <a className="u-btn u-btn--primary hd__cta" href={contact.contactUrl}><span className="u-btn__in">Presupuesto</span></a>
            <button className={`hd__burger ${open ? "is-open" : ""}`} aria-label={open ? "Cerrar menú" : "Abrir menú"} aria-expanded={open} aria-controls="mobileMenu" onClick={() => setOpen((o) => !o)}>
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>
      <div id="mobileMenu" className={`mm ${open ? "is-open" : ""}`} role="dialog" aria-label="Menú principal" aria-hidden={!open}>
        {nav.map((n, i) => <a key={n.href} href={n.href} style={{ transitionDelay: `${open ? 80 + i * 50 : 0}ms` }} tabIndex={open ? 0 : -1}>{n.label}</a>)}
        <a href={contact.phoneHref} className="mm__phone" tabIndex={open ? 0 : -1}>{contact.phone}</a>
      </div>
    </>
  );
}

export function Footer() {
  return (
    <footer className="ft">
      <div className="u-wrap">
        <div className="ft__grid">
          <div className="ft__brand">
            <Logo tone="light" height={32} />
            <p>{footer.text}</p>
            <div className="ft__social">
              <a href={contact.instagram} aria-label="Instagram"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg></a>
              <a href={contact.linkedin} aria-label="LinkedIn"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 11-.01 5 2.5 2.5 0 01.01-5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C20.6 8.65 21 11 21 14v7h-4v-6.2c0-1.5-.03-3.4-2.07-3.4-2.07 0-2.39 1.6-2.39 3.3V21H10z" /></svg></a>
              <a href={contact.whatsapp} aria-label="WhatsApp"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm5.3 14.2c-.2.6-1.3 1.2-1.8 1.2s-1 .3-3.4-.7c-2.9-1.2-4.7-4.1-4.8-4.3-.1-.2-1.1-1.5-1.1-2.9s.7-2.1 1-2.4c.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.4.6-.4.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.7-.1l.9-1.1c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.5.3.1.2.1.7-.1 1.3z" /></svg></a>
            </div>
          </div>
          <div className="ft__col"><h4>Servicios</h4><ul>{footer.services.map(([l, h]) => <li key={h}><a href={h}>{l}</a></li>)}</ul></div>
          <div className="ft__col"><h4>Empresa</h4><ul>{footer.company.map(([l, h]) => <li key={h}><a href={h}>{l}</a></li>)}</ul></div>
          <div className="ft__col"><h4>Contacto</h4><ul>
            <li><a href={contact.phoneHref}>{contact.phone}</a></li>
            <li><a href={`mailto:${contact.email}`}>{contact.email}</a></li>
            <li><span>{contact.addressFull[0]}<br />{contact.addressFull[1]}</span></li>
          </ul></div>
        </div>
        <div className="ft__bottom">
          <p>{footer.legal}</p>
          <div>{footer.legalLinks.map(([l, h]) => <a key={h} href={h}>{l}</a>)}</div>
        </div>
      </div>
    </footer>
  );
}

export function WhatsAppFloat() {
  return (
    <a className="wa" href={contact.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="Contactar por WhatsApp">
      <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm5.3 14.2c-.2.6-1.3 1.2-1.8 1.2s-1 .3-3.4-.7c-2.9-1.2-4.7-4.1-4.8-4.3-.1-.2-1.1-1.5-1.1-2.9s.7-2.1 1-2.4c.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.4.6-.4.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.7-.1l.9-1.1c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.5.3.1.2.1.7-.1 1.3z" /></svg>
    </a>
  );
}
