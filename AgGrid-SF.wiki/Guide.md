\

# AgGrid-SF Usage Guide

This guide provides a comprehensive overview of how to use the AgGridWrapper component, its features, API, and examples.

## Getting Started

Ensure you have completed the [Setup Instructions](Setup.md). Once the component is deployed, you can integrate it into your Lightning pages.

## Adding the Component to a Lightning Page

1.  Open the Lightning App Builder in Salesforce.
2.  Select or create the page where you want to add the component.
3.  Drag the `agGridWrapper` component from the "Custom" components section onto your page layout.
4.  Save and activate the page.

## Key Features

- **Modern AG Grid Implementation**: Utilizes AG Grid Community Edition, providing powerful data grid features like filtering, sorting, and pagination.
- **Theme Integration**: Implements the modern AG Grid themes (e.g., Alpine) for a visually appealing interface. CSS variables allow customization.
- **Salesforce Compatibility**: Designed for compatibility with Lightning Locker Service.
- **Dynamic Resource Loading**: Loads AG Grid resources (JS/CSS) dynamically, currently configured for CDN loading via `unpkg.com`.
- **Apex Integration**: Includes an example Apex controller (`AgGridDataController`) to fetch data for the grid.

## Component API

The `agGridWrapper` component exposes properties and potentially methods/events for interaction (though the current implementation focuses on internal setup).

_(Note: The original Component-API.md described generic potential properties like `gridOptions`, `rowData`, `columnDefs`, and methods like `refreshGrid`, `getSelectedRows`. The actual `agGridWrapper.js` currently doesn't expose these directly as `@api` properties/methods for external LWC consumption. It fetches data via `@wire` and defines columns internally. This section should be updated if the component is refactored to be more configurable via its public API.)_

### Internal Properties (Examples)

- `rowData`: Holds the data fetched from Apex.
- `columnDefs`: Defines the grid columns internally.
- `gridApi`: Reference to the AG Grid API after initialization.
- `gridColumnApi`: Reference to the AG Grid Column API.

### Events

- The component doesn't currently dispatch custom events for grid interactions like `rowSelected` or `cellClicked`, but this could be added. The `onGridReady` callback is used internally.

## Examples

*(Note: The original Examples.md showed how to *use* the wrapper if it had `@api` properties. Since the current wrapper is self-contained, these examples aren't directly applicable. The primary usage is simply placing the component on a page.)*

### Basic Usage (Placing the Component)

The main way to use the current component is simply adding it to a Lightning page as described in "Adding the Component to a Lightning Page". It will automatically attempt to load AG Grid resources and fetch data using the wired Apex method.

### Example: Internal Column Definitions

The columns are defined within `agGridWrapper.js`:

```javascript
// Inside AgGridWrapper class
columnDefs = [
  { headerName: "Account Name", field: "Name" },
  { headerName: "Account Number", field: "AccountNumber" },
  { headerName: "Owner Name", field: "OwnerName" },
  {
    headerName: "Annual Revenue",
    field: "AnnualRevenue",
    type: "numericColumn",
    valueFormatter: function (params) {
      return params.value != null ? "$" + params.value.toLocaleString() : "";
    }
  },
  { headerName: "Billing Address", field: "BillingAddress" },
  { headerName: "Phone", field: "Phone" }
];
```

### Example: Internal Data Fetching

Data is fetched using the `@wire` adapter:

```javascript
// Inside AgGridWrapper class
import getGridData from "@salesforce/apex/AgGridDataController.getGridData";

// ...

@wire(getGridData)
wiredData(result) {
  const { data, error } = result;
  if (data) {
    this.rowData = data;
    // Update grid if API is ready
    if (this.gridApi && this.gridApi.setRowData) {
      this.gridApi.setRowData(data);
    }
    this._error = undefined;
  } else if (error) {
    console.error("Error fetching data:", error);
    this._error = error;
    this.rowData = undefined;
  }
}
```

## Best Practices

- **Data Handling**: Ensure the Apex controller returns data in a format that matches the `field` properties in your `columnDefs`.
- **Performance**: For very large datasets, consider implementing server-side sorting/filtering/pagination in AG Grid, which requires significant changes to the Apex controller and grid options.
- **Customization**: Use CSS variables to override theme styles. See [Customization](Customization.md).
- **Static Resources**: For better stability and CSP management, consider using Static Resources instead of a CDN.

This guide provides a starting point for using the `agGridWrapper` component. Explore the code and AG Grid documentation for more advanced features.
