"use client";

import MDEditor from "@uiw/react-md-editor";
import { Plus, Save, Trash2, X } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/client";
import {
  createNote,
  deleteNote,
  getUserNotes,
  updateNote,
} from "@/lib/neon/queries";

interface Note {
  id: number;
  user_id: string;
  title: string;
  content: string | null;
  created_at: string;
  updated_at: string;
}

export default function NotesPage() {
  const { data: session } = authClient.useSession();
  const { resolvedTheme } = useTheme();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [creating, setCreating] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const colorMode = resolvedTheme === "dark" ? "dark" : "light";

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

  function handleStartEdit(note: Note) {
    setEditingNoteId(note.id);
    setEditingContent(note.content || "");
  }

  function handleCancelEdit() {
    setEditingNoteId(null);
    setEditingContent("");
  }

  async function handleSaveEdit(note: Note) {
    setSaving(true);
    try {
      await updateNote(note.id, note.title, editingContent);
      setNotes(
        notes.map((n) =>
          n.id === note.id ? { ...n, content: editingContent } : n,
        ),
      );
      setEditingNoteId(null);
      setEditingContent("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save note");
    } finally {
      setSaving(false);
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
            <Card
              key={note.id}
              className={
                editingNoteId === note.id
                  ? "col-span-full"
                  : "cursor-pointer hover:bg-muted/50 transition-colors"
              }
              onClick={() => editingNoteId !== note.id && handleStartEdit(note)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">
                  {note.title}
                </CardTitle>
                <div className="flex gap-1">
                  {editingNoteId === note.id ? (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSaveEdit(note);
                        }}
                        disabled={saving}
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCancelEdit();
                        }}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNote(note.id);
                      }}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent
                onClick={(e) =>
                  editingNoteId === note.id && e.stopPropagation()
                }
              >
                {editingNoteId === note.id ? (
                  <div data-color-mode={colorMode}>
                    <MDEditor
                      value={editingContent}
                      onChange={(val) => setEditingContent(val || "")}
                      height={300}
                      preview="live"
                    />
                  </div>
                ) : (
                  <>
                    <div
                      data-color-mode={colorMode}
                      className="prose prose-sm dark:prose-invert max-w-none"
                    >
                      {note.content ? (
                        <MDEditor.Markdown source={note.content} />
                      ) : (
                        <p className="text-muted-foreground italic">
                          Click to add content...
                        </p>
                      )}
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Created: {new Date(note.created_at).toLocaleDateString()}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
