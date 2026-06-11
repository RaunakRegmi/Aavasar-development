/**
 * Recruiter → Find Talent — discover students to invite to gigs.
 *
 * Re-skinned to the app's inline-token theme (the previous version used
 * Tailwind classes, which aren't configured in this project). Mirrors the
 * student Find Work page: debounced search, skill filter chips, a card
 * grid, and Prev/Next pagination — all driven by the useTalentList hook.
 */
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Chip, Input, Skeleton, useToast } from "@shared/ui";
import { Icon } from "@shared/icons";
import { useTalentList } from "@features/recruiter/hooks/useTalent";
import { TalentCard } from "@features/recruiter/components/TalentCard";
import { talentPath } from "@shared/config/routes";

const PAGE_SIZE = 12;

export default function BrowseTalentPage() {
  const navigate = useNavigate();
  const toast = useToast();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const handle = window.setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => window.clearTimeout(handle);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, skills]);

  const filters = useMemo(
    () => ({
      page,
      pageSize: PAGE_SIZE,
      ...(debouncedSearch ? { query: debouncedSearch } : {}),
      ...(skills.length ? { skills } : {}),
    }),
    [page, debouncedSearch, skills],
  );

  const { data, isLoading, isFetching, isError, refetch } = useTalentList(filters);
  const talents = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // Skill chips: keep selected ones always visible, plus skills surfaced
  // in the current result set — so chips always reflect real data.
  const skillChips = useMemo(() => {
    const set = new Set<string>(skills);
    for (const t of talents) for (const s of t.skills) set.add(s);
    return Array.from(set).slice(0, 14);
  }, [talents, skills]);

  const toggleSkill = (s: string) =>
    setSkills((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

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
          Find Talent
        </h1>
        <p style={{ fontFamily: "var(--font-text)", fontSize: 16, color: "var(--text-muted)", margin: "4px 0 0" }}>
          Discover students and fresh graduates for your gigs.{" "}
          {total > 0 && (
            <span style={{ color: "var(--text-strong)", fontWeight: 600 }}>{total} available.</span>
          )}
        </p>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search by name, headline, or bio…"
          leading={<Icon name="Search" size={18} />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Skill filter chips */}
      {skillChips.length > 0 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
          {skillChips.map((s) => (
            <Chip key={s} label={s} on={skills.includes(s)} onClick={() => toggleSkill(s)} />
          ))}
          {skills.length > 0 && (
            <button
              type="button"
              onClick={() => setSkills([])}
              style={{
                all: "unset",
                cursor: "pointer",
                alignSelf: "center",
                fontFamily: "var(--font-text)",
                fontSize: 13,
                fontWeight: 600,
                color: "var(--text-subtle)",
              }}
            >
              Clear
            </button>
          )}
        </div>
      )}

      {/* Grid */}
      {isError ? (
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Icon name="AlertCircle" size={20} style={{ color: "var(--danger-500)" }} />
            <div style={{ flex: 1, fontFamily: "var(--font-text)", fontWeight: 600, color: "var(--text-strong)" }}>
              Couldn&apos;t load talent
            </div>
            <Button variant="outline" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        </Card>
      ) : isLoading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <div style={{ display: "flex", gap: 14 }}>
                <Skeleton width={48} height={48} radius={9999} />
                <div style={{ flex: 1 }}>
                  <Skeleton width="70%" height={16} />
                  <div style={{ height: 8 }} />
                  <Skeleton width="50%" height={12} />
                </div>
              </div>
              <div style={{ height: 16 }} />
              <Skeleton width="100%" height={12} />
            </Card>
          ))}
        </div>
      ) : talents.length === 0 ? (
        <Card>
          <div style={{ textAlign: "center", padding: "40px 16px" }}>
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
              <Icon name="UserSearch" size={22} />
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
              No talent found
            </div>
            <div style={{ fontFamily: "var(--font-text)", fontSize: 14, color: "var(--text-muted)" }}>
              Try a broader search or clear your skill filters.
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
            {talents.map((t) => (
              <TalentCard
                key={t.id}
                talent={t}
                onViewProfile={(id) => navigate(talentPath(id))}
                onMessage={() =>
                  toast.info("Messaging is coming soon", {
                    description: "Direct messaging with students will be available shortly.",
                  })
                }
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, marginTop: 28 }}>
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
