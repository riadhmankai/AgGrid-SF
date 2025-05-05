# Installation Instructions for AgGrid-SF

## Prerequisites

Before you begin the installation process, ensure you have the following:

- A Salesforce Developer Org or a Scratch Org.
- Salesforce CLI installed on your machine.
- Basic knowledge of Salesforce Lightning Web Components (LWC).

## Installation Steps

1. **Clone the Repository**

   Start by cloning the AgGrid-SF repository to your local machine:

   ```bash
   git clone https://github.com/riadhmankai/AgGrid-SF.git
   cd AgGrid-SF
   ```

2. **Set Up Content Security Policy (CSP)**

   Add the following trusted sites to your Salesforce Content Security Policy (CSP) settings:

   - `https://cdn.jsdelivr.net`
   - `https://unpkg.com`
   - `https://fonts.googleapis.com`
   - `https://fonts.gstatic.com`

   This step is crucial for loading external resources required by AG Grid.

3. **Deploy the Lightning Web Component**

   Deploy the `agGridWrapper` component to your Salesforce org using the Salesforce CLI:

   ```bash
   sf deploy metadata -p force-app/main/default/lwc/agGridWrapper
   ```

4. **Add the Component to Your Lightning Page**

   After deployment, you can add the `agGridWrapper` component to your Lightning page, app, or home page through the Lightning App Builder.

5. **Verify Installation**

   Once the component is added, verify that it is functioning correctly by checking the Lightning page where you added it. Ensure that the AG Grid is displayed with the Quartz theme.

## Additional Resources

For more detailed information on features, usage, and customization, refer to the other sections of this wiki.
