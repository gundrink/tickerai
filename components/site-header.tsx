import Link from "next/link";
import { ConnectButton } from "@/components/connect-button";
import { HeaderMarks } from "@/components/header-marks";
import { SectionNav } from "@/components/section-nav";
import { clusterLabel, publicEnv } from "@/lib/env";

export function SiteHeader({ current }: { current: "home" | "desk" | "connect" }) {
  return (
    <header className={current === "home" ? "site-header" : "site-header site-header-app"}>
      <div className="brand-cluster">
        <Link href="/" className="wordmark" aria-label="TickerAI">
          <img className="brand-mark" src="/mark.png" alt="" width={28} height={28} />
          <span className="brand-name">
            Ticker<em>AI</em>
          </span>
        </Link>
        <HeaderMarks xUrl={publicEnv.xUrl} ca={publicEnv.ca} cluster={publicEnv.cluster} />
      </div>
      <nav className="site-nav">
        {current === "home" ? (
          <>
            <SectionNav />
            <Link className="launch-link" href="/desk">
              Open desk
            </Link>
          </>
        ) : (
          <>
            <Link href="/desk" aria-current={current === "desk" ? "page" : undefined}>
              Desk
            </Link>
            <Link href="/connect" aria-current={current === "connect" ? "page" : undefined}>
              {clusterLabel[publicEnv.cluster]}
            </Link>
            <ConnectButton compact label="Connect" />
          </>
        )}
      </nav>
    </header>
  );
}
