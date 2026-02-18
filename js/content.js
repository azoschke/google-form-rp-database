const sheetURL = "https://docs.google.com/spreadsheets/d/1lCdnYH1rMBAG9mh_9ncNZeFwMvJJebRk8K7f1BRHhxQ/export?format=csv&gid=0";

const sidebar = document.getElementById("sidebar");
const content = document.getElementById("content");

fetch(sheetURL)
  .then(response => response.text())
  .then(csv => {
    const parsed = Papa.parse(csv, {
      header: true,
      skipEmptyLines: true
    });

    const data = parsed.data;

    data.forEach(item => {
      const li = document.createElement("li");
      const link = document.createElement("a");

      link.href = "#";
      link.textContent = item.Name;

      link.addEventListener("click", (e) => {
        e.preventDefault();

        // If using Markdown formatting
        content.innerHTML = marked.parse(item.Content);

        // If you want plain text only, use:
        // content.textContent = item.Content;
      });

      li.appendChild(link);
      sidebar.appendChild(li);
    });
  })
  .catch(error => {
    console.error("Error loading sheet:", error);
  });
