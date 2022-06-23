# react-typescript-ui-generator

## tl;dr
 Auto-generate React UIs for (almost) arbitrary JSON data structures, all using a completely type-safe API.

## About
 This project aims to simplify UI in React and TypeScript environments by allowing the user to automatically generate UIs that map one-to-one with a given TypeScript data type. It does this in a type-safe manner by providing the `InterfaceUIDataified<T>` type, which converts a TypeScript type `T` into a type representing UI settings for `T`. Then, plug an instance of the UI settings into the `InterfaceUI` component, and a UI will be automatically generated.

## Features
### Current Features
 - Numbers
 - Strings
 - Booleans
 - Arrays of any type in this list
 - Objects of any type in this list
 - Unions of any type in this list
 - Circular/recursive types

### Planned Features
 - Insertion of arbitrary UI elements for specialized kinds of data
 - Array deletion and reordering
 - Custom labels
 - Better CSS compatibility
 - Automatic conversion of `InterfaceUIDataified` data to original data