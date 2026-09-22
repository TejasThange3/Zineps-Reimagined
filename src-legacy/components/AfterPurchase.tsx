import { useState } from "react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Package,
  RotateCcw,
  ScanLine,
} from "lucide-react";
export function AfterPurchase() {
  const [view, setView] = useState("Tracking"),
    [reason, setReason] = useState("Size not quite right"),
    [submitted, setSubmitted] = useState(false);
  return (
    <section className="split-feature mint-feature">
      <div className="container split-feature-grid">
        <div>
          <div className="eyebrow section-eyebrow">
            YOUR BRAND. ALL THE WAY.
          </div>
          <h2>
            The experience
            <br />
            doesn’t end
            <br />
            <span className="muted-heading">at checkout.</span>
          </h2>
          <p>
            Make the moments after purchase feel as considered as the ones
            before it. Branded tracking, packing slips and return flows keep the
            journey recognizably yours.
          </p>
          <div
            className="after-tabs"
            aria-label="Explore the post-purchase experience"
          >
            {["Tracking", "Returns", "Packing slip"].map((tab) => (
              <button
                key={tab}
                aria-pressed={view === tab}
                onClick={() => setView(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <a href="/blog/branded-tracking" className="text-link">
            Explore the customer journey <ArrowRight size={18} />
          </a>
        </div>
        <div className="after-stage">
          <div className="after-browser" key={view}>
            <div className="after-browser-bar">
              <span />
              <span />
              <span />
              <small>
                sample-studio.example / {view.toLowerCase().replace(" ", "-")}
              </small>
            </div>
            <div className="after-brand">
              SAMPLE STUDIO<span>GOOD THINGS. ON THEIR WAY.</span>
            </div>
            {view === "Tracking" ? (
              <div className="after-tracking">
                <Package size={38} />
                <h3>
                  Your next good thing.
                  <br />
                  On its way.
                </h3>
                <p>Order DEMO-1048 · Amsterdam → Berlin</p>
                <div className="after-progress">
                  <span>
                    <Check size={13} />
                  </span>
                  <i />
                  <span>
                    <Check size={13} />
                  </span>
                  <i />
                  <span>
                    <Package size={13} />
                  </span>
                  <i className="pending" />
                  <span className="pending" />
                </div>
                <div className="after-progress-labels">
                  <span>Prepared</span>
                  <span>Collected</span>
                  <span>In transit</span>
                  <span>Delivered</span>
                </div>
                <div className="after-status">
                  <span className="status-dot" />
                  <span>
                    In transit<small>Awaiting the next carrier update.</small>
                  </span>
                </div>
              </div>
            ) : view === "Returns" ? (
              <div className="after-return">
                {submitted ? (
                  <div className="return-confirmation" role="status">
                    <CheckCircle2 size={39} />
                    <h3>A clear way back.</h3>
                    <p>Demo return prepared for the Everyday Set.</p>
                    <div>
                      <strong>Reason</strong>
                      <span>{reason}</span>
                    </div>
                    <small>
                      This is a local preview. No return has been submitted and
                      no shipping label has been created.
                    </small>
                    <button
                      className="text-link"
                      onClick={() => setSubmitted(false)}
                    >
                      Reset the example <RotateCcw size={14} />
                    </button>
                  </div>
                ) : (
                  <>
                    <RotateCcw size={27} />
                    <h3>Let’s find a way back.</h3>
                    <p>Example return · Order DEMO-1048</p>
                    <div className="return-item">
                      <Package size={23} />
                      <span>
                        The Everyday Set<small>1 item · Sample product</small>
                      </span>
                      <Check size={17} />
                    </div>
                    <label>
                      Reason for return
                      <select
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                      >
                        {[
                          "Size not quite right",
                          "Different from expected",
                          "Changed my mind",
                        ].map((r) => (
                          <option key={r}>{r}</option>
                        ))}
                      </select>
                    </label>
                    <button
                      className="button dark"
                      onClick={() => setSubmitted(true)}
                    >
                      Preview this return <ArrowRight size={16} />
                    </button>
                    <small>
                      Demo only. Actual eligibility follows the merchant’s
                      return policy.
                    </small>
                  </>
                )}
              </div>
            ) : (
              <div className="after-packing">
                <div className="packing-title">
                  <span>
                    <ScanLine size={24} /> PACKING SLIP
                  </span>
                  <strong>DEMO-1048</strong>
                </div>
                <h3>
                  A little something,
                  <br />
                  just for you.
                </h3>
                <p>Prepared for Example Recipient · Berlin</p>
                <div className="packing-line">
                  <span>ITEM</span>
                  <span>QTY</span>
                </div>
                <div className="packing-line">
                  <span>
                    The Everyday Set<small>SKU / SAMPLE-001</small>
                  </span>
                  <strong>01</strong>
                </div>
                <div className="packing-thanks">
                  Thank you for choosing Sample Studio.
                </div>
                <div className="barcode" />
              </div>
            )}
            <div className="after-disclaimer">
              BRANDED EXPERIENCE / ILLUSTRATIVE PREVIEW
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
