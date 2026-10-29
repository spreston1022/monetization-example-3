import {
  ArrowRightIcon,
  KeyRoundIcon,
  MapPinnedIcon,
  PackageIcon,
  ReceiptTextIcon,
  TruckIcon,
} from "zudoku/icons";
import { Link } from "zudoku/router";

const apis = [
  {
    icon: PackageIcon,
    name: "Shipping API",
    endpoint: "GET /v1/shipments",
    description:
      "List shipments with their carrier, service level, route, weight and current status.",
    plans: "Bronze & Gold",
    href: "/api/shipping",
  },
  {
    icon: MapPinnedIcon,
    name: "Delivery API",
    endpoint: "GET /v1/deliveries",
    description:
      "Follow each delivery to the doorstep, from out-for-delivery to signed-for proof of delivery.",
    plans: "Silver & Gold",
    href: "/api/delivery",
  },
];

const steps = [
  {
    icon: ReceiptTextIcon,
    title: "Pick a plan",
    body: "Choose Bronze, Silver or Gold on the pricing page.",
  },
  {
    icon: KeyRoundIcon,
    title: "Get your API key",
    body: "A key is issued the moment your subscription starts.",
  },
  {
    icon: TruckIcon,
    title: "Start shipping",
    body: "Send it as a Bearer token and call the APIs in your plan.",
  },
];

const sample = `curl https://your-gateway.zuplo.app/v1/shipments \\
  -H "Authorization: Bearer $API_KEY"

[
  {
    "id": "shp_1002",
    "carrier": "FedEx",
    "service": "2Day",
    "destination": "Denver, CO",
    "status": "in_transit"
  }
]`;

export const HomePage = () => (
  <div>
    <section className="ml-[calc(50%-50vw)] w-screen bg-[#1a1a18] text-[#fafaf9]">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:py-28">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-sm text-primary">
            <TruckIcon size={14} /> Shipping &amp; delivery data, one key
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight lg:text-6xl">
            Move parcels.
            <br />
            <span className="text-primary">Track every mile.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg text-[#a8a29e]">
            The Logistics API gives your app live shipment and delivery data
            through simple REST endpoints. Subscribe, get a key and make your
            first call in minutes.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 font-semibold text-primary-foreground transition hover:brightness-95"
            >
              View pricing <ArrowRightIcon size={16} />
            </Link>
            <Link
              to="/api"
              className="inline-flex items-center gap-2 rounded-md border border-[#423e3c] px-5 py-3 font-semibold transition hover:bg-[#292524]"
            >
              API reference
            </Link>
          </div>
        </div>
        <pre className="overflow-x-auto rounded-xl border border-[#423e3c] bg-[#0c0a09] p-6 text-sm leading-relaxed text-[#e7e5e4] shadow-2xl">
          <code>{sample}</code>
        </pre>
      </div>
    </section>

    <section className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="text-3xl font-bold tracking-tight">Two APIs, three plans</h2>
      <p className="mt-3 text-muted-foreground">
        Bronze includes Shipping, Silver includes Delivery, and Gold bundles
        both.
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {apis.map(({ icon: Icon, ...api }) => (
          <Link
            key={api.name}
            to={api.href}
            className="group rounded-xl border bg-card p-8 transition hover:border-primary hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex size-12 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Icon size={24} />
              </div>
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                {api.plans}
              </span>
            </div>
            <h3 className="mt-6 text-xl font-semibold">{api.name}</h3>
            <code className="mt-2 block text-sm text-muted-foreground">
              {api.endpoint}
            </code>
            <p className="mt-4 text-muted-foreground">{api.description}</p>
            <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold group-hover:text-primary">
              Explore the docs <ArrowRightIcon size={14} />
            </span>
          </Link>
        ))}
      </div>
    </section>

    <section className="ml-[calc(50%-50vw)] w-screen border-y bg-secondary/50">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-3">
        {steps.map(({ icon: Icon, title, body }, i) => (
          <div key={title} className="flex gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
              {i + 1}
            </div>
            <div>
              <h3 className="flex items-center gap-2 font-semibold">
                <Icon size={16} /> {title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-primary px-10 py-12 text-primary-foreground md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-bold">Ready to ship?</h2>
          <p className="mt-2 opacity-80">
            Start on Bronze for free and upgrade when you need delivery data.
          </p>
        </div>
        <Link
          to="/pricing"
          className="inline-flex items-center gap-2 rounded-md bg-[#0f1719] px-5 py-3 font-semibold text-white transition hover:opacity-90"
        >
          Choose a plan <ArrowRightIcon size={16} />
        </Link>
      </div>
    </section>
  </div>
);
