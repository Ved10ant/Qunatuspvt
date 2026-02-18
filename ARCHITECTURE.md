# System Architecture - Smart Blog Editor

This document explains the design decisions and file structure for the Smart Blog Editor.

## 1. High-Level Design (HLD)

The system is built using a modern decoupled architecture:
- **Frontend**: React application using Vite for fast builds. It handles the rich text editing experience and state management.
- **Backend**: FastAPI (Python) service providing RESTful endpoints.
- **Database**: SQLite (SQLModel/SQLAlchemy) for persistence, chosen for its simplicity and local-first nature which fits a "Smart Blog Editor" prototype.

### Core Flows
1. **Editing**: The user types in the Lexical editor. Every keystroke triggers a debounced save operation (2 seconds delay) to sync the JSON state with the backend.
2. **State Management**: Zustand is used to provide a global store for the current post, the list of drafts, and the "saving" status indicator.
3. **AI Integration**: The backend integrates with the Gemini API to process content and return summaries or corrections.

## 2. Low-Level Design (LLD)

### Frontend Structure (`/QuantasFrontend`)
- `src/api/client.ts`: Centralized API communication using fetch.
- `src/store/useEditorStore.ts`: Global state management for posts and editor status.
- `src/components/Editor.tsx`: Main editor component. It uses Lexical's `OnChangePlugin` to capture state changes.
- `src/components/Sidebar.tsx`: Handles navigation between different posts and creation of new ones.
- `src/components/Toolbar.tsx`: Rich text formatting controls (Bold, Italic, Headings).

### Backend Structure (`/QuantasBackendPython`)
- `main.py`: API routes and logic.
- `models.py`: Database entities. `Post` stores Lexical content as a JSON string to avoid data loss during serialization/deserialization.
- `database.py`: Session management and engine initialization.
- `schemas.py`: Pydantic models for type safety on requests/responses.

## 3. Design Choices & Rationale

- **Lexical over Textarea**: Lexical provides a robust framework for building Notion-like editors. Its JSON-based state is easy to store and reconstruct, ensuring high fidelity.
- **Zustand over Redux**: Chosen for its minimal boilerplate and ease of use in smaller to medium-sized projects.
- **FastAPI over Django**: FastAPI's performance and modern Python features (type hints, async/await) make it ideal for building lightweight, efficient services.
- **Debouncing**: To prevent API spamming, a 2-second debounce timer ensures we only save when the user stops typing.
