// backend/routes/AzureRoutes.js
const express = require("express");
const {
  BlobServiceClient,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  ContainerSASPermissions
} = require("@azure/storage-blob");

const router = express.Router();

// Get env vars securely
const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
const containerName = "files";

// GET SAS token
router.get("/get-sas", async (req, res) => {
  try {
    const sharedKey = new StorageSharedKeyCredential(accountName, accountKey);
    const blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net`,
      sharedKey
    );

    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Expire in 30 mins
    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + 30);

    const sasToken = generateBlobSASQueryParameters(
      {
        containerName,
        permissions: ContainerSASPermissions.parse("rwl"),
        expiresOn: expiryDate,
      },
      sharedKey
    ).toString();

    res.status(200).json({ sasUrl: `${containerClient.url}?${sasToken}` });
  } catch (err) {
    console.error("Error generating SAS:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
