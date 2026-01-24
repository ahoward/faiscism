const questions = require('../_data/chain_questions.json');

module.exports = {
  eleventyComputed: {
    pathId: "chain",
    pathName: "The Amplification Chain",
    totalQuestions: () => questions.length,
    questionNum: data => data.question?.id || "",
    questionText: data => data.question?.text || "",
    options: data => data.question?.options || [],
    reveal: data => data.question?.reveal || null,
    context: data => data.question?.context || null,
    quote: data => data.question?.quote || null,
    isLast: data => data.question?.id === questions.length
  }
};
