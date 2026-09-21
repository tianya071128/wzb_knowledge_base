import { declare } from "@babel/helper-plugin-utils";
import remapAsyncToGenerator from "@babel/helper-remap-async-to-generator";
import { types as t } from "@babel/core";
import { visitors } from "@babel/traverse";
import rewriteForAwait from "./for-await.js";
export default declare(api => {
  api.assertVersion("8.0.6");
  const yieldStarVisitor = visitors.environmentVisitor({
    ArrowFunctionExpression(path) {
      path.skip();
    },
    YieldExpression({
      node
    }, state) {
      if (!node.delegate) return;
      const asyncIter = t.callExpression(state.addHelper("asyncIterator"), [node.argument]);
      node.argument = t.callExpression(state.addHelper("asyncGeneratorDelegate"), [asyncIter]);
    }
  });
  const forAwaitVisitor = visitors.environmentVisitor({
    ArrowFunctionExpression(path) {
      path.skip();
    },
    ForOfStatement(path, {
      file
    }) {
      const {
        node
      } = path;
      if (!node.await) return;
      const build = rewriteForAwait(path, {
        getAsyncIterator: file.addHelper("asyncIterator")
      });
      const {
        declar,
        loop
      } = build;
      const block = loop.body;
      path.ensureBlock();
      if (declar) {
        block.body.push(declar);
        if (path.node.body.body.length) {
          block.body.push(t.blockStatement(path.node.body.body));
        }
      } else {
        block.body.push(...path.node.body.body);
      }
      t.inherits(loop, node);
      t.inherits(loop.body, node.body);
      const p = build.replaceParent ? path.parentPath : path;
      p.replaceWithMultiple(build.node);
      p.scope.parent.crawl();
    }
  });
  const visitor = {
    Function(path, state) {
      if (!path.node.async) return;
      path.traverse(forAwaitVisitor, state);
      if (!path.node.generator) return;
      path.traverse(yieldStarVisitor, state);
      path.setData("@babel/plugin-transform-async-generator-functions/async_generator_function", true);
      remapAsyncToGenerator(path, {
        wrapAsync: state.addHelper("wrapAsyncGenerator"),
        wrapAwait: state.addHelper("awaitAsyncGenerator")
      });
    }
  };
  return {
    name: "transform-async-generator-functions",
    manipulateOptions: undefined,
    visitor: {
      Program(path, state) {
        path.traverse(visitor, state);
      }
    }
  };
});