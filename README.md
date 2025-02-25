# AG Grid Integration with Salesforce LWC

This project demonstrates the integration of AG Grid with Salesforce Lightning Web Components (LWC) using CDN-based resources. It showcases how to implement AG Grid's modern Quartz theme while maintaining compatibility with Salesforce's Lightning Locker Service.

## Project Structure
```
force-app/
├── main/
    └── default/
        └── lwc/
            └── agGridWrapper/  # LWC component implementing AG Grid
                ├── agGridWrapper.html
                ├── agGridWrapper.js
                └── agGridWrapper.js-meta.xml
```

## Features
- Modern AG Grid implementation using CDN resources
- Quartz theme integration
- Lightning Locker Service compatibility
- Responsive grid layout
- Sortable and resizable columns

## Setup Instructions

1. Add the following trusted sites to your Salesforce CSP settings (Setup > Security > Content Security Policy):
   - `https://cdn.jsdelivr.net`
   - `https://fonts.googleapis.com`
   - `https://fonts.gstatic.com`

2. Deploy the Lightning Web Component to your org:
   ```bash
   sfdx force:source:deploy -p force-app/main/default/lwc/agGridWrapper
   ```

3. Add the `agGridWrapper` component to your Lightning page or app

## Implementation Details

### CDN Resources
The project uses AG Grid Community Edition v33.1.1 loaded from CDN:
- Main JS: `https://cdn.jsdelivr.net/npm/ag-grid-community@33.1.1/dist/ag-grid-community.min.js`
- Base CSS: `https://cdn.jsdelivr.net/npm/ag-grid-community@33.1.1/styles/ag-grid.min.css`
- Theme CSS: `https://cdn.jsdelivr.net/npm/ag-grid-community@33.1.1/styles/ag-theme-quartz.min.css`

### Key Features
- Dynamic resource loading
- Error handling for resource loading failures
- Grid initialization with Locker Service compatibility
- Modern Quartz theme implementation

## Customization
You can customize the grid's appearance by modifying the CSS variables in the component. For example:

```css
.ag-theme-quartz {
    --ag-foreground-color: rgb(126, 126, 126);
    --ag-background-color: #fff;
    --ag-header-foreground-color: rgb(204, 204, 204);
    --ag-header-background-color: #2d3436;
    --ag-odd-row-background-color: rgb(249, 249, 249);
}
```

## Contributing
Feel free to submit issues and enhancement requests!
