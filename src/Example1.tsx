import { UIGen, UIGenDataified } from 'ts-object-ui-generator'
import { useState } from "react";

// Original data type for which to create the form.
type Form = {
    num: number,
    str: string,
    bool: boolean
};

// Data used as a template for the form's UI.
type FormUIData = UIGenDataified<Form>;

// Render resulting form
export function Example1() {
    const [form, setForm] = useState<FormUIData>({
        num: 0,
        str: "Hello world!",
        bool: true
    });

    return (<UIGen data={form} setData={setForm}></UIGen>);
}