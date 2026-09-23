import { Logo } from "./Logo";
import { FooterMark } from "./FooterMark";

const columns = [
  {
    heading: "Platform",
    links: [
      { href: "/shipping", label: "Shipping software" },
      { href: "/logistics-operating-system", label: "For logistics partners" },
      { href: "/shipping-ai", label: "Shipping AI" },
      { href: "/integrations", label: "Integrations" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { href: "/blog", label: "Blog" },
      { href: "/knowledge-base", label: "Knowledge base" },
      { href: "/knowledge-base#api", label: "API reference" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "https://www.zineps.com/about-us", label: "About Zineps" },
      { href: "https://www.zineps.com/careers", label: "Careers" },
      { href: "https://www.zineps.com/privacy-policy", label: "Privacy" },
      { href: "https://www.zineps.com/terms", label: "Terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="ftr">
      <div className="shell shell-wide">
        <div className="ftr-grid">
          <div className="ftr-brand">
            <Logo />
            <p>
              One infrastructure for the businesses that ship and the logistics
              partners that move their goods.
            </p>
            <a href="/pricing" className="btn btn-ghost">
              Start shipping
            </a>
          </div>

          {columns.map((column) => (
            <div key={column.heading} className="ftr-col">
              <h3>{column.heading}</h3>
              <ul>
                {column.links.map((link) => {
                  const external = link.href.startsWith("http");
                  return (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        {...(external
                          ? { target: "_blank", rel: "noreferrer" }
                          : {})}
                      >
                        {link.label}
                        {external ? (
                          <span className="sr"> (opens on zineps.com)</span>
                        ) : null}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="ftr-base">
          <p>
            An independent redesign concept. Not the official Zineps website.
            Product facts and pricing are drawn from zineps.com; shipment rates,
            workspace records and delivery estimates shown here are examples.
          </p>
          <a
            className="link link-static"
            href="https://www.zineps.com/"
            target="_blank"
            rel="noreferrer"
          >
            zineps.com
          </a>
        </div>
      </div>

      <FooterMark />
    </footer>
  );
}
