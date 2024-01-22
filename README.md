# Speech Portal

## Storage account CORS rule

In the Azure portal, go to the "Settings / Resource sharing (CORS)" blade. Under "Blob service", add a new CORS
rule, with the following values:
- Allowed origins: *
- Allowed methods: select all 8
- Allowed headers: *
- Exposed headers: *
- Max age: 120
Click Save to save the new rule.

## Storage account SAS token

In the Azure portal, go to the"Security + networking / Shared access signature" blade. Create a new account-level 
SAS token with the following values:
- Under "Allowed services", select "Blob".
- Under "Allowed resource types", select "Container" and "Object".
- Under "Allowed permissions", select "Read" and "List", and deselect all other permissions.
- Under "Blob versioning permissions", deselect "Enables deletion of versions".
- Under "Allowed blobindex permissions", deselect all values.
- Change the expiry date/time if desired. The default is 8 hours from the current date/time.
- Leave all other values as is and select "Generate SAS and connection string".
- Select the copy button at the end of the "Connection string" field that applies. Save this value, as it will be required when you run the portal.

## App.tsx

In App.tsx, replace the "aoai-processed" with the name of the container in the storage account that 
contains the wav audio files. Replace the "aoai-json-result-output" with the name of the container
in the storage account that contains the JSON output from the AI workflow.

    paginatedAudioRef.current = new PaginatedAudio(
      blobServiceClientRef.current,
      "aoai-processed",
      10
    );

    jsonResultOutputContainerClientRef.current =
      blobServiceClientRef.current.getContainerClient("aoai-json-result-output");

## Running the app locally

To run the app locally, from the project root directory, type "npm install" to install all dependencies, then "npm run build" to build the application, and then "npm start" to run the application.

Once the development server has started, a browser window should open to http://localhost:3000.

In the "SAS Connection String" field at the top of the page, paste in the SAS token created earlier and 
click "Connect".

The screen should load a list of the audio files in the storage account. Click the Play button on any row. This
will open a flyout with any AI-enhanced data about the recording.

## Deploying the app to Azure App Service.

In Visual Studio Code, click the Azure icon on the left toolbar. Expand the Resources treeview to the App Service
where you want the site deployed.

Right-click the App Service and select "Deploy to Web App". Click the "Deploy" button when asked to confirm.

Wait for the deployment to complete successfully. Check the Output window in Visual Studio Code to see the deployment progress.
