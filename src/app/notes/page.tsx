"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import MDEditor from "@uiw/react-md-editor";
import { Plus, Save, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session, isPending: sessionPending } = authClient.useSession();

  useEffect(() => {
    if (!sessionPending && !session) {
      router.push("/auth/sign-in");
    }
  }, [session, sessionPending, router]);

  const { resolvedTheme } = useTheme();
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState<string>("");
  const colorMode = resolvedTheme === "dark" ? "dark" : "light";

  const {
    data: notes = [],
    isPending: notesPending,
    error,
  } = useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      const data = await getUserNotes();
      return data as Note[];
    },
    enabled: !!session,
  });

  const createMutation = useMutation({
    mutationFn: (title: string) => createNote(title, null),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setNewNoteTitle("");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      title,
      content,
    }: {
      id: number;
      title: string;
      content: string;
    }) => updateNote(id, title, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setEditingNoteId(null);
      setEditingContent("");
    },
  });

  function handleCreateNote(e: React.FormEvent) {
    e.preventDefault();
    if (!newNoteTitle.trim()) return;
    createMutation.mutate(newNoteTitle.trim());
  }

  function handleStartEdit(note: Note) {
    setEditingNoteId(note.id);
    setEditingContent(note.content || "");
  }

  function handleCancelEdit() {
    setEditingNoteId(null);
    setEditingContent("");
  }

  function handleSaveEdit(note: Note) {
    updateMutation.mutate({
      id: note.id,
      title: note.title,
      content: editingContent,
    });
  }

  if (sessionPending || !session || notesPending) {
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

  const queryError = error instanceof Error ? error.message : null;
  const mutationError =
    createMutation.error instanceof Error
      ? createMutation.error.message
      : deleteMutation.error instanceof Error
        ? deleteMutation.error.message
        : updateMutation.error instanceof Error
          ? updateMutation.error.message
          : null;
  const displayError = queryError || mutationError;

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-3xl font-bold">Your Notes</h1>

      {displayError && (
        <div className="mb-4 rounded-md bg-destructive/15 p-4 text-destructive">
          {displayError}
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
        <Button
          type="submit"
          disabled={createMutation.isPending || !newNoteTitle.trim()}
        >
          <Plus className="mr-2 h-4 w-4" />
          {createMutation.isPending ? "Creating..." : "Add Note"}
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
                        disabled={updateMutation.isPending}
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
                        deleteMutation.mutate(note.id);
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
