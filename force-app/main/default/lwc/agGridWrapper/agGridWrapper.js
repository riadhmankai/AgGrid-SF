import { LightningElement } from 'lwc';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import agGridResource from '@salesforce/resourceUrl/agGrid';

export default class AgGridWrapper extends LightningElement {
    gridApi;
    gridColumnApi;
    initialized = false;

    // Example column definitions
    columnDefs = [
        { field: 'name' },
        { field: 'age' },
        { field: 'country' }
    ];

    // Example row data
    rowData = [
        { name: 'John Doe', age: 30, country: 'USA' },
        { name: 'Jane Smith', age: 25, country: 'Canada' },
        { name: 'Bob Johnson', age: 35, country: 'UK' }
    ];

    async connectedCallback() {
        try {
            // Load AG Grid library and styles
            await Promise.all([
                loadScript(this, agGridResource + '/ag-grid-community.min.noStyle.js'),
                loadStyle(this, agGridResource + '/styles/ag-grid.css'),
                loadStyle(this, agGridResource + '/styles/ag-theme-alpine.css')
            ]);
            
            this.initializeGrid();
        } catch (error) {
            console.error('Error loading AG Grid resources', error);
        }
    }

    initializeGrid() {
        if (this.initialized) {
            return;
        }

        const gridDiv = this.template.querySelector('.ag-grid-container');
        const gridOptions = {
            columnDefs: this.columnDefs,
            rowData: this.rowData,
            onGridReady: (params) => {
                this.gridApi = params.api;
                this.gridColumnApi = params.columnApi;
                params.api.sizeColumnsToFit();
            }
        };

        // Initialize AG Grid
        window.agGrid.createGrid(gridDiv, gridOptions);
        this.initialized = true;
    }

    // Example method to update data
    updateGridData(newData) {
        if (this.gridApi) {
            this.gridApi.setRowData(newData);
        }
    }
}
