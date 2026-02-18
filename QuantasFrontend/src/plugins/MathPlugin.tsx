import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';
import { $createMathNode, MathNode } from '../nodes/MathNode';
import { $getSelection, $isRangeSelection, COMMAND_PRIORITY_EDITOR, createCommand } from 'lexical';
import type { LexicalCommand } from 'lexical';
import { $insertNodes } from 'lexical';

export const INSERT_MATH_COMMAND: LexicalCommand<{ equation: string; inline: boolean }> =
    createCommand();

export default function MathPlugin(): JSX.Element | null {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        if (!editor.hasNodes([MathNode])) {
            throw new Error('MathPlugin: MathNode not registered on editor');
        }

        return editor.registerCommand(
            INSERT_MATH_COMMAND,
            (payload) => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    const mathNode = $createMathNode(payload.equation, payload.inline);
                    $insertNodes([mathNode]);
                }
                return true;
            },
            COMMAND_PRIORITY_EDITOR,
        );
    }, [editor]);

    return null;
}
