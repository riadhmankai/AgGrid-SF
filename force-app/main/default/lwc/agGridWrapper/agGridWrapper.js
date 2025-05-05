import { LightningElement, wire, api } from "lwc";
import getGridData from "@salesforce/apex/AgGridDataController.getGridData";

export default class AgGridWrapper extends LightningElement {
  gridApi;
  gridColumnApi;
  @api initialized = false;
  @api error;
  rowData;

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
      if (this.gridApi && typeof this.gridApi.setRowData === 'function') {
        this.gridApi.setRowData(data);
      }
      this.error = undefined;
    } else if (error) {
      console.error("Error fetching data:", error);
      this.error = error;
      this.rowData = undefined;
    }
  }

  async renderedCallback() {
    if (this.initialized) {
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
      this.error = "Failed to load AG Grid resources: " + (error.message || JSON.stringify(error));
    }
  }

  loadStyle(url) {
    return new Promise((resolve, reject) => {
      const link = document.createElement("link");
      link.href = url;
      link.type = "text/css";
      link.rel = "stylesheet";
      link.onload = () => resolve();
      link.onerror = (error) => reject(new Error(`Failed to load style: ${url}, Error: ${error}`));
      
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
      script.onerror = (error) => reject(new Error(`Failed to load script: ${url}, Error: ${error}`));
      
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
    if (this.initialized) {
      return;
    }

    const gridDiv = this.template.querySelector(".ag-grid-container");
    if (!gridDiv) {
      this.error = "Grid container element not found in the template.";
      return;
    }

    // Check if agGrid is available in the global scope
    if (!window.agGrid) {
      this.error = "AG Grid library failed to load.";
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

      // Use the older createGrid pattern which works better with Locker Service
      if (typeof window.agGrid.createGrid === 'function') {
        window.agGrid.createGrid(gridDiv, gridOptions);
        this.initialized = true;
      } else {
        // Fallback to the Grid constructor if createGrid is not available
        try {
          // Check if we can access the Grid constructor
          if (window.agGrid && window.agGrid.Grid) {
            new window.agGrid.Grid(gridDiv, gridOptions);
            this.initialized = true;
          } else {
            throw new Error("AG Grid constructor not available");
          }
        } catch (innerError) {
          console.error("Error with Grid constructor:", innerError);
          // Last resort - try direct instantiation via string access
          const gridConstructor = window.agGrid["Grid"];
          if (gridConstructor) {
            new gridConstructor(gridDiv, gridOptions);
            this.initialized = true;
          } else {
            throw new Error("Could not access AG Grid constructor via any method");
          }
        }
      }
    } catch (error) {
      console.error("Error creating grid:", error);
      this.error = "Failed to create AG Grid: " + (error.message || JSON.stringify(error));
    }
  }
}
