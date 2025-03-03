# Examples of Using AgGrid-SF

This document provides various examples demonstrating how to implement and use the AgGrid-SF component in different scenarios. Each example includes code snippets and explanations to help you understand how to leverage the capabilities of the AgGrid-SF project effectively.

## Example 1: Basic Grid Setup

This example shows how to set up a basic AG Grid within the AgGridWrapper component.

### HTML

```html
<template>
  <div class="ag-theme-quartz" style="height: 500px; width: 100%;">
    <c-ag-grid-wrapper></c-ag-grid-wrapper>
  </div>
</template>
```

### JavaScript

```javascript
import { LightningElement } from "lwc";

export default class BasicGridExample extends LightningElement {
  // Define grid options and data here
}
```

## Example 2: Custom Column Definitions

In this example, we will define custom columns for the AG Grid.

### HTML

```html
<template>
  <div class="ag-theme-quartz" style="height: 500px; width: 100%;">
    <c-ag-grid-wrapper
      columns="{columnDefs}"
      data="{rowData}"
    ></c-ag-grid-wrapper>
  </div>
</template>
```

### JavaScript

```javascript
import { LightningElement } from "lwc";

export default class CustomColumnsExample extends LightningElement {
  columnDefs = [
    { headerName: "Make", field: "make" },
    { headerName: "Model", field: "model" },
    { headerName: "Price", field: "price" }
  ];

  rowData = [
    { make: "Toyota", model: "Celica", price: 35000 },
    { make: "Ford", model: "Mondeo", price: 32000 },
    { make: "Porsche", model: "Boxster", price: 72000 }
  ];
}
```

## Example 3: Handling Events

This example demonstrates how to handle events emitted by the AG Grid.

### HTML

```html
<template>
  <div class="ag-theme-quartz" style="height: 500px; width: 100%;">
    <c-ag-grid-wrapper
      ongridready="{handleGridReady}"
      onrowselected="{handleRowSelected}"
    ></c-ag-grid-wrapper>
  </div>
</template>
```

### JavaScript

```javascript
import { LightningElement } from "lwc";

export default class EventHandlingExample extends LightningElement {
  handleGridReady(event) {
    console.log("Grid is ready", event);
  }

  handleRowSelected(event) {
    const selectedRows = event.detail.api.getSelectedRows();
    console.log("Selected Rows:", selectedRows);
  }
}
```

## Example 4: Dynamic Data Loading

This example illustrates how to load data dynamically into the AG Grid.

### HTML

```html
<template>
  <div class="ag-theme-quartz" style="height: 500px; width: 100%;">
    <c-ag-grid-wrapper data="{dynamicRowData}"></c-ag-grid-wrapper>
  </div>
</template>
```

### JavaScript

```javascript
import { LightningElement, track } from "lwc";

export default class DynamicDataExample extends LightningElement {
  @track dynamicRowData = [];

  connectedCallback() {
    this.loadData();
  }

  loadData() {
    // Simulate an API call
    setTimeout(() => {
      this.dynamicRowData = [
        { make: "Honda", model: "Civic", price: 22000 },
        { make: "Chevrolet", model: "Malibu", price: 24000 }
      ];
    }, 1000);
  }
}
```

## Conclusion

These examples provide a starting point for implementing the AgGrid-SF component in various scenarios. Feel free to modify the code snippets to suit your specific use cases and explore the full capabilities of the AG Grid within Salesforce LWC.
