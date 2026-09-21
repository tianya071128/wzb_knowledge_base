import { types as t } from "@babel/core";
const topicReferenceVisitor = {
  exit(path, state) {
    if (path.isTopicReference()) {
      state.topicReferences.push(path);
    } else {
      if (state.topicReferences.length === 0 && !state.sideEffectsBeforeFirstTopicReference && !path.isPure()) {
        state.sideEffectsBeforeFirstTopicReference = true;
      }
    }
  },
  "ClassBody|Function"(_, state) {
    if (state.topicReferences.length === 0) {
      state.sideEffectsBeforeFirstTopicReference = true;
    }
  }
};
const visitor = {
  BinaryExpression: {
    exit(path) {
      const {
        scope,
        node
      } = path;
      if (node.operator !== "|>") {
        return;
      }
      const pipeBodyPath = path.get("right");
      if (pipeBodyPath.node.type === "TopicReference") {
        path.replaceWith(node.left);
        return;
      }
      const visitorState = {
        topicReferences: [],
        sideEffectsBeforeFirstTopicReference: pipeBodyPath.isFunction()
      };
      pipeBodyPath.traverse(topicReferenceVisitor, visitorState);
      if (visitorState.topicReferences.length === 1 && (!visitorState.sideEffectsBeforeFirstTopicReference || path.scope.isPure(node.left, true))) {
        visitorState.topicReferences[0].replaceWith(node.left);
        path.replaceWith(node.right);
        return;
      }
      const topicVariable = scope.generateUidIdentifierBasedOnNode(node);
      scope.push({
        id: topicVariable
      });
      visitorState.topicReferences.forEach(path => path.replaceWith(t.cloneNode(topicVariable)));
      path.replaceWith(t.sequenceExpression([t.assignmentExpression("=", t.cloneNode(topicVariable), node.left), node.right]));
    }
  }
};
export default visitor;