import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const storageBucket =
  process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "public";

// Simple helpers
export async function insertArticle(payload: {
  title: string;
  desc: string;
  image?: string;
  author?: string;
}) {
  try {
    const res = await fetch("/api/admin/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok)
      return {
        data: null,
        error: json?.error || new Error("Failed to create article"),
      };
    return { data: json.data, error: json.error ?? null };
  } catch (e) {
    return { data: null, error: e };
  }
}

export async function fetchArticles(options?: { onlyOwnedBy?: string | null }) {
  try {
    // If filtering by owner, use the API endpoint instead (handles staff auth)
    if (options?.onlyOwnedBy) {
      try {
        const res = await fetch("/api/admin/articles", {
          method: "GET",
          credentials: "include",
        });
        const json = await res.json();
        if (!res.ok)
          return {
            data: null,
            error: json?.error || new Error("Failed to fetch articles"),
          };
        // API returns { ok: true, data: [...], error: null }
        const data = json?.data ?? [];
        return { data, error: json?.error ?? null };
      } catch (e) {
        return { data: null, error: e };
      }
    }

    let query = supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false });

    const { data, error } = await query;
    return { data, error };
  } catch (e) {
    return { data: null, error: e };
  }
}

// Fetch articles via server-admin endpoint (will include auth cookie)
export async function fetchAdminArticles() {
  try {
    const res = await fetch("/api/admin/articles", {
      method: "GET",
      credentials: "include",
    });
    const json = await res.json();
    if (!res.ok)
      return {
        data: null,
        error: json?.error || new Error("Failed to fetch admin articles"),
      };
    return { data: json?.data ?? json, error: json?.error ?? null };
  } catch (e) {
    return { data: null, error: e };
  }
}

export async function updateArticle(
  id: string,
  payload: { title?: string; desc?: string; image?: string; author?: string },
) {
  try {
    const res = await fetch(
      `/api/admin/articles/${encodeURIComponent(String(id))}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      },
    );
    const json = await res.json();
    if (!res.ok)
      return {
        data: null,
        error: json?.error || new Error("Failed to update article"),
      };
    return { data: json.data, error: json.error ?? null };
  } catch (e) {
    return { data: null, error: e };
  }
}

export async function deleteArticle(id: string) {
  try {
    const res = await fetch(
      `/api/admin/articles/${encodeURIComponent(String(id))}`,
      {
        method: "DELETE",
        credentials: "include",
      },
    );
    const json = await res.json();
    if (!res.ok)
      return {
        data: null,
        error: json?.error || new Error("Failed to delete article"),
      };
    return { data: json.data, error: json.error ?? null };
  } catch (e) {
    return { data: null, error: e };
  }
}

export async function insertPrestasi(payload: {
  title: string;
  year: string;
  image?: string;
}) {
  try {
    const { data, error } = await supabase.from("prestasi").insert([
      {
        title: payload.title,
        year: payload.year,
        image: payload.image || "",
      },
    ]);
    return { data, error };
  } catch (e) {
    return { data: null, error: e };
  }
}

export async function fetchPrestasi() {
  const { data, error } = await supabase
    .from("prestasi")
    .select("*")
    .order("created_at", { ascending: false });
  return { data, error };
}

export async function deletePrestasi(id: string) {
  try {
    const { data, error } = await supabase
      .from("prestasi")
      .delete()
      .match({ id });
    return { data, error };
  } catch (e) {
    return { data: null, error: e };
  }
}

export async function updatePrestasi(
  id: string,
  payload: { title?: string; year?: string; image?: string },
) {
  try {
    const { data, error } = await supabase
      .from("prestasi")
      .update({
        ...(payload.title !== undefined ? { title: payload.title } : {}),
        ...(payload.year !== undefined ? { year: payload.year } : {}),
        ...(payload.image !== undefined ? { image: payload.image } : {}),
      })
      .match({ id });
    return { data, error };
  } catch (e) {
    return { data: null, error: e };
  }
}

// === Galeri helpers ===
export async function insertGaleri(payload: {
  title: string;
  desc?: string;
  image?: string;
}) {
  try {
    const { data, error } = await supabase.from("galeri").insert([
      {
        title: payload.title,
        desc: payload.desc || "",
        image: payload.image || "",
      },
    ]);
    return { data, error };
  } catch (e) {
    return { data: null, error: e };
  }
}

export async function fetchGaleri() {
  const { data, error } = await supabase
    .from("galeri")
    .select("*")
    .order("created_at", { ascending: false });
  return { data, error };
}

export async function deleteGaleri(id: string) {
  try {
    const { data, error } = await supabase
      .from("galeri")
      .delete()
      .match({ id });
    return { data, error };
  } catch (e) {
    return { data: null, error: e };
  }
}

export async function updateGaleri(
  id: string,
  payload: { title?: string; desc?: string; image?: string },
) {
  try {
    const { data, error } = await supabase
      .from("galeri")
      .update({
        ...(payload.title !== undefined ? { title: payload.title } : {}),
        ...(payload.desc !== undefined ? { desc: payload.desc } : {}),
        ...(payload.image !== undefined ? { image: payload.image } : {}),
      })
      .match({ id });
    return { data, error };
  } catch (e) {
    return { data: null, error: e };
  }
}

export async function uploadGaleriImage(file: File) {
  const filename = `galeri/${Date.now()}-${file.name}`;
  try {
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => resolve(String(fr.result));
      fr.onerror = (err) => reject(err);
      fr.readAsDataURL(file);
    });

    const res = await fetch("/api/upload-member-photo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename, dataUrl }),
    });
    const json = await res.json();
    if (!res.ok)
      return {
        data: null,
        error: new Error(
          json?.error?.message || json?.error || "upload failed",
        ),
      };
    return {
      data: { publicUrl: json?.data?.publicUrl ?? json?.publicUrl ?? "" },
      error: null,
    };
  } catch (e) {
    return { data: null, error: e };
  }
}

export async function insertMember(payload: {
  name: string;
  role?: string; // legacy display title
  role_group?: string; // 'board_of_director' | 'head_of_division' | 'staff'
  staff_category?: string; // for staff: 'accounting_olympiad' | 'research_and_writing' | 'organization_and_project' | 'media_and_visual'
  photo?: string;
}) {
  try {
    const { data, error } = await supabase.from("members").insert([
      {
        name: payload.name,
        role: payload.role || "",
        ...(payload.role_group !== undefined
          ? { role_group: payload.role_group }
          : {}),
        ...(payload.staff_category !== undefined
          ? { staff_category: payload.staff_category }
          : {}),
        photo: payload.photo || "",
      },
    ]);
    return { data, error };
  } catch (e) {
    return { data: null, error: e };
  }
}

export async function fetchMembers() {
  try {
    // Try ordering by `position` if the column exists; otherwise fall back to created_at.
    let data = null;
    let error = null;

    try {
      const res = await supabase
        .from("members")
        .select("*")
        .order("position", { ascending: true });
      data = res.data;
      error = res.error;
      if (error && /column|undefined/i.test(String(error.message || ""))) {
        const res2 = await supabase
          .from("members")
          .select("*")
          .order("created_at", { ascending: false });
        data = res2.data;
        error = res2.error;
      }
    } catch (err: any) {
      const res2 = await supabase
        .from("members")
        .select("*")
        .order("created_at", { ascending: false });
      data = res2.data;
      error = res2.error;
    }

    return { data, error };
  } catch (e) {
    return { data: null, error: e };
  }
}

export async function deleteMember(id: string) {
  try {
    const { data, error } = await supabase
      .from("members")
      .delete()
      .match({ id });
    return { data, error };
  } catch (e) {
    return { data: null, error: e };
  }
}

export async function updateMember(
  id: string,
  payload: {
    name?: string;
    role?: string;
    role_group?: string | null;
    staff_category?: string | null;
    photo?: string;
  },
) {
  try {
    const { data, error } = await supabase
      .from("members")
      .update({
        ...(payload.name !== undefined ? { name: payload.name } : {}),
        ...(payload.role !== undefined ? { role: payload.role } : {}),
        ...(payload.role_group !== undefined
          ? { role_group: payload.role_group }
          : {}),
        ...(payload.staff_category !== undefined
          ? { staff_category: payload.staff_category }
          : {}),
        ...(payload.photo !== undefined ? { photo: payload.photo } : {}),
      })
      .match({ id });
    return { data, error };
  } catch (e) {
    return { data: null, error: e };
  }
}

// Storage helpers
export async function uploadFileToStorage(
  bucket: string,
  path: string,
  file: File,
) {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: true });
    if (error) {
      // Common cause: bucket not found
      const errAny = error as any;
      const msg =
        (errAny && (errAny.message || errAny.error_description)) ||
        String(error);
      if (/bucket not found|Bucket not found|not found/i.test(msg)) {
        return {
          data: null,
          error: new Error(
            `Storage bucket "${bucket}" not found. Create the bucket in Supabase Storage or change the upload target. Original: ${msg}`,
          ),
        };
      }
      return { data: null, error };
    }
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
    return { data: urlData, error: null };
  } catch (e) {
    return { data: null, error: e };
  }
}

export async function uploadPrestasiImage(file: File) {
  const filename = `prestasi/${Date.now()}-${file.name}`;
  // Use the server upload route (service role) to ensure bucket write access
  try {
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => resolve(String(fr.result));
      fr.onerror = (err) => reject(err);
      fr.readAsDataURL(file);
    });

    const res = await fetch("/api/upload-member-photo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename, dataUrl }),
    });
    const json = await res.json();
    if (!res.ok)
      return {
        data: null,
        error: new Error(
          json?.error?.message || json?.error || "upload failed",
        ),
      };
    return {
      data: { publicUrl: json?.data?.publicUrl ?? json?.publicUrl ?? "" },
      error: null,
    };
  } catch (e) {
    return { data: null, error: e };
  }
}

export async function uploadMemberPhoto(file: File) {
  const filename = `members/${Date.now()}-${file.name}`;
  // In client context we cannot use service role; route on server will handle actual upload.
  // Convert file to data URL in caller if needed; to keep compatibility, attempt to POST here.
  try {
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => resolve(String(fr.result));
      fr.onerror = (err) => reject(err);
      fr.readAsDataURL(file);
    });

    const res = await fetch("/api/upload-member-photo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename, dataUrl }),
    });
    const json = await res.json();
    if (!res.ok)
      return {
        data: null,
        error: new Error(
          json?.error?.message || json?.error || "upload failed",
        ),
      };
    return {
      data: { publicUrl: json?.data?.publicUrl ?? json?.publicUrl ?? "" },
      error: null,
    };
  } catch (e) {
    return { data: null, error: e };
  }
}

// Fetch articles by author name (public, no auth required)
export async function fetchArticlesByAuthor(authorName: string) {
  try {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .ilike("author", authorName)
      .order("created_at", { ascending: false });
    return { data, error };
  } catch (e) {
    return { data: null, error: e };
  }
}

// === Article likes & comments helpers ===
export async function fetchArticleLikeCount(articleId: string) {
  try {
    const { data, error, count } = await supabase
      .from("article_likes")
      .select("id", { count: "exact" })
      .eq("article_id", articleId);
    return { count: count ?? 0, data, error };
  } catch (e) {
    return { count: 0, data: null, error: e };
  }
}

export async function fetchArticleCommentCount(articleId: string) {
  try {
    const { data, error, count } = await supabase
      .from("article_comments")
      .select("id", { count: "exact" })
      .eq("article_id", articleId);
    return { count: count ?? 0, data, error };
  } catch (e) {
    return { count: 0, data: null, error: e };
  }
}

export async function fetchCommentsByArticle(articleId: string) {
  try {
    const { data, error } = await supabase
      .from("article_comments")
      .select("*")
      .eq("article_id", articleId)
      .order("created_at", { ascending: false });
    return { data, error };
  } catch (e) {
    return { data: null, error: e };
  }
}

export async function addArticleComment(payload: {
  article_id: string;
  user_name?: string;
  user_email?: string;
  content: string;
}) {
  try {
    const { data, error } = await supabase.from("article_comments").insert([
      {
        article_id: payload.article_id,
        user_name: payload.user_name || null,
        user_email: payload.user_email || null,
        content: payload.content,
      },
    ]);
    return { data, error };
  } catch (e) {
    return { data: null, error: e };
  }
}

export async function toggleArticleLike(payload: {
  article_id: string;
  user_name?: string;
  user_email?: string;
}) {
  try {
    // check existing
    const { data: existing } = await supabase
      .from("article_likes")
      .select("*")
      .match({
        article_id: payload.article_id,
        user_email: payload.user_email,
      });

    if (Array.isArray(existing) && existing.length > 0) {
      // remove like
      const { error } = await supabase
        .from("article_likes")
        .delete()
        .match({ id: existing[0].id });
      const { count } = await fetchArticleLikeCount(payload.article_id);
      return { action: "removed", error, count };
    }

    const { data, error } = await supabase.from("article_likes").insert([
      {
        article_id: payload.article_id,
        user_name: payload.user_name || null,
        user_email: payload.user_email || null,
      },
    ]);

    const { count } = await fetchArticleLikeCount(payload.article_id);
    return { action: "added", data, error, count };
  } catch (e) {
    return { action: "error", error: e };
  }
}

export async function fetchLikesByUser(user_email?: string) {
  try {
    if (!user_email) return { data: null, error: null };
    const { data, error } = await supabase
      .from("article_likes")
      .select("*")
      .eq("user_email", user_email)
      .order("created_at", { ascending: false });
    return { data, error };
  } catch (e) {
    return { data: null, error: e };
  }
}

export async function fetchLikesByUserName(user_name?: string) {
  try {
    if (!user_name) return { data: null, error: null };
    const { data, error } = await supabase
      .from("article_likes")
      .select("*")
      .eq("user_name", user_name)
      .order("created_at", { ascending: false });
    return { data, error };
  } catch (e) {
    return { data: null, error: e };
  }
}

/**
 * Check if a user (by email) has already liked a specific article.
 */
export async function hasUserLikedArticle(articleId: string, userEmail: string): Promise<boolean> {
  try {
    const { data } = await supabase
      .from("article_likes")
      .select("id")
      .eq("article_id", articleId)
      .eq("user_email", userEmail);
    return Array.isArray(data) && data.length > 0;
  } catch {
    return false;
  }
}

export async function fetchCommentsByUserName(user_name?: string) {
  try {
    if (!user_name) return { data: null, error: null };
    const { data, error } = await supabase
      .from("article_comments")
      .select("*")
      .eq("user_name", user_name)
      .order("created_at", { ascending: false });
    return { data, error };
  } catch (e) {
    return { data: null, error: e };
  }
}
