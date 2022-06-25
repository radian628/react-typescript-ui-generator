import { UIGen, UIGenDataified } from 'ts-object-ui-generator'
import { useState } from "react";
import * as UI from "ts-object-ui-generator";

// Original data type for which to create the form.
type Form = { [key: string]: string };

// Data used as a template for the form's UI.
type FormUIData = UIGenDataified<Form>;

// Render resulting form
export function Example1() {
    const [form, setForm] = useState<FormUIData>(
        {
            str: "sdfsdfsfs"
        }
    )

    return (<UIGen data={form} setData={setForm}></UIGen>);
}