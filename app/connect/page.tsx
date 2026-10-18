"use client";

import Link from "next/link";
import { useAppKitAccount } from "@reown/appkit/react";
import { useEffect, useState } from "react";
import { ConnectButton } from "@/components/connect-button";
import { SiteHeader } from "@/components/site-header";
import { clusterLabel, publicEnv } from "@/lib/env";

export default function ConnectPage() {
  const { isConnected } = useAppKitAccount();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <>
      <SiteHeader current="connect" />
      <main className="connect-stage">
        <section className="connect-panel" aria-label="Connect wallet">
          <img className="connect-mark" src="/mark.png" alt="" width={96} height={96} />
          <p className="connect-kicker">{clusterLabel[publicEnv.cluster]}</p>
          <h1>Connect a wallet</h1>
          <p className="connect-lead">The wallet opens on {publicEnv.cluster}. Email and social login stay off.</p>
          <ConnectButton label="Connect wallet" />
          {ready && isConnected ? (
            <Link className="connect-enter" href="/desk">
              Enter the desk
            </Link>
          ) : null}
        </section>
      </main>
    </>
  );
}
