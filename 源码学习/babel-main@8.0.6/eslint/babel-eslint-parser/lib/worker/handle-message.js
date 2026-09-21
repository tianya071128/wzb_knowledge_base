import maybeParse from "./maybeParse.js";
import { normalizeBabelParseConfig } from "./configuration.js";
import { ACTIONS } from "../client.js";
export default async function handleMessage(action, payload) {
  switch (action) {
    case ACTIONS.MAYBE_PARSE:
      return await maybeParse(payload.code, await normalizeBabelParseConfig(payload.options));
  }
}