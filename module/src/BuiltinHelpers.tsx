import React from "react";
import { InterfaceMode, UIGenData, TypedUIGenArray, TypedUIGenCustomElement, TypedUIGenUnion, TypedUIGenWithOptions } from "./UIGen"

export function Slider(x: number, min: number, max: number, step: number): TypedUIGenCustomElement<number> {
    return {
        $mode: InterfaceMode.CUSTOM,
        customElement: (props: { label?: string, data: number, setData: (x: number) => void}) => {
            return <React.Fragment>
                        <label>{props.label}</label>
                        <input className="number-input" type="range" min={min} max={max} step={step} value={props.data} onChange={e => {
                        props.setData(Number(e.currentTarget.value));
                    }}></input>
                </React.Fragment>
        },
        data: x
    }
}


export function Optional<T extends UIGenData>(data: T & UIGenData, exists: boolean): { $mode: InterfaceMode.OPTIONAL, exists: boolean, data: T } {
    return {
        $mode: InterfaceMode.OPTIONAL,
        exists,
        data
    }
}

export function Array<T extends UIGenData>(data: (T & UIGenData)[], example: T & UIGenData): TypedUIGenArray<T & UIGenData> {
    return {
        $mode: InterfaceMode.ARRAY,
        array: data,
        arrayExample: example
    }
}

export function Union<T extends UIGenData>(index: number, examples: (T & UIGenData)[], exampleLabels: string[]): TypedUIGenUnion<T & UIGenData> {
    return {
        $mode: InterfaceMode.UNION,
        unionExamples: examples,
        labels: exampleLabels,
        data: examples[index],
        index
    }
}




export function WithOptions<T extends UIGenData>(data: T & UIGenData, className: string, label: string): TypedUIGenWithOptions<T & UIGenData> {
    return {
        $mode: InterfaceMode.WITH_OPTIONS,
        className,
        label,
        data
    }
}