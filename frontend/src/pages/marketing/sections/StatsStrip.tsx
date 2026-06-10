import { Icon } from "@shared/icons";

const items: ReadonlyArray<{ value: string; label: string; star?: boolean }> = [
  { value: "10,000+", label: "Enrolled Students" },
  { value: "500+", label: "Verified Businesses" },
  { value: "4.9/5", label: "Average Rating", star: true },
];

export function StatsStrip() {
  return (
    <section className="container-page" style={{ paddingBottom: 56 }}>
      <div
        style={{
          display: "flex",
          background: "var(--surface-2)",
          borderRadius: "var(--radius-lg)",
          padding: "28px 0",
        }}
      >
        {items.map((it, i) => (
          <div
            key={it.label}
            style={{
              flex: 1,
              textAlign: "center",
              borderLeft: i ? "1px solid var(--border-default)" : "none",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: 34,
                color: "var(--brand-700)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              {it.value}
              {it.star && (
                <Icon
                  name="Star"
                  size={22}
                  style={{ color: "var(--star)" }}
                  fill="var(--star)"
                />
              )}
            </div>
            <div
              style={{
                fontFamily: "var(--font-text)",
                fontSize: 14,
                color: "var(--text-muted)",
                marginTop: 4,
              }}
            >
              {it.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
