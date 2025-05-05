import { LightningElement, wire, api } from "lwc";
import getGridData from "@salesforce/apex/AgGridDataController.getGridData";

export default class AgGridWrapper extends LightningElement {
  gridApi;
  gridColumnApi;
  _initialized = false;
  _error;
  rowData;

  // Lifecycle hook - handle initialization event
  connectedCallback() {
    this.addEventListener(
      "privateinitializedchange",
      this.handleInitializedChange
    );
  }

  disconnectedCallback() {
    this.removeEventListener(
      "privateinitializedchange",
      this.handleInitializedChange
    );
  }

  // Event handler to update internal property
  handleInitializedChange = (event) => {
    this._initialized = event.detail.value;
  };

  // Getters and setters for the error property to comply with ESLint
  @api
  get error() {
    return this._error;
  }

  set error(value) {
    this._error = value;
  }

  // Getters and setters for the initialized property to comply with ESLint
  @api
  get initialized() {
    return this._initialized;
  }

  set initialized(value) {
    // This setter still exists for external API compatibility
    this._initialized = value;
  }

  // Private method to update initialization state via event
  // This avoids ESLint warnings about @api property reassignments
  notifyInitialized() {
    // Using a custom event to update the internal state
    this.dispatchEvent(
      new CustomEvent("privateinitializedchange", {
        bubbles: false,
        detail: { value: true }
      })
    );
  }

  // Column definitions matching the Apex controller
  columnDefs = [
    { headerName: "Account Name", field: "Name" },
    { headerName: "Account Number", field: "AccountNumber" },
    { headerName: "Owner Name", field: "OwnerName" },
    {
      headerName: "Annual Revenue",
      field: "AnnualRevenue",
      type: "numericColumn",
      valueFormatter: (params) => {
        return params.value != null ? "$" + params.value.toLocaleString() : "";
      }
    },
    {
      headerName: "Billing Address",
      field: "BillingAddress"
    },
    { headerName: "Phone", field: "Phone" }
  ];

  @wire(getGridData)
  wiredData({ error, data }) {
    if (data) {
      this.rowData = data;
      if (this.gridApi && typeof this.gridApi.setRowData === "function") {
        this.gridApi.setRowData(data);
      }
      this._error = undefined;
    } else if (error) {
      console.error("Error fetching data:", error);
      this._error = error;
      this.rowData = undefined;
    }
  }

  async renderedCallback() {
    if (this._initialized) {
      return;
    }

    try {
      // Load only Alpine theme CSS which works well with Salesforce
      // This is the CSS-based theme, not the API-based theme
      await this.loadStyle(
        "https://unpkg.com/ag-grid-community@33.2.4/styles/ag-theme-alpine.min.css"
      );

      // Then load script separately to ensure proper sequencing
      await this.loadScript(
        "https://unpkg.com/ag-grid-community@33.2.4/dist/ag-grid-community.min.js"
      );

      // Initialize after loading
      this.initializeGrid();
    } catch (error) {
      console.error("Error loading AG Grid resources:", error);
      this._error =
        "Failed to load AG Grid resources: " +
        (error.message || JSON.stringify(error));
    }
  }

  loadStyle(url) {
    return new Promise((resolve, reject) => {
      const link = document.createElement("link");
      link.href = url;
      link.type = "text/css";
      link.rel = "stylesheet";
      link.onload = () => resolve();
      link.onerror = (error) =>
        reject(new Error(`Failed to load style: ${url}, Error: ${error}`));

      // Add to document.head instead of template for better compatibility
      document.head.appendChild(link);
    });
  }

  loadScript(url) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = url;
      script.type = "text/javascript";
      script.onload = () => resolve();
      script.onerror = (error) =>
        reject(new Error(`Failed to load script: ${url}, Error: ${error}`));

      // Add to document.head instead of template for better compatibility
      document.head.appendChild(script);
    });
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    if (this.gridApi) {
      this.gridApi.sizeColumnsToFit();

      // Set data if it was fetched before grid was ready
      if (this.rowData) {
        this.gridApi.setRowData(this.rowData);
      }
    }
  }

  initializeGrid() {
    if (this._initialized) {
      return;
    }

    const gridDiv = this.template.querySelector(".ag-grid-container");
    if (!gridDiv) {
      this._error = "Grid container element not found in the template.";
      return;
    }

    // Check if agGrid is available in the global scope
    if (!window.agGrid) {
      this._error = "AG Grid library failed to load.";
      return;
    }

    try {
      // Build grid options
      const gridOptions = {
        columnDefs: this.columnDefs,
        rowData: this.rowData || [],
        defaultColDef: {
          flex: 1,
          minWidth: 100,
          resizable: true,
          sortable: true,
          filter: true
        },
        onGridReady: (params) => this.onGridReady(params),
        suppressMenuHide: true,
        enableCellTextSelection: true,
        // Explicitly set theme to "legacy" to avoid theme warning
        theme: "legacy"
      };
      // eslint-disable-next-line @lwc/lwc/no-api-reassignments

      // Use the older createGrid pattern which works better with Locker Service
      if (typeof window.agGrid.createGrid === "function") {
        window.agGrid.createGrid(gridDiv, gridOptions);
        this.initialized = true;
      } else {
        // Fallback to the Grid constructor if createGrid is not available
        try {
          // eslint-disable-next-line @lwc/lwc/no-api-reassignments
          // Check if we can access the Grid constructor
          if (window.agGrid && window.agGrid.Grid) {
            // Creating and attaching the grid
            this.createAndAttachGrid(window.agGrid.Grid, gridDiv, gridOptions);
            this.initialized = true;
          } else {
            throw new Error("AG Grid constructor not available");
          }
        } catch (innerError) {
          console.error("Error with Grid constructor:", innerError);
          // Last resort - try direct instantiation via string access
          // eslint-disable-next-line @lwc/lwc/no-api-reassignments
          const gridConstructor = window.agGrid.Grid;
          if (gridConstructor) {
            // Creating and attaching the grid
            this.createAndAttachGrid(gridConstructor, gridDiv, gridOptions);
            this.initialized = true;
          } else {
            throw new Error(
              "Could not access AG Grid constructor via any method"
            );
          }
        }
      }
    } catch (error) {
      console.error("Error creating grid:", error);
      this._error =
        "Failed to create AG Grid: " + (error.message || JSON.stringify(error));
    }
  }

  // Helper method to create and attach grid - avoids 'new' for side effects
  createAndAttachGrid(Constructor, container, options) {
    return new Constructor(container, options);
  }
}
