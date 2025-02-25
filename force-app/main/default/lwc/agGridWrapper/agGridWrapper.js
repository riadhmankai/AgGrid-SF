import { LightningElement } from "lwc";

export default class AgGridWrapper extends LightningElement {
  gridApi;
  gridColumnApi;
  initialized = false;

  // Example column definitions
  columnDefs = [{ field: "name" }, { field: "age" }, { field: "country" }];

  // Example row data
  rowData = [
    { name: "John Doe", age: 30, country: "USA" },
    { name: "Jane Smith", age: 25, country: "Canada" },
    { name: "Bob Johnson", age: 35, country: "UK" }
  ];

  async renderedCallback() {
    if (this.initialized) {
      return;
    }

    try {
      // Load AG Grid and theme from CDN in sequence
      await this.loadStyle(
        "https://cdn.jsdelivr.net/npm/ag-grid-community@33.1.1/styles/ag-grid.min.css"
      );
      await this.loadStyle(
        "https://cdn.jsdelivr.net/npm/ag-grid-community@33.1.1/styles/ag-theme-quartz.min.css"
      );
      await this.loadScript(
        "https://cdn.jsdelivr.net/npm/ag-grid-community@33.1.1/dist/ag-grid-community.min.js"
      );

      // Initialize after loading
      this.initializeGrid();
    } catch (error) {
      console.error("Error loading AG Grid:", error);
    }
  }

  loadStyle(url) {
    return new Promise((resolve, reject) => {
      const link = document.createElement("link");
      link.href = url;
      link.type = "text/css";
      link.rel = "stylesheet";
      link.onload = resolve;
      link.onerror = reject;
      document.head.appendChild(link);
    });
  }

  loadScript(url) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = url;
      script.type = "text/javascript";
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  initializeGrid() {
    if (this.initialized) {
      return;
    }

    const gridDiv = this.template.querySelector(".ag-grid-container");
    if (!gridDiv) {
      console.error("Grid container element not found");
      return;
    }

    if (!window.agGrid) {
      console.error("AG Grid library not loaded");
      return;
    }

    const gridOptions = {
      columnDefs: this.columnDefs,
      rowData: this.rowData,
      defaultColDef: {
        flex: 1,
        minWidth: 100,
        resizable: true,
        sortable: true
      },
      onGridReady: (params) => {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        if (params.api) {
          params.api.sizeColumnsToFit();
        }
      }
    };

    try {
      // Use the createGrid method which is more Locker-friendly
      window.agGrid.createGrid(gridDiv, {
        ...gridOptions,
        theme: "legacy"
      });
      this.initialized = true;
    } catch (error) {
      console.error("Error creating grid:", error);
    }
  }

  // Example method to update data
  updateGridData(newData) {
    if (this.gridApi) {
      this.gridApi.setRowData(newData);
    }
  }
}
