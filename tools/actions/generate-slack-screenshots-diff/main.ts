import * as core from "@actions/core";
import { promises as fs } from "fs";

const generateBlocks = (array) =>
  array.map((e) => [
    {
      type: "divider",
    },
    {
      type: "image",
      title: {
        type: "plain_text",
        text: e.actual.name,
        emoji: true,
      },
      image_url: e.actual.link,
      alt_text: "marg",
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Diff:* ${e.diff.name}`,
      },
      accessory: {
        type: "button",
        text: {
          type: "plain_text",
          text: "View",
          emoji: true,
        },
        value: "click_me_123",
        url: e.diff.link,
        action_id: "button-action",
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Expected:* ${e.expected.name}`,
      },
      accessory: {
        type: "button",
        text: {
          type: "plain_text",
          text: "View",
          emoji: true,
        },
        value: "click_me_123",
        url: e.expected.link,
        action_id: "button-action",
      },
    },
  ]);

const main = async () => {
  const images = core.getInput("images");
  const workspace = core.getInput("workspace");
  const imagesObject = await fs.readFile(`${workspace}/${images}`, "utf8");
  const parsed = JSON.parse(imagesObject);
  core.info(JSON.stringify(parsed, null, 2));

  const windows = generateBlocks(parsed.windows);
  const linux = generateBlocks(parsed.linux);

  let blocks = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: ":alert: Screenshots have been updated!\n\n Pull Request: ${{ github.event.commits[0].message }}\n Owner: *${{ github.actor }}*\n :github: run: ${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}.",
      },
    },
    {
      type: "divider",
    },
    {
      type: "header",
      text: {
        type: "plain_text",
        text: "Linux :tux:",
        emoji: true,
      },
    },
    ...linux.flat(),
    {
      type: "divider",
    },
    {
      type: "header",
      text: {
        type: "plain_text",
        text: "Windows :windaube:",
        emoji: true,
      },
    },
    ...windows.flat(),
  ];
  const result = { blocks };
  core.info(JSON.stringify(result, null, 2));
  await fs.writeFile(
    `${workspace}/payload-slack-content.json`,
    JSON.stringify(result)
  );
};

main().catch((err) => core.setFailed(err));