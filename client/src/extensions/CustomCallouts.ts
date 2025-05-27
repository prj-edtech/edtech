import { Node, mergeAttributes } from "@tiptap/core";

export const CalloutGreen = Node.create({
  name: "calloutGreen",
  group: "block",
  content: "block+",
  parseHTML() {
    return [{ tag: "div[data-type='calloutGreen']" }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "calloutGreen",
        class:
          "border-l-4 shadow-md border-green-500 pl-3 py-2 my-2 rounded-lg",
      }),
      0,
    ];
  },
});

export const CalloutViolet = Node.create({
  name: "calloutViolet",
  group: "block",
  content: "block+",
  parseHTML() {
    return [{ tag: "div[data-type='calloutViolet']" }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "calloutViolet",
        class: "border-l-4 shadow-md border-blue-500 pl-3 py-2 my-2 rounded-lg",
      }),
      0,
    ];
  },
});
