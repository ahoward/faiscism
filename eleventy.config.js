module.exports = function(eleventyConfig) {
  // Copy static assets
  eleventyConfig.addPassthroughCopy("site/css");
  eleventyConfig.addPassthroughCopy("site/js");
  eleventyConfig.addPassthroughCopy("site/images");
  eleventyConfig.addPassthroughCopy("site/fonts");

  // Watch targets
  eleventyConfig.addWatchTarget("site/css/");
  eleventyConfig.addWatchTarget("site/js/");

  // Custom filter: encode answers to URL-safe string
  eleventyConfig.addFilter("encodeAnswers", function(answers) {
    // answers is array of integers [0-3]
    // pack into base64-ish string
    const packed = answers.map(a => a.toString(4)).join('');
    return Buffer.from(packed).toString('base64url');
  });

  // Custom filter: decode answers from URL-safe string
  eleventyConfig.addFilter("decodeAnswers", function(encoded) {
    try {
      const packed = Buffer.from(encoded, 'base64url').toString();
      return packed.split('').map(c => parseInt(c, 4));
    } catch {
      return [];
    }
  });

  // Custom filter: calculate result type from scores
  eleventyConfig.addFilter("resultType", function(scores) {
    const total = Object.values(scores).reduce((a, b) => a + b, 0);
    const max = Object.keys(scores).length * 3; // max score per dimension is 3
    const ratio = total / max;

    if (ratio < 0.25) return 'sleepwalker';
    if (ratio < 0.4) return 'skeptic';
    if (ratio < 0.55) return 'participant';
    if (ratio < 0.7) return 'architect';
    if (ratio < 0.85) return 'witness';
    return 'resister';
  });

  // Custom filter: get result metadata
  eleventyConfig.addFilter("resultMeta", function(type) {
    const results = {
      sleepwalker: {
        name: "The Sleepwalker",
        summary: "Uses AI heavily, trusts implicitly, hasn't considered systemic effects.",
        hook: "I took the mirror test. I'm a Sleepwalker. Are you?"
      },
      skeptic: {
        name: "The Skeptic",
        summary: "Distrusts AI, avoids it, may not understand structural dynamics.",
        hook: "I took the mirror test. I'm a Skeptic. Are you?"
      },
      participant: {
        name: "The Participant",
        summary: "Uses thoughtfully, sees patterns, participates anyway.",
        hook: "I took the mirror test. I'm a Participant. Are you?"
      },
      architect: {
        name: "The Architect",
        summary: "Works in/on AI, understands mechanics, may feel conflicted.",
        hook: "I took the mirror test. I'm an Architect. Are you?"
      },
      witness: {
        name: "The Witness",
        summary: "Sees patterns clearly, struggles with action.",
        hook: "I took the mirror test. I'm a Witness. Are you?"
      },
      resister: {
        name: "The Resister",
        summary: "Actively minimizes AI, seeks alternatives, accepts friction.",
        hook: "I took the mirror test. I'm a Resister. Are you?"
      }
    };
    return results[type] || results.participant;
  });

  // Generate all result permutations for a path
  eleventyConfig.addCollection("chainResults", function(collectionApi) {
    return generateResultPermutations('chain', 3); // 3 dimensions, 3 levels each
  });

  eleventyConfig.addCollection("pillarsResults", function(collectionApi) {
    return generateResultPermutations('pillars', 3);
  });

  eleventyConfig.addCollection("mirrorResults", function(collectionApi) {
    return generateResultPermutations('mirror', 3);
  });

  return {
    dir: {
      input: "site",
      output: "_site",
      includes: "_includes",
      layouts: "_layouts",
      data: "_data"
    },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};

// Helper: generate all permutations of dimension scores
function generateResultPermutations(pathId, dimensions) {
  const levels = ['low', 'medium', 'high'];
  const results = [];

  function generate(current, depth) {
    if (depth === dimensions) {
      const code = current.map(l => levels.indexOf(l)).join('');
      results.push({
        path: pathId,
        levels: current.slice(),
        code: code,
        permalink: `/${pathId}/result/${code}/`
      });
      return;
    }
    for (const level of levels) {
      current.push(level);
      generate(current, depth + 1);
      current.pop();
    }
  }

  generate([], 0);
  return results;
}
