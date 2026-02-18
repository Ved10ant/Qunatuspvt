import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListItemNode, ListNode } from '@lexical/list';
import { useEditorStore } from '../store/useEditorStore';
import { useEffect, useRef } from 'react';
import { api } from '../api/client';
import Toolbar from './Toolbar';

const theme = {
    paragraph: 'mb-2 text-gray-700',
    heading: {
        h1: 'text-4xl font-bold mb-4',
        h2: 'text-2xl font-semibold mb-3',
    },
    list: {
        ul: 'list-disc ml-6 mb-2',
        ol: 'list-decimal ml-6 mb-2',
    }
};

const Editor: React.FC = () => {
    const { currentPost, updatePostContent, setIsSaving, setLastSaved } = useEditorStore();
    // const [editorState, setEditorState] = useState<string | null>(null);
    const saveTimeoutRef = useRef<any>(null);

    useEffect(() => {
        if (currentPost) {
            // No need to set editorState here as we use currentPost.content directly
        }
    }, [currentPost?.id]);

    const handleOnChange = (state: any) => {
        const stringifiedState = JSON.stringify(state.toJSON());
        updatePostContent(stringifiedState);

        // Auto-save logic (Debouncing)
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

        setIsSaving(true);
        saveTimeoutRef.current = setTimeout(async () => {
            if (currentPost) {
                await api.updatePost(currentPost.id, { content: stringifiedState });
                setLastSaved(new Date().toLocaleTimeString());
                setIsSaving(false);
            }
        }, 2000); // 2 second debounce
    };

    if (!currentPost) {
        return (
            <div className="flex-1 flex items-center justify-center text-gray-400">
                Select or create a post to start editing
            </div>
        );
    }

    const initialConfig = {
        namespace: 'MyEditor',
        theme,
        onError: (error: Error) => console.error(error),
        nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode],
        editorState: currentPost.content === '{}' ? undefined : currentPost.content,
    };

    return (
        <div className="flex-1 p-8 max-w-4xl mx-auto w-full">
            <input
                type="text"
                className="text-5xl font-bold w-full mb-8 focus:outline-none border-none placeholder-gray-300"
                value={currentPost.title}
                onChange={(e) => {
                    const newTitle = e.target.value;
                    useEditorStore.getState().updatePostTitle(newTitle);
                    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
                    setIsSaving(true);
                    saveTimeoutRef.current = setTimeout(async () => {
                        await api.updatePost(currentPost.id, { title: newTitle });
                        setLastSaved(new Date().toLocaleTimeString());
                        setIsSaving(false);
                    }, 2000);
                }}
                placeholder="Post Title"
            />

            <LexicalComposer initialConfig={initialConfig} key={currentPost.id}>
                <div className="relative">
                    <Toolbar />
                    <div className="relative">
                        <RichTextPlugin
                            contentEditable={<ContentEditable className="min-h-[500px] outline-none text-xl" />}
                            placeholder={<div className="absolute top-0 left-0 text-gray-300 pointer-events-none text-xl">Start writing.....</div>}
                            ErrorBoundary={LexicalErrorBoundary}
                        />
                    </div>
                    <HistoryPlugin />
                    <OnChangePlugin onChange={handleOnChange} />
                </div>
            </LexicalComposer>
        </div>
    );
};

export default Editor;
