import { LocalSettings } from "@node-red/runtime";
import * as util from "@node-red/util";
import { EventEmitter } from "events";
import { Express, NextFunction, Request, Response } from "express";
import { Server as HttpsServer } from "https";

declare const registry: registry.RegistryModule;

export = registry;

declare namespace registry {
    interface RegistryModule {} // eslint-disable-line @typescript-eslint/no-empty-interface

    interface NodeConstructor<TNode extends Node<TCred>, TNodeDef extends NodeDef, TCred extends {}> {
        (this: TNode, nodeDef: TNodeDef): void;
    }
    interface NodeSetting<T> {
        value: T;
        exportable?: boolean | undefined;
    }
    type NodeSettings<TSets> = {
        [K in keyof TSets]: NodeSetting<TSets[K]>;
    };

    interface NodeCredential {
        type: "text" | "password";
    }

    type NodeCredentials<TCreds> = {
        [K in keyof TCreds]: NodeCredential;
    };

    interface NodeAPINodes {
        /**
         * Registers a node constructor
         * @param type - the string type name
         * @param constructor - the constructor function for this node type
         * @param opts - optional additional options for the node
         */
        // eslint-disable-next-line @definitelytyped/no-unnecessary-generics
        registerType<TNode extends Node<TCreds>, TNodeDef extends NodeDef, TSets, TCreds extends {}>(
            type: string,
            constructor: NodeConstructor<TNode, TNodeDef, TCreds>, // eslint-disable-line @definitelytyped/no-unnecessary-generics
            opts?: {
                credentials?: NodeCredentials<TCreds> | undefined; // eslint-disable-line @definitelytyped/no-unnecessary-generics
                settings?: NodeSettings<TSets> | undefined; // eslint-disable-line @definitelytyped/no-unnecessary-generics
            },
        ): void;

        /**
         * Called from a Node's constructor function, invokes the super-class
         * constructor and attaches any credentials to the node.
         * @param node the node object being created
         * @param def the instance definition for the node
         */
        createNode(node: Node, def: NodeDef): void;

        getNode(id: string): Node;
        eachNode(cb: (node: NodeDef) => void): void;

        /**
         * Adds a set of credentials for the given node id.
         * @param id the node id for the credentials
         * @param creds an object of credential key/value pairs
         * @returns a promise for backwards compatibility TODO: can this be removed?
         */
        addCredentials(id: string, creds: object): Promise<void>;
        /**
         * Gets the credentials for the given node id.
         * @param id the node id for the credentials
         * @returns the credentials
         */
        getCredentials(id: string): object;
        /**
         * Deletes the credentials for the given node id.
         * @param id the node id for the credentials
         */
        deleteCredentials(id: string): void;
    }

    interface NodeAPIComms {
        publish(topic: string, data: any, retain: boolean): void;
    }

    interface NodeAPILibrary {
        register(type: string): void;
    }

    type NodeApiLog = Omit<util.Log, "init">;

    interface NodeAPISettings {
        get(prop: string): any;
        set(prop: string, value: any): Promise<void>;
        delete(prop: string): Promise<void>;
        available(): boolean;
        registerNodeSettings(type: string, opts: object): void;
        exportNodeSettings(safeSettings: object): object;
        enableNodeSettings(types: string[]): void;
        disableNodeSettings(types: string[]): void;
        getUserSettings(username: string): void;
        setUserSettings(username: string, settings: object): Promise<void>;
    }

    interface NodeAPISettingsWithData extends NodeAPISettings, LocalSettings {}

    interface NodeAPIAuth {
        /**
         * Returns an Express middleware function that ensures the user making a request has the necessary permission.
         */
        needsPermission(permission: string): (req: Request, res: Response, next: NextFunction) => void;
    }

    interface NodeAPIPlugins {
        /**
         * Registers a plugin constructor
         * @param id - the string id of the plugin
         * @param definition - the definition object of the plugin
         */
        // eslint-disable-next-line @definitelytyped/no-unnecessary-generics
        registerPlugin<TPluginDef extends PluginDef = PluginDef>(
            id: string,
            definition: PluginDefinition<TPluginDef>, // eslint-disable-line @definitelytyped/no-unnecessary-generics
        ): void;

        /**
         * Returns the plugin definition for the given id
         * @param id - the string id of the plugin
         * @returns the plugin definition
         */
        // eslint-disable-next-line @definitelytyped/no-unnecessary-generics
        get<TPluginDef extends PluginDef = PluginDef>(id: string): PluginDefinition<TPluginDef>;

        /**
         * Returns the plugin definitions for the given type
         * @param type - the string type of the plugin
         * @returns the plugin definitions
         */
        // eslint-disable-next-line @definitelytyped/no-unnecessary-generics
        getByType<TPluginDef extends PluginDef = PluginDef>(type: string): Array<PluginDefinition<TPluginDef>>;
    }
    interface PluginDefinition<TPluginDef> {
        id?: string;
        type: string;
        module?: string;
        onadd?(): void;
        _?: any;
        settings?: NodeSettings<TPluginDef> | undefined;
        onadd?: () => void;
    }
    interface PluginDef {
        "*": unknown;
    }

    /**
     * Runtime API provided to nodes by Node Registry
     */
    interface NodeAPI<TSets extends NodeAPISettingsWithData = NodeAPISettingsWithData> {
        nodes: NodeAPINodes;
        log: NodeApiLog;
        settings: TSets;
        events: EventEmitter;
        hooks: util.Hooks;
        util: util.Util;
        version(): Promise<string>;
        require(id: string): any;
        comms: NodeAPIComms;
        library: NodeAPILibrary;
        auth: NodeAPIAuth;
        plugins: NodeAPIPlugins;
        readonly httpNode: Express;
        readonly httpAdmin: Express;
        readonly server: HttpsServer;
        _: util.I18nTFunction;
    }

    /**
     * Function called by Node Registry to init node.
     */
    interface NodeInitializer<TSets extends NodeAPISettingsWithData = NodeAPISettingsWithData> {
        (RED: NodeAPI<TSets>): void | Promise<void>;
    }

    interface NodeMessage {
        payload?: unknown | undefined;
        topic?: string | undefined;
        _msgid?: string | undefined;
        [key: string]: unknown;
    }

    interface NodeMessageParts {
        /** a unique identifier for the sequence */
        id: string;
        /** the message's position within the sequence */
        index: number;
        /** if known, the total number of messages in the sequence */
        count?: number | undefined;
    }

    interface NodeMessageInFlow extends NodeMessage {
        _msgid: string;
        /**
         * If there is a message sequence, then each message in a sequence has the ```parts``` property.
         * More info: https://nodered.org/docs/user-guide/messages#understanding-msgparts
         */
        parts?: NodeMessageParts | undefined;
    }

    interface Node<TCreds extends {} = {}> extends EventEmitter {
        id: string;
        type: string;
        z: string;
        name?: string | undefined;
        credentials: TCreds;
        _flow?: FlowInfo;
        _alias?: string;
        /**
         * Update the wiring configuration for this node.
         * @param wires -the new wiring configuration
         */
        updateWires(wires: Array<[]>): void;
        /**
         * Get the context object for this node.
         * @returns the context object
         */
        context(): NodeContext;
        /**
         * Called when the node is being stopped
         * @param  removed Whether the node has been removed, or just being stopped
         * @returns Promises which resolves when the node has closed
         */
        close(removed: boolean): Promise<void>;
        /**
         * Send a message to the nodes wired.
         * @param msg A message or array of messages to send
         */
        send(msg?: NodeMessage | Array<NodeMessage | NodeMessage[] | null>): void;
        /**
         * Receive a message.
         *
         * This will emit the `input` event with the provided message.
         * As of 1.0, this will return *before* any 'input' callback handler is invoked.
         */
        receive(msg?: NodeMessage): void;
        /**
         * Log an INFO level message
         */
        log(msg: any): void;
        /**
         * Log a WARN level message
         */
        warn(msg: any): void;
        /**
         * Log an ERROR level message
         */
        error(logMessage: any, msg?: NodeMessage): void;
        /**
         * Log an DEBUG level message
         */
        debug(msg: any): void;
        /**
         * Log an TRACE level message
         */
        trace(msg: any): void;
        /**
         * Log a metric event.
         * If called with no args, returns whether metric collection is enabled
         */
        metric(): boolean;
        metric(eventname: string, msg: NodeMessage, metricValue: number): void;
        /**
         * Set the node's status object
         *
         * status: { fill:"red|green", shape:"dot|ring", text:"blah" }
         * or
         * status: "simple text status"
         */
        status(status: string | NodeStatus): void;
        /**
         * Nodes register a listener on the input event to receive messages from the
         * up-stream nodes in a flow.
         * More info: https://nodered.org/docs/creating-nodes/node-js#receiving-messages
         */
        on(
            event: "input",
            listener: (
                msg: NodeMessageInFlow,
                send: (msg: NodeMessage | Array<NodeMessage | NodeMessage[] | null>) => void,
                done: (err?: Error) => void,
            ) => void,
        ): this;

        /**
         * Whenever a new flow is deployed, the existing nodes are deleted. If any of them
         * need to tidy up state when this happens, such as disconnecting from a remote
         * system, they should register a listener on the close event.
         * More info: https://nodered.org/docs/creating-nodes/node-js#closing-the-node
         */
        on(event: "close", listener: () => void): this;
        /**
         * If the node needs to do any asynchronous work to complete the tidy up, the
         * registered listener should accept an argument which is a function to be called
         * when all the work is complete.
         * More info: https://nodered.org/docs/creating-nodes/node-js#closing-the-node
         */
        on(event: "close", listener: (done: () => void) => void): this; // tslint:disable-line:unified-signatures
        /**
         * If the registered listener accepts two arguments, the first will be a boolean
         * flag that indicates whether the node is being closed because it has been removed
         * entirely, or that it is just being restarted.
         * More info: https://nodered.org/docs/creating-nodes/node-js#closing-the-node
         */
        on(event: "close", listener: (removed: boolean, done: () => void) => void): this; // tslint:disable-line:unified-signatures
    }

    type NodeStatusFill = "red" | "green" | "yellow" | "blue" | "grey";
    type NodeStatusShape = "ring" | "dot";

    interface NodeStatus {
        fill?: NodeStatusFill | undefined;
        shape?: NodeStatusShape | undefined;
        text?: string | undefined;
    }

    /**
     * Node Instance Definition Object
     */
    interface NodeDef {
        id: string;
        type: string;
        name: string;
        z: string;
    }

    interface NodeContextData {
        /**
         * Get a value from context
         * @param key
         * @param storeName - store name when multiple context stores are used
         */
        get(key: string, storeName?: string): unknown;
        /**
         * Get a value from context asynchronously
         */
        get(key: string, cb: (err: Error, value: unknown) => void): void;
        /**
         * Get multiple values from context
         * @param keys
         * @param storeName - store name when multiple context stores are used
         */
        get(keys: string[], storeName?: string): unknown[];
        /**
         * Get multiple values from context asynchronously
         */
        get(keys: string[], cb: (err: Error, value: unknown[]) => void): void;

        /**
         * Get a value from context asynchronously, when multiple context stores are used
         */
        get(key: string, storeName: string | undefined, cb: (err: Error, value: unknown) => void): void;
        /**
         * Get multiple values from context asynchronously, when multiple context stores are used
         */
        get(keys: string[], storeName: string | undefined, cb: (err: Error, value: unknown[]) => void): void;

        /**
         * Set a value in context
         * @param key
         * @param value
         * @param cb - callback for async calls
         */
        set(key: string, value: unknown, cb?: (err: Error) => void): void;
        /**
         * Set multiple values in context
         * @param keys
         * @param values
         * @param cb - callback for async calls
         */
        set(keys: string[], values: unknown[], cb?: (err: Error) => void): void;

        /**
         * Set a value in context, when multiple context stores are used
         * @param key
         * @param value
         * @param storeName
         * @param cb - callback for async calls
         */
        set(key: string, value: unknown, storeName: string | undefined, cb?: (err: Error) => void): void;
        /**
         * Set multiple values in context, when multiple context stores are used
         * @param keys
         * @param values
         * @param storeName
         * @param cb - callback for async calls
         */
        set(keys: string[], values: unknown[], storeName: string | undefined, cb?: (err: Error) => void): void;

        /**
         * Returns a list of all node-scoped context property keys
         * @param storeName - store name when multiple context stores are used
         */
        keys(storeName?: string): string[];
        /**
         * Returns a list of all node-scoped context property keys asynchronously
         */
        keys(cb: (err: Error, value: unknown[]) => void): void;
        /**
         * Returns a list of all node-scoped context property keys asynchronously, when multiple context stores are used
         */
        keys(storeName: string | undefined, cb: (err: Error, value: unknown[]) => void): void;
    }

    interface NodeContext extends NodeContextData {
        global: NodeContextData;
        flow: NodeContextData;
    }

    type FlowType = "subflow" | "flow";

    interface FlowInfo {
        TYPE: FlowType;
        path: string;
        flow: Node;
        subflowDef?: SubflowDef;
    }

    type SubflowDefEnvType = "cred" | string;

    interface SubflowDefEnv {
        name: string;
        type: SubflowDefEnvType;
        value?: any;
    }

    interface SubflowDefInOutWire {
        id: string;
    }

    interface SubflowDefInOut {
        wires: SubflowDefInOutWire[];
    }

    interface SubflowDef {
        id: string;
        name: string;
        configs?: Node[];
        nodes?: Node[];
        subflows?: Node[];
        in?: SubflowDefInOut[];
        out?: SubflowDefInOut[];
        env?: SubflowDefEnv[];
        status?: any;
    }
}
