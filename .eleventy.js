module.exports = function (eleventyConfig) {
  // Copy assets and admin files
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy("src/_redirects");
  eleventyConfig.addPassthroughCopy("src/admin");

  // Latest added posts collection
  eleventyConfig.addCollection("latestAddedPosts", (collectionApi) => {
    return collectionApi
      .getAll()
      .filter(
        (item) =>
          item.inputPath.startsWith("./src/posts/") &&
          item.data.layout === "post.njk"
      )
      .sort((a, b) => new Date(b.data.date) - new Date(a.data.date)) // sort by date desc
      .slice(0, 5); // latest 5
  });

  // Date filter with default and fallback formatting
  eleventyConfig.addFilter("date", (dateObj, format = "yyyy-MM-dd") => {
    if (!dateObj) return ""; // No date provided
    const date = new Date(dateObj);
    if (isNaN(date.getTime())) return ""; // Invalid date

    // Handle different date formats
    if (format === "yyyy-MM-dd") {
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    }

    if (format === "MMM d") {
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
      }).format(date);
    }

    if (format === "MMMM d, yyyy") {
      return new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }).format(date);
    }

    // Fallback to localized US format
    return new Intl.DateTimeFormat("en-US").format(date);
  });

  // Collections filtered by tags
  eleventyConfig.addCollection("gameBlogs", function (collectionApi) {
    return collectionApi
      .getFilteredByTag("gameBlogs")
      .filter((item) => item.inputPath.includes("/posts/game-blogs/"));
  });

  eleventyConfig.addCollection("latestNews", (collectionApi) =>
    collectionApi.getFilteredByTag("latestNews")
  );

  eleventyConfig.addCollection("craftsArts", (collectionApi) =>
    collectionApi.getFilteredByTag("craftsArts")
  );

  eleventyConfig.addCollection("bookBlogs", (collectionApi) =>
    collectionApi.getFilteredByTag("bookBlogs")
  );

  // URL helper filters
  eleventyConfig.addFilter("getParentName", function (url) {
    const parts = url.split("/").filter((part) => part);
    return parts.length > 1 ? parts[0].replace(/-/g, " ") : "Home";
  });

  eleventyConfig.addFilter("getParentUrl", function (url) {
    const parts = url.split("/").filter((part) => part);
    return parts.length > 1 ? `/${parts[0]}/` : "/";
  });

  eleventyConfig.addFilter("getCategoryFromUrl", function (url) {
    const parts = url.split("/").filter((part) => part);
    if (parts.length > 1) {
      return parts[0]
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }
    return null;
  });

  // String slice filter for excerpts
  eleventyConfig.addFilter("slice", function (array, start, end) {
    return array.slice(start, end);
  });

  return {
    dir: {
      input: "src",
      output: "dist",
    },
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
