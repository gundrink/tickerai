import Link from "next/link";
import { CollisionField } from "@/components/collision-field";
import { HeroSearch } from "@/components/hero-search";
import { ScrollField } from "@/components/scroll-field";
import { SiteHeader } from "@/components/site-header";

const ticker = [
  "One ticker, many contracts",
  "Liquidity × unique traders",
  "Young pools lose half their score",
  "Farmed puddles stay off the pick",
  "Market cap is a flag, never a sort",
  "Same address is not verified",
  "Heuristic, not proof",
];

const lineup = ["PEPE", "WIF", "BONK", "TRUMP", "USDT", "APE", "MOODENG", "POPCAT"];

const steps = [
  {
    title: "Type the ticker",
    body: "A symbol or a contract address. The search leaves this page and opens the desk.",
  },
  {
    title: "See every candidate",
    body: "Exact-symbol rows, related names, and off-chain venue listings stay in separate buckets.",
  },
  {
    title: "Read the stamp",
    body: "The pick is liquidity times unique traders, with age and farming checks. Missing data stays unknown.",
  },
  {
    title: "Check the explorer",
    body: "The desk abstains when the evidence is not there. No pick is better than a wrong pick.",
  },
];

export default function LandingPage() {
  return (
    <>
      <SiteHeader current="home" />
      <ScrollField />
      <main>
        <section className="hero" id="current">
          <CollisionField />
          <p className="ticker" aria-hidden="true">
            {[0, 1].map((copy) => (
              <span key={copy}>
                {ticker.map((item) => (
                  <span key={`${copy}-${item}`}>
                    <i />
                    {item}
                  </span>
                ))}
              </span>
            ))}
          </p>
          <div className="hero-copy">
            <p className="eyebrow">Ticker collision</p>
            <h1>
              Which one is worth <em>inspecting</em>?
            </h1>
            <p className="lede">
              Type a ticker. TickerAI opens a desk of every observed candidate wearing it, then stamps the one best
              supported by liquidity and trader evidence. The stamp is a <strong>heuristic, not proof</strong>.
            </p>
            <ul className="coin-row">
              {lineup.map((coin) => (
                <li key={coin}>{coin}</li>
              ))}
            </ul>
            <HeroSearch />
            <p className="fine">Search opens a new page. Missing liquidity or traders render as unknown.</p>
          </div>
        </section>

        <section className="section" id="collision">
          <p className="kicker">The collision</p>
          <h2>A symbol is not an identity.</h2>
          <p className="section-lede">
            One search can return dozens of exact-symbol rows across chains. The desk keeps the evidence on the table
            and refuses a pick when the evidence is not there.
          </p>
          <div className="compare">
            <article className="card card-dark">
              <header>
                <h3>Guessing the name</h3>
                <span>Risk</span>
              </header>
              <dl>
                <div>
                  <dt>What you see</dt>
                  <dd>The ticker</dd>
                </div>
                <div>
                  <dt>What you miss</dt>
                  <dd>The other contracts</dd>
                </div>
                <div>
                  <dt>A crowded puddle</dt>
                  <dd>Looks busy</dd>
                </div>
                <div>
                  <dt>Market cap</dt>
                  <dd>Can be inflated</dd>
                </div>
              </dl>
            </article>
            <article className="card card-light">
              <header>
                <h3>Reading the desk</h3>
                <span>Evidence</span>
              </header>
              <dl>
                <div>
                  <dt>What you see</dt>
                  <dd>Every candidate</dd>
                </div>
                <div>
                  <dt>Score</dt>
                  <dd>Liquidity × traders</dd>
                </div>
                <div>
                  <dt>A crowded puddle</dt>
                  <dd>Flagged, not crowned</dd>
                </div>
                <div>
                  <dt>No evidence</dt>
                  <dd>The desk abstains</dd>
                </div>
              </dl>
            </article>
          </div>
        </section>

        <section className="section" id="signals">
          <p className="kicker">Three signals</p>
          <h2>The pick is a ranking, not a verdict.</h2>
          <ol className="signal-grid">
            <li>
              <h3>Depth × traders</h3>
              <p className="formula">score = liquidity × ut24h</p>
              <p>Both numbers have to be present. A missing value stays unknown. It is never treated as zero.</p>
            </li>
            <li>
              <h3>Pool age</h3>
              <p className="formula">under 30 days → × 0.5</p>
              <p>A young pool can buy attention. It cannot buy an older first-pool timestamp.</p>
            </li>
            <li>
              <h3>Farming flag</h3>
              <p className="formula">crowded puddle stays out</p>
              <p>Thousands of traders on a thin pool are excluded from the pick. A deep pool is not punished for being busy.</p>
            </li>
          </ol>
        </section>

        <section className="section" id="steps">
          <p className="kicker">The path</p>
          <h2>Search here. Read the result on the next page.</h2>
          <ol className="step-grid">
            {steps.map((step, index) => (
              <li key={step.title} style={{ animationDelay: `${index * 80}ms` }}>
                <span>0{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="section closing" id="enter">
          <p className="kicker">Open the desk</p>
          <h2>Pick a ticker, or type your own.</h2>
          <div className="actions">
            <Link className="primary-link" href="/desk?q=PEPE">
              Resolve PEPE
            </Link>
            <Link className="secondary-link" href="/desk">
              Open an empty desk
            </Link>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <span>Heuristic, not proof. Verify on the explorer.</span>
        <span>Not financial advice.</span>
      </footer>
    </>
  );
}
