# Node.js Backend Demo

<cite>
**Referenced Files in This Document**
- [package.json](file://demo/node/01模块/package.json)
- [01_path.ts](file://demo/node/01模块/src/01_path.ts)
- [02_url.ts](file://demo/node/01模块/src/02_url.ts)
- [03_console.ts](file://demo/node/01模块/src/03_console.ts)
- [04_fs.ts](file://demo/node/01模块/src/04_fs.ts)
- [05_buffer.ts](file://demo/node/01模块/src/05_buffer.ts)
- [06_BlobAndFile.ts](file://demo/node/01模块/src/06_BlobAndFile.ts)
- [07_events.ts](file://demo/node/01模块/src/07_events.ts)
- [test.ts](file://demo/node/01模块/src/test.ts)
- [app.ts](file://demo/node/02_playground/src/app.ts)
- [loginController.ts](file://demo/node/02_playground/src/controllers/auth/loginController.ts)
- [getSmsCodeController.ts](file://demo/node/02_playground/src/controllers/auth/getSmsCodeController.ts)
- [getVerifyCodeController.ts](file://demo/node/02_playground/src/controllers/auth/getVerifyCodeController.ts)
- [checkVerifyCodeController.ts](file://demo/node/02_playground/src/controllers/auth/checkVerifyCodeController.ts)
- [addDictController.ts](file://demo/node/02_playground/src/controllers/system/dict/addDictController.ts)
- [deleteDictController.ts](file://demo/node/02_playground/src/controllers/system/dict/deleteDictController.ts)
- [nodemon.json](file://demo/node/02_playground/nodemon.json)
- [tsconfig.json](file://demo/node/02_playground/tsconfig.json)
- [package.json](file://demo/node/02_playground/package.json)
- [server.js](file://demo/网络协议/http服务/服务端/server.js)
- [app.js](file://demo/网络协议/https/app.js)
- [server.js](file://demo/网络协议/tcp/server.js)
- [server.js](file://demo/网络协议/h2/server.js)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
4. [Architecture Overview](#architecture-overview)
5. [Detailed Component Analysis](#detailed-component-analysis)
6. [Dependency Analysis](#dependency-analysis)
7. [Performance Considerations](#performance-considerations)
8. [Troubleshooting Guide](#troubleshooting-guide)
9. [Conclusion](#conclusion)
10. [Appendices](#appendices)

## Introduction
This document presents a comprehensive Node.js backend demo focused on the module system, file operations, HTTP servers, and a practical playground application. It explains how built-in modules integrate with application architecture, demonstrates asynchronous patterns, and provides guidance for both beginners and experienced developers building production-grade backend services.

## Project Structure
The demo is organized into two primary areas:
- Built-in module demos: A set of TypeScript examples showcasing path handling, URL parsing, console utilities, file system operations, buffer manipulation, Blob/File APIs, and event handling.
- Playground application: A Koa-based backend service with controllers for authentication and system dictionary management, plus development tooling for rapid iteration.

```mermaid
graph TB
subgraph "Built-in Module Demos"
M1["01_path.ts"]
M2["02_url.ts"]
M3["03_console.ts"]
M4["04_fs.ts"]
M5["05_buffer.ts"]
M6["06_BlobAndFile.ts"]
M7["07_events.ts"]
T["test.ts"]
end
subgraph "Playground Application"
APP["app.ts"]
AUTH["Auth Controllers<br/>loginController.ts<br/>getSmsCodeController.ts<br/>getVerifyCodeController.ts<br/>checkVerifyCodeController.ts"]
SYS["System Controllers<br/>addDictController.ts<br/>deleteDictController.ts"]
CFG["Development Config<br/>nodemon.json<br/>tsconfig.json"]
end
M1 --> APP
M2 --> APP
M3 --> APP
M4 --> APP
M5 --> APP
M6 --> APP
M7 --> APP
T --> APP
APP --> AUTH
APP --> SYS
CFG --> APP
```

**Diagram sources**
- [01_path.ts](file://demo/node/01模块/src/01_path.ts)
- [02_url.ts](file://demo/node/01模块/src/02_url.ts)
- [03_console.ts](file://demo/node/01modules/src/03_console.ts)
- [04_fs.ts](file://demo/node/01模块/src/04_fs.ts)
- [05_buffer.ts](file://demo/node/01模块/src/05_buffer.ts)
- [06_BlobAndFile.ts](file://demo/node/01模块/src/06_BlobAndFile.ts)
- [07_events.ts](file://demo/node/01模块/src/07_events.ts)
- [test.ts](file://demo/node/01模块/src/test.ts)
- [app.ts](file://demo/node/02_playground/src/app.ts)
- [loginController.ts](file://demo/node/02_playground/src/controllers/auth/loginController.ts)
- [getSmsCodeController.ts](file://demo/node/02_playground/src/controllers/auth/getSmsCodeController.ts)
- [getVerifyCodeController.ts](file://demo/node/02_playground/src/controllers/auth/getVerifyCodeController.ts)
- [checkVerifyCodeController.ts](file://demo/node/02_playground/src/controllers/auth/checkVerifyCodeController.ts)
- [addDictController.ts](file://demo/node/02_playground/src/controllers/system/dict/addDictController.ts)
- [deleteDictController.ts](file://demo/node/02_playground/src/controllers/system/dict/deleteDictController.ts)
- [nodemon.json](file://demo/node/02_playground/nodemon.json)
- [tsconfig.json](file://demo/node/02_playground/tsconfig.json)

**Section sources**
- [package.json](file://demo/node/01模块/package.json)
- [app.ts](file://demo/node/02_playground/src/app.ts)

## Core Components
This section introduces the core building blocks demonstrated in the Node.js backend demo:
- Path handling: Resolving, joining, normalizing, and extracting metadata from file paths.
- URL parsing: Constructing and manipulating URLs and query parameters.
- Console utilities: Logging, timing, and structured output for diagnostics.
- File system operations: Reading, writing, copying, watching, and streaming files.
- Buffer manipulation: Encoding, decoding, and transforming binary data.
- Blob and File APIs: Handling web-like binary resources in Node environments.
- Event handling: Emitting and listening to events for decoupled workflows.

These components collectively illustrate how built-in modules form the foundation of Node.js applications, enabling robust file handling, protocol support, and extensible architectures.

**Section sources**
- [01_path.ts](file://demo/node/01模块/src/01_path.ts)
- [02_url.ts](file://demo/node/01模块/src/02_url.ts)
- [03_console.ts](file://demo/node/01模块/src/03_console.ts)
- [04_fs.ts](file://demo/node/01模块/src/04_fs.ts)
- [05_buffer.ts](file://demo/node/01模块/src/05_buffer.ts)
- [06_BlobAndFile.ts](file://demo/node/01模块/src/06_BlobAndFile.ts)
- [07_events.ts](file://demo/node/01模块/src/07_events.ts)

## Architecture Overview
The playground application follows a layered architecture:
- Entry point initializes middleware, routes, and static assets.
- Controllers encapsulate business actions (authentication and system dictionary operations).
- Middleware handles body parsing, logging, and error propagation.
- Development tools (Nodemon) enable hot reload during iterative development.

```mermaid
graph TB
EP["Entry Point<br/>app.ts"] --> MW["Middleware<br/>Body Parser / Logger"]
EP --> RT["Routing Layer"]
RT --> AC["Auth Controllers"]
RT --> SC["System Controllers"]
EP --> ST["Static Assets"]
DEV["Dev Tools<br/>nodemon.json / tsconfig.json"] --> EP
```

**Diagram sources**
- [app.ts](file://demo/node/02_playground/src/app.ts)
- [loginController.ts](file://demo/node/02_playground/src/controllers/auth/loginController.ts)
- [getSmsCodeController.ts](file://demo/node/02_playground/src/controllers/auth/getSmsCodeController.ts)
- [getVerifyCodeController.ts](file://demo/node/02_playground/src/controllers/auth/getVerifyCodeController.ts)
- [checkVerifyCodeController.ts](file://demo/node/02_playground/src/controllers/auth/checkVerifyCodeController.ts)
- [addDictController.ts](file://demo/node/02_playground/src/controllers/system/dict/addDictController.ts)
- [deleteDictController.ts](file://demo/node/02_playground/src/controllers/system/dict/deleteDictController.ts)
- [nodemon.json](file://demo/node/02_playground/nodemon.json)
- [tsconfig.json](file://demo/node/02_playground/tsconfig.json)

## Detailed Component Analysis

### Path Handling
This module demonstrates path resolution, normalization, and metadata extraction. It illustrates how to construct safe file references and avoid traversal vulnerabilities by normalizing paths before use.

```mermaid
flowchart TD
Start(["Start"]) --> Resolve["Resolve absolute path"]
Resolve --> Normalize["Normalize path segments"]
Normalize --> Join["Join path components"]
Join --> Extract["Extract basename/dirname/extname"]
Extract --> End(["End"])
```

**Diagram sources**
- [01_path.ts](file://demo/node/01模块/src/01_path.ts)

**Section sources**
- [01_path.ts](file://demo/node/01模块/src/01_path.ts)

### URL Parsing
This module covers constructing and parsing URLs, including query parameters. It emphasizes safe handling of user-provided URLs and proper encoding/decoding of special characters.

```mermaid
flowchart TD
Start(["Start"]) --> Build["Build URL from components"]
Build --> Parse["Parse existing URL"]
Parse --> Query["Manipulate query parameters"]
Query --> Encode["Encode/decode special characters"]
Encode --> End(["End"])
```

**Diagram sources**
- [02_url.ts](file://demo/node/01模块/src/02_url.ts)

**Section sources**
- [02_url.ts](file://demo/node/01模块/src/02_url.ts)

### Console Utilities
Logging and diagnostics are essential for observability. This module showcases structured logging, timing metrics, and warning/error reporting patterns suitable for backend services.

```mermaid
flowchart TD
Start(["Start"]) --> LogInfo["Log informational messages"]
LogInfo --> LogWarn["Log warnings"]
LogWarn --> LogErr["Log errors"]
LogErr --> Timer["Start/stop timers"]
Timer --> End(["End"])
```

**Diagram sources**
- [03_console.ts](file://demo/node/01模块/src/03_console.ts)

**Section sources**
- [03_console.ts](file://demo/node/01模块/src/03_console.ts)

### File System Operations
This module demonstrates synchronous and asynchronous file operations, including reading, writing, copying, and streaming. It also covers watching files for changes and managing streams for efficient I/O.

```mermaid
sequenceDiagram
participant Caller as "Caller"
participant FS as "File System"
participant Stream as "Stream"
Caller->>FS : "readFile(path)"
FS-->>Caller : "content"
Caller->>FS : "copyFile(src, dest)"
Caller->>Stream : "createWriteStream(dest)"
Stream-->>Caller : "finish"
```

**Diagram sources**
- [04_fs.ts](file://demo/node/01模块/src/04_fs.ts)

**Section sources**
- [04_fs.ts](file://demo/node/01模块/src/04_fs.ts)

### Buffer Manipulation
Buffers are fundamental for handling binary data. This module covers creating, converting, slicing, and transforming buffers, along with encoding and decoding strategies.

```mermaid
flowchart TD
Start(["Start"]) --> Create["Create buffer from string/array"]
Create --> Slice["Slice buffer into parts"]
Slice --> Convert["Convert between encodings"]
Convert --> Transform["Transform data (e.g., hex/base64)"]
Transform --> End(["End"])
```

**Diagram sources**
- [05_buffer.ts](file://demo/node/01模块/src/05_buffer.ts)

**Section sources**
- [05_buffer.ts](file://demo/node/01模块/src/05_buffer.ts)

### Blob and File APIs
While primarily browser-focused, Node environments can emulate Blob and File semantics for compatibility with web-like workflows. This module demonstrates creating and manipulating these objects.

```mermaid
flowchart TD
Start(["Start"]) --> Create["Create Blob from chunks"]
Create --> Slice["Slice Blob into parts"]
Slice --> File["Create File from Blob"]
File --> End(["End"])
```

**Diagram sources**
- [06_BlobAndFile.ts](file://demo/node/01模块/src/06_BlobAndFile.ts)

**Section sources**
- [06_BlobAndFile.ts](file://demo/node/01模块/src/06_BlobAndFile.ts)

### Event Handling
Events enable decoupled communication between components. This module shows emitting and listening to custom events, useful for orchestrating workflows and plugin systems.

```mermaid
sequenceDiagram
participant Emitter as "EventEmitter"
participant Listener as "Listener"
Emitter->>Listener : "emit('event', payload)"
Listener-->>Emitter : "handle(payload)"
```

**Diagram sources**
- [07_events.ts](file://demo/node/01模块/src/07_events.ts)

**Section sources**
- [07_events.ts](file://demo/node/01模块/src/07_events.ts)

### Playground Application: Entry Point and Middleware
The application entry point initializes middleware and routes. Middleware commonly includes body parsing, CORS, logging, and error handling. Routing maps incoming requests to controller actions.

```mermaid
sequenceDiagram
participant Client as "Client"
participant App as "App (app.ts)"
participant MW as "Middleware"
participant Ctrl as "Controller"
Client->>App : "HTTP Request"
App->>MW : "Apply middleware chain"
MW-->>Ctrl : "Pass to controller"
Ctrl-->>App : "Response"
App-->>Client : "HTTP Response"
```

**Diagram sources**
- [app.ts](file://demo/node/02_playground/src/app.ts)

**Section sources**
- [app.ts](file://demo/node/02_playground/src/app.ts)

### Authentication Controllers
Controllers encapsulate business logic for authentication flows:
- Login controller: Validates credentials and issues tokens/sessions.
- SMS verification: Generates and sends SMS codes.
- Captcha verification: Generates and validates image/text-based challenges.
- Verification code checks: Confirms submitted codes against generated ones.

```mermaid
sequenceDiagram
participant Client as "Client"
participant Login as "loginController.ts"
participant SMS as "getSmsCodeController.ts"
participant VC as "getVerifyCodeController.ts"
participant CV as "checkVerifyCodeController.ts"
Client->>SMS : "GET /sms"
SMS-->>Client : "SMS code sent"
Client->>VC : "GET /verify-code"
VC-->>Client : "Image/text challenge"
Client->>CV : "POST /check-verify-code"
CV-->>Client : "Verification result"
Client->>Login : "POST /login"
Login-->>Client : "Token/session"
```

**Diagram sources**
- [loginController.ts](file://demo/node/02_playground/src/controllers/auth/loginController.ts)
- [getSmsCodeController.ts](file://demo/node/02_playground/src/controllers/auth/getSmsCodeController.ts)
- [getVerifyCodeController.ts](file://demo/node/02_playground/src/controllers/auth/getVerifyCodeController.ts)
- [checkVerifyCodeController.ts](file://demo/node/02_playground/src/controllers/auth/checkVerifyCodeController.ts)

**Section sources**
- [loginController.ts](file://demo/node/02_playground/src/controllers/auth/loginController.ts)
- [getSmsCodeController.ts](file://demo/node/02_playground/src/controllers/auth/getSmsCodeController.ts)
- [getVerifyCodeController.ts](file://demo/node/02_playground/src/controllers/auth/getVerifyCodeController.ts)
- [checkVerifyCodeController.ts](file://demo/node/02_playground/src/controllers/auth/checkVerifyCodeController.ts)

### System Dictionary Controllers
System controllers manage dictionary CRUD operations:
- Add dictionary entries.
- Delete dictionary entries.

```mermaid
sequenceDiagram
participant Client as "Client"
participant Add as "addDictController.ts"
participant Del as "deleteDictController.ts"
Client->>Add : "POST /system/dict/add"
Add-->>Client : "Created"
Client->>Del : "DELETE /system/dict/delete"
Del-->>Client : "Deleted"
```

**Diagram sources**
- [addDictController.ts](file://demo/node/02_playground/src/controllers/system/dict/addDictController.ts)
- [deleteDictController.ts](file://demo/node/02_playground/src/controllers/system/dict/deleteDictController.ts)

**Section sources**
- [addDictController.ts](file://demo/node/02_playground/src/controllers/system/dict/addDictController.ts)
- [deleteDictController.ts](file://demo/node/02_playground/src/controllers/system/dict/deleteDictController.ts)

### Development Workflow and Tooling
- Nodemon: Watches source files and restarts the server automatically on changes.
- TypeScript configuration: Ensures type safety and modern JavaScript features.

```mermaid
flowchart TD
Dev["Developer edits TS files"] --> Save["Save changes"]
Save --> Nodemon["Nodemon detects change"]
Nodemon --> Restart["Restart server process"]
Restart --> Live["Live updates in dev"]
```

**Diagram sources**
- [nodemon.json](file://demo/node/02_playground/nodemon.json)
- [tsconfig.json](file://demo/node/02_playground/tsconfig.json)

**Section sources**
- [nodemon.json](file://demo/node/02_playground/nodemon.json)
- [tsconfig.json](file://demo/node/02_playground/tsconfig.json)

## Dependency Analysis
The Node.js demos rely on built-in modules and third-party libraries for HTTP and routing. Dependencies are declared in the project’s package files.

```mermaid
graph TB
Pkg["Playground package.json"] --> Koa["@koa/router"]
Pkg --> Body["@koa/bodyparser"]
Pkg --> Static["@koa/static"]
Pkg --> TypesKoa["@types/koa"]
Pkg --> TypesRouter["@types/koa__router"]
ModPkg["Module demos package.json"] --> BuiltIns["Built-in Modules"]
```

**Diagram sources**
- [package.json](file://demo/node/02_playground/package.json)
- [package.json](file://demo/node/01模块/package.json)

**Section sources**
- [package.json](file://demo/node/02_playground/package.json)
- [package.json](file://demo/node/01模块/package.json)

## Performance Considerations
- Prefer streaming for large file uploads/downloads to reduce memory pressure.
- Use non-blocking I/O and async/await patterns to keep the event loop responsive.
- Minimize synchronous operations in hot paths; leverage buffering and chunked processing.
- Apply compression and caching strategies for static assets and repeated responses.
- Monitor CPU and memory usage during development and load testing.

## Troubleshooting Guide
Common issues and remedies:
- Path traversal and invalid paths: Always normalize and validate paths before file operations.
- Encoding problems with Buffers and Streams: Ensure consistent encoding (UTF-8, base64, hex) across boundaries.
- Asynchronous pitfalls: Avoid mixing sync and async APIs in the same call stack; handle errors via try/catch and centralized error handlers.
- Hot reload not triggering: Verify Nodemon configuration and watch patterns; ensure TypeScript emits JS artifacts.
- Middleware ordering: Place body parser before route handlers; place error handlers last.

**Section sources**
- [04_fs.ts](file://demo/node/01模块/src/04_fs.ts)
- [05_buffer.ts](file://demo/node/01模块/src/05_buffer.ts)
- [07_events.ts](file://demo/node/01模块/src/07_events.ts)
- [nodemon.json](file://demo/node/02_playground/nodemon.json)

## Conclusion
The Node.js backend demo demonstrates how built-in modules underpin real-world applications. By combining path handling, URL parsing, console utilities, file system operations, buffer manipulation, Blob/File APIs, and event handling, developers can build robust, maintainable backend services. The playground application further illustrates modular controllers, middleware, and development workflows suitable for production-grade systems.

## Appendices
- Related network protocol examples: HTTP server, HTTPS app, TCP server, and HTTP/2 server implementations are available for reference and experimentation.

**Section sources**
- [server.js](file://demo/网络协议/http服务/服务端/server.js)
- [app.js](file://demo/网络协议/https/app.js)
- [server.js](file://demo/网络协议/tcp/server.js)
- [server.js](file://demo/网络协议/h2/server.js)