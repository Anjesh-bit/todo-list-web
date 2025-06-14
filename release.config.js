export const branches = ["main"];
export const plugins = [
  "@semantic-release/commit-analyzer",
  "@semantic-release/release-notes-generator",
  "@semantic-release/changelog",
  "@semantic-release/github",
  "@semantic-release/npm",
  [
    "@semantic-release/git",
    {
      assets: [],
      message: "chore(release): [skip ci]\n\n${nextRelease.notes}",
    },
  ],
];
export const release = {
  version: false,
  prepare: ["@semantic-release/npm"],
};
