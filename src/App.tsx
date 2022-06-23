import { useState } from 'react'
import logo from './logo.svg'
import './App.css'
import { AsNormalTypescriptObject, InterfaceMode, InterfaceUI, InterfaceUIData, InterfaceUIDataified } from './InterfaceUI'

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
  primitiveUnion: number | string
}

type Test = InterfaceUIDataified<Test2>;

type MaybeString = string | undefined;

function App() {
  const [test, setTest] = useState<Test>({
    a: 2,
    b: 4,
    c: 6,
    testString: "asdfsdfsdkjfhjs",
    boolTest: true,
    nestedObject: {
      nestedNum: 234,
      nestedStr: "sdfsdf",
    },
    opt: {
      $mode: InterfaceMode.OPTIONAL,
      exists: true,
      data: 5
    },
    optObj: {
      $mode: InterfaceMode.OPTIONAL,
      exists: false,
      data: {
        num: 2,
        str: "a",
        bool: false
      }
    },
    arr: {
      $mode: InterfaceMode.ARRAY,
      array: [1, 2, 3, 4],
      arrayExample: 0
    },
    objArr: {
      $mode: InterfaceMode.OPTIONAL,
      exists: true,
      data: {
        $mode: InterfaceMode.ARRAY,
        array: [{ num: 1, str:"array of objects!" }],
        arrayExample: { num: 1, str:"array of objects!" }
      }
    },
    union: {
      $mode: InterfaceMode.ARRAY,
      array: [],
      arrayExample: {
        $mode: InterfaceMode.UNION,
        unionExamples: [
          { 
            x: 10, 
            y: 10, 
            z: {
              $mode: InterfaceMode.OPTIONAL,
              exists: true,
              data: 10
            } }, 
            { desc: "Located at (10, 10) "}
        ],
        labels: ["Numbers", "Strings"],
        data: { desc: "sdfjsdlf" },
        index: 1
      }
    },
    primitiveUnion: {
      $mode: InterfaceMode.UNION,
      unionExamples: [2345, "sdfsdf"],
      labels: ["number", "string"],
      data: 666,
      index: 0
    }
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
    primitiveUnion: 0
  }


  let t2: Test2 = t;
  //console.log(t2);
  //console.log(toNormalTypescriptObject(test));

  return (
    <InterfaceUI data={test} setData={data => {
      setTest(data);
    }}></InterfaceUI>
  )
}

export default App
