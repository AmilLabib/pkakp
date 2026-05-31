(async () => {
  // Try common dev ports that Next may be running on
  const urls = [
    "http://localhost:3001/api/upload-member-photo",
    "http://localhost:3000/api/upload-member-photo",
  ];

  const payload = {
    filename: "members/test-1x1.png",
    dataUrl:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII=",
  };

  for (const url of urls) {
    try {
      console.log(`Attempting POST to ${url} ...`);
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        redirect: "follow",
      });
      const text = await res.text();
      console.log(`Response from ${url}: status=${res.status}`);
      try {
        console.log(JSON.stringify(JSON.parse(text), null, 2));
      } catch (e) {
        console.log(text);
      }
      process.exit(0);
    } catch (err) {
      // try next
      // console.error(`Failed to POST to ${url}:`, String(err));
    }
  }

  console.error(
    "Could not connect to any local upload endpoint (tried ports 3001 and 3000)",
  );
  process.exit(2);
})();
