import React, { useState } from 'react'
import logo from './logo.svg'
import './App.css'
import { AsNormalTypescriptObject, InterfaceMode, UIGen, UIGenDataified, toNormalTypescriptObject } from 'ts-object-ui-generator';
import * as UI from 'ts-object-ui-generator'
import { Example1 } from './Example1';

type Test2 = {
  a: number,
  b: number,
  c: number,
  testString: string,
  boolTest: boolean,
  nestedObject: {
    nestedNum: number,
    nestedStr: string
  },
  opt?: number
  optObj?: {
    num: number,
    bool: boolean,
    str: string
  },
  arr: number[]
  objArr?: {
    num: number,
    str: string
  }[],
  union: ({ x: number, y: number, z?: number } | { desc: string })[]
  primitiveUnion: number | string,
  matrix: number[][]
}

type BinaryTree = number | {
  left: BinaryTree,
  right: BinaryTree
};

type BinaryTreeUI = UIGenDataified<BinaryTree>;

type Test = UIGenDataified<Test2>;

type MaybeString = string | undefined;

type aaa = UIGenDataified<number>

function App() {
  const [test, setTest] = useState<Test>({
    a: UI.WithOptions<number>(1, "farting-pig-turds", "asdfasdf"),
    b: 3,
    c: UI.Slider(6, 0, 10, 0.5),
    testString: "asdfsdfsdkjfhjs",
    boolTest: true,
    nestedObject: UI.WithOptions({
        nestedNum: 234,
        nestedStr: "sdfsdf",
      }, "farting-pig-turds", ""),
    opt: UI.Optional(5, false),
    optObj: UI.Optional({
        num: 2,
        str: "a",
        bool: false
      }, false),
    arr: UI.Array([1,2,3,4], 0),
    objArr: UI.Optional(
      UI.Array([{ num: 1, str:"array of objects!" }], { num: 1, str:"array of objects!" }), true
    ),
    union: UI.Array([], UI.Union(0,[{ 
      x: 10, 
      y: 10, 
      z: UI.Optional(10, true) }, 
      { desc: "Located at (10, 10) "}], ["Numbers", "Strings"])),
    primitiveUnion: UI.Union(0, [2345, "sdfsdf"], ["number", "string"]),
    matrix: UI.Array([
      UI.Array([0], 0)
    ], UI.Array([], 0))
  });

  let binTreeRoot: BinaryTreeUI | {} = {}

  Object.assign(binTreeRoot, 
    UI.Union(0, [0, { left: binTreeRoot, right: binTreeRoot }], ["leaf", "interior"]));

  let [treeUIData, setTreeUIData] 
    = useState<BinaryTreeUI>(binTreeRoot as BinaryTreeUI);
  console.log(toNormalTypescriptObject<Test2>(test));

  return (<React.Fragment>
    <div className="input-css-test">
    <Example1></Example1>
    <UIGen data={test} setData={setTest}></UIGen>
    <UIGen data={treeUIData} setData={data => {
      setTreeUIData(data);
    }}></UIGen>
    </div>
  </React.Fragment>);
}

export default App
