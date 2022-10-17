import {ReactUIElement, ViewWrapper, View} from "../core/element/ReactUIElement";
import {Button, VStack, Text, TextField, HStack} from "../component";
import {Callback, Context, Contexts, DotProp, Prop} from "../core/element/Decorator";
import {Ref, State} from "../core/element/HookDecorator";
import {Div} from "../core/utils/HTMLTags";
import {ContextProvider} from "../core";

let myThemes = {
    first: {
        Button: {
            bg: "#00AAFF",
            border: "#00FF00",
            fg: "#00AAFF"
        }
    },
    second: {
        Button: {
            bg: "#AA00AA",
            border: "#666666",
            fg: "#AA88AA"
        }
    }
}
class CSub1 extends View {
    @Prop toggle: any
    @DotProp text: any
    @Context a: any
    @Contexts allContent: any
    Body = () =>
        VStack(
            Text(`${this.toggle}`),
            Text(this.text)
        )
            .didMount(() => {
                console.log("jj",this.a)
                console.log(this.allContent)
            })
            .didUpdate(() => {
                console.log("rerender")
            })
}
let Sub1 = ViewWrapper(CSub1)

class Counter extends View {
    @Prop startNum: number = 0
    @Callback(State) count: any = () => this.startNum

    Body = () =>
        VStack(
            HStack(
                Button("+")
                    .onClick(() => {
                        this.count.setValue((pre:any)=>pre+1)
                    }),
                Button("-")
                    .onClick(() => {
                        this.count.setValue((pre:any)=>pre-1)
                    })
            )
                .spacing("20px"),
            Text(this.count.value),
            Button("clear")
                .onClick(() => {
                    this.count.value = this.startNum
                })
        )
            .alignment("center")
}


let CounterView = ViewWrapper<{startNum?: number}>(Counter)

class CMain extends View {
    @State count: any = 1
    @State toggle: any = false
    @State text: any = "defaultValue"

    Body = () =>
        ContextProvider(
        VStack(
            TextField(this.text.value)
                .onChange((newT:string) => {this.text.value = newT}),
            Button("click me")
                .onClick(() => {
                    this.count.setValue((pre: number) => pre + 1)
                    this.toggle.setValue((pre: boolean) => !pre)
                }),
            Text(`count: ${this.count.value}`),
            Sub1({toggle: false})
                .text(this.text.value),
            CounterView({startNum:100})
        )
        )
            .context({a:"hh"})

}


const Main = ViewWrapper(CMain)

export default Main