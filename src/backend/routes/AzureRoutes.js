import express from "express";
import multer from "multer";
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  ContainerSASPermissions,
  BlobSASPermissions,
} from "@azure/storage-blob";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;

const containerName = "files";

// ------------------ GET SAS TOKEN ------------------
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

// ------------------ UPLOAD ------------------
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { userId, docType, eventId } = req.body;
    const file = req.file;

    if (!file || !userId || !docType || !eventId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const sharedKey = new StorageSharedKeyCredential(accountName, accountKey);
    const blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net`,
      sharedKey
    );
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Path: files/{docType}/{userId}/{eventId}/{filename}
    const blobName = `${docType}/${userId}/${eventId}/${file.originalname}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadData(file.buffer, {
      blobHTTPHeaders: { blobContentType: file.mimetype },
    });

    res.json({ message: "File uploaded successfully", path: blobName });
  } catch (err) {
    console.error("Error uploading file:", err.message);
    res.status(500).json({ error: "Error uploading file" });
  }
});

// ------------------ LIST DOCUMENTS ------------------
router.get("/list-user-documents", async (req, res) => {
  const { userId, eventId } = req.query;
  if (!userId || !eventId)
    return res.status(400).json({ error: "Missing userId or eventId" });

  const sharedKey = new StorageSharedKeyCredential(accountName, accountKey);
  const blobServiceClient = new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net`,
    sharedKey
  );
  const containerClient = blobServiceClient.getContainerClient(containerName);

  const docTypes = ["FloorPlan", "Agenda", "Budget", "VendorContract", "Photos", "Other"];
  const documents = [];

  try {
    for (const docType of docTypes) {
      // List blobs under {docType}/{userId}/{eventId}/
      for await (const blob of containerClient.listBlobsFlat({
        prefix: `${docType}/${userId}/${eventId}/`,
      })) {
        const fileName = blob.name.split("/").pop();

        // Generate SAS for this blob (read-only, expires in 30 mins)
        const sasToken = generateBlobSASQueryParameters(
          {
            containerName,
            blobName: blob.name,
            permissions: BlobSASPermissions.parse("r"),
            expiresOn: new Date(new Date().getTime() + 30 * 60 * 1000),
          },
          sharedKey
        ).toString();

        documents.push({
          name: fileName,
          type: docType,
          size: blob.properties.contentLength,
          date: blob.properties.lastModified,
          url: `https://${accountName}.blob.core.windows.net/${containerName}/${blob.name}?${sasToken}`,
        });
      }
    }

    res.json(documents);
  } catch (err) {
    console.error("Error fetching documents:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
