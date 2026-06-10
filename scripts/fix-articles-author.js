/**
 * Script untuk memperbaiki artikel yang tidak memiliki author field
 * Jalankan di browser console atau sebagai Node.js script
 */

async function fixArticlesWithoutAuthor() {
  console.log("Fetching all articles without author...");

  // Get semua artikel yang tidak memiliki author
  const res = await fetch("/api/admin/articles", {
    method: "GET",
    credentials: "include",
  });

  const json = await res.json();
  const allArticles = json?.data ?? json?.ok ? json?.data : [];

  console.log(`Total articles: ${allArticles.length}`);

  // Filter artikel tanpa author
  const articlesWithoutAuthor = allArticles.filter(
    (art: any) => !art.author || art.author.trim() === ""
  );

  console.log(
    `Articles without author: ${articlesWithoutAuthor.length}`,
    articlesWithoutAuthor.map((a: any) => ({ id: a.id, title: a.title }))
  );

  if (articlesWithoutAuthor.length === 0) {
    console.log("✓ Semua artikel sudah memiliki author field!");
    return;
  }

  console.warn(
    "⚠ Ada artikel tanpa author field. Mari kita lihat data di database."
  );
  console.log(
    "Hubungi admin untuk menjalankan script fix di server atau database editor."
  );
}

// Jalankan
fixArticlesWithoutAuthor().catch(console.error);

/**
 * UNTUK ADMIN: SQL SCRIPT untuk memperbaiki di Supabase
 *
 * Jika staff name adalah "Intan", jalankan:
 * UPDATE articles
 * SET author = 'Intan'
 * WHERE author IS NULL OR author = '';
 *
 * Atau untuk staff tertentu, gunakan:
 * UPDATE articles
 * SET author = 'nama_staff'
 * WHERE id IN ('article_id_1', 'article_id_2', ...);
 *
 * ATAU, untuk bulk fix (UPDATE berdasarkan CREATED TIME):
 * UPDATE articles
 * SET author = 'staff_name'
 * WHERE author IS NULL
 *   AND created_at BETWEEN '2024-01-01' AND '2024-12-31';
 */
