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