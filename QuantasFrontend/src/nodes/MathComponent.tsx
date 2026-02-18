import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getNodeByKey } from 'lexical';
import { MathNode } from './MathNode';

export default function MathComponent({
    equation,
    inline,
    nodeKey,
}: {
    equation: string;
    inline: boolean;
    nodeKey: string;
}): JSX.Element {
    const [editor] = useLexicalComposerContext();
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(equation);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    const onDoubleClick = () => {
        setIsEditing(true);
    };

    const onBlur = () => {
        setIsEditing(false);
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            if (node instanceof MathNode) {
                node.setEquation(value);
            }
        });
    };

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    };

    const containerStyle: React.CSSProperties = {
        display: inline ? 'inline-block' : 'block',
        padding: '0 4px',
        cursor: 'pointer',
        backgroundColor: isEditing ? '#f0f0f0' : 'transparent',
        borderRadius: '4px',
    };

    if (isEditing) {
        return (
            <span style={containerStyle}>
                <input
                    ref={inputRef}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    style={{
                        border: '1px solid #ccc',
                        borderRadius: '2px',
                        padding: '2px 4px',
                        fontFamily: 'monospace',
                    }}
                />
            </span>
        );
    }

    const html = katex.renderToString(equation, {
        displayMode: !inline,
        throwOnError: false,
    });

    return (
        <span
            style={containerStyle}
            onDoubleClick={onDoubleClick}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
