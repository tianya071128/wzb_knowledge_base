import { declare } from "@babel/helper-plugin-utils";
import syntaxFlow from "@babel/plugin-syntax-flow";
import { types as t } from "@babel/core";
import generateCode from "@babel/generator";
export default declare(api => {
  api.assertVersion("8.0.6");
  function commentFromString(comment) {
    return typeof comment === "string" ? {
      type: "CommentBlock",
      value: comment
    } : comment;
  }
  function attachComment({
    ofPath,
    toPath,
    where = "trailing",
    optional = false,
    comments = generateComment(ofPath, optional),
    keepType = false
  }) {
    if (!toPath?.node) {
      toPath = ofPath.getPrevSibling();
      where = "trailing";
    }
    if (!toPath.node) {
      toPath = ofPath.getNextSibling();
      where = "leading";
    }
    if (!toPath.node) {
      toPath = ofPath.parentPath;
      where = "inner";
    }
    if (!Array.isArray(comments)) {
      comments = [comments];
    }
    const newComments = comments.map(commentFromString);
    if (!keepType && ofPath?.node) {
      const node = ofPath.node;
      const parent = ofPath.parentPath;
      const prev = ofPath.getPrevSibling();
      const next = ofPath.getNextSibling();
      const isSingleChild = !(prev.node || next.node);
      const leading = node.leadingComments;
      const trailing = node.trailingComments;
      if (isSingleChild && leading) {
        parent.addComments("inner", leading);
      }
      toPath.addComments(where, newComments);
      ofPath.remove();
      if (isSingleChild && trailing) {
        parent.addComments("inner", trailing);
      }
    } else {
      toPath.addComments(where, newComments);
    }
  }
  function wrapInFlowComment(path) {
    attachComment({
      ofPath: path,
      comments: generateComment(path, path.parent.optional)
    });
  }
  function generateComment(path, optional) {
    let comment = path.getSource().replace(/\*-\//g, "*-ESCAPED/").replace(/\*\//g, "*-/");
    if (optional) comment = "?" + comment;
    if (!comment.startsWith(":")) comment = ":: " + comment;
    return comment;
  }
  function isTypeImport(importKind) {
    return importKind === "type" || importKind === "typeof";
  }
  return {
    name: "transform-flow-comments",
    inherits: syntaxFlow,
    visitor: {
      TypeCastExpression(path) {
        const {
          node
        } = path;
        attachComment({
          ofPath: path.get("typeAnnotation"),
          toPath: path.get("expression"),
          keepType: true
        });
        path.replaceWith(t.parenthesizedExpression(node.expression));
      },
      Identifier(path) {
        if (path.parentPath.isFlow()) return;
        const {
          node
        } = path;
        if (node.typeAnnotation) {
          attachComment({
            ofPath: path.get("typeAnnotation"),
            toPath: path,
            optional: node.optional || node.typeAnnotation.optional
          });
          if (node.optional) {
            node.optional = false;
          }
        } else if (node.optional) {
          attachComment({
            toPath: path,
            comments: ":: ?"
          });
          node.optional = false;
        }
      },
      AssignmentPattern: {
        exit({
          node
        }) {
          const {
            left
          } = node;
          if (left.optional) {
            left.optional = false;
          }
        }
      },
      Function(path) {
        if (path.isDeclareFunction()) return;
        const {
          node
        } = path;
        if (node.typeParameters) {
          attachComment({
            ofPath: path.get("typeParameters"),
            toPath: path.get("id"),
            optional: node.typeParameters.optional
          });
        }
        if (node.returnType) {
          attachComment({
            ofPath: path.get("returnType"),
            toPath: path.get("body"),
            where: "leading",
            optional: node.returnType.typeAnnotation.optional
          });
        }
      },
      ClassProperty(path) {
        const {
          node
        } = path;
        if (!node.value) {
          wrapInFlowComment(path);
        } else if (node.typeAnnotation) {
          attachComment({
            ofPath: path.get("typeAnnotation"),
            toPath: path.get("key"),
            optional: node.typeAnnotation.optional
          });
        }
      },
      ExportNamedDeclaration(path) {
        const {
          node
        } = path;
        if (node.exportKind !== "type" && !t.isFlow(node.declaration)) {
          return;
        }
        wrapInFlowComment(path);
      },
      ImportDeclaration(path) {
        const {
          node
        } = path;
        if (isTypeImport(node.importKind)) {
          wrapInFlowComment(path);
          return;
        }
        const typeSpecifiers = node.specifiers.filter(specifier => specifier.type === "ImportSpecifier" && isTypeImport(specifier.importKind));
        const nonTypeSpecifiers = node.specifiers.filter(specifier => specifier.type !== "ImportSpecifier" || !isTypeImport(specifier.importKind));
        node.specifiers = nonTypeSpecifiers;
        if (typeSpecifiers.length > 0) {
          const typeImportNode = t.cloneNode(node);
          typeImportNode.specifiers = typeSpecifiers;
          const comment = `:: ${generateCode(typeImportNode).code}`;
          if (nonTypeSpecifiers.length > 0) {
            attachComment({
              toPath: path,
              comments: comment
            });
          } else {
            attachComment({
              ofPath: path,
              comments: comment
            });
          }
        }
      },
      ObjectPattern(path) {
        const {
          node
        } = path;
        if (node.typeAnnotation) {
          attachComment({
            ofPath: path.get("typeAnnotation"),
            toPath: path,
            optional: node.optional || node.typeAnnotation.optional
          });
        }
      },
      Flow(path) {
        wrapInFlowComment(path);
      },
      Class(path) {
        const {
          node
        } = path;
        let comments = [];
        if (node.typeParameters) {
          const typeParameters = path.get("typeParameters");
          comments.push(generateComment(typeParameters, node.typeParameters.optional));
          const trailingComments = node.typeParameters.trailingComments;
          if (trailingComments) {
            comments.push(...trailingComments);
          }
          typeParameters.remove();
        }
        if (node.superClass) {
          if (comments.length > 0) {
            attachComment({
              toPath: path.get("id"),
              comments: comments
            });
            comments = [];
          }
          if (node.superTypeArguments) {
            const superTypeArguments = path.get("superTypeArguments");
            comments.push(generateComment(superTypeArguments, superTypeArguments.node.optional));
            superTypeArguments.remove();
          }
        }
        if (node.implements) {
          const impls = path.get("implements");
          const comment = "implements " + impls.map(impl => generateComment(impl).replace(/^:: /, "")).join(", ");
          delete node.implements;
          if (comments.length === 1) {
            comments[0] += ` ${comment}`;
          } else {
            comments.push(`:: ${comment}`);
          }
        }
        if (comments.length > 0) {
          attachComment({
            toPath: path.get("body"),
            where: "leading",
            comments: comments
          });
        }
      }
    }
  };
});