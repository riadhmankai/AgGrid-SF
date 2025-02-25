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

    renderedCallback() {
        if (this.initialized) {
            return;
        }

        Promise.all([
            loadStyle(this, agGridResource + '/styles/ag-grid.css'),
            loadStyle(this, agGridResource + '/styles/ag-theme-alpine.css'),
            loadScript(this, agGridResource + '/ag-grid-community.min.noStyle.js')
        ])
            .then(() => {
                this.initializeGrid();
            })
            .catch(error => {
                console.error('Error loading AG Grid resources:', error);
            });
    }

    initializeGrid() {
        if (this.initialized) {
            return;
        }

        const gridDiv = this.template.querySelector('.ag-grid-container');
        if (!gridDiv) {
            console.error('Grid container element not found');
            return;
        }

        const agGrid = window.agGrid;
        if (!agGrid) {
            console.error('AG Grid library not loaded');
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
            agGrid.createGrid(gridDiv, gridOptions);
            this.initialized = true;
        } catch (error) {
            console.error('Error creating grid:', error);
        }
    }

    // Example method to update data
    updateGridData(newData) {
        if (this.gridApi) {
            this.gridApi.setRowData(newData);
        }
    }
}
