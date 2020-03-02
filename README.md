# generate-org-npmrc

[![npm](https://img.shields.io/npm/v/generate-org-npmrc)](https://www.npmjs.com/package/generate-org-npmrc) ![NPM](https://img.shields.io/npm/l/generate-org-npmrc)

Authenticates with Artifactory and generates an .npmrc.

## Usage

Run the CLI using [`npx`](https://www.npmjs.com/package/npx)

```bash
npx generate-org-npmrc
# => ? What's your organization name? › ...
```

Optionally accepts an org name and API key

```bash
npx generate-org-npmrc xxx xxx
# => Writing .npmrc
```
