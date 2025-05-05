# Troubleshooting and FAQ for AgGrid-SF

This document provides solutions to common issues, answers frequently asked questions, and discusses compatibility with Salesforce Lightning Locker Service.

## Lightning Locker Compatibility

### Overview

The AgGrid-SF project aims for compatibility with Salesforce's Lightning Locker Service. Locker enhances security by isolating components and enforcing stricter JavaScript rules.

### Key Considerations & Best Practices

1.  **Locker Restrictions**: Locker Service restricts or modifies certain JavaScript behaviors (e.g., global scope access, some DOM manipulation methods). Code must adhere to these restrictions.
2.  **Resource Loading**: Loading external libraries requires careful handling.
    - **CDN**: Requires correctly configured CSP Trusted Sites. Can sometimes lead to intermittent issues due to timing or browser-specific CSP enforcement.
    - **Static Resources**: Generally more reliable within Locker Service as resources are served from the Salesforce domain (`self`). Use `lightning/platformResourceLoader`.
3.  **Component Isolation**: LWCs operate in isolated namespaces. Don't rely on global variables between components.
4.  **Event Handling**: Use standard LWC event handling (`CustomEvent`).
5.  **Testing**: Always test thoroughly in a Salesforce org (Sandbox or Scratch Org) where Locker Service is active.
6.  **Avoid `eval()`/`new Function()`**: AG Grid itself _should_ avoid these, but be mindful if adding custom cell renderers or formatters.
7.  **DOM Access**: Limit direct DOM manipulation. Prefer LWC template directives and refs where possible. AG Grid manages its own internal DOM, which is generally okay, but interactions _between_ LWC and AG Grid's DOM need care.

## Common Issues & Solutions

### 1. AG Grid Not Loading / Rendering

- **Symptoms:** Component area is blank, no grid appears.
- **Solutions:**
  - **CSP Issues:** Verify CSP Trusted Sites (`unpkg.com`, `fonts.googleapis.com`, `fonts.gstatic.com`) are correctly configured and active in Salesforce Setup. Check the browser console for CSP errors (often mentioning `script-src`, `style-src`, or `font-src`).
  - **Network Issues:** Ensure the browser can reach `unpkg.com`. Check the Network tab in browser developer tools for failed requests (404s, CORS errors).
  - **JavaScript Errors:** Check the browser console for errors during resource loading (`loadScript`, `loadStyle`) or grid initialization (`initializeGrid`, `onGridReady`).
  - **Locker Service:** Intermittent failures, especially in Firefox/Safari, might be Locker conflicts. Consider switching to Static Resources.

### 2. Data Not Displaying in the Grid

- **Symptoms:** Grid renders but shows "No Rows To Show" or is empty.
- **Solutions:**
  - **Apex Controller:** Verify the `AgGridDataController.getGridData` method is deployed, has no errors, and is returning data. Use `System.debug` or check Apex logs. Ensure the user has permission to execute the Apex class.
  - **Wire Service:** Check the browser console for errors related to the `@wire` adapter. Ensure the data format returned by Apex matches the `field` names in `columnDefs`.
  - **Grid API:** Check for errors in `onGridReady` or when `setRowData` is called. Is `this.gridApi` valid?

### 3. Styling Issues (Theme Not Applied)

- **Symptoms:** Grid appears unstyled or uses a default browser look.
- **Solutions:**
  - **CSS Loading:** Check the Network tab and console for errors loading `ag-grid.min.css` or `ag-theme-alpine.min.css`. Verify CSP allows `style-src` from `unpkg.com`.
  - **Theme Class:** Ensure the container div in `agGridWrapper.html` has the correct theme class (e.g., `class="ag-theme-alpine ..."`).
  - **CSS Conflicts:** Check if other CSS on the page is interfering with AG Grid styles.

### 4. `this.gridApi.setRowData is not a function` Error

- **Symptoms:** Error appears in the console, often when data arrives from Apex.
- **Solution:** This usually means `this.gridApi` wasn't correctly assigned during grid initialization. Ensure `onGridReady` correctly receives the `params` object and assigns `this.gridApi = params.api`. Add console logs in `onGridReady` and `initializeGrid` to trace the `gridApi` object.

### 5. Deployment Errors

- **Symptoms:** `sf project deploy start` fails.
- **Solution:** Check the command output for specific errors (e.g., missing metadata files, invalid XML, Apex compile errors). Ensure all necessary files (`.cls`, `.cls-meta.xml`, `.lwc`, `.cspTrustedSite-meta.xml`) are included and correctly formatted.

## FAQ

### What is AgGrid-SF?

An LWC wrapper for the AG Grid library, demonstrating integration within Salesforce, aiming for Locker Service compatibility.

### Why use AG Grid in Salesforce?

Provides advanced data grid features beyond standard Salesforce components (e.g., complex filtering/sorting, cell editing, grouping, pivoting).

### How is it installed?

Clone the repo, configure CSP, deploy metadata using Salesforce CLI. See [Setup](Setup.md).

### Can I customize the grid appearance?

Yes, via AG Grid theme parameters (CSS variables). See [Customization](Customization.md).

### Is it compatible with Lightning Locker Service?

It aims to be, but loading external libraries via CDN can sometimes cause issues. Using Static Resources is often more robust. See [Lightning Locker Compatibility](#lightning-locker-compatibility) above.

### How do I report bugs or contribute?

See [Contributing](Contributing.md). Use GitHub Issues.
