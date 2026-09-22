import { useEffect } from "react";
import { optical } from "../lib/optical";
import { Closing } from "../components/Closing";
import { ArticleCover } from "../components/ArticleCover";
import { articles, formatDate, type Block } from "../data/articles";
import NotFound from "./NotFound";

function Body({ block }: { block: Block }) {
  if (block.t === "p") return <p>{block.v}</p>;
  if (block.t === "h") return <h2>{block.v}</h2>;
  if (block.t === "quote") return <blockquote>{block.v}</blockquote>;
  if (block.t === "list")
    return (
      <ul className="prose-list">
        {block.v.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  return (
    <div
      className="prose-table-wrap"
      tabIndex={0}
      role="region"
      aria-label="Table, scrolls horizontally"
    >
      <table className="prose-table">
        <thead>
          <tr>
            {block.head.map((cell) => (
              <th key={cell} scope="col">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row) => (
            <tr key={row.join()}>
              {row.map((cell, i) => (
                <td key={i} className={i ? "num" : undefined}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Reading progress, driven entirely by the CSS scroll timeline. No scroll
 * listener, no per-frame JavaScript, and it runs off the main thread. Where
 * the browser has no scroll timeline the bar simply does not render.
 */
function Progress() {
  return <div className="progress" aria-hidden="true" />;
}

export default function Article({ slug }: { slug: string }) {
  const article = articles.find((a) => a.slug === slug);

  /* Two more guides, same topic first, so the foot of the page is a real
     suggestion rather than whatever happens to sit next in the array. */
  const related = [
    ...articles.filter((a) => a.slug !== slug && a.topic === article?.topic),
    ...articles.filter((a) => a.slug !== slug && a.topic !== article?.topic),
  ].slice(0, 2);

  useEffect(() => {
    if (article) document.title = `${article.title} | Zineps`;
  }, [article]);

  if (!article) return <NotFound />;

  return (
    <>
      <Progress />
      <article className="prose-page">
        <div className="prose-cover shell shell-wide">
          <ArticleCover slug={article.slug} />
        </div>

        <header className="prose-head shell">
          <p className="jrn-meta mono">
            {article.topic} <span aria-hidden="true">·</span> {article.minutes}{" "}
            min read
          </p>
          <h1 style={optical(article.title)}>{article.title}</h1>
          <p className="lead">{article.standfirst}</p>
          <time dateTime={article.date} className="prose-date mono">
            {formatDate(article.date)}
          </time>
        </header>

        <div className="prose shell">
          {article.body.map((block, i) => (
            <Body key={i} block={block} />
          ))}
        </div>

        <footer className="prose-foot shell shell-wide">
          <div className="prose-more">
            <p className="jrn-meta mono">Keep reading</p>
            <ul>
              {related.map((item) => (
                <li key={item.slug}>
                  <a href={`/blog/${item.slug}`} className="prose-next">
                    <ArticleCover slug={item.slug} className="prose-next-art" />
                    <span className="prose-next-body">
                      <span className="jrn-meta mono">
                        {item.topic} <span aria-hidden="true">·</span>{" "}
                        {item.minutes} min
                      </span>
                      <span className="prose-next-title">{item.title}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <p className="prose-note">
            Written for this redesign concept. Zineps publishes its own blog at{" "}
            <a
              className="link link-static"
              href="https://www.zineps.com/blog?lang=en"
              target="_blank"
              rel="noreferrer"
            >
              zineps.com
            </a>
            .
          </p>
        </footer>
      </article>

      <Closing
        title="Shipping is mostly small decisions, made a lot."
        body="Zineps makes the repeatable ones once and leaves you the interesting ones."
      />
    </>
  );
}
