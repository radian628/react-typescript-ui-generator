# react-typescript-ui-generator

[GUIDE](#guide)

## tl;dr
 Auto-generate React UIs for (almost) arbitrary JSON data structures, all using a completely type-safe API.

## About
 This project aims to simplify UI in React and TypeScript environments by allowing the user to automatically generate UIs that map one-to-one with a given TypeScript data type. It does this in a type-safe manner by providing the `InterfaceUIDataified<T>` type, which converts a TypeScript type `T` into a type representing UI settings for `T`. Then, plug an instance of the UI settings into the `InterfaceUI` component, and a UI will be automatically generated.

## Features
### Current Features
Currently supports the following data types:
 - Numbers
 - Strings
 - Booleans
 - Arrays of any type in this list
 - Objects of any type in this list
 - Unions of any type in this list
 - Circular/recursive types
 - Any other kind of data with custom elements

The following forms of input are supported:
 - Text inputs for numbers/strings
 - Checkboxes for booleans
 - Dropdowns for selecting union variants
 - Sliders/range inputs for numbers
 - Arbitrary elements

### Planned Features
 - Array deletion and reordering
 - Better CSS compatibility
 - Automatic conversion of `InterfaceUIDataified` data to original data

## Guide
Create a simple GUI for some object data type:
```tsx
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
function Example1() {

    // State hook for form, containing initial data.
    const [form, setForm] = useState<FormUIData>({
        num: 0,
        str: "Hello world!",
        bool: true
    });

    // Creates a UI for the form.
    return (<UIGen data={form} setData={setForm}></UIGen>);
}
```

Optional properties:
```tsx
import *  as UI from "ts-object-ui-generator"
//...
type OptionalExample = {
    optionalNumber?: number
}
//...
const [optional, setOptional] = useState<UIGenDataified<OptionalExample>>({
    optionalNumber?: UI.Optional(123 /* Contains 123 by default */, false /* Number does not exist by default */)
});
//...
```


Arrays:
```tsx
//...
type ArrayExample = string[]
//...
const [arr, setArr] = useState<UIGenDataified<ArrayExample>>(
    UI.Array(["hello", "world"] /* Default array */, "hello" /* Default element to append when one is added */)
);
//...
```


Unions:
```tsx
//...
type UnionExample = number | string;
//...
const [arr, setArr] = useState<UIGenDataified<UnionExample>>(
    UI.Union(
        0 /* Current index from which to get the union's default value. */,
        [0, "foo bar"] /* List of default values for the union. */
        ["Number", "Text"] /* List of labels for the union variant dropdown. */
    )
);
//...
```

