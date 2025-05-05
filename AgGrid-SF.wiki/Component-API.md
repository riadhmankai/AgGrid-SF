# Component API Documentation for AgGridWrapper

The AgGridWrapper component provides a set of public properties, methods, and events that allow developers to interact with and customize the AG Grid functionality within the Salesforce Lightning Web Component (LWC) framework.

## Public Properties

### `gridOptions`

- **Type:** Object
- **Description:** Configuration options for the AG Grid. This property allows you to set various grid options such as column definitions, row data, and other grid settings.

### `rowData`

- **Type:** Array
- **Description:** An array of data objects that represent the rows in the grid. This property is used to populate the grid with data.

### `columnDefs`

- **Type:** Array
- **Description:** An array of column definition objects that define the structure and behavior of the grid columns. Each object can specify properties such as header name, field, sortable, filterable, etc.

## Public Methods

### `refreshGrid()`

- **Description:** Refreshes the grid data and re-renders the grid. This method can be called to update the grid when the underlying data changes.

### `getSelectedRows()`

- **Description:** Returns an array of the currently selected rows in the grid. This method can be used to retrieve user selections for further processing.

### `setRowData(data: Array)`

- **Description:** Accepts an array of data objects and updates the grid with the new row data. This method is useful for dynamically changing the data displayed in the grid.

## Events

### `gridReady`

- **Description:** Fired when the grid is fully initialized and ready to be interacted with. This event can be used to perform actions after the grid is set up.

### `rowSelected`

- **Description:** Fired when a row is selected or deselected. This event can be used to handle user interactions with row selections.

### `cellClicked`

- **Description:** Fired when a cell in the grid is clicked. This event provides information about the clicked cell and can be used to trigger custom actions based on user interactions.

## Example Usage

```javascript
// Example of setting up the grid options
this.gridOptions = {
  columnDefs: this.columnDefs,
  rowData: this.rowData,
  onGridReady: this.onGridReady.bind(this),
  onRowSelected: this.onRowSelected.bind(this)
};

// Example of refreshing the grid
this.refreshGrid();
```

## Conclusion

The AgGridWrapper component provides a flexible API for integrating AG Grid within Salesforce LWC. By utilizing the public properties, methods, and events, developers can create dynamic and interactive data grids tailored to their specific needs.
