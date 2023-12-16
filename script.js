function getAllUtmLinksOnPage()
{
  let links = document.querySelectorAll("a");
  let allUtmLinks = Array.from(links)
    .map((link) => link.href)
    .filter((href) => href && href.toLowerCase().includes("utm"));

  let iframes = document.querySelectorAll("iframe");
  let iframeUtms = [];

  for (let iframe of iframes)
  {
    try
    {
      let utmInput = iframe.contentWindow.document.getElementById("utm_data");
      if (
        utmInput &&
        utmInput.value &&
        utmInput.value.toLowerCase().includes("utm")
      )
      {
        iframeUtms.push(utmInput.value);
      }
    } catch (error)
    {
      console.warn("Cannot access iframe contents:", error);
    }

    const src = iframe.getAttribute("src");
    if (src)
    {
      const utmParams = src.match(/utm_[^&]+/g);
      if (utmParams && utmParams.length)
      {
        iframeUtms.push(utmParams.join("&"));
      }
    }
  }

  return [...allUtmLinks, ...iframeUtms];
}

function displayUtmLinks()
{
  let utmLinks = getAllUtmLinksOnPage();

  if (utmLinks.length > 0)
  {
    let newWindow = window.open("", "_blank");
    let pageTitle = document.querySelector("h1")
      ? document.querySelector("h1").textContent
      : "Page";
    newWindow.document.write(`<h1>UTMs in "${pageTitle}":</h1>`);
    newWindow.document.write("<ul>");
    utmLinks.forEach((link) =>
    {
      newWindow.document.write(
        `<li><a href="${link}" target="_blank">${link}</a></li>`
      );
    });
    newWindow.document.write("</ul>");
  } else
  {
    console.log("No UTM links found.");
  }
}

displayUtmLinks();