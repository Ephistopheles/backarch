<div
  class="export-wrapper"
  style="
    width: 1440px;
    min-height: 812px;
    position: relative;
    font-family: var(--font-family-body);
    background-color: var(--background);
  "
>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@100;200;300;400;500;600;700;800;900&family=Geist:wght@100;200;300;400;500;600;700;800;900&family=IBM+Plex+Mono:wght@100;200;300;400;500;600;700&family=IBM+Plex+Sans:wght@100;200;300;400;500;600;700&family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Nunito:wght@200;300;400;500;600;700;800;900&family=PT+Serif:wght@400;700&family=Roboto+Slab:wght@100;200;300;400;500;600;700;800;900&family=Roboto:wght@100;300;400;500;700;900&family=Shantell+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
    rel="stylesheet"
  />
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=1440, initial-scale=1.0" />
      <title>BackArch</title>
      <style id="global-styles">
        :root {
          --background: #ffffff;
          --foreground: #0f172a;
          --border: #e2e8f0;
          --input: #f1f5f9;
          --primary: #0f172a;
          --primary-foreground: #ffffff;
          --secondary: #f8fafc;
          --secondary-foreground: #64748b;
          --muted: #f1f5f9;
          --muted-foreground: #64748b;
          --accent: #f1f5f9;
          --accent-foreground: #0f172a;
          --destructive: #ef4444;
          --destructive-foreground: #ffffff;
          --warning: #f59e0b;
          --warning-foreground: #ffffff;
          --card: #ffffff;
          --card-foreground: #0f172a;
          --sidebar: #f8fafc;
          --sidebar-foreground: #334155;
          --radius-sm: 4px;
          --radius-md: 6px;
          --radius-lg: 8px;
          --radius-xl: 12px;
          --font-family-body: "Inter", sans-serif;
        }

        * {
          box-sizing: border-box;
        }

        .export-wrapper {
          margin: 0;
          padding: 0;
          font-family: var(--font-family-body);
          background-color: var(--background);
          color: var(--foreground);
          height: 100vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        /* Utility */
        .flex-center {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      </style>

      <style id="layout-styles">
        .app-header {
          height: 56px;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
          background-color: var(--background);
          z-index: 10;
        }

        .logo-area {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 600;
          font-size: 16px;
        }

        .version-control {
          display: flex;
          align-items: center;
          gap: 8px;
          background-color: var(--secondary);
          padding: 6px 12px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border);
          font-size: 13px;
          font-weight: 500;
          color: var(--foreground);
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .btn-primary {
          background-color: var(--primary);
          color: var(--primary-foreground);
          padding: 8px 16px;
          border-radius: var(--radius-md);
          font-size: 13px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .main-workspace {
          display: flex;
          flex: 1;
          overflow: hidden;
        }

        .sidebar-left {
          width: 260px;
          background-color: var(--sidebar);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
        }

        .sidebar-header {
          padding: 16px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--muted-foreground);
        }

        .component-list {
          padding: 0 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .component-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          background-color: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          font-size: 13px;
          font-weight: 500;
          color: var(--sidebar-foreground);
          cursor: grab;
        }

        .canvas-area {
          flex: 1;
          position: relative;
          background-color: #fafafa;
          background-image:
            linear-gradient(to right, #e5e7eb 1px, transparent 1px),
            linear-gradient(to bottom, #e5e7eb 1px, transparent 1px);
          background-size: 40px 40px;
          display: flex;
          flex-direction: column;
        }

        .canvas-node {
          position: absolute;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 16px;
          width: 200px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .node-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          font-weight: 600;
          font-size: 13px;
        }

        .node-content {
          font-size: 12px;
          color: var(--muted-foreground);
          line-height: 1.5;
        }

        .bottom-panel {
          height: 200px;
          background-color: var(--background);
          border-top: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          margin-top: auto;
          z-index: 5;
        }

        .panel-header {
          padding: 12px 20px;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 13px;
          font-weight: 600;
        }

        .panel-content {
          flex: 1;
          padding: 0;
          overflow-y: auto;
        }

        .log-item {
          padding: 10px 20px;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 13px;
        }

        .log-item.warning {
          background-color: #fffbeb;
        }

        .log-tag {
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .tag-warn {
          background: #fef3c7;
          color: #d97706;
        }
        .tag-info {
          background: #e0f2fe;
          color: #0284c7;
        }
      </style>
    </head>
    <body>
      <!-- Top Bar -->
      <header class="app-header">
        <div class="logo-area">
          <div
            style="
              width: 24px;
              height: 24px;
              background: var(--foreground);
              border-radius: 6px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
            "
          >
            <iconify-icon
              icon="lucide:box"
              style="font-size: 16px"
            ></iconify-icon>
          </div>
          <span>BackArch</span>
        </div>

        <div class="version-control" data-media-type="banani-button">
          <iconify-icon
            icon="lucide:layers"
            style="font-size: 14px; color: var(--muted-foreground)"
          ></iconify-icon>
          <span>Production Stack (v2.1.0)</span>
          <iconify-icon
            icon="lucide:chevron-down"
            style="
              font-size: 14px;
              color: var(--muted-foreground);
              margin-left: 4px;
            "
          ></iconify-icon>
        </div>

        <div class="header-actions">
          <div
            style="
              width: 32px;
              height: 32px;
              border-radius: 50%;
              border: 1px solid var(--border);
              overflow: hidden;
            "
          >
            <img
              src="https://storage.googleapis.com/banani-avatars/avatar%2Ffemale%2F25-35%2FEuropean%2F2"
              alt="User"
              style="width: 100%; height: 100%; object-fit: cover"
            />
          </div>
          <div class="btn-primary" data-media-type="banani-button">
            <iconify-icon
              icon="lucide:zap"
              style="font-size: 14px"
            ></iconify-icon>
            Generate
          </div>
        </div>
      </header>

      <div class="main-workspace">
        <!-- Left Sidebar -->
        <aside class="sidebar-left">
          <div class="sidebar-header">Components</div>
          <div class="component-list">
            <div class="component-item" data-media-type="banani-button">
              <div
                class="flex-center"
                style="
                  width: 24px;
                  height: 24px;
                  background: #e0f2fe;
                  border-radius: 4px;
                  color: #0284c7;
                "
              >
                <iconify-icon
                  icon="lucide:globe"
                  style="font-size: 14px"
                ></iconify-icon>
              </div>
              <span>Endpoint</span>
            </div>
            <div class="component-item" data-media-type="banani-button">
              <div
                class="flex-center"
                style="
                  width: 24px;
                  height: 24px;
                  background: #fef3c7;
                  border-radius: 4px;
                  color: #d97706;
                "
              >
                <iconify-icon
                  icon="lucide:box"
                  style="font-size: 14px"
                ></iconify-icon>
              </div>
              <span>Model</span>
            </div>
            <div class="component-item" data-media-type="banani-button">
              <div
                class="flex-center"
                style="
                  width: 24px;
                  height: 24px;
                  background: #dcfce7;
                  border-radius: 4px;
                  color: #16a34a;
                "
              >
                <iconify-icon
                  icon="lucide:cpu"
                  style="font-size: 14px"
                ></iconify-icon>
              </div>
              <span>Service</span>
            </div>
            <div class="component-item" data-media-type="banani-button">
              <div
                class="flex-center"
                style="
                  width: 24px;
                  height: 24px;
                  background: #f3e8ff;
                  border-radius: 4px;
                  color: #9333ea;
                "
              >
                <iconify-icon
                  icon="lucide:archive"
                  style="font-size: 14px"
                ></iconify-icon>
              </div>
              <span>Repository</span>
            </div>
            <div class="component-item" data-media-type="banani-button">
              <div
                class="flex-center"
                style="
                  width: 24px;
                  height: 24px;
                  background: #fee2e2;
                  border-radius: 4px;
                  color: #dc2626;
                "
              >
                <iconify-icon
                  icon="lucide:database"
                  style="font-size: 14px"
                ></iconify-icon>
              </div>
              <span>Database</span>
            </div>
          </div>
        </aside>

        <!-- Main Canvas & Bottom Panel -->
        <main class="canvas-area">
          <!-- Example Nodes on Canvas to illustrate "Drawing" -->
          <div class="canvas-node" style="top: 80px; left: 120px">
            <div class="node-header">
              <div
                class="flex-center"
                style="
                  width: 20px;
                  height: 20px;
                  background: #e0f2fe;
                  border-radius: 4px;
                  color: #0284c7;
                "
              >
                <iconify-icon
                  icon="lucide:globe"
                  style="font-size: 12px"
                ></iconify-icon>
              </div>
              <span>GET /users</span>
            </div>
            <div class="node-content">
              Returns list of active users.
              <div style="margin-top: 8px; color: #94a3b8; font-size: 11px">
                Auth: Bearer Token
              </div>
            </div>
          </div>

          <div class="canvas-node" style="top: 80px; left: 400px">
            <div class="node-header">
              <div
                class="flex-center"
                style="
                  width: 20px;
                  height: 20px;
                  background: #dcfce7;
                  border-radius: 4px;
                  color: #16a34a;
                "
              >
                <iconify-icon
                  icon="lucide:cpu"
                  style="font-size: 12px"
                ></iconify-icon>
              </div>
              <span>UserService</span>
            </div>
            <div class="node-content">
              Handles business logic for user management.
            </div>
          </div>

          <!-- Connecting Line Simulation (SVG) -->
          <svg
            style="
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              pointer-events: none;
              z-index: 0;
            "
          >
            <path
              d="M 322 130 L 400 130"
              stroke="#cbd5e1"
              stroke-width="2"
              fill="none"
              stroke-dasharray="4 4"
              marker-end="url(#arrow)"
            ></path>
            <defs>
              <marker
                id="arrow"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <path d="M0,0 L0,6 L9,3 z" fill="#cbd5e1"></path>
              </marker>
            </defs>
          </svg>

          <!-- Bottom Validation Panel -->
          <footer class="bottom-panel">
            <div class="panel-header">
              <iconify-icon
                icon="lucide:alert-circle"
                style="font-size: 16px; color: var(--muted-foreground)"
              ></iconify-icon>
              Validation &amp; Feedback
              <div
                style="
                  background: var(--muted);
                  padding: 2px 8px;
                  border-radius: 12px;
                  font-size: 11px;
                  margin-left: auto;
                "
              >
                3 Issues Found
              </div>
            </div>
            <div class="panel-content">
              <div class="log-item warning" data-media-type="banani-button">
                <iconify-icon
                  icon="lucide:alert-triangle"
                  style="font-size: 16px; color: #d97706"
                ></iconify-icon>
                <div style="flex: 1">
                  UserService is missing a repository connection.
                </div>
                <span class="log-tag tag-warn">Warning</span>
              </div>
              <div class="log-item" data-media-type="banani-button">
                <iconify-icon
                  icon="lucide:info"
                  style="font-size: 16px; color: #0284c7"
                ></iconify-icon>
                <div style="flex: 1">
                  Consider adding caching to GET /users for better performance.
                </div>
                <span class="log-tag tag-info">Suggestion</span>
              </div>
              <div class="log-item" data-media-type="banani-button">
                <iconify-icon
                  icon="lucide:info"
                  style="font-size: 16px; color: #0284c7"
                ></iconify-icon>
                <div style="flex: 1">
                  Database schema validated successfully.
                </div>
                <span class="log-tag tag-info">Info</span>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </body>
  </html>
  <script src="https://code.iconify.design/iconify-icon/3.0.0/iconify-icon.min.js"></script>
  <style>
    :root {
      --background: #f7f8fa;
      --foreground: #0f1724;
      --border: #00000014;
      --input: #ffffff;
      --primary: #0b74ff;
      --primary-foreground: #ffffff;
      --secondary: #f1f5f9;
      --secondary-foreground: #475569;
      --muted: #f3f4f6;
      --muted-foreground: #94a3b8;
      --success: #ecfdf5;
      --success-foreground: #0f8a5f;
      --accent: #ffb020;
      --accent-foreground: #3b2f00;
      --destructive: #fff1f2;
      --destructive-foreground: #b91c1c;
      --warning: #fffbeb;
      --warning-foreground: #7a5d00;
      --card: #ffffff;
      --card-foreground: #0f1724;
      --sidebar: #ffffff;
      --sidebar-foreground: #0f1724;
      --sidebar-primary: #0b74ff;
      --sidebar-primary-foreground: #ffffff;
      --radius-sm: 4px;
      --radius-md: 6px;
      --radius-lg: 8px;
      --radius-xl: 12px;
      --font-family-body: Inter;
    }
  </style>
</div>
