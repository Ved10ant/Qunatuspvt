# Hiring Challenge: Design & Architecture

This document outlines the design decisions and architectural choices made during the implementation of the Smart Blog Editor.

## 1. Rich Text Editor (Lexical)
I chose **Lexical** by Meta because of its highly modular, plugin-based architecture. 
- **Modularity**: Every feature (Tables, Links, Math) is encapsulated in separate nodes and plugins.
- **Performance**: Lexical uses a light-weight Reconciliation approach, minimizing unnecessary re-renders.
- **Extensibility**: Custom features like Mathematical Expressions were implemented using `DecoratorNode`, allowing for complex interactive components within the editor.

## 2. State Management (Zustand)
Following the requirement to separate UI state from Editor data:
- **Zustand** provides a global store that manages both the `currentPost` (editor content) and peripheral UI states like `isSaving` and `posts` list.
- **Selective Updates**: Functions like `updatePostTitle` specifically target the required slices of the state to avoid full-app re-renders.

## 3. Persistence Layer
- While the assignment suggested localStorage or a mock API, I implemented a robust **Node.js/Express** backend with **MongoDB** (Mongoose).
- **Data Integrity**: I solved a race condition between the Lexical `OnChange` auto-save and the "Publish" button by ensuring the latest editor state is explicitly sent during the publication request.
- **IDs**: Transitioned from simple integers to **string-based ObjectIds** to provide a production-ready database schema.

## 4. Key Features Implemented
- **Tables**: Integrated using `@lexical/table` with insert/edit capabilities.
- **Mathematical Expressions**: Custom node using **KaTeX** for LaTeX rendering, supporting both block and inline modes.
- **Mobile Responsive UI**: Sidebar and Editor adapt based on screen size, utilizing Tailwind CSS for fluid layout transitions.

## 5. Development Workflow
- **Frontend**: Vite + React + TypeScript
- **Backend**: Node.js + Express
- **ORM**: Mongoose
- **Styling**: Tailwind CSS 4.0
