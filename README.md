# AG Grid Integration with Salesforce LWC

This project demonstrates the integration of AG Grid with Salesforce Lightning Web Components (LWC).

## Project Structure
```
force-app/
├── main/
    └── default/
        ├── staticresources/    # Contains AG Grid library files
        └── lwc/               # Contains Lightning Web Components
```

## Setup Instructions
1. Deploy the static resources to your Salesforce org
2. Deploy the Lightning Web Components to your org
3. Add the component to your Lightning page or app

## Components
- `agGrid` - Static resource containing AG Grid library
- `agGridWrapper` - LWC component that implements AG Grid functionality
