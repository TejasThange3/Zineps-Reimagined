import { useState } from "react";
import { optical } from "../lib/optical";
import { PageIntro } from "../components/PageIntro";
import { Segmented } from "../components/Segmented";

const routes = {
  merchant: {
    label: "I want to ship",
    heading: "Tell us what you ship and where.",
    note: "Volume, destinations and the systems you run on. That is enough for us to say what the network can do for your lanes.",
    fields: [
      { id: "company", label: "Company", type: "text", auto: "organization" },
      { id: "email", label: "Work email", type: "email", auto: "email" },
      {
        id: "volume",
        label: "Shipments a month",
        type: "text",
        auto: "off",
        hint: "A rough number is fine.",
      },
      {
        id: "countries",
        label: "Where you ship to",
        type: "text",
        auto: "off",
        hint: "For example: NL, BE, DE.",
      },
    ],
  },
  partner: {
    label: "I move goods",
    heading: "Tell us what you can carry.",
    note: "Your services, lanes and the customers you already serve. We will come back on how partnering works for your model.",
    fields: [
      { id: "company", label: "Company", type: "text", auto: "organization" },
      { id: "email", label: "Work email", type: "email", auto: "email" },
      {
        id: "services",
        label: "Services you offer",
        type: "text",
        auto: "off",
        hint: "Parcel, freight, fulfilment, last mile.",
      },
      {
        id: "regions",
        label: "Regions you cover",
        type: "text",
        auto: "off",
        hint: "Countries or a description.",
      },
    ],
  },
} as const;

type Route = keyof typeof routes;

export default function Contact() {
  const [route, setRoute] = useState<Route>("merchant");
  const active = routes[route];

  return (
    <>
      <PageIntro
        title={["Talk to someone who has", "seen your problem before."]}
        lead="Zineps is a small team in Amsterdam. Questions about rates, lanes, integrations or partnering reach a person, not a queue."
        aside={
          <div className="contact-details">
            <dl>
              <div>
                <dt>Email</dt>
                <dd>
                  <a className="link link-static" href="mailto:info@zineps.com">
                    info@zineps.com
                  </a>
                </dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>
                  <a className="link link-static" href="tel:+31202614474">
                    020 261 4474
                  </a>
                </dd>
              </div>
              <div>
                <dt>Office</dt>
                <dd>
                  Herikerbergweg 288
                  <br />
                  1101 CT Amsterdam
                </dd>
              </div>
            </dl>
          </div>
        }
      />

      <section className="section contact">
        <div className="shell shell-wide">
          <div className="contact-grid">
            <div className="contact-copy">
              <Segmented
                name="Who you are"
                value={route}
                options={[
                  { value: "merchant", label: routes.merchant.label },
                  { value: "partner", label: routes.partner.label },
                ]}
                onChange={(value) => setRoute(value as Route)}
              />
              <h2 style={optical(active.heading)}>{active.heading}</h2>
              <p className="lead">{active.note}</p>
              <p className="contact-alt">
                In a hurry?{" "}
                <a className="link link-accent" href="/pricing">
                  Start on the free plan
                </a>{" "}
                and talk to us afterwards.
              </p>
            </div>

            <form
              className="contact-form"
              onSubmit={(event) => event.preventDefault()}
              noValidate
            >
              {active.fields.map((field) => (
                <div className="field" key={`${route}-${field.id}`}>
                  <label htmlFor={`${route}-${field.id}`}>{field.label}</label>
                  <input
                    id={`${route}-${field.id}`}
                    name={field.id}
                    type={field.type}
                    className="input"
                    autoComplete={field.auto}
                  />
                  {"hint" in field && field.hint ? (
                    <p className="hint">{field.hint}</p>
                  ) : null}
                </div>
              ))}

              <div className="field">
                <label htmlFor={`${route}-message`}>Anything else</label>
                <textarea
                  id={`${route}-message`}
                  name="message"
                  className="input contact-area"
                  rows={4}
                />
              </div>

              <div className="contact-submit">
                <a
                  href="https://www.zineps.com/contact"
                  className="btn btn-primary btn-lg"
                  target="_blank"
                  rel="noreferrer"
                >
                  Send this on zineps.com
                </a>
                <p className="contact-disclosure">
                  This is a redesign concept with no backend, so the form does
                  not submit anywhere and nothing you type is stored or sent.
                  The button opens the real contact page.
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
