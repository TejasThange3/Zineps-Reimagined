import { PageIntro } from "../components/PageIntro";
import { PartnersArt } from "../components/IntroArt";
import { FigureRow, ProblemList, SplitFeature } from "../components/blocks";
import { Faq } from "../components/Faq";
import { Surface } from "../components/Surface";
import { BarChart } from "../components/Chart";
import { Closing } from "../components/Closing";

/* Problem and outcome framing, and the operational figures, as published by
   Zineps on its logistics operating system page. */
const problems = [
  {
    name: "Services and contracts",
    problem:
      "Carrier contracts, price structures and customer agreements live in different tools, so nobody is certain what is sold to whom at what margin.",
    answer:
      "Services, pricing, margins and rules sit in one system. You control what you sell, to which customer group, and at which margin.",
    figure: "+55%",
    figureLabel: "operational efficiency",
  },
  {
    name: "Customers and revenue",
    problem:
      "Resellers rarely know which customers, services and routes are actually profitable until the quarter has closed.",
    answer:
      "Revenue, margin and customer performance in real time. You can see where you are growing and where you are quietly losing money.",
    figure: "Real time",
    figureLabel: "revenue and margin",
  },
  {
    name: "Onboarding and support",
    problem:
      "Onboarding a merchant and supporting them afterwards happens across email, spreadsheets and whatever tool was open at the time.",
    answer:
      "Onboarding, support tickets and shipment operations in one workflow, attached to the shipments they are about.",
    figure: "+40%",
    figureLabel: "support efficiency",
  },
  {
    name: "Network and integrations",
    problem:
      "Growing the network means another integration project every time a carrier, 3PL or reseller joins.",
    answer:
      "Zineps is the layer between them. New parties connect to the platform, not to each of you separately.",
    figure: "10x",
    figureLabel: "faster to integrate",
  },
];

const faq = [
  {
    q: "What do I actually get out of partnering?",
    a: "Access to merchants already shipping on the platform, a place to publish your rates and conditions, and the operational tooling to run those customers without adding headcount.",
  },
  {
    q: "How do I make my contracts available to Zineps users?",
    a: "Publish your services, rates and conditions in the partner workspace. The matching engine then offers them to merchants whose lanes and volumes fit what you have.",
  },
  {
    q: "Do I keep the customer relationship?",
    a: "Yes. Merchants ship in Zineps, but the commercial relationship, the contract and the margin stay yours. Zineps is the infrastructure underneath it.",
  },
  {
    q: "Can I bring merchants I already serve?",
    a: "That is one of the main reasons partners join. Onboard your existing customers onto the platform and stop running their shipping through spreadsheets and email.",
  },
  {
    q: "How does pricing work on the partner side?",
    a: "It depends on your setup, volume and model. You can choose whether you or your customers pay for shipping and platform usage, which leaves the margin strategy with you.",
  },
];

export default function Partners() {
  return (
    <>
      <PageIntro
        eyebrow="For logistics partners"
        title={["Run the commercial side", "of logistics on one system."]}
        aside={<PartnersArt />}
        lead="Publish rates, set margins per customer group, invoice automatically and support the merchants you already serve. They ship in Zineps. The relationship stays yours."
        actions={
          <>
            <a href="/contact" className="btn btn-primary btn-lg">
              Talk to sales
            </a>
            <a href="/integrations" className="btn btn-ghost btn-lg">
              See the network
            </a>
          </>
        }
      />

      <FigureRow
        title={["What is already", "running on the platform"]}
        items={[
          { value: "1,000+", label: "active shippers" },
          { value: "100+", label: "carrier and logistics integrations" },
          { value: "5M+", label: "shipments processed" },
        ]}
        note="Figures as published by Zineps."
      />

      <ProblemList
        title={["Where the margin", "actually goes."]}
        lead="Most logistics companies still run on spreadsheets and disconnected tools. That is not a tooling preference, it is a cost, and it usually shows up as headcount."
        items={problems}
      />

      <SplitFeature
        tinted
        title={["One place to decide what you sell,", "and for how much."]}
        body="Rates and conditions published once. Customer groups with their own margins. Invoicing that runs per customer or per shipment without anyone exporting a CSV."
        points={[
          "Publish services, rates and conditions once, sell them many times",
          "Contracts, customer groups and margin rules in one catalogue",
          "Automatic invoicing per customer or per shipment",
          "Volume, margin and performance visible per customer",
        ]}
        action={
          <a href="/contact" className="btn btn-primary">
            Talk to sales
          </a>
        }
        visual={
          <div className="workspace">
            <Surface beam className="workspace-shell">
              <div className="workspace-core">
                <div className="workspace-head">
                  <span className="mono">PARTNER WORKSPACE</span>
                  <span className="mono workspace-period">THIS MONTH</span>
                </div>
                <table className="workspace-table">
                  <caption className="sr">
                    Example customer group performance
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">Customer group</th>
                      <th scope="col">Shipments</th>
                      <th scope="col">Margin</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Fashion, NL", "4,120", "18.2%"],
                      ["Electronics, DE", "2,845", "12.7%"],
                      ["Home and garden", "1,960", "21.4%"],
                      ["Marketplace sellers", "1,204", "9.8%"],
                    ].map(([group, shipments, margin]) => (
                      <tr key={group}>
                        <th scope="row">{group}</th>
                        <td className="num">{shipments}</td>
                        <td className="num workspace-margin">{margin}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="workspace-chart">
                  <p className="mono workspace-period">MARGIN BY GROUP</p>
                  <BarChart
                    label="Margin percentage by customer group"
                    values={[18.2, 12.7, 21.4, 9.8]}
                    labels={["Fashion", "Electr.", "Home", "Market."]}
                  />
                </div>
                <p className="customs-note">
                  Margin is set per group, not per invoice line.
                </p>
              </div>
            </Surface>
            <p className="console-note">
              Example workspace data. Fictional customer groups.
            </p>
          </div>
        }
      />

      <SplitFeature
        flip
        title={["Supply on one side,", "demand on the other."]}
        body="Carriers, freight forwarders, 3PLs and resellers publish what they can move. Merchants, marketplaces and B2B shippers buy it. Zineps is the layer that lets both sides grow without another integration project."
        points={[
          "Connect once, reach every shipper already on the platform",
          "Expand the network without building point-to-point links",
          "Onboard the merchants you already serve onto the same system",
        ]}
        visual={
          <div className="network">
            <div className="network-col">
              <p className="network-label mono">SUPPLY</p>
              <ul>
                {[
                  "Carriers",
                  "Freight forwarders",
                  "3PLs",
                  "Regional networks",
                ].map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="network-spine" aria-hidden="true">
              <span className="network-hub">Zineps</span>
            </div>
            <div className="network-col">
              <p className="network-label mono">DEMAND</p>
              <ul>
                {[
                  "Online stores",
                  "Marketplace sellers",
                  "D2C brands",
                  "B2B shippers",
                ].map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        }
      />

      <Faq items={faq} heading="What partners ask first" />
      <Closing
        title="Bring your contracts. Keep your customers."
        body="Publish what you can move, set your margins, and let the merchants already on the platform find you."
      />
    </>
  );
}
