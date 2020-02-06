#!/usr/bin/env node

const fs = require("fs");
const open = require("open");
const axios = require("axios");
const { prompt } = require("enquirer");

const CONFIG = {
  organization: null,
  baseURL: null,
  apiKey: null
};

const findApiKey = () => {
  if (CONFIG.baseURL === null) {
    console.error("Missing <baseURL>");
    return;
  }

  open(`${CONFIG.baseURL}/webapp/app.html#/profile`);
};

const generateNpmrc = async () => {
  const client = axios.create({
    baseURL: CONFIG.baseURL,
    headers: { "X-Api-Key": CONFIG.apiKey }
  });

  const { data: auth } = await client.get(
    `${CONFIG.baseURL}/api/npm/npm/auth/${CONFIG.organization}`
  );

  return `registry=${CONFIG.baseURL}/api/npm/npm/
${auth.trim()}
`;
};

(async () => {
  const { organization } = await prompt({
    type: "input",
    name: "organization",
    message: "What's your organization name?"
  });

  CONFIG.organization = organization;
  CONFIG.baseURL = `https://${organization}.jfrog.io/${organization}`;

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

  console.log("Writing .npmrc");
  const npmrc = await generateNpmrc();

  fs.writeFile(".npmrc", npmrc, err => {
    if (err) console.err(err);
    console.log("Wrote .npmrc!");
  });
})();
