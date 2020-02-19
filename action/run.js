const eslint = require("eslint");
const request = require("./request");

const {
  GITHUB_ACTION,
  GITHUB_REPOSITORY,
  GITHUB_SHA,
  GITHUB_WORKSPACE
} = process.env;

const GITHUB_TOKEN = process.argv[2];
process.argv.splice(0, 3);

const glob = process.argv.length ? process.argv : ["."];

const CHECK_NAME = "eslint annotations";

const headers = {
  "Content-Type": "application/json",
  Accept: "application/vnd.github.antiope-preview+json",
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  "User-Agent": "18f-gh-action-js-lint"
};

const createCheck = async () => {
  const body = {
    name: CHECK_NAME,
    head_sha: GITHUB_SHA,
    status: "in_progress",
    started_at: new Date()
  };

  const {
    data: { id }
  } = await request(
    `https://api.github.com/repos/${GITHUB_REPOSITORY}/check-runs`,
    { method: "POST", headers, body }
  );

  return id;
};

const updateCheck = async (id, conclusion, output) => {
  const body = {
    name: GITHUB_ACTION,
    head_sha: GITHUB_SHA,
    status: "completed",
    completed_at: new Date(),
    conclusion,
    output
  };

  await request(
    `https://api.github.com/repos/${GITHUB_REPOSITORY}/check-runs/${id}`,
    { method: "PATCH", headers, body }
  );
};

const lint = () => {
  const cli = new eslint.CLIEngine({ extensions: [".js", ".jsx", ".tsx"] });

  const { results, errorCount, warningCount } = cli.executeOnFiles(glob);

  const levels = ["", "warning", "failure"];

  const annotations = [];
  for (const result of results) {
    const { filePath, messages } = result;
    const path = filePath.substring(GITHUB_WORKSPACE.length + 1);

    annotations.push(
      ...messages.map(({ line, severity, ruleId, message }) => {
        const annotationLevel = levels[severity];
        return {
          path,
          start_line: line,
          end_line: line,
          annotation_level: annotationLevel,
          message: `[${ruleId}] ${message}`
        };
      })
    );
  }

  return {
    conclusion: errorCount > 0 ? "failure" : "success",
    output: {
      title: GITHUB_ACTION,
      summary: `${errorCount} error(s), ${warningCount} warning(s) found`,
      annotations
    }
  };
};

const handleError = e => {
  console.log("Error", e.stack);
  if (e.data) {
    console.log(e.data);
  }
  process.exit(1);
};

const run = async () => {
  const checkID = await createCheck();
  try {
    const { conclusion, output } = lint();
    await updateCheck(checkID, conclusion, output);
    if (conclusion === "failure") {
      process.exit(78);
    }
  } catch (e) {
    await updateCheck(checkID, "failure");
    handleError(e);
  }
};

run().catch(handleError);
