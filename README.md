# AG Grid Integration with Salesforce LWC

I am currently working on AgGrid-SF, an open source Salesforce Lightning Web Components (LWC) wrapper of the famous JavaScript library AG Grid. It showcases how to implement AG Grid's modern Quartz theme in Salesforce while maintaining compatibility with Salesforce's Lightning Locker Service.
About AG Grid Community:
AG Grid Community is a free, open-source data grid library that supports JavaScript, TypeScript, React, Angular, Vue, now Salesforce! AG Grid Community is widely used in the financial industry. It is utilized by major financial institutions like J.P. Morgan, for building financial services and other digital experiences. AG Grid's robust features, such as advanced filtering, sorting, and customization options, make it a popular choice for managing and analyzing financial data. It delivers outstanding performance and has no third-party dependencies.

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
- Salesforce Lightning Locker Service compatibility

## Setup Instructions

1. Add the following trusted sites to your Salesforce Content Security Policy (CSP settings):

   - `https://cdn.jsdelivr.net`
   - `https://fonts.googleapis.com`
   - `https://fonts.gstatic.com`

2. Deploy the Lightning Web Component to your org:

   ```bash
   sf deploy metadata -p force-app/main/default/lwc/agGridWrapper
   ```

3. Add the `agGridWrapper` component to your Lightning page, app or home page.

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

You can customize the Grid data by updating the JavaScript file.
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

## Deploy to Salesforce

Click the button below to deploy this project to your Salesforce org.

[![Deploy to Salesforce](https://raw.githubusercontent.com/afawcett/githubsfdeploy/master/deploy.png)](https://githubsfdeploy.herokuapp.com/app/githubdeploy/riadhmankai/AgGrid%20SF)

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
