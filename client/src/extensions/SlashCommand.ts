// import { Extension, Editor } from "@tiptap/core";
// import Suggestion, {
//   SuggestionOptions,
//   SuggestionProps,
// } from "@tiptap/suggestion";

// // Define a type for CommandItem
// type CommandItem = {
//   label: string;
//   action: (editor: Editor) => void;
// };

// export const SlashCommand = Extension.create<{
//   suggestion: Partial<SuggestionOptions<CommandItem>>;
// }>({
//   name: "slashCommand",

//   addOptions() {
//     return {
//       suggestion: {
//         char: "/",
//         startOfLine: false,
//         command: ({ editor, range, props }: SuggestionProps<CommandItem>) => {
//           const { query, items } = props;

//           // Find matching command item based on the query
//           const selectedItem = items.find((item) =>
//             item.label.toLowerCase().includes(query.toLowerCase())
//           );

//           // If a match is found, execute the corresponding action
//           if (selectedItem) {
//             selectedItem.action(editor);
//           }
//         },
//       },
//     };
//   },

//   addProseMirrorPlugins() {
//     return [
//       Suggestion<CommandItem>({
//         editor: this.editor,
//         ...this.options.suggestion,
//       }),
//     ];
//   },
// });
