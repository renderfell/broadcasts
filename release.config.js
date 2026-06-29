/**
 * Semantic Release configuration
 * Uses conventional commits to determine releases.
 * - No npm publish (this is not a library)
 * - Updates package.json + CHANGELOG.md and commits them
 * - Creates GitHub Release + tag
 *
 * GitHub Pages deploy is handled in the workflow ONLY when a release is published.
 */
export default {
  branches: ['main'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/changelog',
      {
        changelogFile: 'CHANGELOG.md',
      },
    ],
    [
      '@semantic-release/npm',
      {
        npmPublish: false,
      },
    ],
    [
      '@semantic-release/git',
      {
        assets: ['CHANGELOG.md', 'package.json'],
        message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
    [
      '@semantic-release/github',
      {
        successComment: false,
        failComment: false,
        releasedLabels: false,
      },
    ],
  ],
};
