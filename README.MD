# BackArch – Project Context

## Overview

BackArch is a visual backend architecture designer that allows users to model, validate, and generate the base structure of backend applications using a graph-based approach.

The application is designed to:

* Provide a visual canvas for backend architectural design.
* Enforce architectural best practices through validation rules.
* Support multiple stacks (initially Spring Boot).
* Generate a clean, production-ready project structure.
* Remain framework-agnostic at its core.

BackArch is not a code editor. It is an architectural modeling tool that helps users design backend systems before writing business logic.

---

# Application Layout Structure

The application is divided into four main layout areas:

1. Header (Configuration Layer)
2. Left Sidebar (Component Catalog)
3. Right Sidebar (Node Inspector)
4. Footer (Validation & Feedback Engine)

Each section has a clear and well-defined responsibility.

---

# 1. Header – Global Configuration

The Header represents the configuration layer of the application.

It is responsible for defining the architectural context in which the graph operates.

## Responsibilities

* Select Stack (e.g., Spring Boot).
* Select Stack Version.
* Select Architecture Style (Clean, Layered, Hexagonal, etc.).
* Configure global project metadata (project name, base package, etc.).

## Behavior

When the user changes the configuration:

* The catalog (left sidebar) dynamically adapts.
* The validation rules are updated.
* The available node types may change.
* The graph engine re-evaluates constraints.

The configuration acts as the root context of the entire system.

Nothing in the canvas exists independently of the selected configuration.

---

# 2. Left Sidebar – Component Catalog

The Left Sidebar contains the draggable architectural components.

These components represent domain abstractions such as:

* Endpoints
* Services
* Repositories
* Entities
* Databases
* External Services

## Responsibilities

* Display available node types based on selected stack.
* Allow drag-and-drop into the canvas.
* Prevent invalid components from appearing.

## Behavior

When a component is dragged into the canvas:

* A node is created via the Graph Engine.
* The node receives a unique ID.
* The node inherits metadata based on stack configuration.

The sidebar is a projection of the current stack capabilities.

---

# 3. Canvas – Graph Engine Core

The canvas is the visual representation of the internal graph engine.

Under the hood, the system operates using a functional graph-based model.

## Core Concepts

* Nodes represent architectural elements.
* Edges represent valid relationships between elements.
* The graph is immutable and updated via pure functions.

## Responsibilities

* Render nodes visually.
* Render edges.
* Allow connecting nodes.
* Prevent invalid connections.
* Reflect real-time validation state.

The canvas does not contain business rules.

All logic is delegated to the core graph engine.

---

# 4. Right Sidebar – Node Inspector

The Right Sidebar is the configuration panel for the selected node.

When a user selects a node on the canvas, this panel displays its editable properties.

## Responsibilities

* Edit node name.
* Edit layer-specific metadata.
* Configure annotations or modifiers.
* Display validation warnings specific to that node.

## Behavior

Any change in the inspector:

* Triggers a graph update.
* Re-runs validation rules.
* Updates feedback in the footer.

The inspector modifies state through the graph engine only.

---

# 5. Footer – Validation & Feedback Engine

The Footer displays architectural feedback.

This is where BackArch differentiates itself from simple diagram tools.

## Responsibilities

* Display validation errors.
* Display architectural warnings.
* Allow ignoring specific warnings.
* Show overall architecture health status.

## Validation Examples

* Endpoint connected directly to Repository.
* Missing Service layer.
* Circular dependency detected.
* Multiple data sources without abstraction.

## Behavior

The footer updates in real-time based on graph changes.

Users can:

* Click a warning to highlight the affected nodes.
* Ignore warnings explicitly.
* Resolve issues by modifying the graph.

---

# What the Application Does When Fully Implemented

When BackArch is fully implemented, the application will:

1. Allow users to visually design a backend architecture.
2. Dynamically enforce best practices based on selected architecture style.
3. Prevent invalid structural relationships.
4. Offer actionable feedback to improve design quality.
5. Generate a base project structure matching the designed architecture.

## Full Flow

1. User selects stack and architecture in the header.
2. User drags components from the left sidebar to the canvas.
3. User connects components to model flow and dependencies.
4. The graph engine validates the architecture in real time.
5. The footer displays warnings or errors.
6. The user configures nodes via the right sidebar.
7. Once valid, the user generates the project.

---

# Project Generation (Final Output)

When generation is triggered:

* A structured folder hierarchy is created.
* Layers follow the selected architectural style.
* Boilerplate files are generated.
* Dependency configuration matches the selected stack.

BackArch does not generate business logic.

It generates a clean, architecturally sound foundation.

---

# Design Philosophy

BackArch is built on these principles:

* Architecture first.
* Stack-aware but core-agnostic.
* Functional graph engine.
* Separation between UI and domain logic.
* Validation-driven design.

---

# Long-Term Vision

Future expansions may include:

* Multiple stack support (Node, .NET, Python).
* Code preview before generation.
* Plugin system for custom architectural rules.
* Export to different formats.
* Team collaboration mode.

BackArch aims to become a professional tool for backend architectural modeling, especially useful for:

* Developers learning backend architecture.
* Teams standardizing architectural practices.
* Rapid prototyping of backend systems.
