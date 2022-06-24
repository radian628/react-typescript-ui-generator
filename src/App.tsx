import React, { useState } from 'react'
import logo from './logo.svg'
import './App.css'
import { AsNormalTypescriptObject, InterfaceMode, InterfaceUI, InterfaceUIData, InterfaceUIDataified, toNormalTypescriptObject } from './InterfaceUI'
import * as UI from './BuiltinHelpers'

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

type BinaryTreeUI = InterfaceUIDataified<BinaryTree>;

type Test = InterfaceUIDataified<Test2>;

type MaybeString = string | undefined;

type aaa = InterfaceUIDataified<number>

function App() {
  const [test, setTest] = useState<Test>({
    a: {
      $mode: InterfaceMode.WITH_OPTIONS,
      data: 1,
      label: "asdfasdf",
      className: "farting-pig-turds"
    },
    b: {
      $mode: InterfaceMode.WITH_OPTIONS,
      data: 3,
      customElement: (props) => {
        return <p>Custom element!</p>;
      }
    },
    c: UI.Slider(6, 0, 10, 0.5),
    testString: "asdfsdfsdkjfhjs",
    boolTest: true,
    nestedObject: {
      $mode: InterfaceMode.WITH_OPTIONS,
      data: {
        nestedNum: 234,
        nestedStr: "sdfsdf",
      },
      className: "farting-pig-turds"
    },
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

  let t: AsNormalTypescriptObject<Test> = {
    a: 2,
    b: 4,
    c: 6,
    testString: "asdfsdfsdkjfhjs",
    boolTest: true,
    nestedObject: {
      nestedNum: 234,
      nestedStr: "sdfsdf",
    },
    opt: 3,
    optObj: undefined,
    arr: [6, 7, 8],
    objArr: [{ num: 234, str: "skdfjlksd" }],
    union: [{ desc: "aaaaaa"}],
    primitiveUnion: 0,
    matrix: [[]]
  }

  let binTreeRoot: BinaryTreeUI | {} = {}

  Object.assign(binTreeRoot, {
    $mode: InterfaceMode.UNION,
    unionExamples: [0, { left: binTreeRoot, right: binTreeRoot }],
    labels: ["leaf", "interior"],
    data: 0,
    index: 0
  });

  let [treeUIData, setTreeUIData] 
    = useState<BinaryTreeUI>(binTreeRoot as BinaryTreeUI);


  let t2: Test2 = t;
  //console.log(t2);
  console.log(toNormalTypescriptObject<Test2>(test));

  return (<React.Fragment>
    <div className="input-css-test">
    <InterfaceUI data={test} setData={data => {
      setTest(data);
    }}></InterfaceUI>
    </div>
    {/* <InterfaceUI data={treeUIData} setData={data => {
      setTreeUIData(data);
    }}></InterfaceUI> */}
  </React.Fragment>);
}

export default App
