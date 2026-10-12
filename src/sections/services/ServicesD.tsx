import { useEffect, useRef, useState } from "react";
import { services } from "@/content/site";
import { SecHead } from "../common/SecHead";
import "./services.css";

/** D — LISTA Y CORTINA: imagen fija que cambia con una cortina; lista sobria con filetes finos. */
export default function ServicesD() {
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState(0);
  const rows = useRef<(HTMLLIElement | null)[]>([]);
  const go = (i: number) => setActive((a) => { if (a !== i) setPrev(a); return i; });

  useEffect(() => {
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) go(Number((e.target as HTMLElement).dataset.i)); });
    }, { rootMargin: "-45% 0px -45% 0px" });
    rows.current.forEach((r) => r && io.observe(r));
    return () => io.disconnect();
  }, []);

  return (
    <div className="sD">
      <div className="u-wrap sD__grid">
        <div className="sD__left">
          <div className="sD__sticky">
            <SecHead eyebrow={services.eyebrow} title={services.title} />
            <div className="sD__frame">
              {services.items.map((s, i) => (
                <img key={s.n} src={s.img} alt={i === active ? s.alt : ""} loading="lazy" decoding="async"
                  className={i === active ? "is-on" : i === prev ? "is-prev" : ""} />
              ))}
              <span className="sD__cap">{services.items[active].n} — {services.items[active].title}</span>
            </div>
          </div>
        </div>
        <ol className="sD__list">
          {services.items.map((s, i) => (
            <li key={s.n} ref={(el) => (rows.current[i] = el)} data-i={i} className={i === active ? "is-on" : ""} onPointerEnter={() => go(i)}>
              <a href={s.href} onFocus={() => go(i)}>
                <span className="sD__n">{s.n}</span>
                <span className="sD__body">
                  <span className="sD__t">{s.title}</span>
                  <span className="sD__sub">{s.sub}</span>
                  <span className="sD__p">{s.text}</span>
                </span>
                <span className="sD__go" aria-hidden>→</span>
              </a>
              <img className="sD__mimg" src={s.img} alt="" loading="lazy" decoding="async" />
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
