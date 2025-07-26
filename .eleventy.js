const pluginSitemap = require("@quasibit/eleventy-plugin-sitemap");

module.exports = function (eleventyConfig) {
  // ✅ Copy static assets and admin files
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy("src/_redirects");
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("src/robots.txt"); // robots.txt support

  // ✅ Sitemap plugin configuration
  eleventyConfig.addPlugin(pluginSitemap, {
    sitemap: {
      hostname: "https://thecozytales.com",
    },
  });

  // ✅ Collection: Latest 20 added blog posts
  eleventyConfig.addCollection("latestAddedPosts", (collectionApi) => {
    return collectionApi
      .getAll()
      .filter(
        (item) =>
          item.inputPath.startsWith("./src/posts/") &&
          item.data.layout === "post.njk"
      )
      .sort((a, b) => new Date(b.data.date) - new Date(a.data.date))
      .slice(0, 20);
  });

  // ✅ Filter: Slice
  eleventyConfig.addFilter("slice", function (array, start, end) {
    if (!Array.isArray(array)) return [];
    return array.slice(start, end);
  });

  // ✅ Filter: Date formatting
  eleventyConfig.addFilter("date", (dateObj, format = "yyyy-MM-dd") => {
    if (!dateObj) return "";
    const date = new Date(dateObj);
    if (isNaN(date.getTime())) return "";

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

    return new Intl.DateTimeFormat("en-US").format(date);
  });

  // ✅ Collections by tag and folder structure
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

  // ✅ Filters: For breadcrumb/category UI
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

  // ✅ Eleventy config return
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
