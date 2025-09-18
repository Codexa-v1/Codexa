import express from "express";
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  ContainerSASPermissions
} from "@azure/storage-blob";

const router = express.Router();

const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;

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

router.get("/list-user-documents", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: "Missing userId" });

    const sharedKey = new StorageSharedKeyCredential(accountName, accountKey);
    const blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net`,
      sharedKey
    );
    const containerClient = blobServiceClient.getContainerClient(containerName);

    const documents = [];

    // Assume user uploads are stored with prefix `userId/filename`
    for await (const blob of containerClient.listBlobsFlat({ prefix: `${userId}/` })) {
      // Generate SAS URL for each blob
      const expiryDate = new Date();
      expiryDate.setMinutes(expiryDate.getMinutes() + 30);

      const sasToken = generateBlobSASQueryParameters(
        {
          containerName,
          blobName: blob.name,
          permissions: ContainerSASPermissions.parse("r"), // read-only
          expiresOn: expiryDate,
        },
        sharedKey
      ).toString();

      documents.push({
        name: blob.name.split("/").pop(),
        size: blob.properties.contentLength,
        type: blob.properties.contentType,
        date: blob.properties.lastModified,
        url: `https://${accountName}.blob.core.windows.net/${containerName}/${blob.name}?${sasToken}`,
      });
    }

    res.json(documents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
