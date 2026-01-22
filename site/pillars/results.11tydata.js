const results = require('../_data/results.json');

module.exports = {
  eleventyComputed: {
    pathId: "pillars",
    pathName: "The Five Pillars",
    resultCode: data => data.result?.code || "",
    levels: data => data.result?.levels || [],

    resultType: data => {
      const levels = data.result?.levels || [];
      let totalScore = 0;
      for (const level of levels) {
        if (level === "low") totalScore += 0;
        else if (level === "medium") totalScore += 1;
        else totalScore += 2;
      }
      const ratio = totalScore / 6;
      if (ratio < 0.25) return "sleepwalker";
      if (ratio < 0.4) return "skeptic";
      if (ratio < 0.55) return "participant";
      if (ratio < 0.7) return "architect";
      if (ratio < 0.85) return "witness";
      return "resister";
    },

    resultName: data => {
      const type = data.resultType;
      return results.types[type]?.name || "Unknown";
    },

    resultSummary: data => {
      const type = data.resultType;
      return results.types[type]?.summary || "";
    },

    resultDescription: data => {
      const type = data.resultType;
      return results.types[type]?.description || "";
    },

    shareHook: data => {
      const type = data.resultType;
      return results.types[type]?.hook || "";
    },

    dimensions: data => {
      const levels = data.result?.levels || [];
      return [
        { name: "Historical Pattern Recognition", level: levels[0] || "low" },
        { name: "Structural Awareness", level: levels[1] || "low" },
        { name: "Centralization Concern", level: levels[2] || "low" }
      ];
    },

    otherPaths: () => [
      { id: "chain", name: "The Amplification Chain" },
      { id: "mirror", name: "The Inverse Mirror" }
    ]
  }
};
