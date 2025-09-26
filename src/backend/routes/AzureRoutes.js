const express = require("express");
const { BlobServiceClient, StorageSharedKeyCredential, generateBlobSASQueryParameters, ContainerSASPermissions } = require("@azure/storage-blob");

const router = express.Router();

// Config - use environment variables for security
const accountName = import.meta.env.VITE_AZURE_STORAGE_ACCOUNT_NAME;
const accountKey = import.meta.env.VITE_AZURE_STORAGE_ACCOUNT_KEY;
const containerName = "files"; // change if needed

// Generate SAS Token endpoint
router.get("/get-sas", async (req, res) => {
  try {
    const sharedKey = new StorageSharedKeyCredential(accountName, accountKey);
    const blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net`,
      sharedKey
    );

    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Expiry: 30 minutes from now
    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + 30);

    // Generate SAS Token with permissions
    const sasToken = generateBlobSASQueryParameters({
      containerName,
      permissions: ContainerSASPermissions.parse("rwl"), // read, write, list
      expiresOn: expiryDate,
    }, sharedKey).toString();

    res.json({ sasUrl: `${containerClient.url}?${sasToken}` });
  } catch (err) {
    console.error("SAS generation failed:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
