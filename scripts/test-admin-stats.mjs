import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testStats() {
  console.log("Testing admin statistics...\n");

  // 1. Check articles table structure
  console.log("=== Articles Table ===");
  const { data: articles, error: articlesError } = await supabase
    .from("articles")
    .select("*")
    .limit(3);

  if (articlesError) {
    console.error("Error fetching articles:", articlesError);
  } else {
    console.log("Sample articles:", JSON.stringify(articles, null, 2));
  }

  // 2. Count total articles
  const { data: allArticles, error: allArticlesError } = await supabase
    .from("articles")
    .select("id", { count: "exact" });

  if (allArticlesError) {
    console.error("Error counting articles:", allArticlesError);
  } else {
    console.log(`\nTotal articles in database: ${allArticles?.length ?? 0}`);
  }

  // 3. Check for articles by author
  console.log("\n=== Articles by Author ===");
  const { data: articlesWithAuthor, error: authorError } = await supabase
    .from("articles")
    .select("id, title, author")
    .not("author", "is", null);

  if (authorError) {
    console.error("Error fetching articles with author:", authorError);
  } else {
    console.log(
      "Articles with author:",
      JSON.stringify(articlesWithAuthor, null, 2),
    );
  }

  // 4. Check article_likes
  console.log("\n=== Article Likes ===");
  const { data: likes, error: likesError } = await supabase
    .from("article_likes")
    .select("id, article_id", { count: "exact" });

  if (likesError) {
    console.error("Error fetching likes:", likesError);
  } else {
    console.log(`Total likes: ${likes?.length ?? 0}`);
  }

  // 5. Check article_comments
  console.log("\n=== Article Comments ===");
  const { data: comments, error: commentsError } = await supabase
    .from("article_comments")
    .select("id, article_id", { count: "exact" });

  if (commentsError) {
    console.error("Error fetching comments:", commentsError);
  } else {
    console.log(`Total comments: ${comments?.length ?? 0}`);
  }

  // 6. Check if we can filter by author
  console.log("\n=== Testing Author Filter ===");
  const testAuthor = "Intan";
  const { data: filteredArticles, error: filterError } = await supabase
    .from("articles")
    .select("id, title, author")
    .eq("author", testAuthor);

  if (filterError) {
    console.error(`Error filtering by author '${testAuthor}':`, filterError);
  } else {
    console.log(
      `Articles by author '${testAuthor}': ${filteredArticles?.length ?? 0}`,
    );
    if (filteredArticles?.length) {
      console.log(JSON.stringify(filteredArticles, null, 2));
    }
  }
}

testStats().catch(console.error);
