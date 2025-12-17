"use client";

import { neonClient } from "./client";

// Query notes - JWT token is automatically injected for authenticated users
// RLS policies ensure users can only access their own notes
export async function getUserNotes() {
  const { data, error } = await neonClient
    .from("notes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// Create a note - userId is automatically set via auth.user_id() default
export async function createNote(title: string, content: string | null) {
  const { data, error } = await neonClient
    .from("notes")
    .insert({ title, content })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// Update a note - RLS ensures users can only update their own notes
export async function updateNote(
  id: number,
  title: string,
  content: string | null
) {
  const { data, error } = await neonClient
    .from("notes")
    .update({ title, content, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// Delete a note - RLS ensures users can only delete their own notes
export async function deleteNote(id: number) {
  const { error } = await neonClient.from("notes").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}
