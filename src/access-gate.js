/* Free-tools email gate: unlock only after HubSpot confirms a successful submission. */
(function () {
  const paths = new Set(["/analyzer","/chat","/contract","/event-brief","/prompts","/tools","/directory","/workflow","/workflows","/analyzer.dc.html","/chat.dc.html","/contract.dc.html","/eventbrief.dc.html","/prompts.dc.html","/tools.dc.html","/workflow.dc.html"]);
  const path = location.pathname.toLowerCase().replace(/\/index\.html$/, "").replace(/\/$/, "");
  let unlocked = false;
  try { unlocked = localStorage.getItem("afdj-tools-access") === "1"; } catch (_) {}
  if (!unlocked) unlocked = document.cookie.split("; ").includes("afdj_tools_access=1");
  if (paths.has(path) && !unlocked) location.replace("/free-tools.html?next=" + encodeURIComponent(location.pathname + location.search + location.hash));
})();
