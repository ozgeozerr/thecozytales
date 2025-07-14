module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy("src/_redirects");
  eleventyConfig.addPassthroughCopy("src/admin");

  eleventyConfig.addCollection("latestAddedPosts", (collectionApi) => {
    return collectionApi
      .getAll()
      .filter(
        (item) =>
          item.inputPath.includes("/posts/") && item.data.layout === "post.njk"
      )
      .reverse()
      .slice(0, 5);
  });

  // Date filter with default and fallback formatting
  eleventyConfig.addFilter("date", (dateObj, format = "yyyy-MM-dd") => {
    if (!dateObj) return ""; // No date provided
    const date = new Date(dateObj);
    if (isNaN(date.getTime())) return ""; // Invalid date

    if (format === "yyyy-MM-dd") {
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
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
  eleventyConfig.addCollection("tales", (collectionApi) =>
    collectionApi.getFilteredByTag("tales")
  );

  eleventyConfig.addPassthroughCopy("src/admin");

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
