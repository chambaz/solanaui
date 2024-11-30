"use client";

import { TxnList } from "@/components/sol/txn-list";

import { DocsTabs, DocsVariant } from "@/components/web/docs-tabs";

export default function TokenCardPage() {
  const variants: DocsVariant[] = [
    {
      label: "Default",
      value: "default",
      preview: (
        <TxnList
          signatures={[
            "2EaBnbW5nranKYGguV7roVYRfHBQtKDDFutsDJCpVdggE2aMRgnv8R29KLAWWu9SMmhnGB4q6jbrA5AM4VLznVYT",
            "4uWXpZQk5ESz67uMFPfRo1X9eegpKUCrCJ1dsxktqVGbLh5fGRXsGGSq63n9AdjLp1mSxC8WCHig6Cd1wdpY38sQ",
            "2ynHGAkRP3RVdax6kTh68t7n6tLG5RadvbMMShf4d46JMEpcdY9dao1mBbBMPT7tuhtvSMtVgKyutaR2z7uShfLB",
            "2gYLu4wW16p5bdpYhB5DQ3udSSFQCngAE9xnuZb2wS4iA5fsPW6NTLPz4PYVSE6rewAB3UKePZ2HN3XSrdNP337H",
            "euoUXwshHbqTqchFVuUy8QBX3jMi6RXnXHM3a4HBFfk1pekFW4iECQuasLoALBksTaNmJtaLLNmPYtmxMms3W7o",
            "3aKWM9U91KHHVyB1C9pE7kxDSPiFKz7CrqikHGBpbAPMtPBeE6HfZ4pyWjH6w8ZKT3xofxEekMQ2ZfxUDNsm3by2",
            "DoRCpn8HYxsEa2JBSUXCtxnxL5snnHtHcANa6ugJh2VhczTbfHVPRq7HY3h123xZRRSZ2AcXUZr8TwsidHrRUDo",
          ]}
          onClick={(txn) => {
            alert(txn.transaction.signatures[0]);
          }}
        />
      ),
      code: `import { TokenList } from "@/components/sol/token-list"

export function TokenCardDemo() {
  return (
    <TokenList 
      tokens={[
        new PublicKey("EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm"),
        new PublicKey("EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm"),
      ]}
      address={
        publicKey ?? new PublicKey("11111111111111111111111111111111")
      }
      onClick={(token) => {
        alert(txn.transaction.signatures[0]);
      }}
    />
  )
}`,
    },
  ];

  return <DocsTabs variants={variants} />;
}
