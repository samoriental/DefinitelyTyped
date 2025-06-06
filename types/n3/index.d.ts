/// <reference types="node" />

import * as RDF from "@rdfjs/types";
import { EventEmitter } from "events";
import * as stream from "stream";

export interface Prefixes<I = RDF.NamedNode> {
    [key: string]: I;
}

export type Term = NamedNode | BlankNode | Literal | Variable | DefaultGraph;
export type PrefixedToIri = (suffix: string) => NamedNode;

export class NamedNode<Iri extends string = string> implements RDF.NamedNode<Iri> {
    readonly termType: "NamedNode";
    readonly value: Iri;
    constructor(iri: Iri);
    readonly id: string;
    toJSON(): {};
    equals(other: RDF.Term): boolean;
    static subclass(type: any): void;
}

export class BlankNode implements RDF.BlankNode {
    static nextId: number;
    readonly termType: "BlankNode";
    readonly value: string;
    constructor(name: string);
    readonly id: string;
    toJSON(): {};
    equals(other: RDF.Term): boolean;
    static subclass(type: any): void;
}

export class Variable implements RDF.Variable {
    readonly termType: "Variable";
    readonly value: string;
    constructor(name: string);
    readonly id: string;
    toJSON(): {};
    equals(other: RDF.Term): boolean;
    static subclass(type: any): void;
}

export class Literal implements RDF.Literal {
    static readonly langStringDatatype: NamedNode;
    readonly termType: "Literal";
    readonly value: string;
    readonly id: string;
    toJSON(): {};
    equals(other: RDF.Term): boolean;
    static subclass(type: any): void;
    readonly language: string;
    readonly datatype: NamedNode;
    readonly datatypeString: string;
    constructor(id: string);
}

export class DefaultGraph implements RDF.DefaultGraph {
    readonly termType: "DefaultGraph";
    readonly value: "";
    constructor();
    readonly id: string;
    toJSON(): {};
    equals(other: RDF.Term): boolean;
    static subclass(type: any): void;
}

export class BaseIRI {
    constructor(base: string);
    static supports(base: string): boolean;
    toRelative(iri: string): string;
}

export type Quad_Subject = NamedNode | BlankNode | Variable;
export type Quad_Predicate = NamedNode | Variable;
export type Quad_Object = NamedNode | Literal | BlankNode | Variable;
export type Quad_Graph = DefaultGraph | NamedNode | BlankNode | Variable;

export class BaseQuad implements RDF.BaseQuad {
    constructor(subject: Term, predicate: Term, object: Term, graph?: Term);
    readonly termType: "Quad";
    readonly value: "";
    readonly subject: Term;
    readonly predicate: Term;
    readonly object: Term;
    readonly graph: Term;
    equals(other: RDF.BaseQuad): boolean;
    toJSON(): string;
}

export class Quad extends BaseQuad implements RDF.Quad {
    constructor(subject: Term, predicate: Term, object: Term, graph?: Term);
    readonly subject: Quad_Subject;
    readonly predicate: Quad_Predicate;
    readonly object: Quad_Object;
    readonly graph: Quad_Graph;
    equals(other: RDF.BaseQuad): boolean;
    toJSON(): string;
}

export class Triple extends Quad implements RDF.Quad {}

export interface DataFactoryInterface<Q_In extends RDF.BaseQuad = RDF.Quad, Q_Out extends BaseQuad = Quad>
    extends RDF.DataFactory<Q_In, Q_Out>
{
    namedNode<Iri extends string = string>(value: Iri): NamedNode<Iri>;
    blankNode(value?: string): BlankNode;
    literal(value: string | number, languageOrDatatype?: string | RDF.NamedNode): Literal;
    variable(value: string): Variable;
    defaultGraph(): DefaultGraph;
    quad(
        subject: RDF.Quad_Subject,
        predicate: RDF.Quad_Predicate,
        object: RDF.Quad_Object,
        graph?: RDF.Quad_Graph,
    ): Quad;
    quad<Q_In extends RDF.BaseQuad = RDF.Quad, Q_Out extends BaseQuad = Quad>(
        subject: Q_In["subject"],
        predicate: Q_In["predicate"],
        object: Q_In["object"],
        graph?: Q_In["graph"],
    ): Q_Out;
    triple(subject: RDF.Quad_Subject, predicate: RDF.Quad_Predicate, object: RDF.Quad_Object): Quad;
    triple<Q_In extends RDF.BaseQuad = RDF.Quad, Q_Out extends BaseQuad = Quad>(
        subject: Q_In["subject"],
        predicate: Q_In["predicate"],
        object: Q_In["object"],
    ): Q_Out;
}

export const DataFactory: DataFactoryInterface;

export type ErrorCallback = (err: Error, result: any) => void;
export type QuadCallback<Q extends BaseQuad = Quad> = (result: Q) => void;
export type QuadPredicate<Q extends BaseQuad = Quad> = (result: Q) => boolean;

export type OTerm = RDF.Term | string | null;

export type Logger = (message?: any, ...optionalParams: any[]) => void;

export interface BlankTriple<Q extends RDF.BaseQuad = RDF.Quad> {
    predicate: Q["predicate"];
    object: Q["object"];
}

export interface Token {
    type: string;
    value?: string | undefined;
    line: number;
    prefix?: string | undefined;
}
export interface LexerOptions {
    lineMode?: boolean | undefined;
    n3?: boolean | undefined;
    comments?: boolean | undefined;
    isImpliedBy?: boolean | undefined;
}

export type TokenCallback = (error: Error, token: Token) => void;

export class Lexer {
    constructor(options?: LexerOptions);
    tokenize(input: string): Token[];
    tokenize(input: string | EventEmitter, callback: TokenCallback): void;
}

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types
export type MimeType =
    // Discrete types
    | "application"
    | "example"
    | "text"
    // Multipart types
    | "message"
    | "multipart";

export type BaseFormat =
    | "Turtle"
    | "TriG"
    | "N-Triples"
    | "N-Quads"
    | "N3"
    | "Notation3";

export type BaseFormatVariant =
    | BaseFormat
    | Lowercase<BaseFormat>;

export type Star = "*" | "star" | "-star";

export type MimeSubtype = BaseFormatVariant | `${BaseFormatVariant}${Star}`;

export type MimeFormat = MimeSubtype | `${MimeType}/${MimeSubtype}`;

export interface ParserOptions {
    // string type is here to maintain backwards compatibility - consider removing when
    // updating major version
    format?: string | MimeFormat | undefined;
    factory?: RDF.DataFactory | undefined;
    baseIRI?: string | undefined;
    blankNodePrefix?: string | undefined;
    isImpliedBy?: boolean | undefined;
}

export interface StreamParserOptions extends ParserOptions {
    options?: boolean | undefined;
}

export type ParseCallback<Q extends BaseQuad = Quad> = (error: Error, quad: Q, prefixes: Prefixes) => void;

export type PrefixCallback = (prefix: string, prefixNode: RDF.NamedNode) => void;

export type CommentCallback = (comment: string) => void;

export class Parser<Q extends BaseQuad = Quad> {
    constructor(options?: ParserOptions);
    parse(input: string, callback?: null, prefixCallback?: PrefixCallback): Q[];
    parse(input: string | EventEmitter, callback: ParseCallback<Q>, prefixCallback?: PrefixCallback): void;
    parse(input: string | EventEmitter, callback: {
        onQuad: ParseCallback<Q>;
        onPrefix?: PrefixCallback;
        onComment?: CommentCallback;
    }): void;
}

export class StreamParser<Q extends BaseQuad = Quad> extends stream.Transform
    implements RDF.Stream<Q>, RDF.Sink<EventEmitter, RDF.Stream<Q>>
{
    constructor(options?: StreamParserOptions);
    import(stream: EventEmitter): RDF.Stream<Q>;
}

export interface WriterOptions {
    // string type is here to maintain backwards compatibility - consider removing when
    // updating major version
    format?: string | MimeFormat | undefined;
    prefixes?: Prefixes<RDF.NamedNode | string> | undefined;
    end?: boolean | undefined;
}

export class Writer<Q extends RDF.BaseQuad = RDF.Quad> {
    constructor(options?: WriterOptions);
    constructor(fd: any, options?: WriterOptions);
    quadToString(subject: Q["subject"], predicate: Q["predicate"], object: Q["object"], graph?: Q["graph"]): string;
    quadsToString(quads: RDF.Quad[]): string;
    addQuad(
        subject: Q["subject"],
        predicate: Q["predicate"],
        object: Q["object"] | Array<Q["object"]>,
        graph?: Q["graph"],
        done?: () => void,
    ): void;
    addQuad(quad: RDF.Quad): void;
    addQuads(quads: RDF.Quad[]): void;
    addPrefix(prefix: string, iri: RDF.NamedNode | string, done?: () => void): void;
    addPrefixes(prefixes: Prefixes<RDF.NamedNode | string>, done?: () => void): void;
    end(err?: ErrorCallback, result?: string): void;
    blank(predicate: Q["predicate"], object: Q["object"]): BlankNode;
    blank(triple: BlankTriple | RDF.Quad | BlankTriple[] | RDF.Quad[]): BlankNode;
    list(triple: Array<Q["object"]>): Quad_Object[];
}

export class StreamWriter<Q extends RDF.BaseQuad = RDF.Quad> extends stream.Transform
    implements RDF.Sink<RDF.Stream<Q>, EventEmitter>
{
    constructor(options?: WriterOptions);
    constructor(fd: any, options?: WriterOptions);
    import(stream: RDF.Stream<Q>): EventEmitter;
}

export class StoreFactory
    implements RDF.DatasetCoreFactory<RDF.BaseQuad, Quad, Store>, RDF.DatasetFactory<RDF.BaseQuad, Quad, Store>
{
    dataset(quads?: RDF.BaseQuad[] | RDF.DatasetCore): Store;
}

export interface Rule {
    premise: RDF.Quad[];
    conclusion: RDF.Quad[];
}

export class Reasoner<
    Q_RDF extends RDF.BaseQuad = RDF.Quad,
    Q_N3 extends BaseQuad = Quad,
    OutQuad extends RDF.BaseQuad = RDF.Quad,
    InQuad extends RDF.BaseQuad = RDF.Quad,
> {
    constructor(store: Store<Q_RDF, Q_N3, OutQuad, InQuad>);
    reason(rules: Rule[] | RDF.DatasetCore<RDF.Quad>): void;
}

export class Store<
    Q_RDF extends RDF.BaseQuad = RDF.Quad,
    Q_N3 extends BaseQuad = Quad,
    OutQuad extends RDF.BaseQuad = RDF.Quad,
    InQuad extends RDF.BaseQuad = RDF.Quad,
> implements RDF.Store<Q_RDF>, RDF.Dataset<OutQuad, InQuad> {
    constructor(triples?: Q_RDF[] | RDF.Dataset<InQuad, InQuad>, options?: StoreOptions);
    addAll(quads: RDF.Dataset<InQuad, InQuad> | InQuad[]): this;
    contains(other: RDF.Dataset<InQuad, InQuad>): boolean;
    deleteMatches(subject?: RDF.Term, predicate?: RDF.Term, object?: RDF.Term, graph?: RDF.Term): this;
    difference(other: RDF.Dataset<InQuad, InQuad>): RDF.Dataset<OutQuad, InQuad>;
    equals(other: RDF.Dataset<InQuad, InQuad>): boolean;
    filter(iteratee: (quad: OutQuad, dataset: this) => boolean): RDF.Dataset<OutQuad, InQuad>;
    intersection(other: RDF.Dataset<InQuad, InQuad>): RDF.Dataset<OutQuad, InQuad>;
    map(iteratee: (quad: OutQuad, dataset: RDF.Dataset<OutQuad, OutQuad>) => OutQuad): RDF.Dataset<OutQuad, InQuad>;
    reduce<A>(callback: (accumulator: A, quad: OutQuad, dataset: this) => A, initialValue?: A): A;
    toArray(): OutQuad[];
    toCanonical(): string;
    toStream(): RDF.Stream<OutQuad>;
    toString(): string;
    union(quads: RDF.Dataset<InQuad, InQuad>): RDF.Dataset<OutQuad, InQuad>;
    readonly size: number;
    add(quad: InQuad): this;
    addQuad(
        subject: Q_RDF["subject"],
        predicate: Q_RDF["predicate"],
        object: Q_RDF["object"],
        graph?: Q_RDF["graph"],
        done?: () => void,
    ): boolean;
    addQuad(quad: Q_RDF): boolean;
    addQuads(quads: Q_RDF[]): void;
    delete(quad: InQuad): this;
    has(quad: InQuad): boolean;
    import(stream: RDF.Stream<Q_RDF & InQuad>): EventEmitter & Promise<this>;
    removeQuad(
        subject: Q_RDF["subject"],
        predicate: Q_RDF["predicate"],
        object: Q_RDF["object"],
        graph?: Q_RDF["graph"],
        done?: () => void,
    ): boolean;
    removeQuad(quad: Q_RDF): boolean;
    removeQuads(quads: Q_RDF[]): void;
    remove(stream: RDF.Stream<Q_RDF>): EventEmitter;
    removeMatches(
        subject?: Term | null,
        predicate?: Term | null,
        object?: Term | null,
        graph?: Term | null,
    ): EventEmitter;
    deleteGraph(graph: Q_RDF["graph"] | string): EventEmitter;
    getQuads(subject: OTerm, predicate: OTerm, object: OTerm, graph: OTerm): Quad[];
    readQuads(subject: OTerm, predicate: OTerm, object: OTerm, graph: OTerm): Iterable<OutQuad>;
    match(
        subject?: Term | null,
        predicate?: Term | null,
        object?: Term | null,
        graph?: Term | null,
    ): RDF.Stream<Q_RDF> & RDF.Dataset<OutQuad, InQuad>;
    countQuads(subject: OTerm, predicate: OTerm, object: OTerm, graph: OTerm): number;
    forEach(callback: (quad: OutQuad, dataset: this) => void): void;
    forEach(callback: QuadCallback<Q_N3>, subject: OTerm, predicate: OTerm, object: OTerm, graph: OTerm): void;
    every(iteratee: (quad: OutQuad, dataset: this) => boolean): boolean;
    every(callback: QuadPredicate<Q_N3>, subject: OTerm, predicate: OTerm, object: OTerm, graph: OTerm): boolean;
    some(iteratee: (quad: OutQuad, dataset: this) => boolean): boolean;
    some(callback: QuadPredicate<Q_N3>, subject: OTerm, predicate: OTerm, object: OTerm, graph: OTerm): boolean;
    getSubjects(predicate: OTerm, object: OTerm, graph: OTerm): Array<Q_N3["subject"]>;
    forSubjects(callback: (result: Q_N3["subject"]) => void, predicate: OTerm, object: OTerm, graph: OTerm): void;
    getPredicates(subject: OTerm, object: OTerm, graph: OTerm): Array<Q_N3["predicate"]>;
    forPredicates(callback: (result: Q_N3["predicate"]) => void, subject: OTerm, object: OTerm, graph: OTerm): void;
    getObjects(subject: OTerm, predicate: OTerm, graph: OTerm): Array<Q_N3["object"]>;
    forObjects(callback: (result: Q_N3["object"]) => void, subject: OTerm, predicate: OTerm, graph: OTerm): void;
    getGraphs(subject: OTerm, predicate: OTerm, object: OTerm): Array<Q_N3["graph"]>;
    forGraphs(callback: (result: Q_N3["graph"]) => void, subject: OTerm, predicate: OTerm, object: OTerm): void;
    createBlankNode(suggestedName?: string): BlankNode;
    extractLists(options?: extractListOptions): Record<string, RDF.Term[]>;
    [Symbol.iterator](): Iterator<OutQuad>;
}
export interface extractListOptions {
    remove?: boolean;
    ignoreErrors?: boolean;
}

export interface StoreOptions {
    factory?: RDF.DataFactory | undefined;
}

export namespace Util {
    function isNamedNode(value: RDF.Term | null | undefined): value is RDF.NamedNode;
    function isBlankNode(value: RDF.Term | null | undefined): value is RDF.BlankNode;
    function isLiteral(value: RDF.Term | null | undefined): value is RDF.Literal;
    function isVariable(value: RDF.Term | null | undefined): value is RDF.Variable;
    function isQuad(value: RDF.Term | null | undefined): value is RDF.Quad;
    function isDefaultGraph(value: RDF.Term | null | undefined): value is RDF.DefaultGraph;
    function inDefaultGraph(value: RDF.Quad): boolean;
    function prefix(iri: RDF.NamedNode | string, factory?: RDF.DataFactory): PrefixedToIri;
    function prefixes(
        defaultPrefixes: Prefixes<RDF.NamedNode | string>,
        factory?: RDF.DataFactory,
    ): (prefix: string) => PrefixedToIri;
}

export function termToId(term: Term): string;
export function termFromId(id: string, factory: RDF.DataFactory): Term;
