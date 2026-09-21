import UtilParser from "./util.js";
import { SourceLocation } from "../util/location.js";
import { OptionFlags } from "../options.js";
class Node {
  constructor(optionFlags, filename, pos, loc) {
    this.start = pos;
    this.end = 0;
    if (loc !== undefined) this.loc = new SourceLocation(loc);
    if (optionFlags & OptionFlags.Ranges) this.range = [pos, 0];
    if (loc !== undefined && filename) {
      this.loc.filename = filename;
    }
  }
  type = "";
}
const NodePrototype = Node.prototype;
export class NodeUtils extends UtilParser {
  createPosition(loc) {
    return loc;
  }
  startNode() {
    const {
      startLoc
    } = this.state;
    this.setLoc(startLoc);
    return this.startNodeAt(startLoc);
  }
  startNodeAt(loc) {
    const {
      optionFlags,
      filename
    } = this;
    if (!(optionFlags & OptionFlags.Locations)) {
      return new Node(optionFlags, filename, loc.index);
    }
    return new Node(optionFlags, filename, loc.index, this.createPosition(loc));
  }
  startNodeAtNode(type) {
    const {
      optionFlags,
      filename
    } = this;
    if (!(optionFlags & OptionFlags.Locations)) {
      return new Node(optionFlags, filename, type.start);
    }
    return new Node(optionFlags, filename, type.start, type.loc.start);
  }
  finishNode(node, type) {
    return this.finishNodeAt(node, type, this.state.lastTokEndLoc);
  }
  finishNodeAt(node, type, endLoc) {
    if (node.end > 0) {
      throw new Error("Do not call finishNode*() twice on the same node." + " Instead use resetEndLocation() or change type directly.");
    }
    node.type = type;
    node.end = endLoc.index;
    const {
      optionFlags
    } = this;
    if (optionFlags & OptionFlags.Locations) {
      node.loc.end = this.createPosition(endLoc);
    }
    if (optionFlags & OptionFlags.Ranges) node.range[1] = endLoc.index;
    if (optionFlags & OptionFlags.AttachComment) this.processComment(node);
    return node;
  }
  finishNodeAtNode(node, type, endNode) {
    if (node.end > 0) {
      throw new Error("Do not call finishNode*() twice on the same node." + " Instead use resetEndLocation() or change type directly.");
    }
    node.type = type;
    node.end = endNode.end;
    const {
      optionFlags
    } = this;
    if (optionFlags & OptionFlags.Locations) {
      node.loc.end = endNode.loc.end;
    }
    if (optionFlags & OptionFlags.Ranges) node.range[1] = node.end;
    if (optionFlags & OptionFlags.AttachComment) this.processComment(node);
    return node;
  }
  resetStartLocation(node, startLoc) {
    node.start = startLoc.index;
    const {
      optionFlags
    } = this;
    if (optionFlags & OptionFlags.Locations) {
      node.loc.start = this.createPosition(startLoc);
    }
    if (optionFlags & OptionFlags.Ranges) node.range[0] = startLoc.index;
  }
  resetEndLocation(node, endLoc = this.state.lastTokEndLoc) {
    node.end = endLoc.index;
    const {
      optionFlags
    } = this;
    if (optionFlags & OptionFlags.Locations) {
      node.loc.end = this.createPosition(endLoc);
    }
    if (optionFlags & OptionFlags.Ranges) node.range[1] = endLoc.index;
  }
  resetStartLocationFromNode(node, locationNode) {
    node.start = locationNode.start;
    const {
      optionFlags
    } = this;
    if (optionFlags & OptionFlags.Locations) {
      node.loc.start = locationNode.loc.start;
    }
    if (optionFlags & OptionFlags.Ranges) node.range[0] = locationNode.start;
  }
  resetEndLocationFromNode(node, locationNode) {
    node.end = locationNode.end;
    const {
      optionFlags
    } = this;
    if (optionFlags & OptionFlags.Locations) {
      node.loc.end = locationNode.loc.end;
    }
    if (optionFlags & OptionFlags.Ranges) node.range[1] = locationNode.end;
  }
  castNodeTo(node, type) {
    node.type = type;
    return node;
  }
  cloneIdentifier(node) {
    const {
      type,
      start,
      end,
      loc,
      range,
      name
    } = node;
    const cloned = Object.create(NodePrototype);
    cloned.type = type;
    cloned.start = start;
    cloned.end = end;
    cloned.loc = loc;
    cloned.range = range;
    cloned.name = name;
    if (node.extra) cloned.extra = node.extra;
    return cloned;
  }
  cloneStringLiteral(node) {
    const {
      type,
      start,
      end,
      loc,
      range,
      extra
    } = node;
    const cloned = Object.create(NodePrototype);
    cloned.type = type;
    cloned.start = start;
    cloned.end = end;
    cloned.loc = loc;
    cloned.range = range;
    cloned.extra = extra;
    cloned.value = node.value;
    return cloned;
  }
}