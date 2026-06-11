/**
 * Student → Find Work — the entry point for the core marketplace flow.
 *
 * What's here today:
 *   • Header with a live search box (debounced, no submit)
 *   • Filter chips (location, payKind)
 *   • Paginated gig grid (uses the existing useGigList hook)
 *   • Skeleton state, empty state, and "load more" pagination
 *   • Clicking a card navigates to /gigs/:id — TODO[gig-detail]
 *
 * What's NEXT (the core idea picks up here):
 *   • Real "Apply" flow — POST /api/v1/applications
 *   • Saved gigs / bookmarks
 *   • AI-assisted matching ("Recommended for you" using profile skills)
 *   • Server-driven "Why you'd be a good fit" reasoning
 *
 * The page is intentionally simple so the next iteration replaces
 * sections without touching the data plumbing.
 */
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge, Button, Card, SegmentedControl, Skeleton, Tag } from "@shared/ui";
import { Icon } from "@shared/icons";
import { Input } from "@shared/ui";
import { useGigList, type GigLocation, type GigPayKind } from "@features/gigs";
import { formatNprFixed, formatRupeeRate } from "@shared/lib/utils";
import { studentGigPath } from "@shared/config/routes";

type LocationFilter = "all" | GigLocation;
type PayFilter = "all" | GigPayKind;

export default function StudentFindWorkPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [location, setLocation] = useState<LocationFilter>("all");
  const [payKind, setPayKind] = useState<PayFilter>("all");
  const [page, setPage] = useState(1);

  // Debounce search input — 300ms feels live without flooding the API.
  useEffect(() => {
    const handle = window.setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => window.clearTimeout(handle);
  }, [search]);

  // Reset to page 1 whenever a filter changes; pagination on a different
  // result set rarely means what the user wanted.
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, location, payKind]);

  const filters = useMemo(
    () => ({
      page,
      pageSize: 12,
      ...(debouncedSearch ? { query: debouncedSearch } : {}),
      ...(location !== "all" ? { location } : {}),
      ...(payKind !== "all" ? { payKind } : {}),
    }),
    [page, debouncedSearch, location, payKind],
  );

  const { data, isLoading, isFetching, isError, refetch } = useGigList(filters);
  const gigs = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / 12));

  return (
    <div style={{ padding: "32px 40px", maxWidth: 1180 }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 38,
            color: "var(--text-strong)",
            margin: 0,
            letterSpacing: "-0.02em",
          }}
        >
          Find Work
        </h1>
        <p
          style={{
            fontFamily: "var(--font-text)",
            fontSize: 16,
            color: "var(--text-muted)",
            margin: "4px 0 0",
          }}
        >
          Gigs and projects matched to your skills.{" "}
          {total > 0 && (
            <span style={{ color: "var(--text-strong)", fontWeight: 600 }}>
              {total} open right now.
            </span>
          )}
        </p>
      </div>

      {/* Filters */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto auto",
          gap: 16,
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <Input
          placeholder="Search by title, skill, or company…"
          leading={<Icon name="Search" size={18} />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <SegmentedControl<LocationFilter>
          value={location}
          onChange={setLocation}
          options={[
            { value: "all", label: "All" },
            { value: "remote", label: "Remote" },
            { value: "onsite", label: "On-site" },
            { value: "hybrid", label: "Hybrid" },
          ]}
        />
        <SegmentedControl<PayFilter>
          value={payKind}
          onChange={setPayKind}
          options={[
            { value: "all", label: "Any pay" },
            { value: "hourly", label: "Hourly" },
            { value: "fixed", label: "Fixed" },
          ]}
        />
      </div>

      {/* Grid */}
      {isError ? (
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Icon name="AlertCircle" size={20} style={{ color: "var(--danger-500)" }} />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontFamily: "var(--font-text)",
                  fontWeight: 600,
                  color: "var(--text-strong)",
                }}
              >
                Couldn&apos;t load gigs
              </div>
              <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                Check your connection and retry.
              </div>
            </div>
            <Button variant="outline" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        </Card>
      ) : isLoading ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <Skeleton width="40%" height={12} />
              <div style={{ height: 12 }} />
              <Skeleton width="80%" height={20} />
              <div style={{ height: 12 }} />
              <Skeleton width="100%" height={14} />
              <div style={{ height: 6 }} />
              <Skeleton width="60%" height={14} />
            </Card>
          ))}
        </div>
      ) : gigs.length === 0 ? (
        <Card>
          <div style={{ textAlign: "center", padding: "32px 16px" }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "var(--radius-md)",
                background: "var(--surface-2)",
                color: "var(--ink-500)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 14,
              }}
            >
              <Icon name="SearchX" size={22} />
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 18,
                color: "var(--text-strong)",
                marginBottom: 4,
              }}
            >
              No matches yet
            </div>
            <div
              style={{
                fontFamily: "var(--font-text)",
                fontSize: 14,
                color: "var(--text-muted)",
              }}
            >
              Try a broader search or clear filters.
            </div>
          </div>
        </Card>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 16,
              opacity: isFetching ? 0.7 : 1,
              transition: "opacity var(--dur-fast) var(--ease-standard)",
            }}
          >
            {gigs.map((g) => {
              const rate =
                g.payKind === "fixed"
                  ? formatNprFixed(g.pay)
                  : formatRupeeRate(g.pay.amountMinor, "hr");
              return (
                <Card
                  key={g.id}
                  interactive
                  onClick={() => navigate(studentGigPath(g.id))}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-text)",
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: "0.05em",
                        color: "var(--text-subtle)",
                      }}
                    >
                      {g.category}
                    </span>
                    {g.isPremium && <Badge tone="premium">Premium</Badge>}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: 17,
                      color: "var(--text-strong)",
                    }}
                  >
                    {g.title}
                  </div>
                  <p
                    style={{
                      fontFamily: "var(--font-text)",
                      fontSize: 14,
                      lineHeight: 1.5,
                      color: "var(--text-muted)",
                      margin: 0,
                      flex: 1,
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {g.description}
                  </p>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {g.tags.slice(0, 3).map((t) => (
                      <Tag key={t}>{t}</Tag>
                    ))}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderTop: "1px solid var(--border-subtle)",
                      paddingTop: 12,
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        fontFamily: "var(--font-text)",
                        fontSize: 13,
                        color: "var(--text-subtle)",
                      }}
                    >
                      By {g.poster.name}
                      {g.poster.verified && (
                        <Icon name="BadgeCheck" size={14} style={{ color: "var(--brand-700)" }} />
                      )}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-text)",
                        fontWeight: 700,
                        fontSize: 15,
                        color: "var(--success-600)",
                      }}
                    >
                      {rate}
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 12,
                marginTop: 28,
              }}
            >
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1 || isFetching}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                iconLeft={<Icon name="ChevronLeft" size={16} />}
              >
                Previous
              </Button>
              <span
                style={{
                  fontFamily: "var(--font-text)",
                  fontSize: 14,
                  color: "var(--text-muted)",
                  minWidth: 96,
                  textAlign: "center",
                }}
              >
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages || isFetching}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                iconRight={<Icon name="ChevronRight" size={16} />}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
