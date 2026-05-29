import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Simple helpers
export async function insertArticle(payload: {
  title: string;
  desc: string;
  image?: string;
}) {
  try {
    const { data, error } = await supabase.from("articles").insert([
      {
        title: payload.title,
        desc: payload.desc,
        image: payload.image || "",
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
  payload: { title?: string; desc?: string; image?: string },
) {
  try {
    const { data, error } = await supabase
      .from("articles")
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
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .order("created_at", { ascending: false });
  return { data, error };
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
    if (error) return { data: null, error };
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
    return { data: urlData, error: null };
  } catch (e) {
    return { data: null, error: e };
  }
}

export async function uploadPrestasiImage(file: File) {
  const filename = `prestasi/${Date.now()}-${file.name}`;
  return uploadFileToStorage("public", filename, file);
}

export async function uploadMemberPhoto(file: File) {
  const filename = `members/${Date.now()}-${file.name}`;
  return uploadFileToStorage("public", filename, file);
}
