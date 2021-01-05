const puppeteer = require("puppeteer");
const participants = {};

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  const participantFunctions = {
    sendMessage: async ({ email, message }) => {
      const browser = await puppeteer.launch({
        headless: true,
      });

      try {
        const page = await browser.newPage();
        await page.goto(config.baseUrl + "/guild/messages");
        await page.waitForSelector("input[name=email]");
        await page.type("input[name=email]", email);
        await page.type("input[type=password]", "testing123");
        await page.click("[data-testid=loginButton]");
        await page.waitForSelector("[name=message]");
        await page.type("[name=message]", message);
        await page.click("[data-testid=sendMessage]");
        await delay(500);
        return Promise.resolve(null);
      } catch (err) {
        console.log(err);
      }
    },
    addParticipant: async ({ email, url, color }) => {
      const args = [
        "--use-fake-ui-for-media-stream",
        "--use-fake-device-for-media-stream",
      ];

      if (color) {
        args.push(
          `--use-file-for-fake-video-capture=cypress/fixtures/${color}.y4m`,
        );
      }

      const browser = await puppeteer.launch({
        headless: true,
        args,
      });

      try {
        const page = await browser.newPage();
        await page.goto(config.baseUrl + url);
        await page.type("input[name=email]", email);
        await page.type("input[type=password]", "testing123");
        await page.click("[data-testid=loginButton]");
        await delay(5000);
        await page.waitForSelector("[data-testid=joinCall]:not([disabled])");
        await page.click("[data-testid=joinCall]:not([disabled])");
        await delay(5000);
        await page.waitForSelector("[data-testid=leaveCall]", {
          timeout: 60000,
        });
        participants[email] = page;
        return Promise.resolve(null);
      } catch (err) {
        console.log(err);
      }
    },
    removeParticipant: async (email) => {
      const page = participants[email];
      await page.click('[aria-label="Leave"]');
      await page.close();
      delete participants[email];
      return Promise.resolve(null);
    },
    removeAllParticipants: () => {
      return Promise.all(
        Object.keys(participants).map((email) =>
          participantFunctions.removeParticipant(email),
        ),
      ).then(() => null);
    },
    participantCloseBrowser: async (email) => {
      const page = participants[email];
      await page.close({ runBeforeUnload: true });
      delete participants[email];
      return Promise.resolve(null);
    },
  };
  on("task", participantFunctions);
};
