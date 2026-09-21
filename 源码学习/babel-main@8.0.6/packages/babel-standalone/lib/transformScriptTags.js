const scriptTypes = new Set(["text/jsx", "text/babel"]);
let headEl;
let inlineScriptCount = 0;
function transformCode(transformFn, script) {
  let source;
  if (script.url != null) {
    source = script.url;
  } else {
    source = "Inline Babel script";
    inlineScriptCount++;
    if (inlineScriptCount > 1) {
      source += " (" + inlineScriptCount + ")";
    }
  }
  return transformFn(script.content, buildBabelOptions(script, source)).code;
}
function buildBabelOptions(script, filename) {
  let presets = script.presets;
  if (!presets) {
    if (script.type === "module") {
      presets = [["react", {
        runtime: "classic"
      }], ["env", {
        modules: false
      }]];
    } else {
      presets = [["react", {
        runtime: "classic"
      }], "env"];
    }
  }
  const plugins = script.plugins;
  const targets = {
    browsers: script.targets
  };
  if (script.type === "module") {
    targets.esmodules = true;
  }
  return {
    filename,
    presets,
    plugins,
    sourceMaps: "inline",
    sourceFileName: filename,
    targets
  };
}
function run(transformFn, script) {
  const scriptEl = document.createElement("script");
  if (script.type) {
    scriptEl.setAttribute("type", script.type);
  }
  if (script.nonce) {
    scriptEl.nonce = script.nonce;
  }
  scriptEl.text = transformCode(transformFn, script);
  headEl.appendChild(scriptEl);
}
function load(url, successCallback, errorCallback) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  if ("overrideMimeType" in xhr) {
    xhr.overrideMimeType("text/plain");
  }
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 0 || xhr.status === 200) {
        successCallback(xhr.responseText);
      } else {
        errorCallback();
        throw new Error("Could not load " + url);
      }
    }
  };
  xhr.send(null);
}
function parseFromScriptAttribute(script, attributeName) {
  const rawValue = script.getAttribute(attributeName);
  if (rawValue === "") {
    return [];
  }
  if (!rawValue) {
    return undefined;
  }
  return rawValue.split(",").map(item => item.trim());
}
function loadScripts(transformFn, scripts) {
  const results = [];
  const count = scripts.length;
  function check() {
    for (let i = 0; i < count; i++) {
      const result = results[i];
      if (result.loaded && !result.executed) {
        result.executed = true;
        run(transformFn, result);
      } else if (!result.loaded && !result.error && !result.async) {
        break;
      }
    }
  }
  for (let i = 0; i < count; i++) {
    const script = scripts[i];
    const result = {
      async: script.hasAttribute("async"),
      type: script.getAttribute("data-type") ?? undefined,
      nonce: script.nonce,
      error: false,
      executed: false,
      plugins: parseFromScriptAttribute(script, "data-plugins"),
      presets: parseFromScriptAttribute(script, "data-presets"),
      targets: parseFromScriptAttribute(script, "data-targets"),
      loaded: false,
      url: null,
      content: null
    };
    results.push(result);
    if (script.src) {
      result.url = script.src;
      load(script.src, content => {
        result.loaded = true;
        result.content = content;
        check();
      }, () => {
        result.error = true;
        check();
      });
    } else {
      result.url = script.getAttribute("data-module") || null;
      result.loaded = true;
      result.content = script.innerHTML;
    }
  }
  check();
}
export function runScripts(transformFn, scripts) {
  headEl = document.getElementsByTagName("head")[0];
  if (!scripts) {
    scripts = document.getElementsByTagName("script");
  }
  const jsxScripts = [];
  for (let i = 0; i < scripts.length; i++) {
    const script = scripts.item(i);
    const type = script.type.split(";")[0];
    if (scriptTypes.has(type)) {
      jsxScripts.push(script);
    }
  }
  if (jsxScripts.length === 0) {
    return;
  }
  console.warn("You are using the in-browser Babel transformer. Be sure to precompile " + "your scripts for production - https://babeljs.io/docs/setup/");
  loadScripts(transformFn, jsxScripts);
}