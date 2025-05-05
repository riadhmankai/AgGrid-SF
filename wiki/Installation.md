# Installation

This page covers how to install the AG Grid Salesforce integration in your org.

## Prerequisites

Before installation, ensure you have:
- Salesforce CLI installed
- Access to deploy to your target Salesforce org
- CSP settings that allow loading resources from CDNs

## Deployment Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/riadhmankai/AgGrid-SF.git
   cd AgGrid-SF
   ```

2. Deploy the Lightning Web Component and the Apex class to your org:

   ```bash
   sf deploy metadata -p force-app/main/default
   ```

3. Verify CSP settings allow:
   - `https://cdn.jsdelivr.net`
   - `https://unpkg.com`
   - `https://fonts.googleapis.com`
   - `https://fonts.gstatic.com`

4. Add the `agGridWrapper` component to your Lightning page, app, or home page.