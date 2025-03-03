# Customization of AG Grid in AgGrid-SF

The AgGrid-SF project allows for extensive customization of the AG Grid component to fit your specific needs. Below are the various ways you can customize the appearance and behavior of the grid.

## Customizing Grid Data

To customize the data displayed in the grid, you can modify the JavaScript file associated with the `agGridWrapper` component. This includes changing the data source, defining columns, and setting up grid options.

## Customizing Grid Appearance

You can customize the grid's appearance by modifying the CSS variables in the component's CSS file. Here are some examples of CSS variables you can adjust:

```css
.ag-theme-quartz {
  --ag-foreground-color: rgb(126, 126, 126); /* Text color */
  --ag-background-color: #fff; /* Background color */
  --ag-header-foreground-color: rgb(204, 204, 204); /* Header text color */
  --ag-header-background-color: #2d3436; /* Header background color */
  --ag-odd-row-background-color: rgb(
    249,
    249,
    249
  ); /* Odd row background color */
}
```

## Customizing Grid Behavior

You can also customize the behavior of the grid by utilizing AG Grid's extensive API. This includes:

- **Event Handling**: Listen for events such as row clicks, cell edits, and more to implement custom logic.
- **Grid Options**: Modify grid options to enable features like filtering, sorting, and pagination according to your requirements.

## Example Customization

Here’s a simple example of how to customize the grid's data and appearance:

1. **Update the JavaScript file** to change the data source:

```javascript
this.gridOptions.api.setRowData([
  { make: "Toyota", model: "Celica", price: 35000 },
  { make: "Ford", model: "Mondeo", price: 32000 },
  { make: "Porsche", model: "Boxster", price: 72000 }
]);
```

2. **Modify the CSS** to change the grid's theme:

```css
.ag-theme-quartz {
  --ag-background-color: #f0f0f0; /* Light gray background */
}
```

By following these guidelines, you can effectively customize the AG Grid to meet your project's needs. For more advanced customization options, refer to the [AG Grid documentation](https://www.ag-grid.com/documentation/).
