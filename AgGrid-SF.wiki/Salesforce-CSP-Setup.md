# Salesforce Content Security Policy (CSP) Setup

To successfully integrate the AG Grid with Salesforce Lightning Web Components (LWC), you need to configure the Content Security Policy (CSP) settings in your Salesforce org. This setup allows the use of external resources required by AG Grid.

## Steps to Configure CSP in Salesforce

1. **Log in to Salesforce**: Access your Salesforce org with the necessary administrative privileges.

2. **Navigate to CSP Settings**:

   - Go to **Setup**.
   - In the Quick Find box, type **CSP** and select **Content Security Policy**.

3. **Add Trusted Sites**: You need to add the following URLs as trusted sites to allow AG Grid resources to load properly:

   - `https://cdn.jsdelivr.net`
   - `https://unpkg.com`
   - `https://fonts.googleapis.com`
   - `https://fonts.gstatic.com`

   To add a trusted site:

   - Click on **New Trusted Site**.
   - Enter the URL in the **Trusted Site URL** field.
   - Provide a name for the trusted site.
   - Save your changes.

4. **Verify CSP Settings**: After adding the trusted sites, ensure that they are listed in your CSP settings. This verification is crucial to avoid any resource loading issues.

5. **Test the Integration**: Once the CSP settings are configured, deploy your Lightning Web Component and test the AG Grid integration to ensure that all resources are loading correctly.

By following these steps, you will enable the necessary external resources for AG Grid to function seamlessly within your Salesforce environment.
