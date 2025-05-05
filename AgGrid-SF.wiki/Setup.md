\

# Setup Instructions for AgGrid-SF

This guide covers the prerequisites, installation steps, and Salesforce Content Security Policy (CSP) configuration required to use the AgGrid-SF component.

## Prerequisites

Before you begin the installation process, ensure you have the following:

- A Salesforce Developer Org or a Scratch Org.
- Salesforce CLI installed and authenticated to your target org.
- Git installed on your machine.
- Basic knowledge of Salesforce Lightning Web Components (LWC) and Salesforce DX project structure.

## Installation Steps

1.  **Clone the Repository**

    Start by cloning the AgGrid-SF repository to your local machine:

    ```bash
    git clone https://github.com/riadhmankai/AgGrid-SF.git
    cd AgGrid-SF
    ```

2.  **Set Up Content Security Policy (CSP)**

    Configure the necessary CSP Trusted Sites in your Salesforce org. See the [CSP Setup](#salesforce-content-security-policy-csp-setup) section below for details. This step is crucial for loading external resources required by AG Grid.

3.  **Deploy Metadata to Org**

    Deploy the `agGridWrapper` component, the `AgGridDataController` Apex class, and the CSP Trusted Site definitions to your Salesforce org using the Salesforce CLI:

    ```bash
    sf project deploy start -d force-app/main/default
    ```

    _Note: Deploying the Apex class is essential for the component to fetch data._

4.  **Add the Component to Your Lightning Page**

    After deployment, you can add the `agGridWrapper` component to any Lightning page (App, Record, or Home) using the Lightning App Builder.

5.  **Verify Installation**

    Navigate to the Lightning page where you added the component. Verify that the AG Grid is displayed and loading data (if the Apex controller is returning data).

## Salesforce Content Security Policy (CSP) Setup

To allow the LWC to load AG Grid library files and associated resources (like fonts) from the CDN, you need to configure CSP Trusted Sites in your Salesforce org.

### Steps to Configure CSP in Salesforce

1.  **Log in to Salesforce**: Access your Salesforce org with administrative privileges.
2.  **Navigate to CSP Settings**:
    - Go to **Setup**.
    - In the Quick Find box, type `CSP` and select **CSP Trusted Sites**.
3.  **Add Trusted Sites**: Click **New Trusted Site** for each required URL. The necessary sites are included in the project's metadata (`force-app/main/default/cspTrustedSites/`), but if deploying manually or verifying, ensure the following exist and are active:
    - **unpkg.com**:
      - Name: `cdn_unpkg` (or similar)
      - URL: `https://unpkg.com`
      - Context: `All`
      - Directives: Ensure `connect-src`, `script-src`, and `style-src` are enabled.
    - **Google Fonts API**:
      - Name: `google_fonts` (or similar)
      - URL: `https://fonts.googleapis.com`
      - Context: `All`
      - Directives: Ensure `style-src` is enabled.
    - **Google Static Fonts**:
      - Name: `fonts_gstatic` (or similar)
      - URL: `https://fonts.gstatic.com`
      - Context: `All`
      - Directives: Ensure `font-src` is enabled.
4.  **Verify CSP Settings**: Ensure the trusted sites are listed and active. Incorrect CSP settings are a common cause of the component failing to load or render correctly.

By following these setup steps, you will enable the necessary external resources for AG Grid to function seamlessly within your Salesforce environment.
