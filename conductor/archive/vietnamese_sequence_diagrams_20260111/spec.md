# Specification: Add Vietnamese Sequence Diagrams to Backend Workflows

## Overview
This track aims to improve the technical documentation of the backend services by adding visual sequence diagrams to all existing workflow documents. This will provide a clearer, more intuitive understanding of the system's interactions for developers and stakeholders.

## Functional Requirements
- **Target Files:** Identify and process all files in `backend/docs/` that match the filename pattern `*-workflow.md`.
- **Content Analysis:** For each targeted file, analyze the existing text-based workflow steps and descriptions.
- **Diagram Generation:** Generate a Mermaid.js sequence diagram that accurately represents the described workflow.
- **Localization:** All actors, messages, and notes within the Mermaid diagram must be written in **Vietnamese**.
- **Section Insertion:** Create or update a section titled `## Biểu đồ tuần tự` in each file to house the generated diagram. This section should be placed where it best complements the existing text (ideally after the text-based steps).

## Non-Functional Requirements
- **Consistency:** Maintain a consistent style for Mermaid diagrams across all files (e.g., actor naming conventions, arrow types).
- **Readability:** Ensure diagrams are not overly cluttered and are easy to read within a Markdown viewer.

## Acceptance Criteria
- [ ] Every `*-workflow.md` file in `backend/docs/` contains a `## Biểu đồ tuần tự` section.
- [ ] Each of these sections contains a valid, renderable Mermaid sequence diagram.
- [ ] The sequence diagrams accurately mirror the logic described in the text of the respective file.
- [ ] All text elements within the diagrams are in Vietnamese.
- [ ] No existing documentation content is accidentally deleted or corrupted during the update.

## Out of Scope
- Updating workflow files outside of the `backend/docs/` directory.
- Modifying the actual application logic or code.
- Translating the entire content of the `.md` files into Vietnamese (only the diagrams and their section titles).
