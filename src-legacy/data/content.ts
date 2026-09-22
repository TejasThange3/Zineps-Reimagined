export const links = {
  official: "https://www.zineps.com/",
  register: "https://app.zineps.com/register",
  partners: "https://www.zineps.com/logistics-operating-system",
  integrations: "https://www.zineps.com/integrations",
  contact: "https://www.zineps.com/contact",
};

export const integrations = [
  {
    name: "Shopify",
    category: "Commerce",
    detail: "Connect your store and bring orders into your shipping workflow.",
  },
  {
    name: "WooCommerce",
    category: "Commerce",
    detail: "Connect your WooCommerce store to your shipping workspace.",
  },
  {
    name: "Amazon",
    category: "Commerce",
    detail: "Bring marketplace orders into your connected shipping workflow.",
  },
  {
    name: "DHL",
    category: "Carriers",
    detail: "Access DHL shipping through the Zineps carrier network.",
  },
  {
    name: "PostNL",
    category: "Carriers",
    detail: "Connect PostNL services to your shipping workflow.",
  },
  {
    name: "DPD",
    category: "Carriers",
    detail: "Connect DPD services alongside your other shipping options.",
  },
  {
    name: "UPS",
    category: "Carriers",
    detail: "Access UPS shipping through the Zineps carrier network.",
  },
] as const;
