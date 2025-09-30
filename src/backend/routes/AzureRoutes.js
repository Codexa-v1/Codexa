import express from "express";
import { BlobServiceClient, StorageSharedKeyCredential, generateBlobSASQueryParameters, ContainerSASPermissions } from "@azure/storage-blob";

const router = express.Router();

const accountName = process.env.VITE_AZURE_STORAGE_ACCOUNT_NAME;
const accountKey = process.env.VITE_AZURE_STORAGE_ACCOUNT_KEY;
const containerName = "files";

router.get("/get-sas", async (req, res) => {
  try {
    const sharedKey = new StorageSharedKeyCredential(accountName, accountKey);
    const blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net`,
      sharedKey
    );
    const containerClient = blobServiceClient.getContainerClient(containerName);

    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + 30);

    const sasToken = generateBlobSASQueryParameters({
      containerName,
      permissions: ContainerSASPermissions.parse("rwl"),
      expiresOn: expiryDate,
    }, sharedKey).toString();

    res.json({ sasUrl: `${containerClient.url}?${sasToken}` });
  } catch (err) {
    console.error("SAS generation failed:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;