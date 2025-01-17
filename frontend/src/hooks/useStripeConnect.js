// hooks/useStripeConnect.js

// import { useState, useEffect } from "react";
// import { loadConnectAndInitialize } from "@stripe/connect-js";

// export const useStripeConnect = (connectedAccountId) => {
//   const [stripeConnectInstance, setStripeConnectInstance] = useState();

//   useEffect(() => {
//     if (connectedAccountId) {
//       const fetchClientSecret = async () => {
//         const response = await fetch("/api/stripe/account_session", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ accountId: connectedAccountId }),
//         });

//         if (response.ok) {
//           const { client_secret: clientSecret } = await response.json();
//           return clientSecret;
//         } else {
//           console.error("Error fetching client secret");
//         }
//       };

//       loadConnectAndInitialize({
//         publishableKey: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY,
//         fetchClientSecret,
//         appearance: { overlays: "dialog" },
//       }).then(setStripeConnectInstance);
//     }
//   }, [connectedAccountId]);

//   return stripeConnectInstance;
// };

// hooks/useStripeConnect.js
import { useEffect, useState } from 'react';
import { loadConnectAndInitialize } from '@stripe/connect-js';

export function useStripeConnect(connectedAccountId) {
  const [stripeConnectInstance, setStripeConnectInstance] = useState(null);

  useEffect(() => {
    if (!connectedAccountId) return;

    const initConnect = async () => {
      try {
        // loadConnectAndInitialize espera un objeto con tu publishableKey,
        // y una función "fetchClientSecret" que recupere client_secret de tu backend
        const instance = await loadConnectAndInitialize({
          publishableKey: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY,
          fetchClientSecret: async () => {
            // Llamar a tu endpoint /account_session
            const response = await fetch(`${process.env.REACT_APP_API_URL}/stripe/account_session`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ account: connectedAccountId }),
            });
            if (!response.ok) {
              throw new Error("No se pudo obtener client_secret");
            }
            const { client_secret } = await response.json();
            return client_secret;
          },
          appearance: {
            // Opcional: personalizar colores y estilo
            overlays: "dialog",
            variables: { colorPrimary: "#10110f" },
          },
        });

        setStripeConnectInstance(instance);
      } catch (err) {
        console.error("Error inicializando Connect.js:", err);
      }
    };

    initConnect();
  }, [connectedAccountId]);

  return stripeConnectInstance;
}

