import { Mark, type MarkId } from "../Mark";

/**
 * Carrier and platform wall.
 *
 * Two identical runs sit side by side and the pair translates by exactly half
 * its width, so the loop closes without measuring anything.
 */

const marks: { id: MarkId; name: string }[] = [
  { id: "dhl", name: "DHL" },
  { id: "dpd", name: "DPD" },
  { id: "ups", name: "UPS" },
  { id: "fedex", name: "FedEx" },
  { id: "gls", name: "GLS" },
  { id: "bpost", name: "Bpost" },
  { id: "shopify", name: "Shopify" },
  { id: "woocommerce", name: "WooCommerce" },
  { id: "magento", name: "Magento" },
  { id: "prestashop", name: "PrestaShop" },
  { id: "lightspeed", name: "Lightspeed" },
  { id: "wix", name: "Wix" },
  { id: "bol", name: "Bol" },
  { id: "kaufland", name: "Kaufland" },
  { id: "mirakl", name: "Mirakl" },
  { id: "picqer", name: "Picqer" },
  { id: "odoo", name: "Odoo" },
  { id: "exactonline", name: "Exact Online" },
  { id: "microsoftdynamics", name: "Microsoft Dynamics" },
  { id: "ccvshop", name: "CCV Shop" },
  { id: "goedgepickt", name: "GoedGepickt" },
  { id: "lyrawms", name: "Lyra WMS" },
];

export function CarrierWall() {
  return (
    <section
      className="wall"
      aria-label="Carriers and platforms Zineps connects to"
    >
      <div className="shell shell-wide">
        <p className="wall-caption">
          Already connected to the carriers and platforms your operation runs on
        </p>
      </div>
      <div className="wall-track">
        <div className="wall-run">
          {[0, 1].map((run) => (
            <ul key={run} aria-hidden={run === 1 || undefined}>
              {marks.map((mark) => (
                <li key={`${run}-${mark.id}`}>
                  <span className="chip">
                    <Mark id={mark.id} name={run === 0 ? mark.name : ""} />
                  </span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
