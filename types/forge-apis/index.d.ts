// Copyright (c) Autodesk, Inc. All rights reserved
//
// Permission to use, copy, modify, and distribute this software in
// object code form for any purpose and without fee is hereby granted,
// provided that the above copyright notice appears in all copies and
// that both that copyright notice and the limited warranty and
// restricted rights notice below appear in all supporting
// documentation.
//
// AUTODESK PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS.
// AUTODESK SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
// MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE.  AUTODESK, INC.
// DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
// UNINTERRUPTED OR ERROR FREE.

/// <reference types="node" />

/**
 * https://forge.autodesk.com/en/docs/oauth/v2/developers_guide/scopes
 */
export type Scope =
    | "user-profile:read"
    | "user:read"
    | "user:write"
    | "viewables:read"
    | "data:read"
    | "data:write"
    | "data:create"
    | "data:search"
    | "bucket:create"
    | "bucket:read"
    | "bucket:update"
    | "bucket:delete"
    | "code:all"
    | "account:read"
    | "account:write";

export interface ApiResponse {
    body: any;
    headers: { [header: string]: string };
    statusCode: number;
}

export interface ApiError {
    statusCode: number;
    statusMessage: string;
    statusBody: object;
}

/**
 * https://forge.autodesk.com/en/docs/oauth/v2/reference/http/authenticate-POST/#body-structure
 */
export interface Credentials {
    client_id: string;
    client_secret: string;
    grant_type: string;
    scope?: Scope | undefined;
}

/**
 * https://forge.autodesk.com/en/docs/oauth/v2/reference/http/authenticate-POST/#body-structure-200
 * https://forge.autodesk.com/en/docs/oauth/v2/reference/http/gettoken-POST/#body-structure-200
 */
export interface AuthToken {
    access_token: string;
    expires_in: number;
    token_type: string;
    refresh_token?: string | undefined;
}

export class AuthClientTwoLegged {
    constructor(clientId: string, clientSecret: string, scopes: Scope[], autoRefresh: boolean);

    authenticate(): Promise<AuthToken>;
    getCredentials(): AuthToken;
    setCredentials(
        credentials: AuthToken,
    ): void;
    isAuthorized(): boolean;
}

export class AuthClientThreeLegged {
    constructor(clientId: string, clientSecret: string, redirectUri: string, scopes: Scope[], autoRefresh: boolean);

    generateAuthUrl(
        state: string,
    ): string;

    getToken(
        code: string,
    ): Promise<AuthToken>;

    refreshToken(
        credentials: { refresh_token?: string | undefined },
        scope?: Scope[],
    ): Promise<AuthToken>;
}

export class AuthClientTwoLeggedV2 {
    constructor(clientId: string, clientSecret: string, scopes: Scope[], autoRefresh: boolean);

    authenticate(): Promise<AuthToken>;
    getCredentials(): AuthToken;
    setCredentials(
        credentials: AuthToken,
    ): void;
    isAuthorized(): boolean;
}

export class AuthClientThreeLeggedV2 {
    constructor(clientId: string, clientSecret: string, redirectUri: string, scopes: Scope[], autoRefresh: boolean);

    generateAuthUrl(
        state: string,
    ): string;

    getToken(
        code: string,
    ): Promise<AuthToken>;

    refreshToken(
        credentials: { refresh_token?: string | undefined },
        scope?: Scope[],
    ): Promise<AuthToken>;
}

export type AuthClient = AuthClientTwoLegged | AuthClientThreeLegged;

export interface PostBucketsPayloadAllow {
    authId: string;
    access: string;
}

export interface PostBucketsPayload {
    bucketKey: string;
    allow?: PostBucketsPayloadAllow[] | undefined;
    policyKey: string;
}

export class BucketsApi {
    constructor(apiClient?: any);
    /**
     * Use this endpoint to create a bucket. Buckets are arbitrary spaces created and owned by applications.
     * Bucket keys are globally unique across all regions, regardless of where they were created, and they
     * cannot be changed. The application creating the bucket is the owner of the bucket.
     */
    createBucket(
        postBuckets: PostBucketsPayload,
        opts: { xAdsRegion?: string | undefined },
        oauth2Client: AuthClient,
        credentials: AuthToken,
    ): Promise<ApiResponse>;

    /**
     * This endpoint will delete a bucket.
     */
    deleteBucket(
        bucketKey: string,
        oauth2Client: AuthClient,
        credentials: AuthToken,
    ): Promise<ApiResponse>;

    /**
     * This endpoint will return the details of a bucket.
     */
    getBucketDetails(
        bucketKey: string,
        oauth2Client: AuthClient,
        credentials: AuthToken,
    ): Promise<ApiResponse>;

    /**
     * This endpoint will return the buckets owned by the application. This endpoint supports pagination.
     */
    getBuckets(
        opts: { region?: string | undefined; limit?: number | undefined; startAt?: string | undefined },
        oauth2Client: AuthClient,
        credentials: AuthToken,
    ): Promise<ApiResponse>;
}

export interface JobPayloadInput {
    urn: string;
    compressedUrn?: boolean | undefined;
    rootFilename?: string | undefined;
}

export interface JobObjOutputPayloadAdvanced {
    exportFileStructure?: string | undefined;
    modelGuid?: string | undefined;
    objectIds?: string[] | undefined;
}

export interface JobPayloadItem {
    type: string;
    views?: string[] | undefined;
    advanced?: JobObjOutputPayloadAdvanced | undefined;
}

export interface JobPayloadOutput {
    formats: JobPayloadItem[];
}

export interface JobPayloadMisc {
    workflow?: string | undefined;
    workflowAttributes?: object | undefined;
}

export interface JobPayload {
    input: JobPayloadInput;
    output: JobPayloadOutput;
    misc?: JobPayloadMisc | undefined;
}

export interface JobSvf2OutputPayload {
    type: string;
    views?: string[] | undefined;
    advanced?: JobSvf2OutputPayloadAdvanced | undefined;
}

export type JobSvf2OutputPayloadAdvanced = JobSvfOutputPayloadAdvanced;

export interface JobSvfOutputPayload {
    type: string;
    views?: string[] | undefined;
    advanced?: JobSvfOutputPayloadAdvanced | undefined;
}

export interface JobSvfOutputPayloadAdvanced {
    conversionMethod?: string | undefined;
    buildingStoreys: string;
    spaces: string;
    openingElements: string;
    generateMasterViews: boolean;
    materialMode: string;
    hiddenObjects: boolean;
    basicMaterialProperties: boolean;
    autodeskMaterialProperties: boolean;
    timelinerProperties: boolean;
}

export class CommandsApi {
    constructor(apiClient?: any);
    /**
     * Checks if a user has permission to perform specified actions on specified resources.
     */
    checkPermission(
        projectId: string,
        body: CommandsBodyObject,
        opts: object,
        oauth2Client: AuthClient,
        credentials: AuthToken,
    ): Promise<ApiResponse>;

    /**
     * Retrieves the custom relationships between specified versions of items and other resources in the data domain service
     */
    listRefs(
        projectId: string,
        body: CommandsBodyObject,
        opts: object,
        oauth2Client: AuthClient,
        credentials: AuthToken,
    ): Promise<ApiResponse>;

    /**
     * Retrieves metadata for up to 50 specified items. For example, an item name, or the date it was created. It returns the tip (latest) version of the items.
     */
    listItems(
        projectId: string,
        body: CommandsBodyObject,
        opts: object,
        oauth2Client: AuthClient,
        credentials: AuthToken,
    ): Promise<ApiResponse>;

    /**
     * Creates folders in BIM 360 Docs.
     */
    createFolder(
        projectId: string,
        body: CommandsBodyObject,
        opts: object,
        oauth2Client: AuthClient,
        credentials: AuthToken,
    ): Promise<ApiResponse>;

    /**
     * Publishes the latest version of a Collaboration for Revit (C4R) model to BIM 360 Docs.
     */
    publishModel(
        projectId: string,
        body: CommandsBodyObject,
        opts: object,
        oauth2Client: AuthClient,
        credentials: AuthToken,
    ): Promise<ApiResponse>;

    /**
     * Verifies whether a Collaboration for Revit (C4R) model needs to be published to BIM 360 Docs.
     */
    getPublishModelJob(
        projectId: string,
        body: CommandsBodyObject,
        opts: object,
        oauth2Client: AuthClient,
        credentials: AuthToken,
    ): Promise<ApiResponse>;
}

export namespace DerivativesApi {
    enum RegionEnum {
        US = "US",
        EMEA = "EMEA",
        EU = "EMEA",
    }
}

export class DerivativesApi {
    constructor(apiClient?: any, region?: string);

    /**
     * Deletes the manifest and all its translated output files (derivatives). However, it does not delete the design source file.
     */
    deleteManifest(
        urn: string,
        oauth2Client: AuthClient,
        credentials: AuthToken,
    ): Promise<ApiResponse>;

    /**
     * Downloads a selected derivative. To download the file, you need to specify the file’s URN, which you retrieve by calling the GET {urn}/manifest endpoint.
     * Note that the Model Derivative API uses 2 types of URNs. The design URN is generated when you upload the source design file to Forge, and is used when
     * calling most of the Model Derivative endpoints. A derivative URN is generated for each translated output file format, and is used for downloading the output
     * design files. You can set the range of bytes that are returned when downloading the derivative, using the range header.
     */
    getDerivativeManifest(
        urn: string,
        derivativeUrn: string,
        opts: { range?: number | undefined; acceptEncoding?: string | undefined },
        oauth2Client: AuthClient,
        credentials: AuthToken,
    ): Promise<ApiResponse>;

    /**
     * Returns information about the specified derivative.
     */
    getDerivativeManifestInfo(
        urn: string,
        derivativeUrn: string,
        opts: any,
        oauth2Client: AuthClient,
        credentials: AuthToken,
    ): Promise<ApiResponse>;

    /**
     * Returns an up-to-date list of Forge-supported translations, that you can use to identify which types of derivatives are supported for each source file type.
     * You can set this endpoint to only return the list of supported translations if they have been updated since a specified date. See the Supported Translation
     * Formats table for more details about supported translations. Note that we are constantly adding new file formats to the list of Forge translations.
     */
    getFormats(
        opts: { ifModifiedSince?: Date | undefined; acceptEncoding?: string | undefined },
        oauth2Client: AuthClient,
        credentials: AuthToken,
    ): Promise<ApiResponse>;

    /**
     * Returns information about derivatives that correspond to a specific source file, including derviative URNs and statuses.
     * The URNs of the derivatives are used to download the generated derivatives when calling the GET {urn}/manifest/{derivativeurn}
     * endpoint. The statuses are used to verify whether the translation of requested output files is complete. Note that different
     * output files might complete their translation processes at different times, and therefore may have different `status` values.
     * When translating a source file a second time, the previously created manifest is not deleted; it appends the information
     * (only new translations) to the manifest.
     */
    getManifest(
        urn: string,
        opts: { acceptEncoding?: string | undefined },
        oauth2Client: AuthClient,
        credentials: AuthToken,
    ): Promise<ApiResponse>;

    /**
     * Returns a list of model view (metadata) IDs for a design model. The metadata ID enables end users to select an object tree
     * and properties for a specific model view. Although most design apps (e.g., Fusion and Inventor) only allow a single model
     * view (object tree and set of properties), some apps (e.g., Revit) allow users to design models with multiple model views
     * (e.g., HVAC, architecture, perspective). Note that you can only retrieve metadata from an input file that has been
     * translated into an SVF file.
     */
    getMetadata(
        urn: string,
        opts: { acceptEncoding?: string | undefined },
        oauth2Client: AuthClient,
        credentials: AuthToken,
    ): Promise<ApiResponse>;

    /**
     * Returns an object tree, i.e., a hierarchical list of objects for a model view. To call this endpoint you first need to
     * call the GET {urn}/metadata endpoint, to determine which model view (object tree and set of properties) to use. Although
     * most design apps (e.g., Fusion and Inventor) only allow a single model view, some apps (e.g., Revit) allow users to design
     * models with multiple model views (e.g., HVAC, architecture, perspective). Note that you can only retrieve metadata from an
     * input file that has been translated into an SVF file.
     */
    getModelviewMetadata(
        urn: string,
        guid: string,
        opts: {
            acceptEncoding?: string | undefined;
            xAdsForce?: boolean | undefined;
            xAdsFormat?: string | undefined;
            forceget?: boolean | undefined;
        },
        oauth2Client: AuthClient,
        credentials: AuthToken,
    ): Promise<ApiResponse>;

    /**
     * Returns a list of properties for each object in an object tree. Properties are returned according to object ID and do not
     * follow a hierarchical structure. The following image displays a typical list of properties for a Revit object: To call
     * this endpoint you need to first call the GET {urn}/metadata endpoint, which returns a list of model view (metadata) IDs
     * for a design input model. Select a model view (metadata) ID to use when calling the Get Properties endpoint. Note that
     * you can only get properties from a design input file that was previously translated into an SVF file.
     */
    getModelviewProperties(
        urn: string,
        guid: string,
        opts: {
            acceptEncoding?: string | undefined;
            xAdsForce?: boolean | undefined;
            xAdsFormat?: string | undefined;
            forceget?: boolean | undefined;
            objectid?: number | undefined;
        },
        oauth2Client: AuthClient,
        credentials: AuthToken,
    ): Promise<ApiResponse>;

    /**
     * Returns the thumbnail for the source file.
     */
    getThumbnail(
        urn: string,
        opts: { width?: number | undefined; height?: number | undefined; guid?: string | undefined },
        oauth2Client: AuthClient,
        credentials: AuthToken,
    ): Promise<ApiResponse>;

    /**
     * To create references for a composite design in Model Derivative. The description of references is stored in
     * Model Derivative. To use it with the POST job endpoint, you need to set checkReferences to true.
     */
    setReferences(
        urn: string,
        body: any,
        opts: any,
        oauth2Client: AuthClient,
        credentials: AuthToken,
    ): Promise<ApiResponse>;

    /**
     * Translate a source file from one format to another. Derivatives are stored in a manifest that is updated each time this endpoint
     * is used on a source file. Note that this endpoint is asynchronous and initiates a process that runs in the background, rather
     * than keeping an open HTTP connection until completion. Use the GET {urn}/manifest endpoint to poll for the job’s completion.
     */
    translate(
        job: JobPayload,
        opts: { xAdsForce?: boolean | undefined },
        oauth2Client: AuthClient,
        credentials: AuthToken,
    ): Promise<ApiResponse>;
}

export interface JsonApiVersionJsonapi {
    version: string;
}

export interface JsonApiLink {
    href: string;
}

export interface BaseAttributesExtensionObject {
    type: string;
    version: string;
    schema: JsonApiLink;
    data?: object | undefined;
}

export interface CreateFolderDataAttributesExtension {
    type: string;
    version: string;
    data?: object | undefined;
}

export interface CreateFolderDataAttributes {
    name: string;
    extension: BaseAttributesExtensionObject;
}

export interface CreateFolderDataRelationshipsParentData {
    type: string;
    id: string;
}

export interface CreateFolderDataRelationshipsParent {
    data: CreateFolderDataRelationshipsParentData;
}

export interface CreateFolderDataRelationships {
    parent: CreateFolderDataRelationshipsParent;
}

export interface CreateFolderData {
    type: string;
    attributes?: CreateFolderDataAttributes | undefined;
    relationships?: CreateFolderDataRelationships | undefined;
}

export interface CreateFolder {
    jsonapi?: JsonApiVersionJsonapi | undefined;
    data?: CreateFolderData | undefined;
}

export interface CreateRefDataMetaExtension {
    type: string;
    version: string;
    data?: object | undefined;
}

export interface CreateRefDataMeta {
    extension: BaseAttributesExtensionObject;
}

export interface CreateRefData {
    type: string;
    id: string;
    meta?: CreateRefDataMeta | undefined;
}

export interface CreateRef {
    jsonapi?: JsonApiVersionJsonapi | undefined;
    data?: CreateRefData | undefined;
}

export interface CommandsAttributesExtensionObject {
    type: string;
    version: string;
    data?: object | undefined;
}

export interface CommandsAttributesObject {
    extension: CommandsAttributesExtensionObject;
}

export interface CommandsRelationshipsResourceObject {
    data: object;
}

export interface CommandsRelationshipsObject {
    resources: CommandsRelationshipsResourceObject;
}

export interface CommandsBodyObject {
    jsonapi: JsonApiVersionJsonapi;
    data: CommandsBodyObjectData;
    included?: object | undefined;
}

export interface CommandsBodyObjectData {
    type: string;
    attributes: CommandsAttributesObject;
    relationships: CommandsRelationshipsObject;
}

export class FoldersApi {
    constructor(apiClient?: any);
    /**
     * Returns the folder by ID for any folder within a given project. All folders or sub-folders within a project
     * are associated with their own unique ID, including the root folder.
     */
    getFolder(
        projectId: string,
        folderId: string,
        oauth2Client: AuthClient,
        credentials: AuthToken,
    ): Promise<ApiResponse>;

    /**
     * Returns a collection of items and folders within a folder. Items represent word documents, fusion design files, drawings, spreadsheets, etc.
     */
    getFolderContents(
        projectId: string,
        folderId: string,
        opts: {
            filterType?: string[] | undefined;
            filterId?: string[] | undefined;
            filterExtensionType?: string[] | undefined;
            pageNumber?: number | undefined;
            pageLimit?: number | undefined;
        },
        oauth2Client: AuthClient,
        credentials: AuthToken,
    ): Promise<ApiResponse>;

    /**
     * Returns the parent folder (if it exists). In a project, subfolders and resource items are stored under a folder except the root folder
     * which does not have a parent of its own.
     */
    getFolderParent(
        projectId: string,
        folderId: string,
        oauth2Client: AuthClient,
        credentials: AuthToken,
    ): Promise<ApiResponse>;

    /**
     * Returns the resources (`items`, `folders`, and `versions`) which have a custom relationship with the given `folder_id`. Custom relationships
     * can be established between a folder and other resources within the 'data' domain service (folders, items, and versions).
     */
    getFolderRefs(
        projectId: string,
        folderId: string,
        opts: {
            filterType?: string[] | undefined;
            filterId?: string[] | undefined;
            filterExtensionType?: string[] | undefined;
        },
        oauth2Client: AuthClient,
        credentials: AuthToken,
    ): Promise<ApiResponse>;

    /**
     * Returns the custom relationships that are associated to the given `folder_id`. Custom relationships can be established between a folder and
     * other resources within the 'data' domain service (folders, items, and versions).
     */
    getFolderRelationshipsRefs(
        projectId: string,
        folderId: string,
        opts: {
            filterType?: string[] | undefined;
            filterId?: string[] | undefined;
            filterRefType?: string[] | undefined;
            filterDirection?: string | undefined;
            filterExtensionType?: string[] | undefined;
        },
        oauth2Client: AuthClient,
        credentials: AuthToken,
    ): Promise<ApiResponse>;

    /**
     * Creates a new folder in the `data` domain service.
     */
    postFolder(
        projectId: string,
        body: CreateFolder,
        oauth2Client: AuthClient,
        credentials: AuthToken,
    ): Promise<ApiResponse>;

    /**
     * Creates a custom relationship between a folder and another resource within the 'data' domain service (folder, item, or version).
     */
    postFolderRelationshipsRef(
        projectId: string,
        folderId: string,
        body: CreateRef,
        oauth2Client: AuthClient,
        credentials: AuthToken,
    ): Promise<ApiResponse>;
}

export class HubsApi {
    constructor(apiClient?: any);
    /**
     * Returns data on a specific `hub_id`.
     */
    getHub(
        hubId: string,
        oauth2Client: AuthClient,
        credentials: AuthToken,
    ): Promise<ApiResponse>;

    /**
     * Returns a collection of accessible hubs for this member. A Hub represents an A360 Team/Personal hub or a BIM 360 account.
     */
    getHubs(
        opts: { filterId?: string[] | undefined; filterExtensionType?: string[] | undefined },
        oauth2Client: AuthClient,
        credentials: AuthToken,
    ): Promise<ApiResponse>;
}

export interface CreateStorageDataAttributes {
    name: string;
    extension?: BaseAttributesExtensionObject | undefined;
}

export interface CreateItemDataRelationshipsTipData {
    type: string;
    id: string;
}

export interface CreateItemDataRelationshipsTip {
    data?: CreateItemDataRelationshipsTipData | undefined;
}

export interface StorageRelationshipsTargetData {
    type: string;
    id: string;
}

export interface CreateStorageDataRelationshipsTarget {
    data?: StorageRelationshipsTargetData | undefined;
}

export interface CreateItemDataRelationships {
    tip?: CreateItemDataRelationshipsTip | undefined;
    parent?: CreateStorageDataRelationshipsTarget | undefined;
}

export interface CreateItemData {
    type: string;
    attributes?: CreateStorageDataAttributes | undefined;
    relationships?: CreateItemDataRelationships | undefined;
}

export interface CreateItemRelationshipsStorageData {
    type: string;
    id: string;
}

export interface CreateItemRelationshipsStorage {
    data?: CreateItemRelationshipsStorageData | undefined;
}

export interface CreateItemRelationships {
    storage?: CreateItemRelationshipsStorage | undefined;
}

export interface CreateItemIncluded {
    type: string;
    id: string;
    attributes?: CreateStorageDataAttributes | undefined;
    relationships?: CreateItemRelationships | undefined;
}

export interface CreateItem {
    jsonapi?: JsonApiVersionJsonapi | undefined;
    data?: CreateItemData | undefined;
    included: CreateItemIncluded[];
}

export class ItemsApi {
    constructor(apiClient?: any);
    /**
     * Returns a resource item by ID for any item within a given project. Resource items represent word documents, fusion design files, drawings, spreadsheets, etc.
     */
    getItem(projectId: string, itemId: string, oauth2Client: AuthClient, credentials: AuthToken): Promise<ApiResponse>;

    /**
     * Returns the 'parent' folder for the given item.
     */
    getItemParentFolder(
        projectId: string,
        itemId: string,
        oauth2Client: AuthClient,
        credentials: AuthToken,
    ): Promise<ApiResponse>;

    /**
     * Returns the resources (`items`, `folders`, and `versions`) which have a custom relationship with the given `item_id`. Custom relationships
     * can be established between an item and other resources within the 'data' domain service (folders, items, and versions).
     */
    getItemRefs(
        projectId: string,
        itemId: string,
        opts: {
            filterType?: string[] | undefined;
            filterId?: string[] | undefined;
            filterExtensionType?: string[] | undefined;
        },
        oauth2Client: AuthClient,
        credentials: AuthToken,
    ): Promise<ApiResponse>;

    /**
     * Returns the custom relationships that are associated to the given `item_id`. Custom relationships can be established between an item and
     * other resources within the 'data' domain service (folders, items, and versions).
     */
    getItemRelationshipsRefs(
        projectId: string,
        itemId: string,
        opts: {
            filterType?: string[] | undefined;
            filterId?: string[] | undefined;
            filterRefType?: string | undefined;
            filterDirection?: string | undefined;
            filterExtensionType?: string[] | undefined;
        },
        oauth2Client: AuthClient,
        credentials: AuthToken,
    ): Promise<ApiResponse>;

    /**
     * Returns the 'tip' version for the given item. Multiple versions of a resource item can be uploaded in a project. The tip version is the most recent one.
     */
    getItemTip(
        projectId: string,
        itemId: string,
        oauth2Client: AuthClient,
        credentials: AuthToken,
    ): Promise<ApiResponse>;

    /**
     * Returns versions for the given item. Multiple versions of a resource item can be uploaded in a project.
     */
    getItemVersions(
        projectId: string,
        itemId: string,
        opts: {
            filterType?: string[] | undefined;
            filterId?: string[] | undefined;
            filterExtensionType?: string[] | undefined;
            filterVersionNumber?: number[] | undefined;
            pageNumber?: number | undefined;
            pageLimit?: number | undefined;
        },
        oauth2Client: AuthClient,
        credentials: AuthToken,
    ): Promise<ApiResponse>;

    /**
     * Creates a new item in the 'data' domain service.
     */
    postItem(
        projectId: string,
        body: CreateItem,
        oauth2Client: AuthClient,
        credentials: AuthToken,
    ): Promise<ApiResponse>;

    /**
     * Creates a custom relationship between an item and another resource within the 'data' domain service (folder, item, or version).
     */
    postItemRelationshipsRef(
        projectId: string,
        itemId: string,
        body: CreateRef,
        oauth2Client: AuthClient,
        credentials: AuthToken,
    ): Promise<ApiResponse>;
}

export interface PostBucketsSigned {
    minutesExpiration: number;
}

export interface ObjectS3Download {
    status: `complete` | `chunked` | `fallback`;
    url?: string | undefined;
    urls?: string[] | undefined;
    params?: { [key: string]: string } | undefined;
    size?: number | undefined;
    sha1?: string | undefined;
}

export interface UploadedResource {
    data: Buffer;
    objectKey: string;
    uploadKey: string;
    eTags: string[];
    progress: number;
    completed: {
        bucketKey: string;
        objectId: string;
        objectKey: string;
        size: number;
        contentType: string;
        location: string;
    };
}

export type DownloadResponseType = "arraybuffer" | "document" | "json" | "text" | "stream";

export interface DownloadedResource {
    objectKey: string;
    responseType: DownloadResponseType;
    downloadParams: { statusCode: 200 };
    downloadUrl: string;
    download: {
        status: 200;
        statusText: "OK";
    };
    data: Buffer;
    progress: number;
    error?: boolean | undefined;
}

export class ObjectsApi {
    constructor(apiClient?: any);
    /**
     * Copies an object to another object name in the same bucket.
     */
    copyTo(
        bucketKey: string,
        objectName: string,
        newObjName: string,
        oauth2Client: AuthClient,
        credentials: AuthToken,
    ): Promise<ApiResponse>;

    /**
     * This endpoint creates a signed URL that can be used to download an object within the specified expiration time. Be aware that
     * if the object the signed URL points to is deleted or expires before the signed URL expires, then the signed URL will no longer
     * be valid. A successful call to this endpoint requires bucket owner access.
     */
    createSignedResource(
        bucketKey: string,
        objectName: string,
        postBucketsSigned: PostBucketsSigned,
        opts: { access?: string | undefined },
        oauth2Client: AuthClient,
        credentials: AuthToken,
    ): Promise<ApiResponse>;

    /**
     * Deletes an object from the bucket.
     */
    deleteObject(
        bucketKey: string,
        objectName: string,
        oauth2Client: AuthClient,
        credentials: AuthToken,
    ): Promise<ApiResponse>;

    /**
     * Delete a signed URL. A successful call to this endpoint requires bucket owner access.
     */
    deleteSignedResource(
        id: string,
        region: string,
    ): Promise<ApiResponse>;

    /**
     * @deprecated Use {@link getObjects} instead.
     * Download an object.
     */
    getObject(
        bucketKey: string,
        objectName: string,
        opts: {
            range?: string | undefined;
            ifNoneMatch?: string | undefined;
            ifModifiedSince?: Date | undefined;
            acceptEncoding?: string | undefined;
        },
        oauth2Client: AuthClient,
        credentials: AuthToken,
    ): Promise<ApiResponse>;

    /**
     * Returns object details in JSON format.
     */
    getObjectDetails(
        bucketKey: string,
        objectName: string,
        opts: { ifModifiedSince?: Date | undefined; _with?: string | undefined },
        oauth2Client: AuthClient,
        credentials: AuthToken,
    ): Promise<ApiResponse>;

    /**
     * List objects in a bucket. It is only available to the bucket creator.
     */
    getObjects(
        bucketKey: string,
        opts: { limit?: number | undefined; beginsWith?: string | undefined; startAt?: string | undefined },
        oauth2Client: AuthClient,
        credentials: AuthToken,
    ): Promise<ApiResponse>;

    /**
     * @deprecated Use {@link getS3DownloadURL} or {@link getS3UploadURL} instead.
     * Download an object using a signed URL.
     */
    getSignedResource(
        id: string,
        opts: {
            range?: string | undefined;
            ifNoneMatch?: string | undefined;
            ifModifiedSince?: string | undefined;
            acceptEncoding?: string | undefined;
            region?: string | undefined;
        },
    ): Promise<ApiResponse>;

    /**
     * This endpoint returns status information about a resumable upload.
     */
    getStatusBySessionId(
        bucketKey: string,
        objectName: string,
        sessionId: string,
        oauth2Client: AuthClient,
        credentials: AuthToken,
    ): Promise<ApiResponse>;

    /**
     * @deprecated use {@link ObjectS3Upload} instead
     * This endpoint allows resumable uploads for large files in chunks.
     */
    uploadChunk(
        bucketKey: string,
        objectName: string,
        contentLength: number,
        contentRange: string,
        sessionId: string,
        body: string | Buffer,
        opts: { contentDisposition?: string | undefined; ifMatch?: string | undefined },
        oauth2Client: AuthClient,
        credentials: AuthToken,
    ): Promise<ApiResponse>;

    /**
     * @deprecated use {@link ObjectS3Upload} instead
     * Upload an object. If the specified object name already exists in the bucket, the uploaded content will
     * overwrite the existing content for the bucket name/object name combination.
     */
    uploadObject(
        bucketKey: string,
        objectName: string,
        contentLength: number,
        body: string | Buffer,
        opts: { contentDisposition?: string | undefined; ifMatch?: string | undefined },
        oauth2Client: AuthClient,
        credentials: AuthToken,
    ): Promise<ApiResponse>;

    /**
     * @deprecated use {@link ObjectS3Upload} instead
     * Overwrite a existing object using a signed URL. Conditions to call this operation: Object is available Expiration
     * period is valid Signed URL should be created with `write` or `readwrite`.
     */
    uploadSignedResource(
        id: string,
        contentLength: number,
        body: string | Buffer,
        opts: {
            contentDisposition?: string | undefined;
            xAdsRegion?: string | undefined;
            ifMatch?: string | undefined;
        },
    ): Promise<ApiResponse>;

    /**
     * @deprecated use {@link ObjectS3Upload} instead
     * Resumable upload for signed URLs.
     */
    uploadSignedResourcesChunk(
        id: string,
        contentRange: number,
        sessionId: string,
        body: string | Buffer,
        opts: {
            contentDisposition?: string | undefined;
            xAdsRegion?: string | undefined;
            ifMatch?: string | undefined;
        },
    ): Promise<ApiResponse>;

    // New S3 Stuff
    /**
     * Returns a signed S3 URL.
     * @param bucketKey bucket key (will be URL-encoded automatically)
     * @param objectKey bucobjectket key (will be URL-encoded automatically)
     * @param opts Optional parameters
     * @param opts.ifNoneMatch If the value of this header matches the ETag of the object, an entity will not be returned from the server;
     * instead a 304 (not modified) response will be returned without any message-body.
     * @param opts.ifModifiedSince If the requested object has not been modified since the time specified in this field,
     * an entity will not be returned from the server; instead, a 304 (not modified) response will be returned without any message-body.
     * @param opts.responseContentType Value of the Content-Type header that the client expects to receive.
     * If this attribute is not provided, it defaults to the value corresponding to the object.
     * @param opts.responseContentDisposition Value of the Content Disposition header the client expects to receive.
     * If this attribute is not provided, it defaults to the value corresponding to the object.
     * @param opts.responseCacheControl Value of the Cache-Control header that the client expects to receive.
     * If this attribute is not provided, it defaults to the value corresponding to the object.
     * @param [opts.publicResourceFallback=false] Allows fallback to OSS signed URLs in case of unmerged resumable uploads.
     * @param [opts.useCdn=true] Will generate a CloudFront URL for the S3 object.
     * @param [opts.minutesExpiration=2] The custom expiration time within the 1 to 60 minutes range, if not specified, default is 2 minutes.
     * data is of type: {module:model/ObjectS3Download}
     * @param oauth2client oauth2client for the call
     * @param credentials credentials for the call
     * @remark https://forge.autodesk.com/en/docs/data/v2/reference/http/buckets-:bucketKey-objects-:objectKey-signeds3download-GET/
     * @async
     */
    getS3DownloadURL(
        bucketKey: string,
        objectKey: string,
        opts: {
            ifNoneMatch?: string | undefined;
            ifModifiedSince?: Date | undefined;
            responseContentType?: string | undefined;
            responseContentDisposition?: string | undefined;
            responseCacheControl?: string | undefined;
            publicResourceFallback?: boolean | undefined;
            useCdn?: boolean | undefined;
            minutesExpiration?: number | undefined;
        },
        oauth2client: AuthClient,
        credentials: AuthToken,
    ): Promise<ObjectS3Download>;

    /**
     * Gets one or more signed URLs to objects. The signed URLs can be used to download the objects directly from S3, skipping OSS servers.
     * Be aware that expiration time for the signed URL(s) is just 60 seconds. So, a request to the URL(s) must begin within 60 seconds; the transfer
     * of the data can exceed 60 seconds.
     * A successful call to this endpoint requires bucket owner access.
     * Note that resumable uploads store each chunk individually. After upload completes, an async process merges all the chunks and creates the
     * definitive OSS file. This async process can take time. If you request an S3 download URL before the async process completes, the response returns
     * a map of S3 URLs, one per chunk where the key is the corresponding range bytes. In case you don’t want multiple URLs in the response, you can use
     * OSS signed URL functionality, with the public-resource-fallback query parameter set to true.
     * Note: While this endpoint does not support range headers, the returned URL(s) can be used for ranged downloads. This way, downloads can be
     * parallelized using multiple ranges for maximum speed.
     * @param bucketKey bucket key (will be URL-encoded automatically)
     * @param body body parameter
     * @param body.requests An array of objects representing each request to get an S3 URL to download from.
     * @param body.requests[].objectKey Object name to create a download S3 signed URL for
     * @param body.requests[].response-content-type Value of the Content-Type header that the client expects to receive.
     * If this attribute is not provided, it defaults to the value corresponding to the object.
     * @param body.requests[].response-content-disposition Value of the Content Disposition header the client expects to receive.
     * If this attribute is not provided, it defaults to the value corresponding to the object.
     * @param body.requests[].response-cache-control Value of the Cache-Control header that the client expects to receive.
     * If this attribute is not provided, it defaults to the value corresponding to the object.
     * @param body.requests[].If-None-Match The value of this attribute is compared to the ETAG of the object.
     * If they match, the response body will show the status of this item as “skipped” with the reason as “Not modified”.
     * @param body.requests[].If-Modified-Since If the requested object has not been modified since the time specified in this attribute,
     * the response body will show the status of this item as “skipped” with the reason as “Not modified”.
     * @param opts Optional parameters
     * @param [opts.publicResourceFallback=false] (public-resource-fallback) Allows fallback to OSS signed URLs in case of unmerged resumable uploads.
     * @param [opts.useCdn=true] Will generate a CloudFront URL for the S3 object.
     * @param [opts.minutesExpiration=2] The custom expiration time within the 1 to 60 minutes range, if not specified, default is 2 minutes.
     * data is of type: {Object.<module:model/ObjectS3Download>}
     * @param oauth2client oauth2client for the call
     * @param credentials credentials for the call
     * @remark https://forge.autodesk.com/en/docs/data/v2/reference/http/buckets-:bucketKey-objects-batchsigneds3download-POST/
     * @async
     */
    getS3DownloadURLs(
        bucketKey: string,
        body: {
            requests: Array<{
                objectKey: string;
                "response-content-type"?: string | undefined;
                "response-content-disposition"?: string | undefined;
                "response-cache-control"?: string | undefined;
                "If-None-Match"?: string | undefined;
                "If-Modified-Since"?: Date | undefined;
            }>;
        },
        opts: {
            publicResourceFallback?: boolean | undefined;
            useCdn?: boolean | undefined;
            minutesExpiration?: number | undefined;
        },
        oauth2client: AuthClient,
        credentials: AuthToken,
    ): Promise<any>;

    /**
     * Requests an S3 signed URL with which to upload an object, or an array of signed URLs with which to upload an object in multiple parts.
     * @param bucketKey bucket key (will be URL-encoded automatically)
     * @param objectKey object key (will be URL-encoded automatically)
     * @param opts Optional parameters
     * @param opts.uploadKey Get a new set of signed urls if the ones that were generated before have already expired and the user
     * still needs to upload some of them.
     * @param [opts.firstParts=1] For a multipart upload, is the starting index when getting upload part URL.
     * If this parameter is not specified the default value is firstPart = 1.
     * Example: To retrieve the parts from 10 to 15 you should pass firstPart = 10 and parts = 6, this will retrieve the parts 10, 11, 12, 13, 14 and 15.
     * @param [opts.parts=1] For a multipart upload, is the starting index when getting upload part URL.
     * If this parameter is not specified the default value is firstPart = 1.
     * Example: To retrieve the parts from 10 to 15 you should pass firstPart = 10 and parts = 6, this will retrieve the parts 10, 11, 12, 13, 14 and 15.
     * @param opts.useAcceleration Whether or not to generate an accelerated signed URL (ie: URLs of
     * the form …s3-accelerate.amazonaws.com… vs …s3.amazonaws.com…).
     * When not specified, defaults to true. Providing non-boolean values will result in a 400 error.
     * @param opts.minutesExpiration The custom expiration time within the 1 to 60 minutes range, if not specified, default is 2 minutes.
     * @param oauth2client oauth2client for the call
     * @param credentials credentials for the call
     * @remark https://forge.autodesk.com/en/docs/data/v2/reference/http/buckets-:bucketKey-objects-:objectKey-signeds3upload-GET/
     * @async
     */
    getS3UploadURL(
        bucketKey: string,
        objectKey: string,
        opts: {
            uploadKey?: string | undefined;
            firstParts?: number | undefined;
            parts?: number | undefined;
            useAcceleration?: boolean | undefined;
            minutesExpiration?: number | undefined;
        },
        oauth2client: AuthClient,
        credentials: AuthToken,
    ): Promise<any>;

    /**
     * Requests a batch of S3 signed URL with which to upload multiple objects or chunks of multiple objects.
     * @param bucketKey bucket key (will be URL-encoded automatically)
     * @param body body parameter
     * @param body.requests An array of objects representing each request to get an S3 URL to download from.
     * @param body.requests[].objectKey The key/name of the object for which to create an S3 upload URL. If neither the “part” nor “parts”
     * attribute is provided, OSS will return a single upload URL with which to upload the entire object.
     * @param body.requests[].uploadKey Get a new set of signed urls if the ones that were generated before have already expired and the user
     * still needs to upload some of them.
     * @param [body.requests[].firstParts=1] For a multipart upload, is the starting index when getting upload part URL.
     * If this parameter is not specified the default value is firstPart = 1.
     * Example: To retrieve the parts from 10 to 15 you should pass firstPart = 10 and parts = 6, this will retrieve the parts 10, 11, 12, 13, 14 and 15.
     * @param [body.requests[].parts=1] For a multipart upload, is the starting index when getting upload part URL.
     * If this parameter is not specified the default value is firstPart = 1.
     * Example: To retrieve the parts from 10 to 15 you should pass firstPart = 10 and parts = 6, this will retrieve the parts 10, 11, 12, 13, 14 and 15.
     * @param opts Optional parameters
     * @param [opts.useAcceleration=true] Whether or not to generate an accelerated signed URL (ie: URLs of
     * the form …s3-accelerate.amazonaws.com… vs …s3.amazonaws.com…).
     * When not specified, defaults to true. Providing non-boolean values will result in a 400 error.
     * @param [opts.minutesExpiration=2] The custom expiration time within the 1 to 60 minutes range, if not specified, default is 2 minutes.
     * @param oauth2client oauth2client for the call
     * @param credentials credentials for the call
     * @remark https://forge.autodesk.com/en/docs/data/v2/reference/http/buckets-:bucketKey-objects-:objectKey-batchsigneds3upload-POST/
     * @async
     */
    getS3UploadURLs(
        bucketKey: string,
        body: {
            requests: Array<{
                objectKey: string;
                uploadKey?: string | undefined;
                firstParts?: number | undefined;
                parts?: number | undefined;
            }>;
        },
        opts: {
            useAcceleration?: boolean | undefined;
            minutesExpiration?: number | undefined;
        },
        oauth2client: AuthClient,
        credentials: AuthToken,
    ): Promise<any>;

    /**
     * Instructs OSS to complete the object creation process after the bytes have been uploaded directly to S3.
     * @param bucketKey bucket key (will be URL-encoded automatically)
     * @param objectKey object key (will be URL-encoded automatically)
     * @param body
     * @param body.uploadKey The identifier of the upload session, which was provided by OSS in the response to the Get Upload URL/s request.
     * @param body.size The expected size of the uploaded object. If provided, OSS will check this against the blob in S3 and return
     * an error if the size does not match.
     * @param body.eTags An array of eTags. S3 returns an eTag to each upload request, be it for a chunk or an entire file.
     * For a single-part upload, this array contains the expected eTag of the entire object. For a multipart upload, this array contains the expected
     * eTag of each part of the upload; the index of an eTag in the array corresponds to its part number in the upload. If provided, OSS will validate
     * these eTags against the content in S3, and return an error if the eTags do not match (indicating some form of data corruption).
     * @param opts Optional parameters
     * @param opts.xAdsMetaContentType (x-ads-meta-Content-Type) The Content-Type value that OSS will store in the record for the uploaded object.
     * @param opts.xAdsMetaContentDisposition (x-ads-meta-Content-Disposition) The Content-Disposition value that OSS will store in the record for the uploaded object.
     * @param opts.xAdsMetaContentEncoding (x-ads-meta-Content-Encoding) The Content-Encoding value that OSS will store in the record for the uploaded object.
     * @param opts.xAdsMetaCacheControl (x-ads-meta-Cache-Control) The Cache-Control value that OSS will store in the record for the uploaded object.
     * @param oauth2client oauth2client for the call
     * @param credentials credentials for the call
     * @remark https://forge.autodesk.com/en/docs/data/v2/reference/http/buckets-:bucketKey-objects-:objectKey-signeds3upload-POST/
     * @async
     */
    completeS3Upload(
        bucketKey: string,
        objectKey: string,
        body: {
            uploadKey?: string | undefined;
            size?: number | undefined;
            eTags?: string[] | undefined;
        },
        opts: {
            xAdsMetaContentType?: string | undefined;
            xAdsMetaContentDisposition?: string | undefined;
            xAdsMetaContentEncoding?: string | undefined;
            xAdsMetaCacheControl?: string | undefined;
        },
        oauth2client: AuthClient,
        credentials: AuthToken,
    ): Promise<any>;

    /**
     * Instructs OSS to complete the object creation process for numerous objects after their bytes have been uploaded directly to S3.
     * @param bucketKey bucket key (will be URL-encoded automatically)
     * @param body body parameter
     * @param body.requests An array of objects representing each request to get an S3 URL to download from.
     * @param body.requests[].objectKey The key/name of the object for which to complete an upload.
     * @param body.requests[].uploadKey The identifier of the upload session, which was provided by OSS in the response to the Get Upload URL/s request.
     * @param body.requests[].size The expected size of the uploaded object. If provided, OSS will check this against the blob in S3 and return
     * an error if the size does not match.
     * @param body.requests[].eTags An array of eTags. S3 returns an eTag to each upload request, be it for a chunk or an entire file.
     * For a single-part upload, this array contains the expected eTag of the entire object. For a multipart upload, this array contains the expected
     * eTag of each part of the upload; the index of an eTag in the array corresponds to its part number in the upload. If provided, OSS will validate
     * these eTags against the content in S3, and return an error if the eTags do not match (indicating some form of data corruption).
     * @param body.requests[].xAdsMetaContentType (x-ads-meta-Content-Type) The Content-Type value that OSS will store in the record for the uploaded object.
     * @param body.requests[].xAdsMetaContentDisposition (x-ads-meta-Content-Disposition) The Content-Disposition value that OSS will store in the record for the uploaded object.
     * @param body.requests[].xAdsMetaContentEncoding (x-ads-meta-Content-Encoding) The Content-Encoding value that OSS will store in the record for the uploaded object.
     * @param body.requests[].xAdsMetaCacheControl (x-ads-meta-Cache-Control) The Cache-Control value that OSS will store in the record for the uploaded object.
     * @param opts Optional parameters
     * @param oauth2client oauth2client for the call
     * @param credentials credentials for the call
     * @remark https://forge.autodesk.com/en/docs/data/v2/reference/http/buckets-:bucketKey-objects-:objectKey-batchcompleteupload-POST/
     * @async
     */
    completeS3Uploads(
        bucketKey: string,
        body: {
            requests: Array<{
                objectKey: string;
                uploadKey?: string | undefined;
                size?: number | undefined;
                eTags?: string[] | undefined;
                xAdsMetaContentType?: string | undefined;
                xAdsMetaContentDisposition?: string | undefined;
                xAdsMetaContentEncoding?: string | undefined;
                xAdsMetaCacheControl?: string | undefined;
            }>;
        },
        oauth2client: AuthClient,
        credentials: AuthToken,
    ): Promise<any>;

    /**
     * Download a resource.
     * @param bucketKey bucket key (will be URL-encoded automatically)
     * @param objects Object or Object array of resource to upload with their parameters
     * @param object[].objectKey object key
     * @param object[].responseType Resource to upload
     * If String, it is the expected response type (defaults to json) ['arraybuffer', 'document', 'json', 'text', 'stream']
     * If you 'stream', you need to provide a writable stream ('data'), the method will pipe content into it.
     * @param opts Optional parameters
     * @param [opts.publicResourceFallback=false] Allows fallback to OSS signed URLs in case of unmerged resumable uploads.
     * @param [opts.useCdn=true] Will generate a CloudFront URL for the S3 object.
     * @param [opts.minutesExpiration=2] The custom expiration time within the 1 to 60 minutes range, if not specified, default is 2 minutes.
     * @param opts.chunkSize Chunk size in Mb. Should not be below 5Mb. Default is 0, download file in one piece.
     * @param opts.onDownloadProgress (progressEvent) => {}
     * @param opts.onRefreshToken () => {}
     * @param oauth2client oauth2client for the call
     * @param credentials credentials for the call
     * @async
     */
    downloadResources(
        bucketKey: string,
        objects: Array<{
            objectKey: string;
            responseType?: DownloadResponseType | undefined;
        }>,
        opts: {
            publicResourceFallback?: boolean | undefined;
            useCdn?: boolean | undefined;
            minutesExpiration?: number | undefined;
            chunkSize?: number | undefined;
            // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
            onDownloadProgress?: (progressEvent: any) => void | undefined;
            // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
            onRefreshToken?: () => void | undefined;
        },
        oauth2client: AuthClient,
        credentials: AuthToken,
    ): Promise<DownloadedResource[]>;

    /**
     * Upload a resource. If the specified object name already exists in the bucket, the uploaded content will overwrite the existing content for the bucket name/object name combination.
     * @param bucketKey bucket key (will be URL-encoded automatically)
     * @param objects Object or Object array of resource to upload with their parameters
     * @param object[].objectKey object key
     * @param object[].data Resource to upload (String| Buffer | Stream)
     * @param object[].eTags An array of eTags. S3 returns an eTag to each upload request, be it for a chunk or an entire file.
     * For a single-part upload, this array contains the expected eTag of the entire object. For a multipart upload, this array contains the expected
     * eTag of each part of the upload; the index of an eTag in the array corresponds to its part number in the upload. If provided, OSS will validate
     * these eTags against the content in S3, and return an error if the eTags do not match (indicating some form of data corruption).
     * @param object[].xAdsMetaContentType (x-ads-meta-Content-Type) The Content-Type value that OSS will store in the record for the uploaded object.
     * @param object[].xAdsMetaContentDisposition (x-ads-meta-Content-Disposition) The Content-Disposition value that OSS will store in the record for the uploaded object.
     * @param object[].xAdsMetaContentEncoding (x-ads-meta-Content-Encoding) The Content-Encoding value that OSS will store in the record for the uploaded object.
     * @param object[].xAdsMetaCacheControl (x-ads-meta-Cache-Control) The Cache-Control value that OSS will store in the record for the uploaded object.
     * @param opts Optional parameters
     * @param chunkSize Chunk size in Mb. Should not be below 5Mb.
     * @param maxBatches Maximum batch to produces. Should not be above 25 or below 1.
     * @param opts.useAcceleration Whether or not to generate an accelerated signed URL (ie: URLs of the form …s3-accelerate.amazonaws.com… vs …s3.amazonaws.com…).
     * When not specified, defaults to true. Providing non-boolean values will result in a 400 error.
     * @param opts.minutesExpiration The custom expiration time within the 1 to 60 minutes range, if not specified, default is 2 minutes.
     * @param opts.onUploadProgress (progressEvent) => {}
     * @param opts.onRefreshToken () => {}
     * @param oauth2client oauth2client for the call
     * @param credentials credentials for the call
     * @async
     */
    uploadResources(
        bucketKey: string,
        objects: Array<{
            objectKey: string;
            data: string | Buffer;
            eTags?: string[] | undefined;
            xAdsMetaContentType?: string | undefined;
            xAdsMetaContentDisposition?: string | undefined;
            xAdsMetaContentEncoding?: string | undefined;
            xAdsMetaCacheControl?: string | undefined;
        }>,
        opts: {
            chunkSize?: number | undefined;
            maxBatches?: number | undefined;
            useAcceleration?: boolean | undefined;
            minutesExpiration?: number | undefined;
            // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
            onUploadProgress?: (progressEvent: any) => void | undefined;
            // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
            onRefreshToken?: () => void | undefined;
        },
        oauth2client: AuthClient,
        credentials: AuthToken,
    ): Promise<UploadedResource[]>;
}

export interface CreateStorageDataRelationships {
    target?: CreateStorageDataRelationshipsTarget | undefined;
}

export interface CreateStorageData {
    type: string;
    attributes?: CreateStorageDataAttributes | undefined;
    relationships?: CreateStorageDataRelationships | undefined;
}

export interface CreateStorage {
    jsonapi?: JsonApiVersionJsonapi | undefined;
    data?: CreateStorageData | undefined;
}

export class ProjectsApi {
    constructor(apiClient?: any);
    /**
     * Returns a collection of projects for a given `hub_id`. A project represents an A360 project or a BIM 360 project which
     * is set up under an A360 hub or BIM 360 account, respectively. Within a hub or an account, multiple projects can be
     * created to be used.
     */
    getHubProjects(
        hubId: string,
        opts: { filterId?: string[] | undefined; filterExtensionType?: string[] | undefined },
        oauth2Client: AuthClient,
        credentials: AuthToken,
    ): Promise<ApiResponse>;

    /**
     * Returns a project for a given `project_id`.
     */
    getProject(
        hubId: string,
        projectId: string,
        oauth2Client: AuthClient,
        credentials: AuthToken,
    ): Promise<ApiResponse>;

    /**
     * Returns the hub for a given `project_id`.
     */
    getProjectHub(
        hubId: string,
        projectId: string,
        oauth2Client: AuthClient,
        credentials: AuthToken,
    ): Promise<ApiResponse>;

    /**
     * Returns the details of the highest level folders the user has access to for a given project.
     */
    getProjectTopFolders(
        hubId: string,
        projectId: string,
        oauth2Client: AuthClient,
        credentials: AuthToken,
    ): Promise<ApiResponse>;

    /**
     * Creates a storage location in the OSS where data can be uploaded to.
     */
    postStorage(
        projectId: string,
        body: CreateStorage,
        oauth2Client: AuthClient,
        credentials: AuthToken,
    ): Promise<ApiResponse>;
}

export class UserProfileApi {
    constructor(apiClient?: any);
    /**
     * Returns the profile information of an authorizing end user.
     */
    getUserProfile(
        oauth2Client: AuthClient,
        credentials: AuthToken,
    ): Promise<ApiResponse>;
}

export interface CreateVersionDataRelationshipsItemData {
    type: string;
    id: string;
}

export interface CreateVersionDataRelationshipsItem {
    data?: CreateVersionDataRelationshipsItemData | undefined;
}

export interface CreateVersionDataRelationships {
    item?: CreateVersionDataRelationshipsItem | undefined;
    storage?: CreateItemRelationshipsStorage | undefined;
}

export interface CreateVersionData {
    type: string;
    attributes?: CreateStorageDataAttributes | undefined;
    relationships?: CreateVersionDataRelationships | undefined;
}

export interface CreateVersion {
    jsonapi?: JsonApiVersionJsonapi | undefined;
    data?: CreateVersionData | undefined;
}

export class VersionsApi {
    constructor(apiClient?: any);
    /**
     * Returns the version with the given `version_id`.
     */
    getVersion(
        projectId: string,
        versionId: string,
        oauth2Client: AuthClient,
        credentials: AuthToken,
    ): Promise<ApiResponse>;

    /**
     * Returns the item the given version is associated with.
     */
    getVersionItem(
        projectId: string,
        versionId: string,
        oauth2Client: AuthClient,
        credentials: AuthToken,
    ): Promise<ApiResponse>;

    /**
     * Returns the resources (`items`, `folders`, and `versions`) which have a custom relationship with the given `version_id`.
     * Custom relationships can be established between a version of an item and other resources within the 'data' domain service
     * (folders, items, and versions).
     */
    getVersionRefs(
        projectId: string,
        versionId: string,
        opts: {
            filterType?: string[] | undefined;
            filterId?: string[] | undefined;
            filterExtensionType?: string[] | undefined;
        },
        oauth2Client: AuthClient,
        credentials: AuthToken,
    ): Promise<ApiResponse>;

    /**
     * Returns the custom relationships that are associated to the given `version_id`. Custom relationships can be established between
     * a version of an item and other resources within the 'data' domain service (folders, items, and versions).
     */
    getVersionRelationshipsRefs(
        projectId: string,
        versionId: string,
        opts: {
            filterType?: string[] | undefined;
            filterId?: string[] | undefined;
            filterRefType?: string[] | undefined;
            filterDirection?: string | undefined;
            filterExtensionType?: string[] | undefined;
        },
        oauth2Client: AuthClient,
        credentials: AuthToken,
    ): Promise<ApiResponse>;

    /**
     * Creates a new version of an item in the 'data' domain service.
     */
    postVersion(
        projectId: string,
        body: CreateVersion,
        oauth2Client: AuthClient,
        credentials: AuthToken,
    ): Promise<ApiResponse>;

    /**
     * Creates a new version of an item in the 'data' domain service.
     */
    postVersionRelationshipsRef(
        projectId: string,
        versionId: string,
        body: CreateRef,
        oauth2Client: AuthClient,
        credentials: AuthToken,
    ): Promise<ApiResponse>;
}

export namespace WebhooksApi {
    enum RegionEnum {
        US = "US",
        EMEA = "EMEA",
        EU = "EMEA",
    }

    enum StatusEnum {
        Active = "active",
        Inactive = "inactive",
    }

    enum WebhooksSystemEnum {
        derivative = "derivative",
        data = "data",
        c4r = "adsk.c4r",
    }

    enum WebhookEventEnum {
        // Data Management
        VersionAdded = "dm.version.added",
        VersionModified = "dm.version.modified",
        VersionDeleted = "dm.version.deleted",
        VersionMoved = "dm.version.moved",
        VersionCopied = "dm.version.copied",
        FolderAdded = "dm.folder.added",
        FolderModified = "dm.folder.modified",
        FolderDeleted = "dm.folder.deleted",
        FolderMoved = "dm.folder.moved",
        FolderCopied = "dm.folder.copied",

        // Model Derivatives
        ExtractionFinished = "extraction.finished",
        ExtractionUpdated = "extraction.updated",

        // Revit Cloud Worksharing
        ModelSync = "model.sync",
        ModelPublish = "model.publish",

        // Fusion Lifecycle
        ItemClone = "item.clone",
        ItemCreate = "item.create",
        ItemLock = "item.lock",
        ItemRelease = "item.release",
        ItemUnlock = "item.unlock",
        ItemUpdate = "item.update",
        WorkflowTransition = "workflow.transition",
    }

    interface HooksOptions {
        acceptEncoding?: string | undefined;
        xAdsRegion?: RegionEnum | undefined;
        status?: StatusEnum | undefined;
        pageState?: string | undefined;
        scopeName?: string | undefined;
        scopeValue?: string | undefined;
        hookAttribute?: any;
        tenant?: string | undefined;
        filter?: string | undefined;
        hubId?: string | undefined;
        projectId?: string | undefined;
        hookExpiry?: string | undefined;
    }
}

export class WebhooksApi {
    constructor(apiClient?: any, region?: WebhooksApi.RegionEnum);

    GetHooks(
        opts: WebhooksApi.HooksOptions,
        oauth2client: AuthClient,
        credentials: AuthToken,
    ): Promise<ApiResponse>;
    GetSystemHooks(
        webhooksSystem: WebhooksApi.WebhooksSystemEnum,
        opts: WebhooksApi.HooksOptions,
        oauth2client: AuthClient,
        credentials: AuthToken,
    ): Promise<ApiResponse>;
    GetSystemEventsHooks(
        webhooksSystem: WebhooksApi.WebhooksSystemEnum,
        eventType: WebhooksApi.WebhookEventEnum,
        opts: WebhooksApi.HooksOptions,
        oauth2client: AuthClient,
        credentials: AuthToken,
    ): Promise<ApiResponse>;
    GetHook(
        webhooksSystem: WebhooksApi.WebhooksSystemEnum,
        eventType: WebhooksApi.WebhookEventEnum,
        hookId: string,
        opts: WebhooksApi.HooksOptions,
        oauth2client: AuthClient,
        credentials: AuthToken,
    ): Promise<ApiResponse>;
    CreateSystemHook(
        webhooksSystem: WebhooksApi.WebhooksSystemEnum,
        callbackUrl: string,
        scope: any,
        opts: WebhooksApi.HooksOptions,
        oauth2client: AuthClient,
        credentials: AuthToken,
    ): Promise<ApiResponse>;
    CreateSystemEventHook(
        webhooksSystem: WebhooksApi.WebhooksSystemEnum,
        eventType: WebhooksApi.WebhookEventEnum,
        callbackUrl: string,
        scope: any,
        opts: WebhooksApi.HooksOptions,
        oauth2client: AuthClient,
        credentials: AuthToken,
    ): Promise<ApiResponse>;
    UpdateSystemEventHook(
        webhooksSystem: WebhooksApi.WebhooksSystemEnum,
        eventType: WebhooksApi.WebhookEventEnum,
        hookId: string,
        payload: string,
        opts: WebhooksApi.HooksOptions,
        oauth2client: AuthClient,
        credentials: AuthToken,
    ): Promise<ApiResponse>;
    DeleteHook(
        webhooksSystem: WebhooksApi.WebhooksSystemEnum,
        eventType: WebhooksApi.WebhookEventEnum,
        hookId: string,
        opts: WebhooksApi.HooksOptions,
        oauth2client: AuthClient,
        credentials: AuthToken,
    ): Promise<ApiResponse>;
}

export namespace TokensApi {
    enum RegionEnum {
        US = "US",
        EMEA = "EMEA",
        EU = "EMEA",
    }

    interface TokensOptions {
        xAdsRegion?: RegionEnum | undefined;
    }
}

export class TokensApi {
    constructor(apiClient?: any, region?: WebhooksApi.RegionEnum);

    CreateToken(
        token: string,
        opts: TokensApi.TokensOptions,
        oauth2client: AuthClient,
        credentials: AuthToken,
    ): Promise<ApiResponse>;
    UpdateToken(
        token: string,
        opts: TokensApi.TokensOptions,
        oauth2client: AuthClient,
        credentials: AuthToken,
    ): Promise<ApiResponse>;
    DeleteToken(
        opts: TokensApi.TokensOptions,
        oauth2client: AuthClient,
        credentials: AuthToken,
    ): Promise<ApiResponse>;
}
