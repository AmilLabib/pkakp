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
    const { data, error } = await supabase.from("articles").insert([
      {
        title: payload.title,
        desc: payload.desc,
        image: payload.image || "",
        ...(payload.author !== undefined ? { author: payload.author } : {}),
      },
    ]);
    return { data, error };
  } catch (e) {
    return { data: null, error: e };
  }
}

export async function fetchArticles() {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false });
  return { data, error };
}

export async function updateArticle(
  id: string,
  payload: { title?: string; desc?: string; image?: string; author?: string },
) {
  try {
    const { data, error } = await supabase
      .from("articles")
      .update({
        ...(payload.title !== undefined ? { title: payload.title } : {}),
        ...(payload.desc !== undefined ? { desc: payload.desc } : {}),
        ...(payload.image !== undefined ? { image: payload.image } : {}),
        ...(payload.author !== undefined ? { author: payload.author } : {}),
      })
      .match({ id });
    return { data, error };
  } catch (e) {
    return { data: null, error: e };
  }
}

export async function deleteArticle(id: string) {
  try {
    const { data, error } = await supabase
      .from("articles")
      .delete()
      .match({ id });
    return { data, error };
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
        error: new Error(json?.error?.message || json?.error || "upload failed"),
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
  role?: string;
  photo?: string;
}) {
  try {
    const { data, error } = await supabase.from("members").insert([
      {
        name: payload.name,
        role: payload.role || "",
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
  payload: { name?: string; role?: string; photo?: string },
) {
  try {
    const { data, error } = await supabase
      .from("members")
      .update({
        ...(payload.name !== undefined ? { name: payload.name } : {}),
        ...(payload.role !== undefined ? { role: payload.role } : {}),
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
