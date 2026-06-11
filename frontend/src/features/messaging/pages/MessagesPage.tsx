/**
 * Messages — shared inbox + thread for both students and recruiters.
 * Rendered at /student/messages(/:conversationId) and the recruiter
 * equivalents. Live updates arrive via the MessagingProvider's WS client.
 */
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Avatar, Badge, IconButton, Input, Skeleton } from "@shared/ui";
import { Icon } from "@shared/icons";
import { useCurrentUser } from "@features/auth";
import {
  recruiterConversationPath,
  studentConversationPath,
} from "@shared/config/routes";
import { formatShort } from "@shared/lib/utils";
import { useConversations, useMessages, useSendMessage, useMarkRead } from "../hooks/useMessaging";
import type { Conversation } from "../contracts/message.contract";

export default function MessagesPage() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const user = useCurrentUser();
  const isRecruiter = user?.role === "recruiter";
  const convPath = (id: string) =>
    isRecruiter ? recruiterConversationPath(id) : studentConversationPath(id);

  const conversations = useConversations();
  const list = conversations.data ?? [];

  // Selected = route param, else first conversation.
  const selectedId = conversationId ?? list[0]?.id;
  const selected = useMemo(
    () => list.find((c) => c.id === selectedId),
    [list, selectedId],
  );

  return (
    <div style={{ display: "flex", height: "calc(100vh - var(--nav-height, 0px))", minHeight: 480 }}>
      {/* Inbox */}
      <aside
        style={{
          width: 320,
          flexShrink: 0,
          borderRight: "1px solid var(--border-default)",
          overflowY: "auto",
          background: "var(--surface-0)",
        }}
      >
        <div style={{ padding: "20px 20px 12px" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--text-strong)", margin: 0 }}>
            Messages
          </h1>
        </div>
        {conversations.isLoading ? (
          <div style={{ padding: "0 16px", display: "grid", gap: 10 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} style={{ display: "flex", gap: 12, padding: "8px 0" }}>
                <Skeleton width={40} height={40} radius={9999} />
                <div style={{ flex: 1 }}>
                  <Skeleton width="60%" height={12} />
                  <div style={{ height: 6 }} />
                  <Skeleton width="80%" height={10} />
                </div>
              </div>
            ))}
          </div>
        ) : list.length === 0 ? (
          <div style={{ padding: "24px 20px", fontFamily: "var(--font-text)", fontSize: 14, color: "var(--text-muted)" }}>
            {isRecruiter
              ? "No conversations yet. Start one from Find Talent or an applicant."
              : "No messages yet. Recruiters who are interested will reach out here."}
          </div>
        ) : (
          <div>
            {list.map((c) => (
              <InboxRow
                key={c.id}
                conv={c}
                active={c.id === selectedId}
                onClick={() => navigate(convPath(c.id))}
              />
            ))}
          </div>
        )}
      </aside>

      {/* Thread */}
      <main style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", background: "var(--surface-page)" }}>
        {selected ? (
          <Thread key={selected.id} conv={selected} meId={user?.id ?? ""} />
        ) : (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ textAlign: "center", color: "var(--text-muted)", fontFamily: "var(--font-text)" }}>
              <Icon name="MessageSquare" size={32} />
              <div style={{ marginTop: 10, fontSize: 14 }}>Select a conversation</div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function InboxRow({ conv, active, onClick }: { conv: Conversation; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        all: "unset",
        cursor: "pointer",
        display: "flex",
        gap: 12,
        alignItems: "center",
        padding: "12px 18px",
        width: "100%",
        boxSizing: "border-box",
        background: active ? "var(--surface-1)" : "transparent",
        borderLeft: active ? "3px solid var(--brand-700)" : "3px solid transparent",
      }}
    >
      <Avatar src={conv.otherParticipant.avatarUrl ?? undefined} name={conv.otherParticipant.fullName} size={40} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              flex: 1,
              fontFamily: "var(--font-text)",
              fontWeight: 600,
              fontSize: 14,
              color: "var(--text-strong)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {conv.otherParticipant.fullName}
          </span>
          {conv.unreadCount > 0 && <Badge tone="info">{conv.unreadCount}</Badge>}
        </div>
        <div
          style={{
            fontFamily: "var(--font-text)",
            fontSize: 12.5,
            color: "var(--text-muted)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {conv.lastMessage?.body ?? "No messages yet"}
        </div>
      </div>
    </button>
  );
}

function Thread({ conv, meId }: { conv: Conversation; meId: string }) {
  const messages = useMessages(conv.id);
  const send = useSendMessage(conv.id);
  const markRead = useMarkRead();
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const items = messages.data ?? [];

  // Mark read on open + whenever new messages land.
  useEffect(() => {
    if (conv.unreadCount > 0) markRead.mutate(conv.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conv.id, items.length]);

  // Auto-scroll to newest.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [items.length]);

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    const body = draft.trim();
    if (!body || send.isPending) return;
    setDraft("");
    send.mutate(body);
  };

  return (
    <>
      {/* Thread header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "16px 24px",
          borderBottom: "1px solid var(--border-default)",
          background: "var(--surface-0)",
        }}
      >
        <Avatar src={conv.otherParticipant.avatarUrl ?? undefined} name={conv.otherParticipant.fullName} size={40} />
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--text-strong)" }}>
          {conv.otherParticipant.fullName}
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
        {messages.isLoading ? (
          <div style={{ display: "grid", gap: 12 }}>
            <Skeleton width="50%" height={36} />
            <Skeleton width="40%" height={36} />
          </div>
        ) : items.length === 0 ? (
          <div style={{ textAlign: "center", color: "var(--text-muted)", fontFamily: "var(--font-text)", fontSize: 14, marginTop: 40 }}>
            Say hello 👋
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {items.map((m) => {
              const mine = m.senderId === meId;
              return (
                <div key={m.id} style={{ display: "flex", justifyContent: mine ? "flex-end" : "flex-start" }}>
                  <div
                    style={{
                      maxWidth: "70%",
                      padding: "9px 13px",
                      borderRadius: 14,
                      background: mine ? "var(--brand-700)" : "var(--surface-0)",
                      color: mine ? "#fff" : "var(--text-strong)",
                      border: mine ? "none" : "1px solid var(--border-default)",
                      fontFamily: "var(--font-text)",
                      fontSize: 14,
                      lineHeight: 1.45,
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                  >
                    {m.body}
                    <div
                      style={{
                        fontSize: 10.5,
                        marginTop: 4,
                        textAlign: "right",
                        color: mine ? "rgba(255,255,255,0.7)" : "var(--text-subtle)",
                      }}
                    >
                      {formatShort(m.createdAt)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Composer */}
      <form
        onSubmit={submit}
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
          padding: "14px 24px",
          borderTop: "1px solid var(--border-default)",
          background: "var(--surface-0)",
        }}
      >
        <Input
          placeholder="Write a message…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          containerStyle={{ flex: 1 }}
        />
        <IconButton
          ariaLabel="Send message"
          variant="bordered"
          onClick={() => submit()}
          disabled={!draft.trim() || send.isPending}
        >
          <Icon name="SendHorizontal" size={18} />
        </IconButton>
      </form>
    </>
  );
}
