import React from "react";



function deCamelCase(str: string) {
    if (str == "") return "";
    let outStr = str[0].toUpperCase();
    for (let char of str.slice(1)) {
        if ("A" <= char && char <= "Z") {
            outStr += " " + char;
        } else {
            outStr += char;
        }
    }
    return outStr;
}



type SelectInputProps<ValueType> = {
    caption: string,
    setData: (x: ValueType, i: number) => void,
    data: number,
    values: ValueType[],
    valueNames: string[],
    isEqual?: (a: ValueType, b: ValueType) => boolean
}

export function SelectInput<ValueType>(props: SelectInputProps<ValueType>) {
    return (
        <React.Fragment>
            <label>{props.caption}</label>
            <select value={props.data} onChange={
                e => {
                    let index = Number(e.currentTarget.value);
                    props.setData(props.values[index], index);
                }
            }>{
                props.values.map((_, i) => (
                    <option key={props.valueNames[i]} value={i}>{props.valueNames[i]}</option>
                ))
            }</select>
        </React.Fragment>
    )
}






type NumberInputProps = {
    label?: string,
    num: number,
    setNum: (num: number) => void
}

export function NumberInput(props: NumberInputProps) {
    return (<React.Fragment>
        {props.label ? <label>{props.label}</label> : undefined}
        <input className="number-input" type="number" value={props.num} onChange={e => {
            props.setNum(Number(e.currentTarget.value));
        }}></input>
    </React.Fragment>)
}







type StringInputProps = {
    label?: string,
    str: string,
    setStr: (str: string) => void
}

export function StringInput(props: StringInputProps) {
    return (<React.Fragment>
        {props.label ? <label>{props.label}</label> : undefined}
        <input className="string-input" value={props.str} onChange={e => {
            props.setStr(e.currentTarget.value);
        }}></input>
    </React.Fragment>)
} 





type BoolInputProps = {
    label?: string,
    bool: boolean,
    setBool: (str: boolean) => void
}

export function BoolInput(props: BoolInputProps) {
    return (<React.Fragment>
        {props.label ? <label>{props.label}</label> : undefined}
        <input className="bool-input" type="checkbox" checked={props.bool} onChange={e => {
            props.setBool(e.currentTarget.checked);
        }}></input>
    </React.Fragment>)
} 






function reinterpret<Old, New>(old: Old): New {
    return (old as unknown) as New;
}

type UIGenDataKey = Not<string | symbol | number, "exists", string | symbol | number>;

type NotA<T, Reserved, Alt> = T extends Reserved ? never : Alt
type NotB<T, Reserved, Alt> = Reserved extends T ? never : Alt
type Not<T, Reserved, Alt> = NotA<T, Reserved, Alt> | NotB<T, Reserved, Alt>

//https://stackoverflow.com/questions/53807517/how-to-test-if-two-types-are-exactly-the-same
export type Eq<T, U, Y=unknown, N=never> =
(<G>() => G extends T ? 1 : 2) extends
(<G>() => G extends U ? 1 : 2) ? Y : N;

export type GetArrayUIGenData<ArrayType extends Array<any>> = {
    $mode: InterfaceMode.ARRAY,
    array: UIGenDataified<ArrayType[number]>[],
    arrayExample: UIGenDataified<ArrayType[number]>
}

//https://stackoverflow.com/questions/53953814/typescript-check-if-a-type-is-a-union
type IsUnion<T, U extends T = T> =
    (T extends any ?
    (U extends T ? false : true)
        : never) extends false ? false : true

export type DistributeUIGen<T> =
    T extends Object ? UIGenDataified<T> : never

export type UIGenDataifiedWithoutOptions<T> =
    (Eq<boolean, T, 1, 2> extends 1
    ? boolean
    : Eq<Exclude<T, undefined>, T, 1, 2> extends 2
    ? {
        $mode: InterfaceMode.OPTIONAL,
        exists: boolean,
        data: UIGenDataified<Exclude<T, undefined>>
    } 
    : IsUnion<T> extends true
    ? {
        $mode: InterfaceMode.UNION,
        unionExamples: DistributeUIGen<T>[],
        data: DistributeUIGen<T>,
        labels: string[],
        index: number
    }
    : T extends Array<any>
    ? GetArrayUIGenData<T>
    : IsUnion<T> extends false
    ? (Required<{
        [Key in keyof T]: UIGenDataified<T[Key]>
    }>)
    // : Eq<string, T, 1, 2> extends 1
    // ? T | TypedUIGenWithOptions<T>
    // : Eq<number, T, 1, 2> extends 1
    // ? T | TypedUIGenWithOptions<T>
    // : Eq<undefined, T, 1, 2> extends 1
    // ? T | TypedUIGenWithOptions<T>
    : TypedUIGenCustomElement<T>);

export type UIGenDataified<T> = 
    UIGenDataifiedWithoutOptions<T>
    | TypedUIGenWithOptions<UIGenDataifiedWithoutOptions<T>>
    | TypedUIGenCustomElement<T>;

export type AsNormalTypescriptObject<T extends UIGenData> =
    T extends boolean
    ? T
    : T extends UIGenUnion
    ? AsNormalTypescriptObject<T["data"]>
    : T extends UIGenWithOptions
    ? AsNormalTypescriptObject<T["data"]>
    : T extends UIGenCustomElement
    ? AsNormalTypescriptObject<T["data"]>
    : T extends UIGenOptional
    ? AsNormalTypescriptObject<T["data"]> | undefined
    : T extends UIGenArray
    ? Array<AsNormalTypescriptObject<T["array"][number]>>
    : T extends UIGenObject
    ? {
        [Key in keyof T]: AsNormalTypescriptObject<T[Key]>
    }
    : string extends T
    ? T
    : number extends T
    ? T
    : undefined extends T
    ? T
    : never;

//type assddsf = AsNormalTypescriptObject<number | TypedUIGenWithOptions<number>>

export function toNormalTypescriptObject<T>(uiData: UIGenDataified<T> & UIGenData): T {
    
    switch (typeof uiData) {
    case "object":
        switch (uiData.$mode) {
        case undefined:
            //@ts-ignore
            return Object.fromEntries(
                Object.entries(uiData).map((entry) => {
                    const [k, v] = entry;
                    //@ts-ignore
                    return [k, toNormalTypescriptObject(v)];
                })
            )
        case InterfaceMode.OPTIONAL:
            //@ts-ignore
            return toNormalTypescriptObject(uiData.exists ? uiData.data : undefined);
        case InterfaceMode.ARRAY:
            //@ts-ignore
            return uiData.array.map(elem =>
                toNormalTypescriptObject(elem));
        case InterfaceMode.UNION:
            return toNormalTypescriptObject(uiData.data);
        case InterfaceMode.WITH_OPTIONS:
            return toNormalTypescriptObject(uiData.data);
        }
    case "number":
    case "string":
    case "boolean":
    case "undefined":
        //@ts-ignore
        return uiData;
    }
}

export enum InterfaceMode {
    OPTIONAL, ARRAY, UNION, WITH_OPTIONS, CUSTOM
};

type UIGenObject = {
    $mode?: undefined,
    [key: UIGenDataKey]: UIGenData
}

export type UIGenOptional = {
    $mode: InterfaceMode.OPTIONAL
    exists: boolean,
    data: UIGenData
}


export type TypedUIGenArray<T extends UIGenData> = {
    $mode: InterfaceMode.ARRAY
    arrayExample: T & UIGenData,
    array: (T & UIGenData)[]
}
export type UIGenArray = TypedUIGenArray<any>;


export type TypedUIGenUnion<T extends UIGenData> = {
    $mode: InterfaceMode.UNION,
    unionExamples: (T & UIGenData)[],
    data: T & UIGenData,
    labels: string[],
    index: number
};
export type UIGenUnion = TypedUIGenUnion<any>


export type UIGenOptions = {
    $mode: InterfaceMode.WITH_OPTIONS,
    className?: string,
    label?: string
}
export type UIGenWithOptions = TypedUIGenWithOptions<any>;
export type TypedUIGenWithOptions<T extends UIGenData> = {
    data: T & UIGenData,
} & UIGenOptions


export type TypedUIGenCustomElement<T> = {
    $mode: InterfaceMode.CUSTOM,
    data: T,
    customElement: (props: 
        { 
            label?: string,
            data: T,
            setData: (data: T) => void
        }
    ) => JSX.Element,
}
export type UIGenCustomElement = TypedUIGenCustomElement<any>;


export type UIGenData = 
      UIGenObject
    | number 
    | string 
    | boolean 
    | undefined 
    | UIGenOptional
    | UIGenArray
    | UIGenUnion
    | UIGenWithOptions
    | UIGenCustomElement;

type UIGenProps<T> = {
    data: UIGenData & T,
    label?: string,
    className?: string,
    setData: (data: UIGenData & T) => void,
    depth?: number
}

export function UIGen<T>(props: UIGenProps<T>) {
    let depth = props.depth ?? 0;
    let className: string | undefined = props.className ?? "";
    if (typeof props.data == "object") {
        switch (props.data.$mode) {
        case undefined:
            className += " interface-ui-object";
            break;
        case InterfaceMode.UNION:
            className += " interface-ui-union";
            break;
        case InterfaceMode.ARRAY:
            className += " interface-ui-array";
            break;
        case InterfaceMode.OPTIONAL:
            className += " interface-ui-optional";
            break;
        }
    }

    className += (depth % 2 == 0) ? " even-depth" : " odd-depth";

    if (className === "") className = undefined;

    switch (typeof props.data) {
    case "object":
        if (props.data.$mode == InterfaceMode.CUSTOM) {
            return <props.data.customElement label={props.label} data={props.data.data} setData={data => {
                if (typeof props.data != "object" || props.data.$mode != InterfaceMode.CUSTOM) return;
                props.setData({
                    ...props.data,
                    data,
                });
            }}></props.data.customElement>
        } else if (props.data.$mode == InterfaceMode.WITH_OPTIONS) {
            return (<UIGen 
                data={props.data.data}
                setData={(data) => {
                    if (typeof props.data != "object" || props.data.$mode != InterfaceMode.WITH_OPTIONS) return;
                    props.setData({
                        ...props.data,
                        data,
                    });
                }}
                label={props.data.label}
                className={props.data.className}
            ></UIGen>)
        } else if (props.data.$mode == InterfaceMode.UNION) {
            return (<div className={className}>
                {props.label ? <label>{props.label}</label> : undefined}
                <SelectInput data={props.data.index} valueNames={props.data.labels} values={props.data.unionExamples} caption={""} setData={(data, index) => {
                    if (typeof props.data != "object" || props.data.$mode != InterfaceMode.UNION) return;
                    props.setData({
                        ...props.data,
                        data,
                        index
                    });
                }}></SelectInput>
                {<UIGen label={""} data={props.data.data} setData={data => {
                    if (typeof props.data != "object" || props.data.$mode != InterfaceMode.UNION) return;
                    props.setData({
                        ...props.data,
                        data
                    });
                }}></UIGen>}
            </div>)


        } else if (props.data.$mode == InterfaceMode.ARRAY) {
            const addNewElement = () => {
                if (typeof props.data != "object" || props.data.$mode != InterfaceMode.ARRAY) return;
                props.setData({
                    ...props.data,
                    array: props.data.array.concat(props.data.arrayExample)
                })
            }
            return (<div className={className}>
                {props.label ? <label>{props.label}</label> : undefined}
                <ul>
                {props.data.array
                .map((_, key) => {
                    if (typeof props.data != "object" || props.data.$mode != InterfaceMode.ARRAY) return;
                    return <li><UIGen 
                        depth={depth + 1}
                        key={key.toString()} 
                        label={key.toString()} 
                        data={reinterpret<any, UIGenData>(props.data.array[key])} 
                        setData={datum => { if (typeof props.data == "object" && props.data.$mode == InterfaceMode.ARRAY) props.setData(
                            {
                                ...props.data,
                                array: props.data.array.map((d, i) => (i == key) ? datum : d)
                            }
                        ); }}
                    ></UIGen></li>
                 })}
                 </ul>
                 {<button onClick={addNewElement}>Add New</button>}
            </div>);


        } else if (props.data.$mode == InterfaceMode.OPTIONAL) {
            return (<div className={className}>
                {props.label ? <label>{props.label}</label> : undefined}
                <BoolInput bool={props.data.exists} setBool={bool => {
                    if (typeof props.data != "object" || props.data.$mode != InterfaceMode.OPTIONAL) return;
                    props.setData({
                        $mode: InterfaceMode.OPTIONAL,
                        exists: bool,
                        data: props.data.data
                    });
                }}></BoolInput>
                {props.data.exists 
                ? <UIGen label={""} data={props.data.data} setData={data => {
                    if (typeof props.data != "object" || props.data.$mode != InterfaceMode.OPTIONAL) return;
                    props.setData({
                        $mode: InterfaceMode.OPTIONAL,
                        exists: props.data.exists,
                        data
                    });
                }}></UIGen> 
                : undefined}
            </div>)

            
        } else {
            return (<div className={className}>
                {props.label ? <label>{props.label}</label> : undefined}
                {(Object.keys(props.data))
                .map(key => 
                    <UIGen 
                        key={key.toString()} 
                        label={deCamelCase(key.toString())} 
                        //@ts-ignore
                        data={reinterpret<any, UIGenData>(props.data[key])} 
                        setData={datum => { if (typeof props.data == "object") props.setData(reinterpret({ ...props.data, [key]: datum })); }}
                    ></UIGen>
                )}
            </div>);
        }
    case "number":
        return <NumberInput label={props.label} num={props.data} setNum={reinterpret(props.setData)}></NumberInput>
    case "string":
        return <StringInput label={props.label} str={props.data} setStr={reinterpret(props.setData)}></StringInput>
    case "boolean":
        return <BoolInput label={props.label} bool={props.data} setBool={reinterpret(props.setData)}></BoolInput>
    }
    return <p>Could not create UI element.</p>
}