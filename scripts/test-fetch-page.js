(async () => {
  const urls = [
    "http://localhost:3000/struktur-organisasi",
    "http://localhost:3001/struktur-organisasi",
  ];
  for (const url of urls) {
    try {
      console.log("Trying", url);
      const res = await fetch(url);
      const text = await res.text();
      console.log("status", res.status);
      console.log(text.slice(0, 800));
      process.exit(0);
    } catch (e) {
      // ignore
    }
  }
  console.error("no dev server responded");
  process.exit(2);
})();
