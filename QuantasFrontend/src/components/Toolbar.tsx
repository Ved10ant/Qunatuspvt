import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { FORMAT_TEXT_COMMAND, UNDO_COMMAND, REDO_COMMAND } from 'lexical';
import { $createHeadingNode } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import { $getSelection, $isRangeSelection } from 'lexical';
import { INSERT_TABLE_COMMAND } from '@lexical/table';
import { INSERT_MATH_COMMAND } from '../plugins/MathPlugin';

const Toolbar: React.FC = () => {
    const [editor] = useLexicalComposerContext();

    const formatHeading = (headingSize: 'h1' | 'h2') => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                $setBlocksType(selection, () => $createHeadingNode(headingSize));
            }
        });
    };

    return (
        <div className="flex items-center gap-2 mb-4 bg-white sticky top-0 z-10 py-2 border-b">
            <button
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
                className="p-2 hover:bg-gray-100 rounded" title="Bold"
            >
                <b>B</b>
            </button>
            <button
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
                className="p-2 hover:bg-gray-100 rounded" title="Italic"
            >
                <i>Italic</i>
            </button>
            <button
                onClick={() => formatHeading('h1')}
                className="p-2 hover:bg-gray-100 rounded" title="H1"
            >
                H1
            </button>
            <button
                onClick={() => formatHeading('h2')}
                className="p-2 hover:bg-gray-100 rounded" title="H2"
            >
                H2
            </button>
            <button
                onClick={() => editor.dispatchCommand(INSERT_TABLE_COMMAND, { columns: '3', rows: '3' })}
                className="p-2 hover:bg-gray-100 rounded text-sm" title="Insert Table"
            >
                Table
            </button>
            <button
                onClick={() => editor.dispatchCommand(INSERT_MATH_COMMAND, { equation: 'E = mc^2', inline: true })}
                className="p-2 hover:bg-gray-100 rounded text-sm font-serif italic" title="Insert Math"
            >
                Σ Math
            </button>
            <div className="w-px h-6 bg-gray-200 mx-2"></div>
            <button
                onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
                className="p-2 hover:bg-gray-100 rounded"
            >
                Undo
            </button>
            <button
                onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
                className="p-2 hover:bg-gray-100 rounded"
            >
                Redo
            </button>
        </div>
    );
};

export default Toolbar;
