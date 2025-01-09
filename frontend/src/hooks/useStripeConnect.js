// hooks/useStripeConnect.js

import { useState, useEffect } from "react";
import { loadConnectAndInitialize } from "@stripe/connect-js";

export const useStripeConnect = (connectedAccountId) => {
  const [stripeConnectInstance, setStripeConnectInstance] = useState();

  useEffect(() => {
    if (connectedAccountId) {
      const fetchClientSecret = async () => {
        const response = await fetch("/api/stripe/account_session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accountId: connectedAccountId }),
        });

        if (response.ok) {
          const { client_secret: clientSecret } = await response.json();
          return clientSecret;
        } else {
          console.error("Error fetching client secret");
        }
      };

      loadConnectAndInitialize({
        publishableKey: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY,
        fetchClientSecret,
        appearance: { overlays: "dialog" },
      }).then(setStripeConnectInstance);
    }
  }, [connectedAccountId]);

  return stripeConnectInstance;
};
