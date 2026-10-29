import { zuploMonetizationPlugin } from "@zuplo/zudoku-plugin-monetization";
// import { graphqlPlugin } from "@zudoku/plugin-graphql";
import type { ZudokuConfig } from "zudoku";
import { HomePage } from "./src/HomePage";

/**
 * Developer Portal Configuration
 * For more information, see:
 * https://zuplo.com/docs/dev-portal/zudoku/configuration/overview
 */
const config: ZudokuConfig = {
  site: {
    title: "Logistics API",
    logo: {
      src: {
        light: "/logo-light.svg",
        dark: "/logo-dark.svg",
      },
      width: 165,
      height: 24,
      alt: "Logistics API",
    },
    banner: {
      message: (
        <div className="text-center">
          📦 The Gold plan now bundles the Shipping and Delivery APIs
        </div>
      ),
      dismissible: true,
    },
  },
  metadata: {
    title: "Logistics API Developer Portal",
    description: "Shipping and delivery APIs for developers",
  },
  // Warm neutrals with a cargo-yellow accent
  theme: {
    light: {
      background: "#fefdfc",
      foreground: "#262626",
      card: "#ffffff",
      cardForeground: "#262626",
      primary: "#f4bf32",
      primaryForeground: "#0f1719",
      secondary: "#f5f5f4",
      secondaryForeground: "#1c1917",
      muted: "#f5f5f5",
      mutedForeground: "#71717a",
      accent: "#f5f5f4",
      accentForeground: "#1c1917",
      border: "#e7e5e4",
      input: "#e7e5e4",
      ring: "#a1a1a1",
      radius: "0.4rem",
    },
    dark: {
      background: "#1a1a18",
      foreground: "#fafaf9",
      card: "#242424",
      cardForeground: "#f2e9e4",
      popover: "#0c0a09",
      popoverForeground: "#fafaf9",
      primary: "#f4bf32",
      primaryForeground: "#0f1719",
      secondary: "#292524",
      secondaryForeground: "#fafaf9",
      muted: "#222222",
      mutedForeground: "#a1a1aa",
      accent: "#292524",
      accentForeground: "#fafaf9",
      border: "#423e3c",
      input: "#4f4948",
      ring: "#a16207",
    },
  },
  navigation: [
    {
      type: "custom-page",
      path: "/",
      element: <HomePage />,
      display: "hide",
    },
    {
      type: "category",
      label: "Documentation",
      icon: "book-open",
      items: [
        {
          type: "doc",
          file: "getting-started",
          icon: "rocket",
        },
      ],
    },
    {
      type: "link",
      to: "/api",
      label: "API Reference",
      icon: "truck",
    },
  ],
  apis: [
    {
      type: "file",
      input: "../config/routes.oas.json",
      path: "api",
    },
  ],
  authentication: {
    // IMPORTANT: This is a demo Auth0 configuration.
    // In a real application, you should replace these values with your own
    // identity provider's configuration.
    // This configuration WILL NOT WORK with custom domains.
    // For more information, see:
    // https://zuplo.com/docs/dev-portal/zudoku/configuration/authentication
    type: "auth0",
    domain: "auth.zuplo.site",
    clientId: "f8I87rdsCRo4nU2FHf0fHVwA9P7xi7Ml",
    audience: "https://api.example.com/",
  },
  apiKeys: {
    enabled: true,
  },
  plugins: [
    // Uncomment to document a GraphQL API:
    // graphqlPlugin({
    //   path: "/graphql",
    //   schema: "./schema.graphql",
    //   endpoint: "/graphql", // (optional, default: "/graphql")
    // }),
    zuploMonetizationPlugin(),
  ],
};

export default config;
