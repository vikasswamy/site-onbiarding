import { Injectable } from "@angular/core";
import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";
@Injectable({
  providedIn: "root",
})
export class FilesService {
  // Enter your storage account name
  picturesAccount = "storagesmartroute27";
  // container name
  picturesContainer = "filesupload";

  // +IMAGES
  public uploadImage(
    sas: string,
    content: Blob,
    name: string,
    handler: () => void
  ) {
    if(name.split(".")[1]!="exe"){
      this.uploadBlob(content, name, this.containerClient(sas), handler);
    }
  }

  public listImages(sas: string): Promise<string[]> {
    return this.listBlobs(this.containerClient(sas));
  }

  public downloadImage(
    sas: string,
    name: string,
    handler: (blob: Blob) => void
  ) {
    this.downloadBlob(name, this.containerClient(sas), handler);
  }

  public deleteImage(sas: string, name: string, handler: () => void) {
    this.deleteBlob(name, this.containerClient(sas), handler);
  }
  // -IMAGES

  public uploadBlob(
    content: Blob,
    name: string,
    client: ContainerClient,
    handler: () => void
  ) {
    let blockBlobClient = client.getBlockBlobClient(name);
    let type = content.type;
    if (name.indexOf('geojson') >= 0) {
      type = 'geojson';
    }
    blockBlobClient
      .uploadData(content, {
        blobHTTPHeaders: { blobContentType: type },
      })
      .then(() => handler());
  }

  private async listBlobs(client: ContainerClient): Promise<string[]> {
    let result: string[] = [];

    let blobs = client.listBlobsFlat();
    for await (const blob of blobs) {
      result.push(blob.name);
    }

    return result;
  }

  private downloadBlob(
    name: string,
    client: ContainerClient,
    handler: (blob: Blob) => void
  ) {
    const blobClient = client.getBlobClient(name);
    blobClient.download().then((resp) => {
      resp.blobBody.then((blob) => {
        handler(blob);
      });
    });
  }

  private deleteBlob(
    name: string,
    client: ContainerClient,
    handler: () => void
  ) {
    client.deleteBlob(name).then(() => {
      handler();
    });
  }

  private containerClient(sas: string): ContainerClient {
    return new BlobServiceClient(
      `https://${this.picturesAccount}.blob.core.windows.net?${sas}`
    ).getContainerClient(this.picturesContainer);
  }
}
