"use client";

import { useCallback, useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { adminDelete, adminList } from "@/app/admin/actions";

interface Message {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const { data, error } = await adminList("aivexa_messages", "created_at", false);
    if (error) setError(error);
    else setMessages(data as unknown as Message[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function remove(id: number) {
    if (!window.confirm("Delete this message?")) return;
    const { error } = await adminDelete("aivexa_messages", "id", id);
    if (error) setError(error);
    else setMessages((prev) => prev.filter((m) => m.id !== id));
  }

  return (
    <>
      <h1 className="admin-title">Messages</h1>
      {error && <div className="form-alert err">{error}</div>}
      {loading ? (
        <p className="admin-muted">Loading…</p>
      ) : messages.length === 0 ? (
        <p className="admin-muted">No messages yet — contact form submissions will appear here.</p>
      ) : (
        messages.map((m) => (
          <div className="message-card" key={m.id}>
            <div className="message-head">
              <b>{m.name}</b>
              <span>
                {new Date(m.created_at).toLocaleString("en-IN")}
                <button className="btn-danger sm" style={{ marginLeft: 12 }} onClick={() => remove(m.id)}>
                  <Trash2 size={13} strokeWidth={2.2} /> Delete
                </button>
              </span>
            </div>
            <div className="message-meta">
              <a href={`mailto:${m.email}`}>{m.email}</a>
              {m.phone && <span> · {m.phone}</span>}
            </div>
            <p>{m.message}</p>
          </div>
        ))
      )}
    </>
  );
}
