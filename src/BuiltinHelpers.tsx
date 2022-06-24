import React from "react";
import { InterfaceMode, InterfaceUIArray, InterfaceUIData, InterfaceUIOptional, InterfaceUIOptions, InterfaceUIUnion, InterfaceUIWithOptions, TypedInterfaceUIArray, TypedInterfaceUIUnion } from "./InterfaceUI"

export function Slider(x: number, min: number, max: number, step: number): InterfaceUIWithOptions {
    return {
        $mode: InterfaceMode.WITH_OPTIONS,
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


export function Optional<T extends InterfaceUIData>(data: T & InterfaceUIData, exists: boolean): { $mode: InterfaceMode.OPTIONAL, exists: boolean, data: T } {
    return {
        $mode: InterfaceMode.OPTIONAL,
        exists,
        data
    }
}

export function Array<T extends InterfaceUIData>(data: (T & InterfaceUIData)[], example: T & InterfaceUIData): TypedInterfaceUIArray<T & InterfaceUIData> {
    return {
        $mode: InterfaceMode.ARRAY,
        array: data,
        arrayExample: example
    }
}

export function Union<T extends InterfaceUIData>(index: number, examples: (T & InterfaceUIData)[], exampleLabels: string[]): TypedInterfaceUIUnion<T & InterfaceUIData> {
    return {
        $mode: InterfaceMode.UNION,
        unionExamples: examples,
        labels: exampleLabels,
        data: examples[index],
        index
    }
}