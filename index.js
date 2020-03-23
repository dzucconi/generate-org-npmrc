#!/usr/bin/env node

const fs = require("fs");
const open = require("open");
const axios = require("axios");
const { prompt } = require("enquirer");

const [_node, _file, ORG_NAME, API_KEY] = process.argv;

const CONFIG = {
  organization: ORG_NAME,
  baseURL: null,
  apiKey: API_KEY
};

const findApiKey = () => {
  if (CONFIG.baseURL === null) {
    console.error("Missing <baseURL>");
    return;
  }

  open(CONFIG.baseURL);
};

const generateNpmrc = async () => {
  const client = axios.create({
    baseURL: CONFIG.baseURL,
    headers: { "X-Api-Key": CONFIG.apiKey }
  });

  const { data: auth } = await client.get(
    `${CONFIG.baseURL}/${CONFIG.organization}/api/npm/npm/auth/${CONFIG.organization}`
  );

  return `registry=${CONFIG.baseURL}/${CONFIG.organization}/api/npm/npm/
${auth.trim()}
`;
};

(async () => {
  if (!CONFIG.organization) {
    const { organization } = await prompt({
      type: "input",
      name: "organization",
      message: "What's your organization name?"
    });

    CONFIG.organization = organization;
  }

  CONFIG.baseURL = `https://${CONFIG.organization}.jfrog.io`;

  if (!CONFIG.apiKey) {
    const { hasApiKey } = await prompt([
      {
        type: "confirm",
        name: "hasApiKey",
        message: "Do you have an API Key?"
      }
    ]);

    if (!hasApiKey) findApiKey();

    const { apiKey } = await prompt([
      {
        type: "input",
        name: "apiKey",
        message: "Please enter your API Key"
      }
    ]);

    CONFIG.apiKey = apiKey;
  }

  console.log("Writing .npmrc");
  const npmrc = await generateNpmrc();

  fs.writeFile(".npmrc", npmrc, err => {
    if (err) console.err(err);
    console.log("Wrote .npmrc!");
  });
})();
