"use client";

import { useEffect, useState } from "react";
import { getUserNotes, createNote, deleteNote } from "@/lib/neon/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/client";
import { Plus, Trash2 } from "lucide-react";

interface Note {
  id: number;
  user_id: string;
  title: string;
  content: string | null;
  created_at: string;
  updated_at: string;
}

export default function DashboardPage() {
  const { data: session } = authClient.useSession();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    async function fetchNotes() {
      try {
        const data = await getUserNotes();
        setNotes(data as Note[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch notes");
      } finally {
        setLoading(false);
      }
    }

    if (session) {
      fetchNotes();
    }
  }, [session]);

  async function handleCreateNote(e: React.FormEvent) {
    e.preventDefault();
    if (!newNoteTitle.trim()) return;

    setCreating(true);
    try {
      const note = await createNote(newNoteTitle.trim(), null);
      setNotes([note as Note, ...notes]);
      setNewNoteTitle("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create note");
    } finally {
      setCreating(false);
    }
  }

  async function handleDeleteNote(id: number) {
    try {
      await deleteNote(id);
      setNotes(notes.filter((note) => note.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete note");
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="mb-8 text-3xl font-bold">Your Notes</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 w-3/4 rounded bg-muted" />
              </CardHeader>
              <CardContent>
                <div className="h-4 w-full rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-3xl font-bold">Your Notes</h1>

      {error && (
        <div className="mb-4 rounded-md bg-destructive/15 p-4 text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleCreateNote} className="mb-8 flex gap-2">
        <Input
          type="text"
          placeholder="Enter a new note title..."
          value={newNoteTitle}
          onChange={(e) => setNewNoteTitle(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={creating || !newNoteTitle.trim()}>
          <Plus className="mr-2 h-4 w-4" />
          {creating ? "Creating..." : "Add Note"}
        </Button>
      </form>

      {notes.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No notes yet. Create your first note above!
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <Card key={note.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">
                  {note.title}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteNote(note.id)}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {note.content || "No content"}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Created: {new Date(note.created_at).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
