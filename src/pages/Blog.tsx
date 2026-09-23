import { useState } from "react";
import { optical } from "../lib/optical";
import { PageIntro } from "../components/PageIntro";
import { BlogArt } from "../components/IntroArt";
import { Segmented } from "../components/Segmented";
import { Closing } from "../components/Closing";
import { Reveal } from "../components/Reveal";
import { ArticleCover } from "../components/ArticleCover";
import { articles, byTopic, formatDate, topics } from "../data/articles";

export default function Blog() {
  const [topic, setTopic] = useState("All");
  const list = byTopic(topic);
  const [lead, ...rest] = list;

  return (
    <>
      <PageIntro
        title={["Notes from the part of e-commerce", "nobody photographs."]}
        aside={<BlogArt />}
        lead="Packaging maths, rule sets, customs fields and return reasons. The unglamorous decisions that decide what shipping actually costs you."
        actions={
          <Segmented
            name="Topic"
            value={topic}
            options={topics.map((t) => ({ value: t, label: t }))}
            onChange={setTopic}
          />
        }
      />

      <section className="section-tight journal">
        <div className="shell shell-wide">
          {lead ? (
            <a href={`/blog/${lead.slug}`} className="jrn-hero">
              <ArticleCover slug={lead.slug} className="jrn-hero-art spot" />
              <div className="jrn-hero-copy">
                <p className="jrn-meta mono">
                  {lead.topic} <span aria-hidden="true">·</span> {lead.minutes}{" "}
                  min read
                </p>
                <h2 style={optical(lead.title)}>{lead.title}</h2>
                <p className="lead">{lead.standfirst}</p>
                <span className="jrn-more link link-accent">
                  Read the guide
                </span>
                <time dateTime={lead.date} className="jrn-date mono">
                  {formatDate(lead.date)}
                </time>
              </div>
            </a>
          ) : null}

          {rest.length ? (
            <ul className="jrn-grid">
              {rest.map((article, i) => (
                <Reveal as="li" key={article.slug} index={i % 3} shift={16}>
                  <a href={`/blog/${article.slug}`} className="jrn-tile">
                    <ArticleCover
                      slug={article.slug}
                      className="jrn-tile-art spot"
                    />
                    <div className="jrn-tile-body">
                      <p className="jrn-meta mono">
                        {article.topic} <span aria-hidden="true">·</span>{" "}
                        {article.minutes} min
                      </p>
                      <h3>{article.title}</h3>
                      <p>{article.standfirst}</p>
                    </div>
                  </a>
                </Reveal>
              ))}
            </ul>
          ) : null}

          {list.length === 0 ? (
            <p className="dir-empty">Nothing filed under {topic} yet.</p>
          ) : null}

          <p className="plans-note">
            {articles.length} guides, written for this concept rather than
            reproduced from zineps.com.
          </p>
        </div>
      </section>

      <Closing
        title="Reading about it is the cheap part."
        body="The free plan covers 200 shipments a month, with partner rates and no per-label fee."
      />
    </>
  );
}
