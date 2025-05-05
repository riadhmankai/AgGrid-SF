import { LightningElement, wire, api } from "lwc";
import getGridData from "@salesforce/apex/AgGridDataController.getGridData";

export default class AgGridWrapper extends LightningElement {
  gridApi;
  gridColumnApi;
  _initialized = false;
  _error;
  rowData;

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
    this._initialized = value;
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
      valueFormatter: function(params) {
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
  wiredData(result) {
    const { data, error } = result;
    if (data) {
      this.rowData = data;
      // Only set row data if grid is initialized and API is available
      if (this.gridApi && this.gridApi.setRowData) {
        try {
          this.gridApi.setRowData(data);
        } catch (e) {
          console.error("Error setting row data:", e);
          this._error = "Error setting row data: " + e.message;
        }
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
      // First load the base CSS required by AG Grid
      await this.loadStyle(
        "https://unpkg.com/ag-grid-community@33.2.4/styles/ag-grid.min.css"
      );
      
      // Then load the theme CSS
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
      this._error = "Failed to load AG Grid resources: " + (error.message || JSON.stringify(error));
    }
  }

  loadStyle(url) {
    return new Promise(function(resolve, reject) {
      // Check if the stylesheet is already loaded
      const existingLink = document.querySelector(`link[href="${url}"]`);
      if (existingLink) {
        resolve(); // Already loaded
        return;
      }
      
      const link = document.createElement("link");
      link.href = url;
      link.type = "text/css";
      link.rel = "stylesheet";
      link.crossOrigin = "anonymous"; // Add cross-origin attribute
      
      link.onload = function() { 
        resolve(); 
      };
      
      link.onerror = function(error) {
        console.error("Failed to load style:", url, error);
        reject(new Error("Failed to load style: " + url));
      };
      
      document.head.appendChild(link);
    });
  }

  loadScript(url) {
    return new Promise(function(resolve, reject) {
      // Check if the script is already loaded
      if (window.agGrid) {
        resolve(); // AG Grid is already available
        return;
      }
      
      const script = document.createElement("script");
      script.src = url;
      script.type = "text/javascript";
      script.crossOrigin = "anonymous"; // Add cross-origin attribute
      
      script.onload = function() { 
        resolve(); 
      };
      
      script.onerror = function(error) {
        console.error("Failed to load script:", url, error);
        reject(new Error("Failed to load script: " + url));
      };
      
      document.head.appendChild(script);
    });
  }

  onGridReady(params) {
    try {
      if (params && params.api) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        
        if (this.gridApi && typeof this.gridApi.setRowData === 'function') {
          this.gridApi.sizeColumnsToFit();
          
          // Set data if it was fetched before grid was ready
          if (this.rowData) {
            try {
              this.gridApi.setRowData(this.rowData);
            } catch (e) {
              console.error("Error setting row data in onGridReady:", e);
            }
          }
        } else {
          console.warn('Grid API methods not available');
        }
      } else {
        console.warn('Invalid grid ready params:', params);
      }
    } catch(e) {
      console.error("Error in onGridReady:", e);
      this._error = "Error initializing grid: " + e.message;
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
      // Define a handler for onGridReady that binds to this context
      const onGridReadyHandler = this.onGridReady.bind(this);

      // Build grid options with additional browser compatibility settings
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
        onGridReady: onGridReadyHandler,
        suppressMenuHide: true,
        enableCellTextSelection: true,
        // Set theme back to "legacy" as required by AG Grid
        theme: "legacy",
        // Improve Firefox/Safari compatibility
        suppressBrowserResizeObserver: true,
        // Prevent cookie issues by disabling localStorage/cookies for grid state
        suppressPersistence: true
      };

      // Use the older createGrid pattern which works better with Locker Service
      if (typeof window.agGrid.createGrid === 'function') {
        const grid = window.agGrid.createGrid(gridDiv, gridOptions);
        
        // Ensure we have a valid gridApi reference
        if (grid && grid.api) {
          this.gridApi = grid.api;
          this.gridColumnApi = grid.columnApi;
        }
        
        this._initialized = true;
      } else {
        // Fallback to the Grid constructor if createGrid is not available
        try {
          if (window.agGrid && window.agGrid.Grid) {
            const grid = this.createAndAttachGrid(window.agGrid.Grid, gridDiv, gridOptions);
            if (grid && grid.api) {
              this.gridApi = grid.api;
              this.gridColumnApi = grid.columnApi;
            }
            this._initialized = true;
          } else {
            throw new Error("AG Grid constructor not available");
          }
        } catch (innerError) {
          console.error("Error with Grid constructor:", innerError);
          const gridConstructor = window.agGrid.Grid;
          if (gridConstructor) {
            const grid = this.createAndAttachGrid(gridConstructor, gridDiv, gridOptions);
            if (grid && grid.api) {
              this.gridApi = grid.api;
              this.gridColumnApi = grid.columnApi;
            }
            this._initialized = true;
          } else {
            throw new Error("Could not access AG Grid constructor via any method");
          }
        }
      }
    } catch (error) {
      console.error("Error creating grid:", error);
      this._error = "Failed to create AG Grid: " + (error.message || JSON.stringify(error));
    }
  }
  
  createAndAttachGrid(Constructor, container, options) {
    const grid = new Constructor(container, options);
    return grid;
  }
}
