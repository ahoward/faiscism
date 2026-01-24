const questions = require('../_data/pillars_questions.json');

module.exports = {
  eleventyComputed: {
    pathId: "pillars",
    pathName: "The Five Pillars",
    totalQuestions: () => questions.length,
    questionNum: data => data.question?.id || "",
    questionText: data => data.question?.text || "",
    options: data => data.question?.options || [],
    reveal: data => data.question?.reveal || null,
    context: data => data.question?.context || null,
    pillarName: data => data.question?.pillarName || null,
    quote: data => data.question?.quote || null,
    isLast: data => data.question?.id === questions.length
  }
};
