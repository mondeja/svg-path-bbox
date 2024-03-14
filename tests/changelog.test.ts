import * as fs from "node:fs";

test("Current version has a CHANGELOG entry", () => {
  const changelog = fs.readFileSync("CHANGELOG.md", "utf8");
  const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));

  const changelogEntry = changelog
    .split("\n")
    .find((line: string) => line.startsWith(`## [${packageJson.version}]`));
  expect(changelogEntry).toBeDefined();
});
