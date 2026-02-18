import type {
    DOMConversionMap,
    DOMConversionOutput,
    DOMExportOutput,
    EditorConfig,
    LexicalNode,
    NodeKey,
    SerializedLexicalNode,
    Spread,
} from 'lexical';

import { DecoratorNode } from 'lexical';
import * as React from 'react';
import { Suspense } from 'react';

const MathComponent = React.lazy(() => import('./MathComponent'));

export type SerializedMathNode = Spread<
    {
        equation: string;
        inline: boolean;
    },
    SerializedLexicalNode
>;

function convertMathElement(domNode: HTMLElement): DOMConversionOutput | null {
    const equation = domNode.getAttribute('data-lexical-equation');
    const inline = domNode.getAttribute('data-lexical-inline') === 'true';
    if (equation) {
        const node = $createMathNode(equation, inline);
        return { node };
    }
    return null;
}

export class MathNode extends DecoratorNode<JSX.Element> {
    __equation: string;
    __inline: boolean;

    static getType(): string {
        return 'math';
    }

    static clone(node: MathNode): MathNode {
        return new MathNode(node.__equation, node.__inline, node.__key);
    }

    constructor(equation: string, inline?: boolean, key?: NodeKey) {
        super(key);
        this.__equation = equation;
        this.__inline = inline ?? false;
    }

    static importJSON(serializedNode: SerializedMathNode): MathNode {
        const node = $createMathNode(
            serializedNode.equation,
            serializedNode.inline,
        );
        return node;
    }

    exportJSON(): SerializedMathNode {
        return {
            equation: this.getEquation(),
            inline: this.getInline(),
            type: 'math',
            version: 1,
        };
    }

    createDOM(_config: EditorConfig): HTMLElement {
        const dom = document.createElement(this.__inline ? 'span' : 'div');
        dom.className = 'lexical-math';
        return dom;
    }

    updateDOM(_prevNode: MathNode, _dom: HTMLElement): boolean {
        return false;
    }

    getEquation(): string {
        return this.__equation;
    }

    setEquation(equation: string): void {
        const writable = this.getWritable();
        writable.__equation = equation;
    }

    getInline(): boolean {
        return this.__inline;
    }

    setInline(inline: boolean): void {
        const writable = this.getWritable();
        writable.__inline = inline;
    }

    static importDOM(): DOMConversionMap | null {
        return {
            div: (domNode: HTMLElement) => {
                if (!domNode.hasAttribute('data-lexical-equation')) {
                    return null;
                }
                return {
                    conversion: convertMathElement,
                    priority: 2,
                };
            },
            span: (domNode: HTMLElement) => {
                if (!domNode.hasAttribute('data-lexical-equation')) {
                    return null;
                }
                return {
                    conversion: convertMathElement,
                    priority: 2,
                };
            },
        };
    }

    exportDOM(): DOMExportOutput {
        const element = document.createElement(this.__inline ? 'span' : 'div');
        element.setAttribute('data-lexical-equation', this.__equation);
        element.setAttribute('data-lexical-inline', String(this.__inline));
        element.innerText = this.__equation;
        return { element };
    }

    decorate(): JSX.Element {
        return (
            <Suspense fallback={null}>
                <MathComponent
                    equation={this.__equation}
                    inline={this.__inline}
                    nodeKey={this.__key}
                />
            </Suspense>
        );
    }
}

export function $createMathNode(equation: string, inline?: boolean): MathNode {
    return new MathNode(equation, inline);
}

export function $isMathNode(node: LexicalNode | null | undefined): node is MathNode {
    return node instanceof MathNode;
}
