import initSqlJs from 'sql.js';
export declare function getDb(): Promise<{
    close(): void;
    create_function(name: string, func: (...args: any[]) => any): /*elided*/ any;
    each(sql: string, params: initSqlJs.BindParams, callback: initSqlJs.ParamsCallback, done: () => void): /*elided*/ any;
    each(sql: string, callback: initSqlJs.ParamsCallback, done: () => void): /*elided*/ any;
    exec(sql: string, params?: initSqlJs.BindParams): initSqlJs.QueryExecResult[];
    export(): Uint8Array;
    getRowsModified(): number;
    handleError(): null | never;
    iterateStatements(sql: string): {
        getRemainingSQL(): string;
        next(): initSqlJs.StatementIteratorResult;
        [Symbol.iterator](): Iterator<{
            bind(values?: initSqlJs.BindParams): boolean;
            free(): boolean;
            freemem(): void;
            get(params?: initSqlJs.BindParams): initSqlJs.SqlValue[];
            getAsObject(params?: initSqlJs.BindParams): initSqlJs.ParamsObject;
            getColumnNames(): string[];
            getNormalizedSQL(): string;
            getSQL(): string;
            reset(): void;
            run(values?: initSqlJs.BindParams): void;
            step(): boolean;
        }>;
    };
    prepare(sql: string, params?: initSqlJs.BindParams): {
        bind(values?: initSqlJs.BindParams): boolean;
        free(): boolean;
        freemem(): void;
        get(params?: initSqlJs.BindParams): initSqlJs.SqlValue[];
        getAsObject(params?: initSqlJs.BindParams): initSqlJs.ParamsObject;
        getColumnNames(): string[];
        getNormalizedSQL(): string;
        getSQL(): string;
        reset(): void;
        run(values?: initSqlJs.BindParams): void;
        step(): boolean;
    };
    run(sql: string, params?: initSqlJs.BindParams): /*elided*/ any;
    updateHook(callback: initSqlJs.UpdateHookCallback | null): /*elided*/ any;
}>;
export declare function saveDb(): void;
