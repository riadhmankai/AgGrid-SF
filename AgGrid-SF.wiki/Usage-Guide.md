# Usage Guide for AgGrid-SF

Welcome to the Usage Guide for the AgGrid-SF project! This document provides a comprehensive overview of how to effectively use the AgGridWrapper component in your Salesforce Lightning applications.

## Getting Started

To begin using the AgGridWrapper component, ensure that you have completed the installation and setup as outlined in the [Installation Guide](Installation.md). Once you have the component deployed in your Salesforce org, you can start integrating it into your Lightning pages.

## Adding the Component to Your Lightning Page

1. Open the Lightning App Builder in Salesforce.
2. Select the page where you want to add the AgGridWrapper component.
3. Drag and drop the `agGridWrapper` component from the custom components section onto your page.
4. Save and activate the page.

## Basic Usage

The AgGridWrapper component is designed to be flexible and easy to use. Here’s a simple example of how to use it:

```html
<template>
  <c-ag-grid-wrapper
    grid-data="{gridData}"
    column-defs="{columnDefs}"
    onGridReady="{handleGridReady}"
  >
  </c-ag-grid-wrapper>
</template>
```

### Properties

- **grid-data**: An array of objects representing the data to be displayed in the grid.
- **column-defs**: An array defining the columns of the grid, including field names and headers.

### Example Data

```javascript
export default class MyComponent extends LightningElement {
  gridData = [
    { id: 1, name: "John Doe", age: 30 },
    { id: 2, name: "Jane Smith", age: 25 }
  ];

  columnDefs = [
    { headerName: "ID", field: "id" },
    { headerName: "Name", field: "name" },
    { headerName: "Age", field: "age" }
  ];

  handleGridReady(event) {
    // Additional logic when the grid is ready
  }
}
```

## Best Practices

- **Data Handling**: Ensure that the data passed to the grid is in the correct format. Use appropriate data types for each field.
- **Performance**: For large datasets, consider implementing pagination or lazy loading to enhance performance.
- **Customization**: Refer to the [Customization Guide](Customization.md) for tips on styling and modifying the grid's appearance.

## Conclusion

The AgGridWrapper component provides a powerful way to display and manage data within your Salesforce applications. By following this guide, you can effectively integrate and utilize the component to meet your data presentation needs. For further information, check out the other sections of the wiki, including the [Component API](Component-API.md) and [Examples](Examples.md).
