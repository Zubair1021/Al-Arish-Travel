import { Link } from "react-router-dom";
import type { FooterColumn } from "./footerData";

interface FooterLinksProps {
  column: FooterColumn;
}

export default function FooterLinks({ column }: FooterLinksProps) {
  return (
    <div className="ft-col">
      <h4 className="ft-col-title">{column.title}</h4>
      <ul className="ft-col-list">
        {column.links.map((link) => (
          <li key={`${column.title}-${link.label}`}>
            <Link to={link.to} className="ft-link">
              <span className="ft-link-dash" aria-hidden="true" />
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
