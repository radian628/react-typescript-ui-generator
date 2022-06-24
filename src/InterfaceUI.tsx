import React from "react";
import { Dispatch, SetStateAction } from "react";



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

function indexOf<T>(arr: T[], elemToFind: T, isEqual?: (a: T, b: T) => boolean) {
    if (!isEqual) return arr.indexOf(elemToFind);
    let index = 0;
    for (let item of arr) {
        if (isEqual(item, elemToFind)) return index;
        index++;
    }
    return -1;
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
                props.values.map((possibleValue, i) => (
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

type InterfaceUIDataKey = Not<string | symbol | number, "exists", string | symbol | number>;

type NotA<T, Reserved, Alt> = T extends Reserved ? never : Alt
type NotB<T, Reserved, Alt> = Reserved extends T ? never : Alt
type Not<T, Reserved, Alt> = NotA<T, Reserved, Alt> | NotB<T, Reserved, Alt>

//https://stackoverflow.com/questions/53807517/how-to-test-if-two-types-are-exactly-the-same
export type Eq<T, U, Y=unknown, N=never> =
(<G>() => G extends T ? 1 : 2) extends
(<G>() => G extends U ? 1 : 2) ? Y : N;

export type GetArrayInterfaceUIData<ArrayType extends Array<any>> = {
    $mode: InterfaceMode.ARRAY,
    array: InterfaceUIDataified<ArrayType[number]>[],
    arrayExample: InterfaceUIDataified<ArrayType[number]>
}

//https://stackoverflow.com/questions/53953814/typescript-check-if-a-type-is-a-union
type IsUnion<T, U extends T = T> =
    (T extends any ?
    (U extends T ? false : true)
        : never) extends false ? false : true

export type DistributeInterfaceUI<T> =
    T extends Object ? InterfaceUIDataified<T> : never

export type InterfaceUIDataifiedWithoutOptions<T> =
    (Eq<boolean, T, 1, 2> extends 1
    ? T
    : Eq<Exclude<T, undefined>, T, 1, 2> extends 2
    ? {
        $mode: InterfaceMode.OPTIONAL,
        exists: boolean,
        data: InterfaceUIDataified<Exclude<T, undefined>>
    } 
    : IsUnion<T> extends true
    ? {
        $mode: InterfaceMode.UNION,
        unionExamples: DistributeInterfaceUI<T>[],
        data: DistributeInterfaceUI<T>,
        labels: string[],
        index: number
    }
    : T extends Array<any>
    ? GetArrayInterfaceUIData<T>
    : IsUnion<T> extends false
    ? (Required<{
        [Key in keyof T]: InterfaceUIDataified<T[Key]>
    }>)
    // : Eq<string, T, 1, 2> extends 1
    // ? T | TypedInterfaceUIWithOptions<T>
    // : Eq<number, T, 1, 2> extends 1
    // ? T | TypedInterfaceUIWithOptions<T>
    // : Eq<undefined, T, 1, 2> extends 1
    // ? T | TypedInterfaceUIWithOptions<T>
    : never);

export type InterfaceUIDataified<T> = 
    InterfaceUIDataifiedWithoutOptions<T>
    | TypedInterfaceUIWithOptions<InterfaceUIDataifiedWithoutOptions<T>>

export type AsNormalTypescriptObject<T extends InterfaceUIData> =
    T extends boolean
    ? T
    : T extends InterfaceUIUnion
    ? AsNormalTypescriptObject<T["data"]>
    : T extends InterfaceUIWithOptions
    ? AsNormalTypescriptObject<T["data"]>
    : T extends InterfaceUIOptional
    ? AsNormalTypescriptObject<T["data"]> | undefined
    : T extends InterfaceUIArray
    ? Array<AsNormalTypescriptObject<T["array"][number]>>
    : T extends InterfaceUIObject
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

type assddsf = AsNormalTypescriptObject<number | TypedInterfaceUIWithOptions<number>>

export function toNormalTypescriptObject<T>(uiData: InterfaceUIDataified<T> & InterfaceUIData): T {
    
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
                //@ts-ignore
                toNormalTypescriptObject(elem));
        case InterfaceMode.UNION:
            //@ts-ignore
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
    OPTIONAL, ARRAY, UNION, WITH_OPTIONS
};

type InterfaceUIObject = {
    $mode?: undefined,
    [key: InterfaceUIDataKey]: InterfaceUIData
}

export type InterfaceUIOptional = {
    $mode: InterfaceMode.OPTIONAL
    exists: boolean,
    data: InterfaceUIData
}


export type TypedInterfaceUIArray<T extends InterfaceUIData> = {
    $mode: InterfaceMode.ARRAY
    arrayExample: T & InterfaceUIData,
    array: (T & InterfaceUIData)[]
}
export type InterfaceUIArray = TypedInterfaceUIArray<any>;

export type TypedInterfaceUIUnion<T extends InterfaceUIData> = {
    $mode: InterfaceMode.UNION,
    unionExamples: (T & InterfaceUIData)[],
    data: T & InterfaceUIData,
    labels: string[],
    index: number
};
export type InterfaceUIUnion = TypedInterfaceUIUnion<any>

export type InterfaceUIOptions = {
    $mode: InterfaceMode.WITH_OPTIONS,
    className?: string,
    label?: string
}

export type InterfaceUIWithOptions = TypedInterfaceUIWithOptions<any>;


type TypedInterfaceUIWithOptions<T> = {
    data: T,
    customElement?: (props: 
        { 
            label?: string,
            data: T,
            setData: (data: T) => void
        }
    ) => JSX.Element,
} & InterfaceUIOptions

export type InterfaceUIData = 
      InterfaceUIObject
    | number 
    | string 
    | boolean 
    | undefined 
    | InterfaceUIOptional
    | InterfaceUIArray
    | InterfaceUIUnion
    | InterfaceUIWithOptions;

type InterfaceUIProps<T> = {
    data: InterfaceUIData & T,
    label?: string,
    className?: string,
    setData: (data: InterfaceUIData & T) => void
}

export function InterfaceUI<T>(props: InterfaceUIProps<T>) {
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

    if (className === "") className = undefined;

    switch (typeof props.data) {
    case "object":
        if (props.data.$mode == InterfaceMode.WITH_OPTIONS) {
            if (props.data.customElement) {
                return <props.data.customElement label={props.label} data={props.data.data} setData={data => {
                    if (typeof props.data != "object" || props.data.$mode != InterfaceMode.WITH_OPTIONS) return;
                    props.setData({
                        ...props.data,
                        data,
                    });
                }}></props.data.customElement>
            }
            return (<InterfaceUI 
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
            ></InterfaceUI>)
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
                {<InterfaceUI label={""} data={props.data.data} setData={data => {
                    if (typeof props.data != "object" || props.data.$mode != InterfaceMode.UNION) return;
                    props.setData({
                        ...props.data,
                        data
                    });
                }}></InterfaceUI>}
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
                .map((datum, key) => {
                    if (typeof props.data != "object" || props.data.$mode != InterfaceMode.ARRAY) return;
                    return <li><InterfaceUI 
                        key={key.toString()} 
                        label={key.toString()} 
                        data={reinterpret<any, InterfaceUIData>(props.data.array[key])} 
                        setData={datum => { if (typeof props.data == "object" && props.data.$mode == InterfaceMode.ARRAY) props.setData(
                            {
                                ...props.data,
                                array: props.data.array.map((d, i) => (i == key) ? datum : d)
                            }
                        ); }}
                    ></InterfaceUI></li>
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
                ? <InterfaceUI label={""} data={props.data.data} setData={data => {
                    if (typeof props.data != "object" || props.data.$mode != InterfaceMode.OPTIONAL) return;
                    props.setData({
                        $mode: InterfaceMode.OPTIONAL,
                        exists: props.data.exists,
                        data
                    });
                }}></InterfaceUI> 
                : undefined}
            </div>)

            
        } else {
            return (<div className={className}>
                {props.label ? <label>{props.label}</label> : undefined}
                {(Object.keys(props.data))
                .map(key => 
                    <InterfaceUI 
                        key={key.toString()} 
                        label={deCamelCase(key.toString())} 
                        //@ts-ignore
                        data={reinterpret<any, InterfaceUIData>(props.data[key])} 
                        setData={datum => { if (typeof props.data == "object") props.setData(reinterpret({ ...props.data, [key]: datum })); }}
                    ></InterfaceUI>
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