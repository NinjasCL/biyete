# Pull Request template

Please, go through these steps before you submit a PR.

1. Make sure that your PR is not a duplicate.
2. If not, then make sure that:

   a. You have done your changes in a separate branch. Branches MUST have descriptive names that start with either the `1-fix/`, `2-feat/` or similar prefixes. Good examples are: `1-fix/signin-issue` or `2-feat/issue-templates`.

   b. You have a descriptive commit message with a short title (first line).

   c. `make test` doesn't throw any error. If it does, fix them first and create a new commit.

   d. Your final commit follows _commitizen_ format. It would be used in the _squash_ commit message(previous commits can be free format).

   e. Your pull request MUST NOT target the `production` branch on this repository. You probably want to target `main` instead.

   f. Give a descriptive title to your PR.

   g. Provide a description of your changes.

   h. Put `closes #XXXX` in your comment to auto-close the issue that your PR fixes (if such).

   i. Be sure to update [CHANGELOG](../CHANGELOG.adoc) with your final commit message's content.

## Branches

The branch must follow the format: `<issue number>-<type>/<context>`.
No spaces, all lowercase, separate words with `-`.

`<type>` must be one of the following:

- _feat_: A new feature
- _fix_: A bug fix
- _docs_: Documentation only changes
- _style_: Changes that do not affect the meaning of the code (white-space, formatting, missing
  semi-colons, etc)
- _refactor_: A code change that neither fixes a bug nor adds a feature
- _perf_: A code change that improves performance
- _test_: Adding missing tests
- _chore_: Changes to the build process or auxiliary tools and libraries such as documentation
  generation

_Example_: `1-docs/bancoestado-purchase-notification-parser`

IMPORTANT: Please review the [CONTRIBUTING](../CONTRIBUTING.adoc) file for detailed contributing guidelines.

**PLEASE REMOVE THIS TEMPLATE BEFORE SUBMITTING**
